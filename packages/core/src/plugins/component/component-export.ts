/**
 * 组件说明书导出器 —— 把某主题下的可用组件生成为一份可直接照抄的 Markdown 参考文档
 *
 * 用途：用户用 WeMD 排版好后，把这份说明连同文章正文发给使用其他工具的人，
 * 对方对着说明里的组件语法与示例，就能排出符合该主题的 Markdown。
 *
 * 设计（确定性、rule-based，不依赖 AI）：
 * - 数据全部来自已固化结构：BUILTIN_SLOT_DEFS（共享槽位语义 + Input Contract）
 *   + 主题 slotDefs（主题扩展槽）合并；示例来自 getComponentSampleMarkdown。
 * - 每个组件输出：名称、用途、语法围栏、插槽表（填什么 / 必填 / 写法）、可复制示例。
 * - 主题扩展槽在表中标注"（主题扩展）"，与共享槽区分，避免排版者误以为必填。
 */
import type { ThemeDefinition } from "../../theme-schema/types";
import type { SlotInputRule } from "./slotTypes";
import { BUILTIN_SLOT_DEFS, getBuiltinSlotDef } from "./slotDefs";
import { mergeSlotOverrides } from "./slotParsers";
import { getComponentSampleMarkdown } from "./slotSamples";
import { getBuiltInThemeDefinition } from "../../builtin-themes";
import { getDefaultTemplate } from "./defaultTemplates";
import { parseSkeletonSlots } from "./skeletonSlotMap";

/** 导出选项 */
export interface ComponentExportOptions {
  /** 只导出这些组件 id；缺省导出全部内置组件 */
  only?: string[];
  /** 文档标题；缺省用「{主题名} · 组件排版参考」 */
  title?: string;
  /** 是否在文档末尾附「排版规格」，缺省 false（本阶段只出组件说明） */
  includeFormat?: boolean;
}

/** Slot 类型的中文标签 */
const SLOT_TYPE_LABEL: Record<string, string> = {
  text: "文字",
  image: "图片",
  list: "列表",
  number: "数字",
  code: "代码",
  decorative: "装饰",
};

/**
 * 原生层自动识别的组件：由原生 Markdown 语法触发，`dual` 标记表示"同时支持 ::: 指令"。
 * 与 markdown-it-native-layer 的路由一致：
 * - heading + 数字前缀 → numbered-heading；普通 heading → section-title；
 * - 代码围栏（非 mermaid）→ code-frame；
 * - 表格 → styled-table；块引用 → pullquote；分隔线 → divider；
 *   单张图片 → image-card；连续多张 → image-grid（后两者 dual，指令写法可带更细字段）。
 * mode：缺省 only（只能/宜用原生）；dual = 原生为主、::: 可选。
 */
interface NativeSyntax {
  trigger: string;
  note: string;
  dual?: boolean;
}
const NATIVE_AUTO_COMPONENTS: Record<string, NativeSyntax> = {
  "numbered-heading": {
    trigger: "## 1. 章节标题",
    note: "写数字开头的二级标题（如 `## 1. …`、`## 01 …`、`## 第一步`），渲染时自动套用「编号章节标题」样式。",
  },
  "section-title": {
    trigger: "## 章节标题",
    note: "普通二级标题即自动套用「章节标题」样式。",
  },
  "code-frame": {
    trigger: "```js\n代码……\n```",
    note: "三个反引号的代码围栏即自动套用「代码块」样式（mermaid 围栏除外）。",
  },
  "styled-table": {
    trigger: "| 名称 | 说明 |\n| --- | --- |\n| 冷板 | 高换热 |",
    note: "标准管线表格即自动对齐列宽成「数据表格」；若需自定义对齐，也可用 `::: styled-table` 指令书写。",
    dual: true,
  },
  pullquote: {
    trigger: "> 这里的金句正文",
    note: "块引用即自动成「金句引用」；若需「金句 + 署名」等更细结构，也可用 `::: pullquote` 指令。",
    dual: true,
  },
  divider: {
    trigger: "---",
    note: "三个以上 `-` / `*` / `_` 即自动成「分隔线」；也可用 `::: divider` 指令。",
    dual: true,
  },
  "image-card": {
    trigger: "![图片说明](图片地址)",
    note: "独占一行的单张图片即自动成「单图卡片」；若需封面/标题/说明字段，也可用 `::: image-card` 指令。",
    dual: true,
  },
  "image-grid": {
    trigger: "![图A](a.png)\n![图B](b.png)",
    note: "连续多行的多张图片（≥2 张）自动成「多图网格」；也可用 `::: image-grid` 指令。",
    dual: true,
  },
};

const isNativeAuto = (id: string): boolean => id in NATIVE_AUTO_COMPONENTS;

/** Input Contract source → 给排版者看的"怎么写"提示 */
function describeInput(
  source: SlotInputRule["source"] | undefined,
  cardinality: string | undefined,
): string {
  switch (source) {
    case "first-line":
      return "放在内容第一行";
    case "last-line":
      return "放在内容最后一行";
    case "paragraph":
      return cardinality === "many" ? "一段或多段文字" : "一段文字";
    case "strong":
      return "以 **强调** 书写的一行";
    case "image":
      return "一行图片 ![说明](图片地址)";
    case "image-url":
      return "第一行放图片，只取图片地址作背景";
    case "list":
      return "无序列表：- 每一项";
    case "number-prefix":
      return "以编号开头（01 / 1. / 一、）";
    case "first-char":
      return "首段首字（自动提取，无需书写）";
    case "hr":
      return "一条分隔线 ---";
    case "block":
      return "代码围栏或表格整块";
    case "all":
      return "整块正文";
    default:
      return "按示例填写";
  }
}

/** 判断槽位是否必填 */
function isRequired(slot: {
  required?: boolean;
  input?: { cardinality?: string };
}): boolean {
  if (slot.required) return true;
  return slot.input?.cardinality === "one";
}

/**
 * 解析主题参数：接受 ThemeDefinition 或内置主题 id 字符串。
 */
function resolveTheme(
  theme: ThemeDefinition | string | undefined,
): ThemeDefinition | undefined {
  if (typeof theme === "string") return getBuiltInThemeDefinition(theme);
  return theme;
}

/** 生成包裹示例内容的高阶围栏（围栏反引号数 > 内容中最大连续反引号数，避免嵌套围栏提前闭合） */
function fence(content: string): string {
  const runs = content.match(/`+/g) ?? [];
  const maxRun = runs.reduce((m, r) => Math.max(m, r.length), 0);
  const tick = "`".repeat(Math.max(3, maxRun + 1));
  return `${tick}\n${content}\n${tick}`;
}

/** 基础 Markdown 语法区块（写给不知 MD 的排版者，规则确定性给出） */
function renderBaseMarkdownSection(): string {
  const rows: [string, string, string][] = [
    ["标题", "# 一级标题 / ## 二级标题 / ### 三级标题", "用于文章大中小标题"],
    ["段落", "直接写文字，段落之间空一行", "正文主体"],
    ["加粗", "**强调的文字**", "需要加重语气处"],
    ["斜体", "*轻标注*（或 _文字_）", "次要说明、语气放轻处"],
    ["列表", "- 无序项\n1. 有序项", "并列要点、步骤"],
    ["图片", "![说明文字](图片地址)", "插图与封面（URL 用图床链接）"],
    ["引用", "> 金句文字", "整句引用、图注等短标注"],
    ["分隔线", "---", "章节间的分割"],
    ["链接", "[显示文字](网址)", "放外部链接"],
  ];
  const lines: string[] = ["## 基础语法", ""];
  for (const [name, syntax, note] of rows) {
    lines.push(`- **${name}**`);
    lines.push("  ```md");
    lines.push(`  ${syntax}`);
    lines.push("  ```");
    lines.push(`  ${note}`);
  }
  lines.push("");
  lines.push("---");
  return lines.join("\n");
}

function renderComponent(
  id: string,
  themeDef: ThemeDefinition | undefined,
  themeSlots: NonNullable<ThemeDefinition["slotDefs"]>[string] | undefined,
): string {
  const baseDef = getBuiltinSlotDef(id) ?? {
    id,
    abbr: id.replace(/-/g, ""),
    slots: [],
  };
  const merged = mergeSlotOverrides(baseDef, themeSlots);
  const themeSlotKeys = new Set((themeSlots ?? []).map((s) => s.key));
  const sample = getComponentSampleMarkdown(themeDef, id);

  const lines: string[] = [];
  lines.push(`## ${id}`);

  // 原生层组件：教原生语法，不教学 ::: 指令
  const native = NATIVE_AUTO_COMPONENTS[id];
  if (native) {
    lines.push("");
    lines.push(
      native.dual
        ? `（可用原生语法——推荐；也可用 \`::: ${id}\` 指令细化字段）`
        : "（原生组件：由原生语法自动识别，**无需** `::: 组件名` 包裹）",
    );
    lines.push("");
    lines.push(fence(native.trigger));
    lines.push(`- ${native.note}`);
    lines.push("");
    lines.push("---");
    lines.push("");
    return lines.join("\n");
  }

  // 语法围栏仅示意；可复制的是下方"示例"块（含真实插槽填充）
  lines.push(`\`\`\`md\n::: ${id}\n…内容…\n:::\`\`\``);

  // 插槽表
  lines.push("");
  lines.push("| 插槽 | 填什么 | 必填 | 写法 |");
  lines.push("| --- | --- | --- | --- |");
  for (const slot of merged.slots) {
    const req = isRequired(slot) ? "●" : "";
    const ext = themeSlotKeys.has(slot.key) ? "（主题扩展）" : "";
    let semantic = `${slot.semantic}${ext}`;
    if (slot.type === "list" && slot.item_slots?.length) {
      semantic += `（每项含：${slot.item_slots
        .map((f) => f.semantic)
        .join("、")}）`;
    }
    const desc = describeInput(slot.input?.source, slot.input?.cardinality);
    lines.push(`| ${slot.key} | ${semantic} | ${req} | ${desc} |`);
  }

  // 示例（无可用示例则不输出示例块）
  if (sample) {
    lines.push("");
    lines.push("**示例：**");
    lines.push("");
    lines.push(fence(`::: ${id}\n${sample}\n:::`));
  }
  lines.push("");
  lines.push("---");
  lines.push("");
  return lines.join("\n");
}

/**
 * 生成主题组件说明书（Markdown）。
 * @param theme 主题定义或内置主题 id（如 "wanqing"）
 */
export function exportThemeComponentGuide(
  theme: ThemeDefinition | string,
  options: ComponentExportOptions = {},
): string {
  const themeDef = resolveTheme(theme);
  const themeName =
    themeDef?.meta.name ?? (typeof theme === "string" ? theme : "未命名主题");
  const description = themeDef?.meta.description;
  const only = options.only ? new Set(options.only) : null;
  const list = BUILTIN_SLOT_DEFS.filter((d) => !only || only.has(d.id));

  const out: string[] = [];
  out.push(`# ${options.title ?? `${themeName} · 组件排版参考`}`);
  if (description) out.push("");
  if (description) out.push(`> ${description}`);
  out.push("");
  out.push(
    "全部正文与组件内容都用 Markdown 书写。先掌握下面这份基础语法，再看组件用法。",
  );
  out.push("");
  out.push(renderBaseMarkdownSection());
  out.push("");
  out.push("本说明列出的组件用如下围栏包裹：");
  out.push("");
  out.push(fence('::: 组件名{属性="值"}\n内容……\n:::'));
  out.push("");
  out.push(
    "> 标题章节（`## 编号 标题`）、代码围栏、表格、块引用、分隔线、图片等默认用原生 Markdown 书写即可自动识别，见各自条目内的「写法」；其余组件用下方围栏包裹。",
  );
  out.push("");
  out.push("> 说明");
  out.push(
    '> - 首行 `{属性="值"}` 为可选的组件属性（如标题、作者），不填则组件按默认形态渲染；',
  );
  out.push("> - 组件内部可嵌套任意 Markdown（段落、图片、列表甚至其他组件）；");
  out.push("> - 一篇公众号文章不必用全，按需选 8–12 个即可。");
  out.push("");
  out.push("## 组件清单");
  out.push("");
  for (const d of list) {
    out.push(
      `- [${d.id}](#${d.id}) — ${d.slots.map((s) => s.semantic).join("、") || d.id}`,
    );
  }
  out.push("");
  out.push("---");
  out.push("");

  for (const d of list) {
    const themeSlots = themeDef?.slotDefs?.[d.id];
    out.push(renderComponent(d.id, themeDef, themeSlots));
  }

  if (options.includeFormat) {
    out.push("");
    out.push("## 排版规格");
    out.push("");
    out.push("- 标题：正文用 `##` 或 `###` 层级，主标题用一次 `#`；");
    out.push("- 引用：`> 金句` 生成整句引用，可作插图注等短标注；");
    out.push("- 命名遵循主题字体与色板，无需额外排版样式。");
  }

  return (
    out
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim() + "\n"
  );
}

/**
 * 生成面向 AI 的紧凑组件手册 —— buildAIGuide
 *
 * 供「AI 排版（整篇）」作为组件词典喂给 LLM。与 exportThemeComponentGuide 不同：
 * 面向 AI，去除基础 Markdown 段落与人类排版说明，每组件只保留：
 * 1. 用途（来自合并后的 slotDefs 语义）
 * 2. 槽位清单（key / 必填 / 怎么填 / 语义）
 * 3. **本主题骨架渲染顺序**（来自 parseSkeletonSlots，覆盖 slotDefs 未表达的骨架差异，
 *    例如 silent-keynote 的 magazine-cover 是 eyebrow←title、大标题←subtitle）
 * 4. 一个可照抄的示例（getComponentSampleMarkdown）
 */
export interface AIGuideOptions {
  /** 只包含这些组件 id；缺省包含全部内置组件 */
  only?: string[];
}

export function buildAIGuide(
  theme: ThemeDefinition | string,
  options: AIGuideOptions = {},
): string {
  const themeDef = resolveTheme(theme);
  const onlySet = options.only ? new Set(options.only) : null;
  const list = BUILTIN_SLOT_DEFS.filter((d) => !onlySet || onlySet.has(d.id));

  const out: string[] = [];
  out.push("## 可用组件（只允许使用下列组件，用 ::: 包裹渲染）");
  out.push("");
  out.push("通用写法：");
  out.push(fence('::: 组件名{属性="值"}\n内容……\n:::'));
  out.push("");
  out.push(
    "部分为原生自动识别组件（标题 / 代码围栏 / 表格 / 块引用 / 分隔线 / 图片），条目内标出原生写法并优先推荐；其中标注「也可用 ::: 」的，指令写法用于细化字段。勿把纯原生组件当 ::: 用。",
  );
  out.push("");
  out.push(
    "以下每个组件的『骨架渲染顺序』是当前主题实际的显示结构，填 body 时严格按此顺序组织内容。",
  );
  out.push("");

  for (const d of list) {
    const themeSlots = themeDef?.slotDefs?.[d.id];
    const template =
      (themeDef?.templates ?? {})[d.id] ?? getDefaultTemplate(d.id);
    out.push(renderAIAgentComponent(themeDef, d.id, themeSlots, template));
  }

  return (
    out
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim() + "\n"
  );
}

/** 渲染单个组件的 AI 用法片段 */
function renderAIAgentComponent(
  themeDef: ThemeDefinition | undefined,
  id: string,
  themeSlots: NonNullable<ThemeDefinition["slotDefs"]>[string] | undefined,
  template: string,
): string {
  const baseDef = getBuiltinSlotDef(id) ?? {
    id,
    abbr: id.replace(/-/g, ""),
    slots: [],
  };
  const merged = mergeSlotOverrides(baseDef, themeSlots);
  const skeleton = parseSkeletonSlots(template);
  const themeSlotKeys = new Set((themeSlots ?? []).map((s) => s.key));

  const lines: string[] = [];
  lines.push(`### ${id}`);

  // 原生层组件：不教学 ::: 指令，转为教原生触发语法
  const native = NATIVE_AUTO_COMPONENTS[id];
  if (native) {
    lines.push(
      native.dual
        ? `（可用原生语法——推荐；也可用 \`::: ${id}\` 指令细化字段）`
        : "（原生组件：由原生语法自动识别，**不要**用 `::: 组件名` 包裹）",
    );
    lines.push("");
    lines.push("- 写法（自动识别）：");
    lines.push("");
    lines.push(fence(native.trigger));
    lines.push(`- ${native.note}`);
    lines.push("");
    lines.push("---");
    lines.push("");
    return lines.join("\n");
  }

  // 用途（合并后的槽位语义）＋ 主题扩展标记
  const semantics = merged.slots
    .map((s) => s.semantic + (themeSlotKeys.has(s.key) ? "（主题扩展）" : ""))
    .filter(Boolean)
    .join("；");
  if (semantics) lines.push(`- 用途：${semantics}`);

  // 槽位清单（插槽表，AI 按列取"填什么 / 必填 / 写法"，比压缩列表命中更稳）
  if (merged.slots.length) {
    lines.push("- 槽位：");
    lines.push("");
    lines.push("| 槽位 | 填什么 | 必填 | 写法 |");
    lines.push("| --- | --- | --- | --- |");
    for (const slot of merged.slots) {
      const required = isRequired(slot) ? "必填" : "可选";
      const how = describeInput(slot.input?.source, slot.input?.cardinality);
      let semantic = slot.semantic;
      if (slot.type === "list" && slot.item_slots?.length) {
        semantic += `（每项含：${slot.item_slots.map((f) => f.semantic).join("、")}）`;
      }
      if (themeSlotKeys.has(slot.key)) semantic += "（主题扩展）";
      lines.push(`| ${slot.key} | ${semantic} | ${required} | ${how} |`);
    }
  }

  // 本主题骨架渲染顺序（弥补 slotDefs 未表达的骨架差异）
  if (skeleton.length) {
    const seq = skeleton
      .map((s) => {
        const sign =
          s.kind === "list"
            ? `[列表项含：${s.itemFields.join("、") || "body"}]`
            : "";
        const req = s.optional ? "可选" : "必含";
        const cls = s.elementClass ? `(.${s.elementClass})` : "";
        return `${s.key}${sign}${cls}【${req}】`;
      })
      .join(" → ");
    lines.push(`- 骨架渲染顺序：${seq}`);
  }

  // 示例
  const sample = getComponentSampleMarkdown(themeDef, id);
  if (sample) {
    lines.push("- 示例：");
    lines.push("");
    lines.push(fence(`::: ${id}\n${sample}\n:::`));
  }
  lines.push("");
  lines.push("---");
  lines.push("");
  return lines.join("\n");
}

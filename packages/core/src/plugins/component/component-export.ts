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
function isRequired(slot: { required?: boolean; input?: { cardinality?: string } }): boolean {
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
  // 语法围栏仅示意；可复制的是下方"示例"块（含真实插槽填充）
  lines.push(`\`\`\`md\n::: ${id}\n…内容…\n:::\n\`\`\``);

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
  const themeName = themeDef?.meta.name ?? (typeof theme === "string" ? theme : "未命名主题");
  const description = themeDef?.meta.description;
  const only = options.only ? new Set(options.only) : null;
  const list = BUILTIN_SLOT_DEFS.filter(
    (d) => !only || only.has(d.id),
  );

  const out: string[] = [];
  out.push(`# ${options.title ?? `${themeName} · 组件排版参考`}`);
  if (description) out.push("");
  if (description) out.push(`> ${description}`);
  out.push("");
  out.push("全部正文与组件内容都用 Markdown 书写。先掌握下面这份基础语法，再看组件用法。");
  out.push("");
  out.push(renderBaseMarkdownSection());
  out.push("");
  out.push("本说明列出的组件用如下围栏包裹：");
  out.push("");
  out.push(fence("::: 组件名{属性=\"值\"}\n内容……\n:::"));
  out.push("");
  out.push("> 说明");
  out.push("> - 首行 `{属性=\"值\"}` 为可选的组件属性（如标题、作者），不填则组件按默认形态渲染；");
  out.push("> - 组件内部可嵌套任意 Markdown（段落、图片、列表甚至其他组件）；");
  out.push("> - 一篇公众号文章不必用全，按需选 8–12 个即可。");
  out.push("");
  out.push("## 组件清单");
  out.push("");
  for (const d of list) {
    out.push(`- [${d.id}](#${d.id}) — ${d.slots.map((s) => s.semantic).join("、") || d.id}`);
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

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
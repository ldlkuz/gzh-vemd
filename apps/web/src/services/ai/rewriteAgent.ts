/**
 * rewriteAgent —— AI 排版（整篇）核心
 *
 * 思路（替代旧的"插入推荐"）：
 * 把当前主题的组件手册（buildAIGuide，含骨架槽位映射）喂给 LLM，
 * LLM 一次性输出整篇最终 Markdown。AI 既能把已有结构改写为组件
 * （段落→steps、列表→timeline、数据→stats-block），又能补装饰/导航组件。
 *
 * 允许 AI 轻微改动措辞，但禁止编造事实/数字/人名、禁止删减信息。
 * 配套 validateRewrite 做组件合法 + 围栏闭合检测，结果先预览、可撤销。
 */
import type { ThemeDefinition, LayoutPreference } from "@wemd/core";
import { buildAIGuide, getBuiltInThemeDefinition } from "@wemd/core";
import { callLLM } from "./llm";

/** 单次重写能承受的原文长度上限（字符）。超限需分段或提示，防截断 */
export const REWRITE_MAX_CHARS = 8000;

/** 校验结果 */
export interface RewriteValidation {
  /** 提取到的组件 id（按出现顺序去重） */
  components: string[];
  /** 不在允许范围内的组件（AI 越界，应剔除或警示） */
  invalid: string[];
  /** 是否围栏未闭合（AI 输出可能被截断） */
  truncated: boolean;
}

/** 解析原文重写前的 LLM 引导手册。
 * allowedComponents 缺省 = 全部组件（由 AI 自行决定用哪些）。
 * 已知组件集合直接扫描手册标题得到，与喂给 AI 的清单严格一致，避免硬编码漂移。 */
export function buildRewriteGuide(
  themeId: string,
  allowedComponents?: string[],
  customDef?: ThemeDefinition,
): { text: string; knownIds: Set<string> } {
  const themeDef =
    customDef ??
    (getBuiltInThemeDefinition(themeId) as ThemeDefinition | undefined);
  const text = buildAIGuide(themeDef ?? themeId, {
    only: allowedComponents?.length ? allowedComponents : undefined,
  });
  // 从手册的 "### 组件id" 章节标题提取允许集合
  const ids = [...text.matchAll(/^### ([\w-]+)/gm)].map((m) => m[1]);
  return { text, knownIds: new Set(ids) };
}

/**
 * 整篇重排：喂组件手册 + 主题约束 + 原文，让 LLM 输出整篇最终 Markdown。
 * @returns 重排后的完整 Markdown
 */
export async function rewriteArticle(
  markdown: string,
  guide: string,
  themeLayout?: LayoutPreference,
): Promise<string> {
  if (markdown.trim().length === 0) {
    throw new Error("编辑器没有内容可排版");
  }
  if (markdown.length > REWRITE_MAX_CHARS) {
    throw new Error(
      `文章过长（${markdown.length} 字），整篇排版上限 ${REWRITE_MAX_CHARS} 字。请精简后重试，或手动分段排版。`,
    );
  }

  const system = [
    "你是一个资深的微信公众号版式设计师。任务：根据下方『组件手册』，把用户文章重新排版为整篇 Markdown。",
    "",
    "规则：",
    "1. 严格按照『组件手册』每个组件标注的语法书写，不得写成手册外的形式：",
    "   - 手册标注「原生组件」或「可用原生语法——推荐」的，一律用原生 Markdown：",
    "     标题用 `## 1. …`（编号开头成编号章节）/ `## …`、表格用 `| a | b |`、",
    "     金句用 `> 引用`、分隔线用 `---`、图片用 `![]()`、代码用 ```围栏；这些【不要】用 ::: 包裹。",
    "   - 只有标注「可用 ::: 指令」「纯组件」的（如 ::: steps / timeline / stats-block / quote-card / end-card / magazine-cover）才用 ::: 包裹。",
    "2. 重组结构与包装：章节标题一律用 `##` 原生标题（不要写成 ::: numbered-heading / section-title）；",
    "   步骤用 ::: steps、时间线用 ::: timeline、数据段用 ::: stats-block 或原生表格、金句用 ::: quote-card、结尾用 ::: end-card。",
    "3. 允许对措辞做轻微润色，但必须：不改动事实/数字/人名/日期、不新增原文没有的信息、不缺删原文要点。",
    "4. 组件内容严格按手册的『骨架渲染顺序』组织，保证落到正确槽位。",
    "5. 保留原文的图片（![]()）、代码、表格、链接，原样放进合适位置。",
    "6. 输出整篇最终 Markdown，不得用 ``` 包裹全文，不要任何解释或前后缀文字。",
    "7. 组件使用克制，避免过度堆砌；装饰组件（divider-fancy 等）按需使用。",
  ].join("\n");

  const user = [
    guide,
    "",
    "## 主题约束",
    formatThemeLayout(themeLayout),
    "",
    "## 用户文章",
    "",
    markdown,
  ].join("\n");

  const raw = await callLLM(system, user, 0.5);
  return raw.trim();
}

function formatThemeLayout(layout: LayoutPreference | undefined): string {
  if (!layout) return "（无，按通用排版）";
  const densityLabel =
    layout.density === "high"
      ? "丰富、杂志级"
      : layout.density === "low"
        ? "简洁、少用组件"
        : "适中、适度点缀";
  return [
    `- 风格基调：${layout.tone.join("、")}`,
    `- 排版密度：${densityLabel}`,
    layout.preferredComponents.length
      ? `- 主题偏好组件：${layout.preferredComponents.join("、")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * 校验 AI 输出：
 * - 提取所有 ::: 组件 id，标记不在已知范围内的越界组件；
 * - 判断围栏是否闭合（::: 开头数 vs ::: 单独闭合行数），用于截断检测。
 */
export function validateRewrite(
  output: string,
  knownIds: Set<string>,
): RewriteValidation {
  const components: string[] = [];
  const invalid: string[] = [];
  const seen = new Set<string>();
  const seenInvalid = new Set<string>();

  const openRe = /^::: ([a-z][\w-]*)/gm;
  let m: RegExpExecArray | null;
  while ((m = openRe.exec(output))) {
    const id = m[1];
    if (!seen.has(id)) {
      seen.add(id);
      components.push(id);
    }
    if (!knownIds.has(id) && !seenInvalid.has(id)) {
      seenInvalid.add(id);
      invalid.push(id);
    }
  }

  const lines = output.split("\n");
  const openCount = lines.filter((l) => l.startsWith("::: ")).length;
  const closeCount = lines.filter((l) => l.trim() === ":::").length;
  const truncated = openCount > closeCount;

  return { components, invalid, truncated };
}

/**
 * 剔除不在允许范围内的组件整块（::: 越界组件的开标记直到闭合 :::），
 * 保留其余正文。越界组件要么是 AI 生造的 id，要么是用户未勾选、不应出现的组件。
 */
export function sanitizeRewrite(output: string, knownIds: Set<string>): string {
  const lines = output.split("\n");
  let inBad = false;
  const out: string[] = [];
  for (const line of lines) {
    const open = line.match(/^::: ([a-z][\w-]*)/);
    if (open) {
      if (!knownIds.has(open[1])) {
        inBad = true; // 跳过该组件整块，直到闭合
        continue;
      }
      inBad = false;
      out.push(line);
      continue;
    }
    if (line.trim() === ":::") {
      out.push(line);
      inBad = false; // 遇到闭合标记，无论是否 bad 都收口
      continue;
    }
    if (!inBad) out.push(line);
  }
  return out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

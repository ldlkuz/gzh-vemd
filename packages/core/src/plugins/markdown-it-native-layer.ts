/**
 * markdown-it-native-layer
 * 渲染端自动识别"基础层原生结构"并套入 wemd-component 容器。
 *
 * 背景：基础层组件（表格/代码块/引用/标题/hr/图片）去 `:::` 后直接用原生
 * Markdown 表示。为了让主题里组件的皮肤（`.wemd-{id}`）仍能命中，渲染端需在
 * 带主题模板（getTemplate）时，把这些原生结构自动识别出来，并复用组件管线
 * （template + slot + fill）产出与 `:::` 一致的 `wemd-component` 结构。
 *
 * 依赖：本插件只负责"识别 + 产出 component_open/component_close token"，
 * 渲染复用 markdown-it-component 的模板管线，因此必须与 markdownItComponent
 * 同时启用，且保证该插件的 core 规则（component-props）随后执行。
 *
 * 设计要点：
 * - 仅顶层块生效：跳过 parentType 为 list / blockquote / component 的嵌套内容，
 *   避免列表项、块引用内容、组件内部的原生结构被重复包裹。
 * - 仅当 enable 时才注册（getTemplate 存在即启用），默认关闭不影响原生渲染。
 * - 识别规则刻意保守：只匹配"一整块就是该原生结构"的形态，降低误判。
 */

import type MarkdownIt from "markdown-it";
import type StateBlock from "markdown-it/lib/rules_block/state_block";
import type Token from "markdown-it/lib/token";

export interface NativeLayerOptions {
  /** 是否启用；仅在带主题模板（getTemplate）时为 true */
  enable?: boolean;
}

/** 挂在 md 实例上的禁用标记，避免组件 slot 重新渲染时重复套容器导致递归 */
const DISABLED_KEY = Symbol("wemdNativeLayerDisabled");

/**
 * 动态开关渲染期的 native-layer 识别。
 * 组件 slot 重渲染（renderBody）期间必须关闭，防止无限递归：
 * native-layer 把原始结构包成组件后，渲染期会再次对组件的 rawContent
 * 做整段 parse，若仍识别原生结构会再次套容器 → 死循环。
 */
export function setNativeLayerDisabled(
  md: MarkdownIt,
  disabled: boolean,
): void {
  (md as unknown as Record<symbol, boolean>)[DISABLED_KEY] = disabled;
}

/** 单个原生结构 → 组件 id 的映射配置 */
interface NativeStructure {
  componentId: string;
}

/* ============================================================
 * 当前支持的映射（按类型全覆盖，值可后续扩展/调优）
 * ============================================================ */
const HEADING_LEVEL = 2; // `##`
const NUMERIC_HEADING_RE = /^\s*(\d+[.．、]|第\s*[一二三四五六七八九十\d]+|0\d|[\d一二三四五六七八九十]+[\s、]\s*\S)/;

/** 表格行（含表头/分隔行/数据行；需带 |） */
const TABLE_LINE_RE = /^\s*\|?[^\n]*\|[^\n]*$/;

/** 分隔行：`| :-- | --: |` 或 `| --- |` 等 */
const TABLE_SEP_RE = /^\s*\|?\s*:?-{1,}:?\s*(?:\|\s*:?-{1,}:?\s*)*\|\s*$/;

/** 围栏代码块起始 / 闭合 */
const FENCE_OPEN_RE = /^\s*(```+|~~~+)/;
const FENCE_INFO_RE = /^\s*(```+|~~~+)\s*([\w+\-./]*)\s*$/;

/** 块引用行（`>`，允许嵌套多个 `>`） */
const QUOTE_LINE_RE = /^\s*>+/;

/** 分隔线：`---` / `***` / `___`（至少 3 个） */
const HR_RE = /^\s*([-*_])\s*\1\s*\1+\s*$/;

/** 独占一行的单张图片 `![](...)` */
const SINGLE_IMAGE_LINE_RE = /^\s*!\[[^\]]*\]\([^)]+\)\s*$/;

/**
 * 判断顶层块是否应被套容器。
 * 嵌套在列表 / 块引用 / 组件内时返回 false，避免重复包裹破坏结构。
 */
function isTopLevel(state: StateBlock): boolean {
  const pt = state.parentType as string;
  return !(pt === "list" || pt === "blockquote" || pt === "component");
}

/** 推入 component 开/闭 token（复用 component_open 渲染管线） */
function pushComponentTokens(
  state: StateBlock,
  startLine: number,
  endLine: number,
  componentId: string,
): void {
  const oldParent = state.parentType;
  state.parentType = "component" as typeof state.parentType;

  const token: Token = state.push("component_open", "section", 1);
  token.markup = ":::";
  token.block = true;
  token.info = "";
  token.attrSet("class", `wemd-component wemd-${componentId}`);
  token.attrSet("data-component", componentId);
  token.map = [startLine, endLine];

  // 保留整块原始内容（含标记本身），交给 slot-parser 分槽
  const baseIndent = state.sCount[startLine];
  token.meta = {
    rawContent: state.getLines(startLine, endLine, baseIndent, true),
  };

  const closeToken: Token = state.push("component_close", "section", -1);
  closeToken.markup = ":::";

  state.parentType = oldParent;
  state.line = endLine;
}

/* ============================================================
 * 各类原生结构的检测规则（返回 endLine，找不到返回 -1）
 * ============================================================ */

/** 代码块：` ```lang ... ``` ` → code-frame */
function detectFence(
  state: StateBlock,
  startLine: number,
  endLine: number,
): number {
  const ls = state.bMarks[startLine] + state.tShift[startLine];
  const lineStart = state.src.slice(ls, state.eMarks[startLine]);
  const open = lineStart.match(FENCE_OPEN_RE);
  if (!open) return -1;
  const marker = open[1].replace(/[^\w]*$/, "");
  // 闭合围栏：同为该 marker、且行内除空白外无其他信息（或同为合法 info）
  for (let line = startLine + 1; line < endLine; line++) {
    const cs = state.bMarks[line] + state.tShift[line];
    const content = state.src.slice(cs, state.eMarks[line]).trim();
    if (content.startsWith(marker) && FENCE_INFO_RE.test(content)) {
      return line + 1;
    }
  }
  return -1;
}

/** 表格：`| a | b |` 后跟分隔行 → styled-table */
function detectTable(
  state: StateBlock,
  startLine: number,
  endLine: number,
): number {
  const ls = state.bMarks[startLine] + state.tShift[startLine];
  const first = state.src.slice(ls, state.eMarks[startLine]);
  if (!TABLE_LINE_RE.test(first)) return -1;
  if (startLine + 1 >= endLine) return -1;
  const ns = state.bMarks[startLine + 1] + state.tShift[startLine + 1];
  const second = state.src.slice(ns, state.eMarks[startLine + 1]);
  if (!TABLE_SEP_RE.test(second)) return -1;

  // 消费后续连续的表格数据行（直到空行或非表格行）
  let line = startLine + 2;
  while (line < endLine) {
    const cs = state.bMarks[line] + state.tShift[line];
    const content = state.src.slice(cs, state.eMarks[line]).trim();
    if (!content) break;
    if (!TABLE_LINE_RE.test(content)) break;
    line++;
  }
  return line;
}

/** 块引用：连续 `>` 行 → pullquote */
function detectBlockquote(
  state: StateBlock,
  startLine: number,
  endLine: number,
): number {
  const ls = state.bMarks[startLine] + state.tShift[startLine];
  const first = state.src.slice(ls, state.eMarks[startLine]);
  if (!QUOTE_LINE_RE.test(first)) return -1;
  let line = startLine + 1;
  while (line < endLine) {
    const cs = state.bMarks[line] + state.tShift[line];
    const content = state.src.slice(cs, state.eMarks[line]).trim();
    // 块引用内允许空行（以 `>` 起始的空行）——为空且非 `>` 则结束
    if (!content) {
      if (cs >= state.eMarks[line]) break; // 纯空行结束
      // 带 `>` 的空行计入
      const raw = state.src.slice(cs, state.eMarks[line]);
      if (!QUOTE_LINE_RE.test(raw)) break;
      line++;
      continue;
    }
    if (!QUOTE_LINE_RE.test(content)) break;
    line++;
  }
  return line;
}

/** 分隔线：`---` 等 → divider */
function detectHr(
  state: StateBlock,
  startLine: number,
  _endLine: number,
): number {
  const ls = state.bMarks[startLine] + state.tShift[startLine];
  const line = state.src.slice(ls, state.eMarks[startLine]);
  return HR_RE.test(line.trim()) ? startLine + 1 : -1;
}

/** 图片：单张 → image-card；连续多张 → image-grid */
function detectImages(
  state: StateBlock,
  startLine: number,
  endLine: number,
): { endLine: number; componentId: string } | null {
  const ls = state.bMarks[startLine] + state.tShift[startLine];
  const first = state.src.slice(ls, state.eMarks[startLine]);
  if (!SINGLE_IMAGE_LINE_RE.test(first)) return null;

  // 统计连续独占一行的图片
  let count = 1;
  let line = startLine + 1;
  while (line < endLine) {
    const cs = state.bMarks[line] + state.tShift[line];
    const content = state.src.slice(cs, state.eMarks[line]).trim();
    if (!content) break;
    if (!SINGLE_IMAGE_LINE_RE.test(content)) break;
    count++;
    line++;
  }
  return {
    endLine: line,
    componentId: count > 1 ? "image-grid" : "image-card",
  };
}

/* ============================================================
 * 块级主规则
 * ============================================================ */
function nativeLayerRule(
  state: StateBlock,
  startLine: number,
  endLine: number,
  silent: boolean,
): boolean {
  if (!isTopLevel(state)) return false;

  // 组件 slot 重新渲染期间关闭识别，避免递归套容器
  if ((state.md as unknown as Record<symbol, boolean>)[DISABLED_KEY]) {
    return false;
  }

  let componentId: string | undefined;
  let end = startLine + 1;

  // 标题：`##` → section-title / numbered-heading
  const ls = state.bMarks[startLine] + state.tShift[startLine];
  const lineStart = state.src.slice(ls, state.eMarks[startLine]);
  const headingM = lineStart.match(/^(#{1,6})\s+(.+)$/);
  if (headingM && headingM[1].length === HEADING_LEVEL) {
    componentId = NUMERIC_HEADING_RE.test(headingM[2].trim())
      ? "numbered-heading"
      : "section-title";
  } else {
    // 代码块 / 表格 / 块引用 / 分隔线 / 图片
    const fenceEnd = detectFence(state, startLine, endLine);
    if (fenceEnd !== -1) {
      // Mermaid 围栏不包成 code-frame：交回标准 fence + highlight 渲染成
      // <pre class="mermaid">，供前端渲染为图形；否则会被当普通代码块高亮成文本。
      const fenceLang = lineStart
        .replace(/^\s*(?:```+|~~~+)\s*/, "")
        .split(/\s+/)[0];
      if (fenceLang === "mermaid") return false;
      componentId = "code-frame";
      end = fenceEnd;
    } else {
      const tableEnd = detectTable(state, startLine, endLine);
      if (tableEnd !== -1) {
        componentId = "styled-table";
        end = tableEnd;
      } else {
        const quoteEnd = detectBlockquote(state, startLine, endLine);
        if (quoteEnd !== -1) {
          componentId = "pullquote";
          end = quoteEnd;
        } else {
          const hrEnd = detectHr(state, startLine, endLine);
          if (hrEnd !== -1) {
            componentId = "divider";
            end = hrEnd;
          } else {
            const img = detectImages(state, startLine, endLine);
            if (img) {
              componentId = img.componentId;
              end = img.endLine;
            }
          }
        }
      }
    }
  }

  if (componentId === undefined) return false;

  if (silent) return true;

  pushComponentTokens(state, startLine, end, componentId);
  return true;
}

export default function markdownItNativeLayer(
  md: MarkdownIt,
  opts?: NativeLayerOptions,
): void {
  if (opts?.enable !== true) return;

  // 在最早的内置块规则（table）之前插入，确保优先消费原生结构
  md.block.ruler.before("table", "native_layer", nativeLayerRule, {
    alt: ["paragraph", "reference", "blockquote", "list"],
  });
}
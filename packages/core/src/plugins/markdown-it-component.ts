/**
 * markdown-it-component
 * 解析公众号组件语法 `::: type{props} ... :::`
 *
 * 语法：
 * ::: quote-card{author="张三" role="设计师"}
 * 内容很重要
 * :::
 *
 * 渲染链路（统一走模板，Phase 4）：
 *   组件原始 markdown 内容
 *     ↓ 取模板（主题包 templates 优先，未定制用内置默认骨架）
 *     ↓ 分槽（slot-parser 按 Input Contract 把内容 map 到 slot:key）
 *     ↓ 填充（template-filler 替换 {{slot:key}} / {{#each}} / {{this.field}}）
 *     ↓ 注入 data-props / data-* 到外层容器
 *   输出 Slot class 结构（wemd-{abbr}-{slot}）
 *
 * 设计要点：
 * - 不渲染具体样式，只输出结构 + data-props，样式由主题 CSS 提供
 * - 组件形态由"当前主题模板"决定；主题未定制某组件时继承内置默认骨架
 * - props 解析支持：key="value"、key='value'、key=value
 * - 支持嵌套组件（内容经 slot-parser 的 renderBody 走完整 markdown-it 管线）
 * - 容错：未闭合的 ::: 不解析，原样输出
 */

import type MarkdownIt from "markdown-it";
import type StateBlock from "markdown-it/lib/rules_block/state_block";
import Token from "markdown-it/lib/token";
import { parseComponentProps } from "./component/parseProps";
import { parseComponentSlots } from "./component/slotParsers";
import { fillTemplate } from "./component/templateFiller";
import { getDefaultTemplate } from "./component/defaultTemplates";
import type { SlotDef } from "./component/slotTypes";

const COMPONENT_MARKER = ":::";
// 组件名允许：小写字母、数字、连字符
const COMPONENT_NAME_RE = /^[a-z][a-z0-9-]*$/;

export interface MarkdownItComponentOptions {
  /**
   * 取组件模板：优先返回当前主题包 templates 中的骨架，
   * 返回 undefined 时回退到内置默认骨架（getDefaultTemplate）。
   */
  getTemplate?: (componentId: string) => string | undefined;
  /**
   * 取主题级扩展槽位：优先返回当前主题包 slotDefs 中的追加槽位，
   * 返回 undefined 时不追加（仅用共享 slotDefs）。
   */
  getSlotDefs?: (componentId: string) => SlotDef[] | undefined;
}

interface ComponentBlockInfo {
  name: string;
  propsRaw: string;
  /** 起始行 `::: name` 之后紧跟着的行内内容（仅 tag-label 支持，如 `::: tag-label #a #b`） */
  inlineContent: string;
}

/**
 * 从行首匹配 `::: name{props}` 语法
 * 返回 null 表示不是组件起始行
 */
function matchComponentOpen(line: string): ComponentBlockInfo | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith(COMPONENT_MARKER)) return null;

  // ::: 后面的内容
  const rest = trimmed.slice(COMPONENT_MARKER.length).trim();
  if (!rest) return null;

  // 提取 name 和可选的 {props}
  // 形如：quote-card 或 quote-card{author="x"} 或 quote-card {author="x"}
  const match = rest.match(/^([a-z][a-z0-9-]*)\s*(\{[^}]*\})?\s*$/);
  if (match) {
    const name = match[1];
    if (!COMPONENT_NAME_RE.test(name)) return null;
    const propsRaw = match[2] ? match[2].slice(1, -1) : "";
    return { name, propsRaw, inlineContent: "" };
  }

  // 扩展：tag-label 允许把标签写在同一行 `::: tag-label #设计 #排版`
  // （其余组件仍要求 `::: name{props}` 独占一行，内容在后续行）
  const tagMatch = rest.match(/^(tag-label)\s+(.+)$/);
  if (tagMatch) {
    return { name: tagMatch[1], propsRaw: "", inlineContent: tagMatch[2] };
  }

  return null;
}

/**
 * 判断一行是否为组件闭合标记 `:::`
 * 注意：起始行可能有 name，闭合行只能是裸 `:::`
 */
function isComponentClose(line: string): boolean {
  return line.trim() === COMPONENT_MARKER;
}

/**
 * 组件块规则：识别 `::: name{props} ... :::` 块
 * 只提取原始内容并压入 component_open / component_close 两个 token，
 * 分槽与填充全部延迟到渲染期完成（见 renderer.rules.component_open）。
 */
function componentRule(
  state: StateBlock,
  startLine: number,
  endLine: number,
  silent: boolean,
): boolean {
  const start = state.bMarks[startLine] + state.tShift[startLine];
  const lineStart = state.src.slice(start, state.eMarks[startLine]);

  const info = matchComponentOpen(lineStart);
  if (!info) return false;

  // 向下查找闭合行 `:::`，支持嵌套组件
  let closeLine = -1;
  let depth = 1;
  for (let line = startLine + 1; line < endLine; line++) {
    const ls = state.bMarks[line] + state.tShift[line];
    const le = state.eMarks[line];
    const content = state.src.slice(ls, le);
    if (matchComponentOpen(content)) {
      depth++;
    } else if (isComponentClose(content)) {
      depth--;
      if (depth === 0) {
        closeLine = line;
        break;
      }
    }
  }

  // 未闭合：不解析，交给其他规则处理
  if (closeLine === -1) return false;

  if (silent) return true;

  const oldParent = state.parentType;
  state.parentType = "component" as typeof state.parentType;

  const token = state.push("component_open", "section", 1);
  token.markup = COMPONENT_MARKER;
  token.block = true;
  token.info = info.propsRaw;
  token.attrSet("class", `wemd-component wemd-${info.name}`);
  token.attrSet("data-component", info.name);
  token.map = [startLine, closeLine];

  // 提取原始内容（不 tokenize，避免生成 p/ul/li；嵌套组件由 slot-parser 的
  // renderBody 在渲染期递归处理）
  // 用 state.getLines 保留组件内容内的缩进（如代码块），只剥掉组件自身的公共缩进，
  // 语义与 markdown-it 原生 fence 规则一致（见 fence.mjs 中 state.getLines 用法）。
  const baseIndent = state.sCount[startLine];
  token.meta = {
    rawContent:
      // tag-label 行内标签：把起始行 `::: tag-label #a #b` 的标签并入内容，
      // 让 slot-parser 能像后续行内容一样处理（其余组件 inlineContent 恒为空）。
      (info.inlineContent ? info.inlineContent + "\n" : "") +
      state.getLines(startLine + 1, closeLine, baseIndent, true),
  };

  const closeToken = state.push("component_close", "section", -1);
  closeToken.markup = COMPONENT_MARKER;

  state.parentType = oldParent;
  state.line = closeLine + 1;

  return true;
}

/**
 * 把 propsRaw 字符串序列化为 JSON 字符串，写入 data-props 属性
 * 同时把解析后的 props 对象合并到 token.meta.props，供渲染时使用
 * （保留 componentRule 已写入的 meta.rawContent，不覆盖）
 */
function attachPropsToToken(token: Token, propsRaw: string): void {
  const props = parseComponentProps(propsRaw);
  token.meta = { ...(token.meta || {}), props };
  try {
    token.attrSet("data-props", JSON.stringify(props));
  } catch {
    token.attrSet("data-props", "{}");
  }
  for (const [key, value] of Object.entries(props)) {
    const attrKey = `data-${key}`;
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      token.attrSet(attrKey, String(value));
    }
  }
}

/**
 * 剥离 HTML 中所有 data-wemd-source-start/end 锚点属性。
 * 组件内部经 renderBody 渲染的子串会被注入"相对子串"的错误行号锚点，
 * 这些必须移除，否则会污染预览端 collectAnchors 的锚点集合导致滚动漂移。
 */
function stripSourceAttrs(html: string): string {
  return html.replace(/ data-wemd-source-(start|end)="[^"]*"/g, "");
}

/**
 * 把滚动锚点属性（data-wemd-source-start/end）注入到模板外层容器。
 * core 阶段 markdown-it-source-position 已把 source 属性写入 token，
 * 但组件用自定义渲染器直接输出模板 HTML，需在此手动透传，否则预览端
 * collectAnchors 无法为组件建立滚动同步锚点（组件区域滚动不同步）。
 */
function injectSourceAttrs(html: string, token: Token): string {
  const start = token.attrGet("data-wemd-source-start");
  const end = token.attrGet("data-wemd-source-end");
  if (start === null && end === null) return html;
  let extra = "";
  if (start !== null) extra += ` data-wemd-source-start="${start}"`;
  if (end !== null) extra += ` data-wemd-source-end="${end}"`;

  const outerRe = /<section\s+class="wemd-component[^"]*"[^>]*?>/;
  return html.replace(outerRe, (tag) => {
    if (tag.includes("data-wemd-source-start=")) return tag;
    return `${tag.slice(0, -1)}${extra}>`;
  });
}

/**
 * 把 data-props / data-* 属性注入到模板外层容器（首个 wemd-component section）
 * 模板只承载结构，属性在渲染期注入，避免每套主题重复写 data-props。
 *
 * 同时把 data-props 之外的 data-* 透传到内层 .wemd-component-body：
 * 主题 CSS 常用 `.wemd-faq[data-title] .wemd-component-body::before { content: attr(data-title) }`
 * 这类选择器，attr() 只能读取伪元素宿主（body）自身的属性，若只注入外层容器，
 * 预览端伪元素取不到值。透传后预览与微信导出（伪元素物化）读取来源一致。
 */
function injectComponentAttrs(
  html: string,
  props: Record<string, unknown>,
): string {
  let dataProps = "{}";
  try {
    dataProps = JSON.stringify(props);
  } catch {
    dataProps = "{}";
  }
  let extra = ` data-props="${escapeHtmlAttr(dataProps)}"`;
  let bodyExtra = "";
  for (const [key, value] of Object.entries(props)) {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      const attr = ` data-${key}="${escapeHtmlAttr(String(value))}"`;
      extra += attr;
      bodyExtra += attr;
    }
  }

  const outerRe = /<section\s+class="wemd-component[^"]*"[^>]*?>/;
  let out = html.replace(outerRe, (tag) => {
    if (tag.includes("data-props=")) return tag;
    return `${tag.slice(0, -1)}${extra}>`;
  });

  if (bodyExtra) {
    const bodyRe = /<div\s+class="wemd-component-body"(\s[^>]*?)?>/;
    out = out.replace(bodyRe, (tag) => {
      // 已带 data-* 则不再重复注入
      if (tag.includes("data-props=") || tag.includes("data-")) return tag;
      return `${tag.slice(0, -1)}${bodyExtra}>`;
    });
  }

  return out;
}

export default function markdownItComponent(
  md: MarkdownIt,
  opts?: MarkdownItComponentOptions,
): void {
  const resolveThemeTemplate = opts?.getTemplate ?? (() => undefined);

  // 注册块规则，优先级在 table、blockquote 之后
  md.block.ruler.before("fence", "component", componentRule, {
    alt: ["paragraph", "reference", "blockquote", "list"],
  });

  // 在 core 规则里把 props 写入 token
  md.core.ruler.push("component-props", (state) => {
    for (const token of state.tokens) {
      if (token.type === "component_open" && token.info != null) {
        attachPropsToToken(token, token.info);
      }
    }
  });

  // 统一渲染：取模板 → 分槽 → 填充 → 注入属性，一次性输出完整组件 HTML
  md.renderer.rules.component_open = (tokens: Token[], idx: number) => {
    const token = tokens[idx];
    const componentName = token.attrGet("data-component") || "";
    const rawContent = token.meta?.rawContent ?? "";
    const props = token.meta?.props ?? {};

    const template =
      resolveThemeTemplate(componentName) ?? getDefaultTemplate(componentName);
    const slotContent = parseComponentSlots(
      md,
      componentName,
      rawContent,
      opts?.getSlotDefs?.(componentName),
    );
    // props 合并进模板数据：让骨架的 {{#if key}}/{{slot:key}} 能读到 props
    // （如 {author="..."}），slot 内容优先，即分槽结果覆盖同名 prop。
    const propsScalar: Record<string, string> = {};
    for (const [key, value] of Object.entries(props)) {
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        propsScalar[key] = String(value);
      }
    }
    const filled = fillTemplate(template, { ...propsScalar, ...slotContent });

    // 组件内部经 renderBody 渲染的子串会注入"相对子串"的错误行号锚点，
    // 必须先剥离，再只注入外层组件的绝对行号锚点，避免污染滚动同步的锚点集合。
    const stripped = stripSourceAttrs(filled);
    return `${injectSourceAttrs(injectComponentAttrs(stripped, props), token)}\n`;
  };

  // 组件整体已在 component_open 输出，close 不再输出
  md.renderer.rules.component_close = () => "";
}

/** 转义 HTML 属性值中的特殊字符 */
function escapeHtmlAttr(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * 通用 Slot 分槽器 —— 把组件原始 markdown 内容按 Input Contract 分成各 Slot
 *
 * 设计目标：
 * - 确定性：同一输入永远得到同一分槽结果（不依赖 AI）
 * - 全覆盖：未归入任何显式 Slot 的行进 `body` 兜底，不丢内容
 * - 统一消费维度：所有 source 都以"行"为原子单位跟踪消费，避免 first-line /
 *   paragraph 等不同维度用同一索引导致互相覆盖
 *
 * 输入：组件原始 markdown（`::: name` 与 `:::` 之间的纯文本）
 * 输出：分槽结果（SlotContent），值为已渲染的 HTML 片段；list 槽为条目数组
 */
import type MarkdownIt from "markdown-it";
import type {
  ComponentSlotDef,
  ListItem,
  SlotContent,
  SlotDef,
} from "./slotTypes";
import { getBuiltinSlotDef, getFallbackSlotDef } from "./slotDefs";
import { setNativeLayerDisabled } from "../markdown-it-native-layer";
import highlightjs from "../../utils/langHighlight";

/** 行内粗体标记（用于识别 strong 槽） */
const STRONG_RE = /\*\*(.+?)\*\*/;
/** markdown 图片行 */
const IMAGE_LINE_RE = /!\[([^\]]*)\]\(([^)]+)\)/;
/** markdown 列表项行 */
const LIST_ITEM_RE = /^[-*+]\s+(.+)$/;

/** 把原始 block 内容按空行切成"行 + 段落分组" */
function analyzeBlock(rawContent: string): {
  lines: string[];
  paragraphs: number[][];
} {
  const lines: string[] = [];
  const paragraphs: number[][] = [];
  let current: number[] = [];
  let inFence = false;
  for (const rawLine of rawContent.split("\n")) {
    // 代码围栏 ```` ```lang ... ``` ```` 内的行保留原始缩进：
    // 代码缩进是语义（非正文排版空白），不能像正文一样去头尾空白，
    // 否则 code-frame / code-block 等组件的行首缩进会丢失。
    const isFence = /^```/.test(rawLine.trim());
    if (isFence) {
      inFence = !inFence;
      lines.push(rawLine);
      current.push(lines.length - 1);
      continue;
    }
    const line = inFence ? rawLine : rawLine.trim();
    if (!line) {
      if (current.length) {
        paragraphs.push(current);
        current = [];
      }
      continue;
    }
    lines.push(line);
    current.push(lines.length - 1);
  }
  if (current.length) paragraphs.push(current);
  return { lines, paragraphs };
}

/** 判断是否为图片行 */
function isImageLine(line: string): boolean {
  return IMAGE_LINE_RE.test(line);
}

/** 提取图片 HTML */
function renderImageMarkdown(line: string): string {
  // 清理行首列表前缀（`- ![a](...)` / `* ![b](...)`），避免残留 `- ` 在 <img> 前
  const cleaned = line.replace(/^\s*[-*+]\s+/, "");
  return cleaned.replace(IMAGE_LINE_RE, (_m, alt: string, src: string) => {
    return `<img src="${escapeHtmlAttr(src)}" alt="${escapeHtmlAttr(alt)}">`;
  });
}

/** 渲染 markdown 行内（粗体/斜体/链接）为 HTML */
function renderInline(markdownParser: MarkdownIt, text: string): string {
  return markdownParser.renderInline(text.trim());
}

/**
 * 分槽主函数
 *
 * @param markdownParser 用于渲染行内 markdown 的 markdown-it 实例
 * @param componentId    组件名
 * @param rawContent     组件原始内容
 * @returns 分槽结果（slotKey → HTML 或 list 条目数组）
 */
export function parseComponentSlots(
  markdownParser: MarkdownIt,
  componentId: string,
  rawContent: string,
  slotOverrides?: SlotDef[],
): SlotContent {
  // 复杂扩展组件：走专用解析器（解析逻辑复杂，无法用通用 source 规则表达）
  const complex = COMPLEX_PARSERS[componentId];
  if (complex) return complex(markdownParser, rawContent);

  const baseDef: ComponentSlotDef =
    getBuiltinSlotDef(componentId) ?? getFallbackSlotDef(componentId);

  // 主题级扩展槽：合并共享槽位，key 冲突以主题扩展为准（让主题能消费额外内容）
  const def = mergeSlotOverrides(baseDef, slotOverrides);

  const result: SlotContent = {};
  const { lines, paragraphs } = analyzeBlock(rawContent);
  const consumed = new Set<number>();
  let hasAllSlot = false;

  for (const slot of def.slots) {
    const rule = slot.input;
    if (!rule) continue; // 无 Input Contract 的 slot（复杂组件已由 COMPLEX_PARSERS 处理）
    switch (rule.source) {
      case "first-line":
      case "last-line": {
        const taken = takeLinesByPosition(
          markdownParser,
          lines,
          rule,
          consumed,
        );
        if (taken !== undefined) result[slot.key] = taken;
        break;
      }
      case "number-prefix": {
        // 行首编号前缀：提取编号（如 01 / 1. / 一、），剩余文本（含 ##）替换回原行
        const taken = takeNumberPrefix(lines, rule);
        if (taken !== undefined) result[slot.key] = taken;
        break;
      }
      case "first-char": {
        // 首字下沉：取首段第一个字符并从该行剥除（剩余文本替换回原行，供 body 渲染）
        const taken = takeFirstChar(lines, rule, consumed);
        if (taken !== undefined) result[slot.key] = taken;
        break;
      }
      case "paragraph": {
        const taken = takeParagraphs(
          markdownParser,
          lines,
          paragraphs,
          rule,
          consumed,
        );
        if (taken !== undefined) result[slot.key] = taken;
        break;
      }
      case "strong": {
        const taken = takeStrong(markdownParser, lines, rule, consumed);
        if (taken !== undefined) result[slot.key] = taken;
        break;
      }
      case "image": {
        const taken = takeImages(lines, rule, consumed);
        if (taken !== undefined) result[slot.key] = taken;
        break;
      }
      case "image-url": {
        // 图片 URL（背景图用途）：取首张图片的 src，不渲染 <img>
        const url = takeImageUrl(lines, rule, consumed);
        if (url !== undefined) result[slot.key] = url;
        break;
      }
      case "list": {
        const items = takeListItems(
          markdownParser,
          lines,
          slot.item_slots,
          consumed,
        );
        if (items !== undefined) result[slot.key] = items;
        break;
      }
      case "hr": {
        const taken = takeHr(lines, consumed);
        if (taken !== undefined) result[slot.key] = taken;
        break;
      }
      case "block": {
        const taken = takeBlock(
          markdownParser,
          lines,
          slot.type,
          consumed,
          rawContent,
        );
        if (taken !== undefined) result[slot.key] = taken;
        break;
      }
      case "all": {
        hasAllSlot = true;
        if (rawContent.trim()) {
          result[slot.key] = renderBody(markdownParser, rawContent);
        }
        break;
      }
      default:
        break;
    }
  }

  // body 兜底：未消费的行按原顺序渲染，确保不丢内容。
  // 注意：source:"all" 槽已消费整块内容（含空行），此时跳过兜底，
  // 否则兜底用"去空行后的行片段"重新渲染会覆盖 all 槽的正确结果（段落被合并）。
  if (!hasAllSlot) {
    const leftover = lines
      .map((line, i) => (consumed.has(i) ? null : line))
      .filter((l): l is string => l !== null);
    if (leftover.length) {
      result.body = renderBody(markdownParser, leftover.join("\n"));
    }
  }

  return result;
}

/**
 * 合并主题级扩展槽到共享槽位：
 * - 追加主题声明的槽位（骨架可用 {{slot:key}} 消费）
 * - key 与共享槽冲突时以主题扩展为准（主题作者明确声明的优先）
 * - 扩展槽排在共享槽之前解析：确保能抢在段落型共享槽（如 desc / body 的
 *   paragraph/many）之前消费内容——否则图片/行会被 desc 吞掉提取不到
 */
export function mergeSlotOverrides(
  base: ComponentSlotDef,
  overrides?: SlotDef[],
): ComponentSlotDef {
  if (!overrides || overrides.length === 0) return base;
  const overrideKeys = new Set(overrides.map((s) => s.key));
  const keepBase = base.slots.filter((s) => !overrideKeys.has(s.key));
  return { ...base, slots: [...overrides, ...keepBase] };
}

/**
 * 取首行 / 末行（first-line / last-line 语义恒为一行，与 cardinality 无关）
 */
function takeLinesByPosition(
  markdownParser: MarkdownIt,
  lines: string[],
  rule: {
    position?: "first" | "last" | "any";
    cardinality?: "one" | "optional" | "many";
    maxChars?: number;
    rejectPunct?: boolean;
  },
  consumed: Set<number>,
): string | undefined {
  const pos = rule.position ?? "first";
  const idxs: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (consumed.has(i)) continue;
    // 跳过代码围栏段（``` 开闭内的所有行），避免 ```js 围栏或代码内容被误取为标题
    if (/^```/.test(lines[i])) {
      i = skipFenceRange(lines, i);
      continue;
    }
    // 可选最大字数：超长行不匹配（如 end-card 的 heading 只认「后记」这类短行，
    // 不吞长正文；无标题时正文仍留给 subtitle，避免被渲染成大标题）
    if (rule.maxChars !== undefined && lines[i].trim().length > rule.maxChars) {
      continue;
    }
    // 仅装饰/元信息行：含中文句读的普通句子不匹配，避免正文短句被当装饰尾标吞掉
    if (rule.rejectPunct && /[。，！？；]/.test(lines[i])) {
      continue;
    }
    idxs.push(i);
  }
  if (pos === "last") idxs.reverse();
  const pick = idxs[0];
  if (pick === undefined) return undefined;
  consumed.add(pick);
  return renderInline(markdownParser, lines[pick]);
}

/** 返回代码围栏段的最后一行索引（用于跳过整个围栏） */
function skipFenceRange(lines: string[], openIdx: number): number {
  const relClose = lines.slice(openIdx + 1).findIndex((l) => /^```/.test(l));
  return relClose >= 0 ? openIdx + relClose : lines.length - 1;
}

/** 行首编号前缀：可选 ## 头 + 数字/中文序号 + 可选分隔符（如 "01 "、"1. "、"一、"） */
const NUMBER_PREFIX_RE =
  /^\s*((?:\d{1,3}|[一二三四五六七八九十百]+)[.、．:：]?\s*)(.*)$/;

/**
 * 提取行首编号前缀（source:"number-prefix"，主题扩展槽用，如 section-title/numbered-heading 的编号拆分）。
 * - 只处理"标题行"：以 ## 开头（h2 自动识别）或以编号开头
 * - 剥离行首 ## 标记（native h2 的 rawContent 含 ##）
 * - 有编号时提取为前缀返回（如 "01"），无编号返回 undefined
 * - 剩余文本替换回原行，供后续 body/paragraph 槽渲染（body 用 renderInline，纯文本）
 * - 不标记 consumed：避免 takeParagraphs 因行已消费而跳过标题行
 */
function takeNumberPrefix(
  lines: string[],
  rule: { position?: "first" | "last" | "any" },
): string | undefined {
  const idxs: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*#+\s/.test(lines[i]) || NUMBER_PREFIX_RE.test(lines[i])) {
      idxs.push(i);
    }
  }
  if (rule.position === "last") idxs.reverse();
  const pick = idxs[0];
  if (pick === undefined) return undefined;
  // 剥离 ## 标记（native h2 的 rawContent 含 ##）
  const stripped = lines[pick].replace(/^\s*#+\s*/, "");
  const m = stripped.match(NUMBER_PREFIX_RE);
  let prefix = "";
  let remainder = stripped;
  if (m) {
    prefix = m[1].trim();
    remainder = (m[2] ?? "").trim();
  }
  lines[pick] = remainder.trim() ? remainder.trim() : "";
  return prefix || undefined;
}

/**
 * 取首段第一个字符（source:"first-char"，主题扩展槽用，如引子卡的首字下沉）。
 * - 取第一个含未消费行的段落（跳过图片行 / 围栏 / 空行）的首个字符
 * - 从该行剥除首字符，剩余文本替换回原行，供 body/paragraph 槽渲染
 *   （与 takeNumberPrefix 同思路：修改原行、不标记 consumed，
 *    使剩余正文仍能被后续 body/paragraph 槽收集，避免正文丢失）
 */
function takeFirstChar(
  lines: string[],
  rule: { position?: "first" | "last" | "any" },
  consumed: Set<number>,
): string | undefined {
  const idxs: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (consumed.has(i)) continue;
    if (/^```/.test(lines[i])) continue;
    const line = lines[i].trim();
    if (!line || isImageLine(line)) continue;
    idxs.push(i);
  }
  if (rule.position === "last") idxs.reverse();
  const pick = idxs[0];
  if (pick === undefined) return undefined;
  const line = lines[pick].trim();
  const first = line.charAt(0);
  if (!first) return undefined;
  lines[pick] = line.slice(1).trim();
  return first;
}

/**
 * 按段落取内容：取第一个含未消费行的段落，消费其全部未消费行。
 * 已部分消费（如标题行被 first-line 取走）的段落，只取剩余行。
 */
function takeParagraphs(
  markdownParser: MarkdownIt,
  lines: string[],
  paragraphs: number[][],
  rule: {
    position?: "first" | "last" | "any";
    cardinality?: "one" | "optional" | "many";
  },
  consumed: Set<number>,
): string | undefined {
  const pos = rule.position ?? "first";
  const ordered = pos === "last" ? [...paragraphs].reverse() : paragraphs;

  const picks: string[] = [];
  for (const para of ordered) {
    const usable = para.filter((i) => !consumed.has(i));
    if (!usable.length) continue;
    for (const i of usable) {
      picks.push(lines[i]);
      consumed.add(i);
    }
    if (rule.cardinality === "one") break;
  }
  return picks.length
    ? picks.map((p) => renderInline(markdownParser, p)).join("<br>")
    : undefined;
}

/**
 * 取粗体行（**text**），渲染为 HTML（保留粗体）
 */
function takeStrong(
  markdownParser: MarkdownIt,
  lines: string[],
  rule: {
    position?: "first" | "last" | "any";
    cardinality?: "one" | "optional" | "many";
  },
  consumed: Set<number>,
): string | undefined {
  const pos = rule.position ?? "last";
  const idxs: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (consumed.has(i) || isImageLine(lines[i])) continue;
    if (STRONG_RE.test(lines[i])) idxs.push(i);
  }
  if (pos === "last") idxs.reverse();
  if (!idxs.length) return undefined;
  const i = idxs[0];
  consumed.add(i);
  return renderInline(markdownParser, lines[i]);
}

/**
 * 取图片行，渲染为 <img>
 */
function takeImages(
  lines: string[],
  rule: {
    position?: "first" | "last" | "any";
    cardinality?: "one" | "optional" | "many";
  },
  consumed: Set<number>,
): string | undefined {
  const pos = rule.position ?? "first";
  const idxs: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (consumed.has(i) || !isImageLine(lines[i])) continue;
    idxs.push(i);
  }
  if (pos === "last") idxs.reverse();
  if (!idxs.length) return undefined;
  const taken: string[] = [];
  for (const i of idxs) {
    taken.push(renderImageMarkdown(lines[i]));
    consumed.add(i);
    if (rule.cardinality === "one") break;
  }
  return taken.join("");
}

/** 取图片 URL（不渲染 <img>，供 background-image 使用） */
function takeImageUrl(
  lines: string[],
  rule: { position?: "first" | "last" | "any" },
  consumed: Set<number>,
): string | undefined {
  const idxs: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (consumed.has(i) || !isImageLine(lines[i])) continue;
    idxs.push(i);
  }
  if (rule.position === "last") idxs.reverse();
  const pick = idxs[0];
  if (pick === undefined) return undefined;
  const m = IMAGE_LINE_RE.exec(lines[pick]);
  if (!m) return undefined;
  consumed.add(pick);
  return escapeHtmlAttr(m[2]);
}

/** 列表项字段净化：含粗体剥掉所有 ** 标记取纯文本（value/title/时间标签等展示字段语义），其余走行内渲染 */
function cleanField(markdownParser: MarkdownIt, part: string): string {
  return part.includes("**")
    ? part.replace(/\*\*/g, "")
    : renderInline(markdownParser, part);
}

/** 单行多字段列表项按分隔符拆开（· • ：，用于「标题 · 描述」这类紧凑写法）；无法拆分返回 null */
function splitInlineFields(line: string, count: number): string[] | null {
  if (count < 2) return null;
  const t = line.trim();
  if (!t) return null;
  const sep = t.search(/[·•：:]/);
  if (sep < 0) return null;
  const before = t.slice(0, sep).trim();
  const after = t.slice(sep + 1).trim();
  if (!before) return null;
  return [before, after];
}

function takeListItems(
  markdownParser: MarkdownIt,
  lines: string[],
  itemSlots: { key: string; type?: string; semantic?: string }[] | undefined,
  consumed: Set<number>,
): ListItem[] | undefined {
  const items: ListItem[] = [];
  let current: string[] = [];
  const currentIdx: number[] = [];

  const flush = () => {
    if (!current.length) return;
    const raw = current.map((l) => l.replace(LIST_ITEM_RE, "$1"));
    const fields =
      itemSlots && itemSlots.length ? itemSlots : [{ key: "body" }];
    const item: ListItem = {};
    // 多字段列表项：若整项仅一行，优先按分隔符拆开（如 two-column-cards 的
    // 「标题 · 描述」紧凑写法），否则按行位置映射到各字段。
    if (fields.length > 1 && raw.length === 1 && raw[0]) {
      const seg = splitInlineFields(raw[0], fields.length);
      fields.forEach((f, idx) => {
        const part = seg ? (seg[idx] ?? "") : (raw[idx] ?? "");
        item[f.key] = cleanField(markdownParser, part);
      });
    } else {
      fields.forEach((f, idx) => {
        const part = raw[idx] ?? "";
        item[f.key] = cleanField(markdownParser, part);
      });
    }
    items.push(item);
    current = [];
    for (const i of currentIdx) consumed.add(i);
    currentIdx.length = 0;
  };

  for (let i = 0; i < lines.length; i++) {
    if (consumed.has(i)) continue;
    const line = lines[i];
    if (LIST_ITEM_RE.test(line)) {
      flush();
    }
    current.push(line);
    currentIdx.push(i);
  }
  flush();

  return items.length ? items : undefined;
}

/**
 * 取分隔线（`---` / `***` / `___` 行），返回 `<hr class="wemd-hr">`
 */
function takeHr(lines: string[], consumed: Set<number>): string | undefined {
  for (let i = 0; i < lines.length; i++) {
    if (consumed.has(i)) continue;
    if (/^[-*_]{3,}\s*$/.test(lines[i])) {
      consumed.add(i);
      return `<hr class="wemd-hr">`;
    }
  }
  return undefined;
}

/**
 * block 类型（代码围栏/表格/整块）：
 * - 优先提取代码围栏 ```` ```lang ... ``` ```` 内部，并消费围栏所在行（避免 body 重复）
 * - code 类型：重建带高亮的 <pre><code>
 * - 非 code（表格/整块）：内容经 markdown 管线渲染成 HTML（如 <table>），
 *   保证 styled-table / table 组件的表格真正渲染出来，而不是原样塞入原始文本
 */
function takeBlock(
  markdownParser: MarkdownIt,
  lines: string[],
  type: string | undefined,
  consumed: Set<number>,
  rawContent: string,
): string | undefined {
  const openIdx = lines.findIndex((l) => /^```/.test(l));
  if (openIdx >= 0) {
    const relClose = lines.slice(openIdx + 1).findIndex((l) => /^```/.test(l));
    const closeIdx = relClose >= 0 ? openIdx + 1 + relClose : -1;
    const endIdx = closeIdx >= 0 ? closeIdx : lines.length - 1;
    const inner = lines
      .slice(openIdx + 1, closeIdx >= 0 ? closeIdx : undefined)
      .join("\n");
    for (let i = openIdx; i <= endIdx; i++) consumed.add(i);
    if (type === "code") {
      // code-frame 骨架自带标题栏（.wemd-cf-header），只需纯 <pre><code>，
      // 不能再带 code-block 的 Mac 窗（.wemd-cb-window），否则两层圆点栏嵌套
      return renderCodeBlock(inner, lines[openIdx], false);
    }
    return renderBody(markdownParser, inner);
  }
  return renderBody(markdownParser, rawContent);
}

/**
 * 把代码围栏内容渲染为带高亮的代码块。
 * @param withWindow 是否包 Mac 终端窗（圆点栏 + 语言标签）；code-block 组件需要，
 *                   code-frame 骨架自带标题栏，传 false 只生成 <pre><code>
 */
function renderCodeBlock(
  inner: string,
  openLine: string,
  withWindow = true,
): string {
  const langMatch = openLine.match(/^```\s*([\w+-]+)/);
  const lang = langMatch?.[1] ?? "";
  // 只去掉首尾空白行与行尾空白，保留行首缩进（trim() 会把首行缩进一并剥掉）
  const code = inner.replace(/^\n+/, "").replace(/\s+$/, "");
  const codeHtml =
    lang && highlightjs.getLanguage(lang)
      ? highlightjs.highlight(lang, code, true).value
      : escapeHtml(code);
  const langLabel = lang || "Code";
  const codeEl = `<pre><code class="hljs language-${escapeHtmlAttr(lang)}">${codeHtml}</code></pre>`;
  if (!withWindow) return codeEl;
  return (
    `<div class="wemd-cb-window">` +
    `<div class="wemd-cb-bar">` +
    `<span class="wemd-cb-dots"><i class="wemd-cb-dot wemd-cb-dot-r"></i><i class="wemd-cb-dot wemd-cb-dot-y"></i><i class="wemd-cb-dot wemd-cb-dot-g"></i></span>` +
    `<span class="wemd-cb-lang">${escapeHtml(langLabel)}</span>` +
    `</div>` +
    codeEl +
    `</div>`
  );
}

/**
 * code-block 专用解析器：把 body 渲染为 Mac 终端窗风格代码块。
 * 与通用 all 槽(body) 不同，这里直接生成标题栏 + 高亮代码，而非走整段 markdown。
 */
function parseCodeBlock(
  markdownParser: MarkdownIt,
  rawContent: string,
): SlotContent {
  // 提取首个 fenced code block 的语言与内容
  const lines = rawContent.split("\n");
  const openIdx = lines.findIndex((l) => /^```/.test(l.trim()));
  let body = "";
  if (openIdx >= 0) {
    const relClose = lines
      .slice(openIdx + 1)
      .findIndex((l) => /^```/.test(l.trim()));
    const closeIdx = relClose >= 0 ? openIdx + 1 + relClose : -1;
    const inner = lines
      .slice(openIdx + 1, closeIdx >= 0 ? closeIdx : undefined)
      .join("\n");
    body = renderCodeBlock(inner, lines[openIdx].trim());
  } else {
    body = renderBody(markdownParser, rawContent);
  }
  return { body };
}

/**
 * body 兜底：整块走 markdown 渲染
 */
function renderBody(markdownParser: MarkdownIt, raw: string): string {
  // 重新渲染组件槽内容期间关闭 native-layer 识别，防止递归套容器
  setNativeLayerDisabled(markdownParser, true);
  try {
    const html = markdownParser.render(raw.trim());
    // 先拆段再标记问题段落，避免新增 <p> 打断 markQuestionParagraphs 的 <p> 结构判断
    return markQuestionParagraphs(splitSoftBreaks(html));
  } finally {
    setNativeLayerDisabled(markdownParser, false);
  }
}

/**
 * 把顶层 <p> 段落内的软换行拆成独立 <p>（每行一段）。
 * 微信编辑器对 <p> 内 <br> 的续行会统一缩进对齐（第二行起前面多出空格），
 * 而浏览器把 <p> 内的软换行折叠为空格 —— 用 <br> 无法两端一致；
 * 拆成独立段落块后，两端都逐行对齐、不产生缩进。
 * 仅处理"<p> 在行首、</p> 在行尾"的顶层段落；列表/表格内嵌套的 <p> 不在行首，
 * 不会被命中，避免在 <li>/<td> 内生成残缺的 </p><p>。
 */
function splitSoftBreaks(html: string): string {
  return html.replace(
    /^<p(\s[^>]*)?>([\s\S]*?)<\/p>$/gm,
    (_m, attrs: string, inner: string) => {
      const split = inner.replace(/\n(?=\s*[^<\s])/g, "</p>\n<p>");
      return split === inner ? _m : `<p${attrs ?? ""}>${split}</p>`;
    },
  );
}

/**
 * 给"直接含 <strong> 的 <p>"注入 wemd-q 类。
 * 替代 CSS 中不兼容微信的 :has(strong) 选择器：faq / accordion 通过
 * `.wemd-component-body > p.wemd-q` 命中"问题/标题"段落，其余组件不受影响
 * （wemd-q 类仅在这两个组件的 CSS 中被消费）。
 */
function markQuestionParagraphs(html: string): string {
  return html.replace(
    /<p([^>]*)>((?:(?!<\/p>)[\s\S])*?)<\/p>/g,
    (_m, attrs: string, inner: string) => {
      if (!/<strong[\s>]/.test(inner)) return `<p${attrs}>${inner}</p>`;
      const withoutClass = attrs
        .replace(/class\s*=\s*["'][^"']*["']/, "")
        .trim();
      const existing = attrs.match(/class\s*=\s*["']([^"']*)["']/);
      const cls = existing ? `${existing[1].trim()} wemd-q` : "wemd-q";
      const prefix = withoutClass ? ` ${withoutClass}` : "";
      return `<p${prefix} class="${cls}">${inner}</p>`;
    },
  );
}

/** 转义 HTML 属性 */
function escapeHtmlAttr(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** 转义 HTML 文本 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ============================================================
 * 复杂扩展组件专用解析器
 * 解析逻辑从 magazineRenderers 迁移，产出 Slot 内容（渲染走模板）。
 * 字段级条件分支（url→a、序号/图标、empty 提示等）在解析期已决定，
 * 模板只做结构排布。
 * ============================================================ */

/** 按空行切段落 */
function splitParagraphs(raw: string): string[] {
  return raw
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** 解析图片，返回 { alt, src } 或 null */
function pickImage(text: string): { alt: string; src: string } | null {
  const m = text.match(/!\[([^\]]*)\]\(([^)]+)\)/);
  if (!m) return null;
  return { alt: m[1], src: m[2] };
}

/** product-card：产品卡片 */
function parseProductCard(_parser: MarkdownIt, raw: string): SlotContent {
  const paragraphs = splitParagraphs(raw);
  const result: SlotContent = {};
  let cursor = 0;

  const image = pickImage(paragraphs[cursor] || "");
  if (image) cursor++;
  if (image) {
    result.image = `<img src="${escapeHtmlAttr(image.src)}" alt="${escapeHtmlAttr(image.alt)}">`;
  }

  const titleLine = paragraphs[cursor] || "";
  cursor++;
  let badge = "";
  let title = "";
  let subtitle = "";
  const badgeMatch = titleLine.match(/【([^】]+)】/);
  if (badgeMatch) badge = badgeMatch[1];
  const titleMatch = titleLine.match(/\*\*([^*]+)\*\*/);
  if (titleMatch) title = titleMatch[1];
  let rest = titleLine;
  if (badgeMatch) rest = rest.replace(badgeMatch[0], "");
  if (titleMatch) rest = rest.replace(titleMatch[0], "");
  subtitle = rest.trim();
  if (badge) result.badge = escapeHtml(badge);
  if (title) result.title = escapeHtml(title);
  if (subtitle) result.subtitle = escapeHtml(subtitle);

  const next = paragraphs[cursor] || "";
  const hasPrice = /💰|￥|¥|~~/.test(next);
  if (!hasPrice && next) {
    result.description = escapeHtml(next);
    cursor++;
  }

  let price = "";
  let originalPrice = "";
  const priceLine = paragraphs[cursor] || "";
  if (priceLine) {
    cursor++;
    const priceMatch = priceLine.match(/(💰\s*)?([￥¥]\s*\d+(?:\.\d+)?)/);
    if (priceMatch) price = priceMatch[2];
    const origMatch = priceLine.match(/~~([^~]+)~~/);
    if (origMatch) originalPrice = origMatch[1];
    if (!price) {
      const parts = priceLine.split(/\s+/).filter(Boolean);
      price = parts.find((p) => !p.startsWith("~~") && /[￥¥\d]/.test(p)) || "";
    }
  }
  if (price) result.price = escapeHtml(price);
  if (originalPrice)
    result.originalPrice = `<s>${escapeHtml(originalPrice)}</s>`;

  let rating = "";
  let sales = "";
  let stock = "";
  const metaLine = paragraphs[cursor] || "";
  if (metaLine && !metaLine.includes("【") && !metaLine.startsWith("#")) {
    const starMatch = metaLine.match(/([⭐☆]+)/);
    const starNumMatch = metaLine.match(/(\d+(?:\.\d+)?)/);
    if (starMatch)
      rating = starMatch[0] + (starNumMatch ? " " + starNumMatch[1] : "");
    const saleMatch = metaLine.match(/📦\s*([^\s]+(?:\s[^\s🔥]+)*)/u);
    if (saleMatch) sales = saleMatch[1];
    const stockMatch = metaLine.match(/🔥\s*([^\s]+(?:\s[^\s]+)*)/u);
    if (stockMatch) stock = stockMatch[1];
    cursor++;
  }
  if (rating) result.rating = escapeHtml(rating);
  if (sales) result.sales = escapeHtml(sales);
  if (stock) result.stock = escapeHtml(stock);

  let button = "";
  const btnLine = paragraphs[cursor] || "";
  if (/【.+】/.test(btnLine)) {
    const m = btnLine.match(/【([^】]+)】/);
    if (m) button = m[1];
    cursor++;
  }
  if (button) result.button = escapeHtml(button);

  const tags: string[] = [];
  const tagsLine = paragraphs[cursor] || "";
  if (tagsLine && tagsLine.startsWith("#")) {
    tagsLine.split(/\s+/).forEach((t) => {
      if (t.startsWith("#")) tags.push(t.slice(1));
    });
  }
  if (tags.length)
    result.tags = tags.map((t) => ({ tag: "#" + escapeHtml(t) }));

  return result;
}

/** brand-sign：品牌签名 */
function parseBrandSign(_parser: MarkdownIt, raw: string): SlotContent {
  const paragraphs = splitParagraphs(raw);
  const result: SlotContent = {};
  let cursor = 0;

  // 首段若为 Logo 图片（![](url) / ![alt](url) / !`url`），提取为 logo，继续从下一段解析品牌名
  const logo = extractBrandLogo(paragraphs[cursor]);
  if (logo) {
    result.logo = logo;
    cursor++;
  }

  const nameP = paragraphs[cursor] || "";
  const m = nameP.match(/\*\*([^*]+)\*\*/);
  if (m) result.brandName = escapeHtml(m[1]);
  // 品牌行尾部 ` · xxx` / `｜xxx` 作为 tagline 副标（紧跟品牌名），非右下角版权小字
  let tagline = "";
  const rest = (nameP.replace(m ? m[0] : "", "") || "").trim();
  const tl = rest.match(/^[·|｜]\s*(.+)$/);
  if (tl) tagline = tl[1].trim();
  cursor++;

  const slog = paragraphs[cursor];
  if (
    slog &&
    !slog.includes("style=") &&
    !slog.includes("divider") &&
    !slog.startsWith("*")
  ) {
    result.slogan = escapeHtml(slog);
    cursor++;
  }

  const meta = paragraphs[cursor];
  if (meta && (meta.includes("style=") || meta.includes("divider"))) {
    const s = meta.match(/style=(inline|stacked|centered)/);
    if (s) result.style = s[1];
    if (/divider\s*=\s*true/.test(meta)) result.divider = "true";
    cursor++;
  }

  // tagline 作为独立字段填充到品牌名行
  if (tagline) result.tagline = escapeHtml(tagline);

  const last = paragraphs[cursor];
  if (last) {
    const em = last.match(/^\*([^*]+)\*$/);
    result.subText = escapeHtml(em ? em[1] : last);
  }

  return result;
}

/** 提取 brand-sign Logo 图片 HTML（支持 ![](url) / ![alt](url) / !`url`），无则返回空 */
function extractBrandLogo(line: string | undefined): string {
  const trimmed = (line || "").trim();
  if (!trimmed) return "";
  const std = trimmed.match(/^!\[([^\]]*)\]\(([^)\s]+)\)/);
  if (std) {
    return `<img class="wemd-bs-logo-img" src="${escapeHtmlAttr(std[2])}" alt="${escapeHtmlAttr(std[1] || "logo")}">`;
  }
  const tick = trimmed.match(/^!`([^`]+)`/);
  if (tick) {
    return `<img class="wemd-bs-logo-img" src="${escapeHtmlAttr(tick[1].trim())}" alt="logo">`;
  }
  return "";
}

/** resource-list：资料/步骤清单 */
function parseResourceList(_parser: MarkdownIt, raw: string): SlotContent {
  const allLines = raw
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l !== "---");
  const result: SlotContent = {};
  let title = "";
  let subtitle = "";
  let numbered = false;
  let layout = "comfortable";
  let listStartIdx = 0;

  for (let i = 0; i < Math.min(3, allLines.length); i++) {
    const l = allLines[i];
    if (!l) continue;
    if (/^- /.test(l)) {
      listStartIdx = i;
      break;
    }
    const mBold = l.match(/^\*\*([^*]+)\*\*$/);
    if (mBold && !title) {
      title = mBold[1];
      listStartIdx = i + 1;
      continue;
    }
    if (/numbered\s*=\s*(true|false)/.test(l) || /layout\s*=\s*/.test(l)) {
      const nm = l.match(/numbered\s*=\s*(true|false)/);
      if (nm) numbered = nm[1] === "true";
      const lm = l.match(/layout\s*=\s*(compact|comfortable)/);
      if (lm) layout = lm[1];
      listStartIdx = i + 1;
      break;
    }
    if (!title && !subtitle) {
      title = l;
      listStartIdx = i + 1;
    } else if (!subtitle) {
      subtitle = l;
      listStartIdx = i + 1;
    }
  }
  if (title) result.title = escapeHtml(title);
  if (subtitle) result.subtitle = escapeHtml(subtitle);
  if (numbered) result.numbered = "true";
  result.layout = layout;

  const items: ListItem[] = [];
  let fallbackIdx = 0;
  for (let i = listStartIdx; i < allLines.length; i++) {
    const line = allLines[i];
    if (!line) continue;
    const itemMatch = line.match(/^-\s*\[([a-zA-Z]+)\|(\d+)\]\s*(.*)$/);
    const plainMatch = itemMatch
      ? null
      : line.match(/^-\s*\*\*(.*?)\*\*\s*[:：]\s*(.*)$/);
    let type = "link";
    let idx = 0;
    let rest = "";
    if (itemMatch) {
      type = itemMatch[1] || "link";
      idx = Number(itemMatch[2]);
      rest = itemMatch[3].trim();
    } else if (plainMatch) {
      fallbackIdx += 1;
      idx = fallbackIdx;
      rest = `${plainMatch[1].trim()} |D=${plainMatch[2].trim()}`;
    } else if (/^-\s+/.test(line)) {
      // 普通列表项：`- 📄 标题` 或 `- 标题`，图标=首个 emoji/字符，标题=其余
      fallbackIdx += 1;
      idx = fallbackIdx;
      const content = line.replace(/^-\s+/, "").trim();
      const iconM = content.match(
        /^(\p{Extended_Pictographic}|[^\s])\s+(.+)$/u,
      );
      if (iconM) {
        rest = `${iconM[2].trim()} |I=${iconM[1].trim()}`;
      } else {
        rest = content;
      }
    } else {
      continue;
    }
    const descM = rest.match(/\|D=([^|]+)/);
    const metaM = rest.match(/\|M=([^|]+)/);
    const tagM = rest.match(/\|T=([^|]+)/);
    const urlM = rest.match(/\|U=([^|]+)/);
    const iconM2 = rest.match(/\|I=([^|]+)/);
    const seg = rest.replace(/\|I=[^|]+/, "").split(/\s*\|(?=[DMTU]=)/);
    const titlePart = seg[0].trim();
    const desc = descM ? descM[1].trim() : "";
    const meta = metaM ? metaM[1].trim() : "";
    const tag = tagM ? tagM[1].trim() : "";
    const url = urlM ? urlM[1].trim() : "";
    const explicitIcon = iconM2 ? iconM2[1].trim() : "";
    const icons: Record<string, string> = {
      file: "📄",
      link: "🔗",
      video: "🎞️",
      step: "📌",
    };
    const label = explicitIcon
      ? explicitIcon
      : numbered
        ? String(idx).padStart(2, "0")
        : icons[type] || "📎";
    const t = url
      ? `<a href="${escapeHtmlAttr(url)}">${escapeHtml(titlePart)}</a>`
      : escapeHtml(titlePart);
    items.push({
      label,
      title: t,
      desc: desc ? escapeHtml(desc) : "",
      meta: meta ? escapeHtml(meta) : "",
      tag: tag ? escapeHtml(tag) : "",
    });
  }
  if (items.length) result.items = items;
  return result;
}

/** testimonial-card：名人推荐/客户背书 */
function parseTestimonialCard(_parser: MarkdownIt, raw: string): SlotContent {
  const paragraphs = splitParagraphs(raw);
  const result: SlotContent = {};
  let cursor = 0;

  let avatarSrc = "";
  const p0 = paragraphs[0] || "";
  const img = pickImage(p0);
  if (img && !/^>/.test(p0)) {
    avatarSrc = img.src;
    cursor = 1;
  }

  let quote = "";
  let source = "";
  for (let i = cursor; i < paragraphs.length; i++) {
    const p = paragraphs[i].trim();
    if (p.startsWith(">")) {
      const content = p.replace(/^>\s*/, "").replace(/\*\*/g, "").trim();
      const src = content.match(/^—{1,2}\s*(.+)$/);
      if (src) {
        source = src[1].trim();
      } else if (!quote) {
        quote = stripQuoteMarks(content);
      } else if (!source) {
        source = stripQuoteMarks(content)
          .replace(/^—{1,2}\s*/, "")
          .trim();
      }
      cursor = i + 1;
    } else if (!quote && isQuotedParagraph(p)) {
      // 自然输入：引用也可写成普通引号段落（"..." / 「...」）
      quote = stripQuoteMarks(p);
      cursor = i + 1;
    } else {
      break;
    }
  }
  if (source) result.source = escapeHtml(source);

  let name = "";
  let title = "";
  const personLine = paragraphs[cursor] || "";
  if (personLine) {
    cursor++;
    const nm = personLine.match(/\*\*([^*]+)\*\*/);
    if (nm) name = nm[1];
    // 职位前导的 `· ` / `｜ ` 分隔符剥掉，避免残留显示（如 `· 内容创作者`）
    const rest = personLine
      .replace(nm ? nm[0] : "", "")
      .replace(/^\s*[·|｜]\s*/, "")
      .trim();
    if (rest) title = rest;
  }
  if (avatarSrc) {
    result.avatar = `<img src="${escapeHtmlAttr(avatarSrc)}" alt="${escapeHtmlAttr(name)}">`;
  }
  if (name) result.name = escapeHtml(name);
  if (title) result.title = escapeHtml(title);

  let company = "";
  let companyLogo = "";
  const companyLine = paragraphs[cursor] || "";
  if (companyLine) {
    const trimmed = companyLine.trim();
    if (!quote && isQuotedParagraph(trimmed)) {
      // 兼容「姓名在前、引用在后」的自然顺序：把引号段落当作引用而非公司
      quote = stripQuoteMarks(trimmed);
    } else {
      const ci = pickImage(companyLine);
      if (ci) companyLogo = ci.src;
      else company = companyLine;
    }
  }
  if (quote) result.quote = escapeHtml(quote);
  if (company) result.company = escapeHtml(company);
  if (companyLogo) {
    result.companyLogo = `<img src="${escapeHtmlAttr(companyLogo)}" alt="${escapeHtmlAttr(company || "brand")}">`;
  }
  return result;
}

/** 判断是否为成对引号包裹的引用段落（"…" / 「…」 / “…”） */
function isQuotedParagraph(p: string): boolean {
  return /^[“"「].*[”"」]$/.test(p);
}

/** cta-card：关注引导卡片（首段 title、中间段 body、末段 action） */
function parseCtaCard(_parser: MarkdownIt, raw: string): SlotContent {
  const paragraphs = splitParagraphs(raw);
  const result: SlotContent = {};
  if (!paragraphs.length) return result;
  // 首段 → 主标题（剥掉 ** 包裹，按钮/标题语义为纯文本）
  result.title = escapeHtml(paragraphs[0].replace(/\*\*/g, "").trim());
  if (paragraphs.length >= 3) {
    // 三段及以上：中间段 → 正文，末段 → 行动按钮
    result.body = paragraphs
      .slice(1, -1)
      .map((p) => escapeHtml(p))
      .join("<br>");
    result.action = escapeHtml(
      paragraphs[paragraphs.length - 1].replace(/\*\*/g, "").trim(),
    );
  } else if (paragraphs.length === 2) {
    // 两段：首段标题、末段正文（无独立按钮）
    result.body = escapeHtml(paragraphs[1]);
  }
  return result;
}

/** timeline：时间线（首个非列表行为标题，列表项为条目；** 已剥） */
function parseTimeline(_parser: MarkdownIt, raw: string): SlotContent {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const result: SlotContent = {};
  let title = "";
  const items: ListItem[] = [];
  for (const line of lines) {
    const itemMatch = line.match(/^[-*+]\s+(.+)$/);
    if (itemMatch) {
      items.push({ body: itemMatch[1].replace(/\*\*/g, "").trim() });
    } else if (!title) {
      // 首个非列表行作为时间线标题
      title = line.replace(/\*\*/g, "").trim();
    }
  }
  if (title) result.title = escapeHtml(title);
  if (items.length) result.items = items;
  return result;
}

/** 剥掉段落首尾的引号标记 */
function stripQuoteMarks(p: string): string {
  return p
    .replace(/^[“"「]+/, "")
    .replace(/[”"」]+$/, "")
    .trim();
}

/** series-nav：系列文章导航 */
function parseSeriesNav(_parser: MarkdownIt, raw: string): SlotContent {
  const lines = raw.split("\n").map((l) => l.trimEnd());
  const result: SlotContent = {};
  let seriesName = "";
  let current = 0;
  let total = 0;
  let description = "";
  let prev = { title: "", index: 0 };
  let next = { title: "", index: 0 };
  let hasExplicitHeader = false;
  let hasExplicitPrev = false;
  let hasExplicitNext = false;
  const listItems: {
    index: number;
    title: string;
    current: boolean;
    done: boolean;
    url?: string;
    titleHasNo?: boolean;
  }[] = [];

  for (const line of lines) {
    const l = line.trim();
    if (!l) continue;
    // 头部格式①：`📚 **名称** （第 X / N 篇）`（兼容全角/半角括号）
    const header = l.match(
      /📚\s*\*\*([^*]+)\*\*\s*[（(]\s*第\s*(\d+)\s*\/\s*(\d+)\s*篇\s*[）)]/,
    );
    if (header) {
      seriesName = header[1];
      current = Number(header[2]);
      total = Number(header[3]);
      hasExplicitHeader = true;
      continue;
    }
    if (/^⬅️\s*上一篇：/.test(l)) {
      const m = l.match(/上一篇：\*\*第(\d+)篇\*\*\s*—\s*(.+)$/);
      if (m) {
        prev = { index: Number(m[1]), title: m[2] };
        hasExplicitPrev = true;
      }
      continue;
    }
    if (/^➡️\s*下一篇：/.test(l)) {
      const m = l.match(/下一篇：\*\*第(\d+)篇\*\*\s*—\s*(.+)$/);
      if (m) {
        next = { index: Number(m[1]), title: m[2] };
        hasExplicitNext = true;
      }
      continue;
    }
    const listItem = parseSeriesListItem(l);
    if (listItem) {
      // `[CURRENT]` 无编号时，按列表顺序补篇号
      if (!listItem.index) listItem.index = listItems.length + 1;
      listItems.push(listItem);
      continue;
    }
    // 未匹配行：首行作系列名（纯文本/加粗均可），后续行作描述
    if (!seriesName && !hasExplicitHeader) {
      seriesName = l.replace(/^\*\*|\*\*$/g, "");
    } else if (!description) {
      description = l;
    }
  }

  // 推断总数：头部没给「第 X / N 篇」时，取列表最大篇号
  const maxIdx = listItems.reduce((m, a) => Math.max(m, a.index), 0);
  if (!total && maxIdx > 0) total = maxIdx;
  // 推断当前篇：头部没给时，取列表中带「当前」标记的篇号
  const markedCurrent = listItems.find((a) => a.current);
  if (!current && markedCurrent) current = markedCurrent.index;

  // prev/next 未显式给出时，从列表自动推导（当前篇的前一篇 / 后一篇）
  if (!hasExplicitPrev && current > 0) {
    const p = listItems.find((a) => a.index === current - 1);
    if (p) prev = { index: p.index, title: p.title };
  }
  if (!hasExplicitNext && current > 0 && current < total) {
    const n = listItems.find((a) => a.index === current + 1);
    if (n) next = { index: n.index, title: n.title };
  }

  if (seriesName) {
    // 「第 X / N 篇」拼进 seriesName 值（模板只做单层 if，避免嵌套 if 解析失败）
    result.seriesName =
      escapeHtml(seriesName) +
      (current && total ? ` <small>第 ${current} / ${total} 篇</small>` : "");
  }
  if (current) result.current = String(current);
  if (total) result.total = String(total);
  if (description) result.description = escapeHtml(description);

  if (prev.title) {
    // 标签不再重复篇号（标题里已有「第X篇」），只加方向箭头增强可点击提示
    result.prevLabel = "← 上一篇";
    result.prevTitle = escapeHtml(prev.title);
  } else {
    result.prevLabel = "这是本系列第 1 篇";
    result.prevEmpty = "1";
  }
  if (next.title) {
    result.nextLabel = "下一篇 →";
    result.nextTitle = escapeHtml(next.title);
  } else {
    result.nextLabel = "本系列已更新到最新一篇";
    result.nextEmpty = "1";
  }

  if (listItems.length) {
    result.items = listItems.map((a) => {
      const cls = [
        "wemd-sn-item",
        a.done ? " done" : "",
        a.current ? " current" : "",
        a.titleHasNo ? " no-idx" : "",
      ].join("");
      const titleHtml = a.url
        ? `<a href="${escapeHtmlAttr(a.url)}">${escapeHtml(a.title)}</a>`
        : escapeHtml(a.title);
      // 状态标记：已完成 → 绿色 ✓；当前篇 → 「当前」标签（模板 each 内不支持 if，故在解析期拼好）
      const check = a.done ? `<span class="wemd-sn-item-check">✓</span>` : "";
      const tag = a.current ? `<span class="wemd-sn-item-tag">当前</span>` : "";
      return {
        cls,
        idx: String(a.index).padStart(2, "0"),
        title: titleHtml,
        check,
        tag,
      };
    });
  }

  // 计算进度百分比（驱动 CSS 变量 --sn-progress）：
  // 1) 头部给了「第 X / N 篇」→ 用 current/total
  // 2) 否则若列表里有「当前」标记 → 用其篇号/总数
  // 3) 都拿不到 → 默认 30%（与 CSS var(--sn-progress, 30%) 兜底一致）
  let progressPct = 30;
  if (current && total) {
    progressPct = Math.round((current / total) * 100);
  } else if (listItems.length) {
    const cur = listItems.findIndex((a) => a.current);
    if (cur >= 0) {
      progressPct = Math.round(((cur + 1) / listItems.length) * 100);
    }
  }
  progressPct = Math.max(0, Math.min(100, progressPct));
  result.progress = `${progressPct}%`;

  return result;
}

/**
 * 中文数字 → 阿拉伯数字（支持 一~九、十、十一、二十、二十一…，series 篇数一般 < 100）
 */
function cnNumToInt(s: string): number {
  if (/^\d+$/.test(s)) return Number(s);
  const digits: Record<string, number> = {
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
  };
  if (s.includes("十")) {
    const [tens, ones] = s.split("十");
    return (tens ? digits[tens] : 1) * 10 + (ones ? digits[ones] : 0);
  }
  return digits[s] || 0;
}

/**
 * 解析单个系列文章列表项，兼容自然输入：
 * - `- 第一篇：标题 ✓` / `- 第2篇：标题`（篇号 + 标题 + 完成标记）
 * - `- [1] 标题` / `- [CURRENT] 标题`（旧格式，CURRENT 表示当前篇）
 * - `- 1. 标题` / `- 01、标题`（数字编号）
 * - 尾部 `✓/✔/✅/☑` → 已完成；`← 当前 / （当前） / **当前** / [CURRENT]` → 当前篇
 *
 * 「第X篇」前缀同时支持中文数字（第一篇/第二篇…），且保留标题原文：
 * 标题自带篇号时渲染层不再叠加 idx 徽章（titleHasNo），避免双重编号。
 */
function parseSeriesListItem(l: string): {
  index: number;
  title: string;
  current: boolean;
  done: boolean;
  url?: string;
  titleHasNo?: boolean;
} | null {
  const m = l.match(/^-\s*(.+)$/);
  if (!m) return null;
  let rest = m[1].trim();

  let url: string | undefined;
  const urlM = rest.match(/\|\s*U=(\S+)/);
  if (urlM) {
    url = urlM[1];
    rest = rest.replace(/\|\s*U=\S+/, "").trim();
  }

  // 完成标记（行尾）
  const doneM = rest.match(/[✓✔✅☑]\s*$/);
  let done = false;
  if (doneM) {
    done = true;
    rest = rest.replace(doneM[0], "").trim();
  }

  // 当前标记（行尾）
  const curM = rest.match(
    /(?:←|⬅)\s*当前\s*$|[（(【]\s*当前\s*[）)】]\s*$|\*\*当前\*\*\s*$/,
  );
  let isCurrent = false;
  if (curM) {
    isCurrent = true;
    rest = rest.replace(curM[0], "").trim();
  }

  // 篇号提取：`第X篇`（中文/阿拉伯数字） / `[N]` / `[CURRENT]` / `N.` / `NN、`
  let index = 0;
  let titleHasNo = false;
  const m1 = rest.match(
    /^\s*第\s*([0-9一二三四五六七八九十百]+)\s*篇\s*[:：]?\s*/,
  );
  const m2 = rest.match(/^\s*\[\s*(\d+)\s*\]\s*/);
  const m3 = rest.match(/^\s*\[\s*CURRENT\s*\]\s*/);
  const m4 = rest.match(/^\s*(\d{1,2})\s*[.、]\s*/);
  if (m1) {
    index = cnNumToInt(m1[1]);
    // 保留标题原文（含「第X篇」），渲染时隐藏 idx 徽章，避免双重编号
    titleHasNo = true;
  } else if (m2) {
    index = Number(m2[1]);
    rest = rest.replace(m2[0], "");
  } else if (m3) {
    isCurrent = true;
    rest = rest.replace(m3[0], "");
  } else if (m4) {
    index = Number(m4[1]);
    rest = rest.replace(m4[0], "");
  }

  const title = rest.trim();
  if (!title) return null;
  return { index, title, current: isCurrent, done, url, titleHasNo };
}

/** tag-label：把 `#标签` 拆成独立标签行（每行一个 <p>，渲染为独立胶囊）；
    不含 `#` 的行（如纯文字说明）整行保留，避免空盒丢内容 */
function parseTagLabel(_parser: MarkdownIt, raw: string): SlotContent {
  const items: string[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const tokens = trimmed.split(/\s+/);
    const hasHash = tokens.some((t) => t.startsWith("#"));
    if (hasHash) {
      for (const token of tokens) {
        if (token.startsWith("#")) items.push(token);
      }
    } else {
      items.push(trimmed);
    }
  }
  return {
    body: items.map((t) => `<p>${escapeHtml(t)}</p>`).join("\n"),
  };
}

/** stats-block：首段单行纯文字作标题；每个列表项/段落组，
    加粗行→value、非加粗行→label（顺序无关；无加粗时按行序 value/label）。 */
function parseStatsBlock(parser: MarkdownIt, raw: string): SlotContent {
  const { lines, paragraphs } = analyzeBlock(raw);
  const result: SlotContent = {};
  let cursor = 0;

  // 首段若为「单行纯文字」→ 作为标题（数据对的加粗首行不算标题）
  if (paragraphs.length) {
    const first = paragraphs[0];
    const isSinglePlain = first.length === 1 && !lines[first[0]].includes("**");
    if (isSinglePlain) {
      result.title = renderInline(parser, lines[first[0]]);
      cursor = 1;
    }
  }

  const items: ListItem[] = [];
  let group: string[] = [];
  const flushGroup = () => {
    if (!group.length) return;
    const boldIdx = group.findIndex((l) => l.includes("**"));
    if (boldIdx !== -1) {
      const nonBold = group.findIndex(
        (l, i) => i !== boldIdx && !l.includes("**"),
      );
      items.push({
        value: group[boldIdx].replace(/\*\*/g, "").trim(),
        label:
          nonBold !== -1 ? renderInline(parser, group[nonBold]).trim() : "",
      });
    } else {
      items.push({
        value: group[0] ? renderInline(parser, group[0]).trim() : "",
        label: group[1] ? renderInline(parser, group[1]).trim() : "",
      });
    }
    group = [];
  };

  for (const para of paragraphs.slice(cursor)) {
    for (const i of para) {
      const line = lines[i];
      if (LIST_ITEM_RE.test(line)) flushGroup();
      group.push(line.replace(LIST_ITEM_RE, "$1"));
    }
  }
  flushGroup();
  result.items = items;
  return result;
}

/** 复杂扩展组件解析器映射 */
const COMPLEX_PARSERS: Record<
  string,
  (p: MarkdownIt, raw: string) => SlotContent
> = {
  "product-card": parseProductCard,
  "brand-sign": parseBrandSign,
  "resource-list": parseResourceList,
  "testimonial-card": parseTestimonialCard,
  "series-nav": parseSeriesNav,
  "cta-card": parseCtaCard,
  timeline: parseTimeline,
  "code-block": parseCodeBlock,
  "tag-label": parseTagLabel,
  "stats-block": parseStatsBlock,
};

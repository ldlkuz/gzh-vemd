/**
 * 组件插入示例生成器（slot-driven sample markdown）
 *
 * 编辑器插入组件时，按「当前主题合并后的槽位结构」自动生成 body，
 * 取代写死的静态模板：任何主题声明扩展槽后，插入即按该主题的槽位补全
 * （如故事集 text-card 带「引子 + 正文」、好物种草 image-caption 带
 * 「图 + 编号 + 名称 + 价格 + 理由」）。
 *
 * 生成规则：按槽位定义顺序遍历，按 input.source 产出对应 markdown 片段，
 * 空行分隔（image / first-line / paragraph 各自一段）。
 * - first-char（首字下沉由正文首字自动提取）与 hr（分隔线组件自带）不生成；
 * - SAMPLE_OVERRIDES 提供更贴切的示例文案，空字符串 = 跳过该槽（如 quote-card
 *   作者由 props 提供，避免与槽位重复）。
 */
import type { ThemeDefinition } from "../../theme-schema/types";
import type { SlotDef } from "./slotTypes";
import { getBuiltinSlotDef } from "./slotDefs";
import { mergeSlotOverrides } from "./slotParsers";
import { getBuiltInThemeDefinition } from "../../builtin-themes";

/** 示例图 URL（用户插入后替换） */
const SAMPLE_IMAGE_URL = "https://via.placeholder.com/1200x630";

/** 组件槽位示例文案覆盖（source 默认值不够贴切时提供；空字符串 = 跳过该槽） */
const SAMPLE_OVERRIDES: Record<string, Record<string, string>> = {
  "magazine-cover": {
    title: "在这里写主标题",
    subtitle: "一句话副标题",
    desc: "这里是引子/描述段落，写一句点明内容的话。",
  },
  "text-card": {
    title: "引子",
    body: "这里是引子正文，第一段的首字会作为红色大字下沉。",
  },
  "image-caption": {
    number: "01 · 分类",
    title: "好物名称",
    price: "¥ 000",
    body: "这里是推荐理由/说明文字，写一句话介绍它。",
  },
  "quote-card": {
    quote: "在这里写下值得被记住的金句",
    author: "", // 作者由 props author=... 提供，槽位不重复生成
  },
  "section-divider": {
    part: "壹",
    title: "章节名",
  },
  "end-card": {
    title: "完",
    subtitle: "这里是结尾收束段落。",
  },
  callout: {
    body: "**提示标题**\n这里是正文内容，可以有多行。",
  },
  "callout-pro": {
    body: "**提示标题**\n这里是正文内容，可以有多行。",
  },
  "cta-card": {
    body: "如果觉得有用，欢迎关注\n点赞 + 在看，支持下作者\n点击关注",
  },
  "stats-block": {
    title: "核心数据一览",
    items: "",
  },
  "image-grid": {
    body: "![](https://via.placeholder.com/400x300)\n\n![](https://via.placeholder.com/400x300)\n\n![](https://via.placeholder.com/400x300)",
  },
  timeline: {
    title: "项目里程碑",
    items: "",
  },
  "related-posts": {
    items: "",
  },
  "toc-nav": {
    body: "## 第一节\n## 第二节\n## 第三节",
  },
  "tag-label": {
    body: "#标签一 #标签二",
  },
  "copyright-notice": {
    body: "© 2026 公众号名称\n未经授权禁止转载",
  },
  "code-block": {
    body: "```js\nconsole.log('hello')\n```",
  },
  steps: {
    body: "1. 第一步\n2. 第二步\n3. 第三步",
  },
  accordion: {
    body: "**标题一**\n这里是内容一。\n\n**标题二**\n这里是内容二。",
  },
  table: {
    table: "| 列名 | 列名 |\n|---|---|\n|  |  |",
  },
  "image-compare": {
    body: "![左图](https://via.placeholder.com/600x400)\n\n![右图](https://via.placeholder.com/600x400)",
  },
};

/** 单个槽位 → markdown 示例片段（undefined = 不生成） */
function sampleForSlot(componentId: string, slot: SlotDef): string | undefined {
  const rule = slot.input;
  if (!rule) return undefined;
  const override = SAMPLE_OVERRIDES[componentId]?.[slot.key];
  if (override === "") return undefined; // 显式跳过
  switch (rule.source) {
    case "image":
    case "image-url":
      return `![${override ?? "示例图"}](${SAMPLE_IMAGE_URL})`;
    case "strong":
      return `**${override ?? "作者 / 出处"}**`;
    case "first-line":
    case "last-line":
    case "number-prefix":
      return override ?? "示例标题";
    case "paragraph":
    case "all":
    case "block":
      return override ?? "这里是正文段落，写一句话说明内容。";
    case "list": {
      const fields = slot.item_slots ?? [];
      // 多项字段（如 two-column-cards 的 icon/title/desc）必须一行一个字段，
      // 解析器按行位置映射；单字段列表沿用单行样式。
      if (fields.length > 1) {
        const itemLines = fields.map((f) => {
          const label = f.semantic || f.key;
          if (f.key === "title") return `**${label}**`;
          // 图标字段无语义占位，用中性符号避免预览里出现文字图标
          if (f.key === "icon") return "⭐";
          return label;
        });
        const item = itemLines
          .map((l, i) => (i === 0 ? `- ${l}` : `  ${l}`))
          .join("\n");
        return `${item}\n${item}`;
      }
      const first = fields[0];
      const title =
        first?.key === "title" ? first : fields.find((f) => f.key === "title");
      const desc = fields.find((f) => f.key === "desc");
      const single = title
        ? `**${title.semantic}**${desc ? ` · ${desc.semantic}` : ""}`
        : (first?.semantic ?? "条目一");
      return `- ${single}\n- ${single}`;
    }
    case "first-char":
    case "hr":
    default:
      return undefined;
  }
}

/**
 * 按当前主题的槽位结构生成组件示例 markdown（编辑器插入用）。
 * @param theme 主题定义；传字符串 id 时按内置主题解析
 * @param componentId 组件 id
 * @returns 组件 body 的 markdown；无法解析时返回空字符串
 */
export function getComponentSampleMarkdown(
  theme: ThemeDefinition | string | undefined,
  componentId: string,
): string {
  const themeDef =
    typeof theme === "string" ? getBuiltInThemeDefinition(theme) : theme;
  // 无内置槽位定义（仅 generic 兜底）时不生成，交由 web 端静态模板兜底，
  // 避免通用样本覆盖手写好的组件模板（author-card 等）。
  const baseDef = getBuiltinSlotDef(componentId);
  if (!baseDef) return "";
  const themeSlots = themeDef?.slotDefs?.[componentId];
  const def = mergeSlotOverrides(baseDef, themeSlots);
  const blocks: string[] = [];
  for (const slot of def.slots) {
    const sample = sampleForSlot(componentId, slot);
    if (sample !== undefined) blocks.push(sample);
  }
  return blocks.join("\n\n");
}

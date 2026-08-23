/**
 * 晚晴主题 - 主题级扩展槽位（WANQING）
 *
 * - magazine-cover   封面图（body 首段图片，作 background-image 用）
 * - text-card        首字下沉 + 引子小标（首行）
 * - end-card         结尾（title「晚晴」 + subtitle 落款文字）
 */
import type { SlotDef } from "../plugins/component/slotTypes";

export const wanqingSlotDefs: Record<string, SlotDef[]> = {
  "magazine-cover": [
    {
      key: "imageUrl",
      type: "text",
      semantic: "封面图 URL（body 首段图片，作 background-image 用）",
      input: {
        source: "image-url",
        position: "first",
        cardinality: "optional",
      },
    },
  ],
  "text-card": [
    {
      key: "title",
      type: "text",
      semantic: "引子小标（首行，如「写给岁月」；无首行时省略）",
      input: { source: "first-line", position: "first", cardinality: "one" },
    },
    {
      key: "dropcap",
      type: "text",
      semantic: "首字下沉（正文首段第一个字符）",
      input: { source: "first-char", position: "first", cardinality: "one" },
    },
    {
      key: "body",
      type: "text",
      semantic: "引子正文",
      required: true,
      input: { source: "paragraph", position: "any", cardinality: "many" },
    },
  ],
  "end-card": [
    {
      key: "title",
      type: "text",
      semantic: "落款标记（首行，如「晚晴」）",
      required: true,
      input: { source: "first-line", position: "first", cardinality: "one" },
    },
    {
      key: "subtitle",
      type: "text",
      semantic: "落款正文（收束句）",
      input: { source: "paragraph", position: "any", cardinality: "optional" },
    },
  ],
};
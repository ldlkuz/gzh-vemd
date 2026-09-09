/**
 * 内置组件 Slot 定义表 —— 主程序默认真源
 *
 * 本次只改主程序，registry 未 Slot 化，故在此内置。
 * 覆盖 39 个内置组件（default + extra + faq + magazine + extended）。
 *
 * 分槽规则与 magazineRenderers 现有解析逻辑保持一致，
 * 确保"无 templates"时输出与现状一致。
 */
import type { ComponentSlotDef } from "./slotTypes";

export const BUILTIN_SLOT_DEFS: ComponentSlotDef[] = [
  // ============================================================
  // magazine 级（专用渲染器，已具名 class）
  // ============================================================
  {
    id: "magazine-cover",
    abbr: "mc",
    hasCustomRenderer: true,
    slots: [
      {
        key: "title",
        type: "text",
        semantic: "主标题",
        required: true,
        input: { source: "first-line", position: "first", cardinality: "one" },
      },
      {
        key: "subtitle",
        type: "text",
        semantic: "英文副标题",
        input: {
          source: "first-line",
          position: "any",
          cardinality: "optional",
        },
      },
      {
        key: "divider",
        type: "decorative",
        semantic: "装饰分隔线",
        input: { source: "hr", cardinality: "optional" },
      },
      {
        key: "desc",
        type: "text",
        semantic: "描述文字",
        input: { source: "paragraph", position: "any", cardinality: "many" },
      },
    ],
  },
  {
    id: "section-divider",
    abbr: "sd",
    hasCustomRenderer: true,
    slots: [
      {
        key: "part",
        type: "text",
        semantic: "PART 编号",
        input: { source: "first-line", position: "first", cardinality: "one" },
      },
      {
        key: "title",
        type: "text",
        semantic: "章节标题",
        input: { source: "first-line", position: "any", cardinality: "one" },
      },
    ],
  },
  {
    id: "two-column-cards",
    abbr: "tcc",
    hasCustomRenderer: true,
    slots: [
      {
        key: "items",
        type: "list",
        semantic: "单列特性卡片列表",
        required: true,
        input: { source: "list", cardinality: "many" },
        item_slots: [
          { key: "title", type: "text", semantic: "标题" },
          { key: "desc", type: "text", semantic: "描述" },
        ],
      },
    ],
  },
  {
    id: "full-quote",
    abbr: "fq",
    hasCustomRenderer: true,
    slots: [
      {
        key: "text",
        type: "text",
        semantic: "引用文字",
        required: true,
        input: { source: "paragraph", cardinality: "many" },
      },
    ],
  },
  {
    id: "image-card",
    abbr: "ic",
    hasCustomRenderer: true,
    slots: [
      {
        key: "image",
        type: "image",
        semantic: "主图",
        required: true,
        input: { source: "image", position: "first", cardinality: "one" },
      },
      {
        key: "caption",
        type: "text",
        semantic: "说明文字",
        input: { source: "paragraph", cardinality: "optional" },
      },
    ],
  },
  {
    id: "end-card",
    abbr: "ec",
    hasCustomRenderer: true,
    slots: [
      {
        key: "title",
        type: "text",
        semantic: "主标题",
        required: true,
        input: { source: "first-line", position: "first", cardinality: "one" },
      },
      {
        key: "subtitle",
        type: "text",
        semantic: "副标题",
        input: {
          source: "first-line",
          position: "any",
          cardinality: "optional",
          // 只认短副标（≤30 字符）；超长的句子不吞，留给 body 兜底渲染为可读正文，
          // 避免整段结语副标被降格成小号灰字。
          maxChars: 30,
        },
      },
      {
        key: "deco",
        type: "decorative",
        semantic: "装饰尾标（≤40字短尾，正文留段落）",
        input: {
          source: "last-line",
          cardinality: "optional",
          // 只认较短装饰尾标（≤40 字符，如 🍃、「编辑：xxx」、胶卷盘的「REEL 019 · 35MM」
          // meta）；过长正文不匹配，留给 body 兜底，杜绝多段正文被装饰槽吞掉。
          maxChars: 40,
          // 真正的装饰/meta 行不含中文句读；含 。，！？；的行是正经正文句子，
          // 即使 ≤40 字也不当作尾标（修复 31~40 字正文短句被误吞进 deco 导致丢失）。
          rejectPunct: true,
        },
      },
    ],
  },
  {
    id: "text-card",
    abbr: "tc",
    hasCustomRenderer: true,
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "正文",
        required: true,
        // all：整块走 markdown 渲染，支持嵌套组件
        input: { source: "all", cardinality: "many" },
      },
    ],
  },

  // ============================================================
  // 普通组件（走 wemd-component-body + 自由 markdown）
  // 统一给一个 body 槽，内容走 slot-parser 的 body 兜底
  // ============================================================
  // 以下组件 CSS 契约均依赖 `.wemd-component-body > p` / `ul` / `pre` / `table`
  // 结构，故统一为单一 body(source:all) 槽，内容经 renderBody 完整渲染，
  // 首段即标题、后续段落/列表即内容，模板由骨架自动输出 .wemd-component-body。
  {
    id: "quote-card",
    abbr: "qc",
    slots: [
      {
        key: "quote",
        type: "text",
        semantic: "金句正文",
        required: true,
        // 首段为金句，**粗体**行作为署名（自然输入无需特殊标记）
        input: { source: "paragraph", position: "first", cardinality: "one" },
      },
      {
        key: "author",
        type: "text",
        semantic: "署名",
        input: { source: "strong", position: "last", cardinality: "one" },
      },
    ],
  },
  {
    id: "divider-fancy",
    abbr: "df",
    slots: [
      {
        key: "label",
        type: "text",
        semantic: "分隔线文字",
        input: { source: "paragraph", position: "first", cardinality: "one" },
      },
    ],
  },
  {
    id: "cta-card",
    abbr: "cta",
    slots: [
      // 专用解析器 parseCtaCard：首段 title、末段 action、中间段 body
      { key: "title", type: "text", semantic: "主标题" },
      { key: "body", type: "text", semantic: "正文" },
      { key: "action", type: "text", semantic: "行动按钮" },
    ],
  },
  {
    id: "code-frame",
    abbr: "cf",
    slots: [
      {
        key: "title",
        type: "text",
        semantic: "代码标题",
        input: { source: "first-line", position: "first", cardinality: "one" },
      },
      {
        key: "code",
        type: "code",
        semantic: "代码内容",
        input: { source: "block", cardinality: "one" },
      },
    ],
  },
  {
    id: "callout-pro",
    abbr: "cp",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "提示正文",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "stats-block",
    abbr: "sb",
    slots: [
      {
        key: "title",
        type: "text",
        semantic: "标题",
        input: {
          source: "first-line",
          position: "first",
          cardinality: "optional",
        },
      },
      {
        key: "items",
        type: "list",
        semantic: "数据指标列表",
        required: true,
        input: { source: "list", cardinality: "many" },
        item_slots: [
          { key: "value", type: "text", semantic: "数值" },
          { key: "label", type: "text", semantic: "说明" },
        ],
      },
    ],
  },
  {
    id: "image-grid",
    abbr: "ig",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "图片列表",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "author-card",
    abbr: "ac",
    slots: [
      // CSS 契约：.wemd-author-card .wemd-component-body > p（首段含 img 为头像、后续段为简介）
      {
        key: "body",
        type: "text",
        semantic: "正文",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "timeline",
    abbr: "tl",
    slots: [
      // 首行标题 + 列表承载时间线条目（条目内 ** 已剥，body 为"时间 描述"原文）
      {
        key: "title",
        type: "text",
        semantic: "时间线标题",
        input: { source: "first-line", position: "first", cardinality: "one" },
      },
      {
        key: "items",
        type: "list",
        semantic: "时间线条目",
        input: { source: "list", cardinality: "many" },
      },
    ],
  },
  {
    id: "follow-bar",
    abbr: "fb",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "关注引导语",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "qr-card",
    abbr: "qr",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "二维码与说明",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "numbered-heading",
    abbr: "nh",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "序号与标题",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "section-title",
    abbr: "st",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "章节标题",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "image-text-row",
    abbr: "itr",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "图文内容",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "hero-banner",
    abbr: "hb",
    slots: [
      // 图片槽先行：首行为图片时作为背景图，随后文本行才轮到标题
      {
        key: "image",
        type: "image",
        semantic: "背景图",
        input: { source: "image", position: "first", cardinality: "optional" },
      },
      // 标题改 first-line：自然输入无需 ** 包裹也能识别（previous: strong）
      {
        key: "title",
        type: "text",
        semantic: "主标题",
        input: { source: "first-line", position: "first", cardinality: "one" },
      },
      {
        key: "subtitle",
        type: "text",
        semantic: "副标题",
        input: {
          source: "paragraph",
          position: "any",
          cardinality: "optional",
        },
      },
    ],
  },
  {
    id: "share-card",
    abbr: "sc",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "分享文案",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "related-posts",
    abbr: "rp",
    slots: [
      {
        key: "items",
        type: "list",
        semantic: "推荐条目",
        input: { source: "list", cardinality: "many" },
      },
    ],
  },
  {
    id: "toc-nav",
    abbr: "tn",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "目录列表",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "tag-label",
    abbr: "tag",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "标签文字",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "image-caption",
    abbr: "icpt",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "图片与图注",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "copyright-notice",
    abbr: "cn",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "版权声明",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "styled-table",
    abbr: "sbt",
    slots: [
      {
        key: "table",
        type: "text",
        semantic: "表格内容",
        input: { source: "block", cardinality: "one" },
      },
    ],
  },
  {
    id: "faq",
    abbr: "fq",
    slots: [
      // CSS 契约：.wemd-faq .wemd-component-body > p（strong 段为问题、其余为回答）
      {
        key: "body",
        type: "text",
        semantic: "正文",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "article-section",
    abbr: "as",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "正文容器",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "code-block",
    abbr: "cb",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "代码内容",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "callout",
    abbr: "cal",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "提示正文",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "steps",
    abbr: "stp",
    slots: [
      // CSS 契约：.wemd-steps .wemd-component-body（有序/无序列表 + 段落完整渲染）
      {
        key: "body",
        type: "text",
        semantic: "正文",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "accordion",
    abbr: "acc",
    slots: [
      // CSS 契约：.wemd-accordion .wemd-component-body（strong 段为标题、其余为内容）
      {
        key: "body",
        type: "text",
        semantic: "正文",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "pullquote",
    abbr: "pq",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "引用文字",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "divider",
    abbr: "dv",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "分隔线内容",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },
  {
    id: "table",
    abbr: "tbl",
    slots: [
      {
        key: "table",
        type: "text",
        semantic: "表格内容",
        input: { source: "block", cardinality: "one" },
      },
    ],
  },
  {
    id: "image-compare",
    abbr: "icmp",
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "对比图",
        input: { source: "all", cardinality: "many" },
      },
    ],
  },

  // ============================================================
  // 复杂扩展组件（专用解析器 COMPLEX_PARSERS 处理，渲染走模板）
  // 分槽规则与 magazineRenderers 现有解析逻辑保持一致
  // ============================================================
  {
    id: "product-card",
    abbr: "pc",
    hasCustomRenderer: true,
    slots: [
      { key: "image", type: "image", semantic: "产品图" },
      { key: "badge", type: "text", semantic: "角标" },
      { key: "title", type: "text", semantic: "标题" },
      { key: "subtitle", type: "text", semantic: "副标题" },
      { key: "description", type: "text", semantic: "详细描述" },
      { key: "price", type: "text", semantic: "现价" },
      { key: "originalPrice", type: "text", semantic: "原价" },
      { key: "rating", type: "text", semantic: "评分" },
      { key: "sales", type: "text", semantic: "销量" },
      { key: "stock", type: "text", semantic: "库存" },
      { key: "button", type: "text", semantic: "按钮文字" },
      { key: "tags", type: "list", semantic: "标签" },
    ],
  },
  {
    id: "brand-sign",
    abbr: "bs",
    hasCustomRenderer: true,
    slots: [
      {
        key: "logo",
        type: "image",
        semantic: "Logo 图片（body 首段图片）",
        input: { source: "image", position: "first", cardinality: "optional" },
      },
      { key: "brandName", type: "text", semantic: "品牌名" },
      { key: "tagline", type: "text", semantic: "副标题（品牌名后 · 紧跟）" },
      { key: "slogan", type: "text", semantic: "Slogan" },
      { key: "subText", type: "text", semantic: "小字版权" },
      { key: "style", type: "text", semantic: "布局样式" },
      { key: "divider", type: "text", semantic: "分隔线" },
    ],
  },
  {
    id: "resource-list",
    abbr: "rl",
    hasCustomRenderer: true,
    slots: [
      { key: "title", type: "text", semantic: "标题" },
      { key: "subtitle", type: "text", semantic: "副标题" },
      {
        key: "items",
        type: "list",
        semantic: "条目列表",
        item_slots: [
          { key: "label", type: "text", semantic: "序号/图标" },
          { key: "title", type: "text", semantic: "标题" },
          { key: "desc", type: "text", semantic: "描述" },
          { key: "meta", type: "text", semantic: "元信息" },
          { key: "tag", type: "text", semantic: "标签" },
        ],
      },
      { key: "numbered", type: "text", semantic: "是否编号" },
      { key: "layout", type: "text", semantic: "布局" },
    ],
  },
  {
    id: "testimonial-card",
    abbr: "tcq",
    hasCustomRenderer: true,
    slots: [
      { key: "avatar", type: "image", semantic: "头像" },
      { key: "quote", type: "text", semantic: "名言正文" },
      { key: "source", type: "text", semantic: "来源" },
      { key: "name", type: "text", semantic: "姓名" },
      { key: "title", type: "text", semantic: "职位" },
      { key: "company", type: "text", semantic: "公司" },
      { key: "companyLogo", type: "image", semantic: "公司 Logo" },
    ],
  },
  {
    id: "series-nav",
    abbr: "sn",
    hasCustomRenderer: true,
    slots: [
      { key: "seriesName", type: "text", semantic: "系列名" },
      { key: "current", type: "text", semantic: "当前进度" },
      { key: "total", type: "text", semantic: "总篇数" },
      { key: "description", type: "text", semantic: "系列简介" },
      { key: "prevLabel", type: "text", semantic: "上一篇标签" },
      { key: "prevTitle", type: "text", semantic: "上一篇标题" },
      { key: "nextLabel", type: "text", semantic: "下一篇标签" },
      { key: "nextTitle", type: "text", semantic: "下一篇标题" },
      {
        key: "items",
        type: "list",
        semantic: "文章列表",
        item_slots: [
          { key: "cls", type: "text", semantic: "条目 class" },
          { key: "idx", type: "text", semantic: "序号" },
          { key: "title", type: "text", semantic: "标题" },
        ],
      },
    ],
  },
];

/** 按组件 id 查找 Slot 定义 */
export function getBuiltinSlotDef(id: string): ComponentSlotDef | undefined {
  return BUILTIN_SLOT_DEFS.find((d) => d.id === id);
}

/** 查找组件的 abbr；无定义时回退为去掉连字符的 id */
export function getComponentAbbr(id: string): string {
  return getBuiltinSlotDef(id)?.abbr ?? id.replace(/-/g, "");
}

/** 生成 ordinal 兜底：无 slot 定义时给一个 body 槽 */
export function getFallbackSlotDef(id: string): ComponentSlotDef {
  return {
    id,
    abbr: getComponentAbbr(id),
    slots: [
      {
        key: "body",
        type: "text",
        semantic: "正文",
        required: true,
        input: { source: "all", cardinality: "many" },
      },
    ],
  };
}

/**
 * 组件语义元素描述表
 *
 * 定义每个组件有哪些可被 CSS 定位的"语义元素"，
 * 以及它们对应的 WeMD 标准选择器。
 *
 * 用途：
 * - Phase 1：告诉 AI 组件有哪些元素可样式化（但不用管 class 名）
 * - Phase 2：告诉 AI 翻译引擎如何将自由选择器映射到 WeMD 标准选择器
 */

/** 单个组件的元素描述 */
export interface ComponentElement {
  /** 语义元素名（AI 用到，如 "title"、"subtitle"） */
  name: string;
  /** 语义描述（AI 理解用途） */
  desc: string;
  /** WeMD 标准选择器（翻译目标） */
  wemdSelector: string;
}

/** 组件类型定义 */
export interface ComponentElementsDef {
  /** 组件类型名（如 "magazine-cover"） */
  type: string;
  /** 组件中文描述 */
  label: string;
  /** 是否有 wemd-component-body 层 */
  hasBody: boolean;
  /** 语义元素列表 */
  elements: ComponentElement[];
  /** 组件容器选择器 */
  containerSelector: string;
  /** 组件容器描述 */
  containerDesc: string;
}

// ============================================================
// 杂志级组件（无 wemd-component-body）
// ============================================================

const MAGAZINE_COVER: ComponentElementsDef = {
  type: "magazine-cover",
  label: "杂志封面",
  hasBody: false,
  containerSelector: ".wemd-magazine-cover",
  containerDesc: "组件容器，包含整个封面",
  elements: [
    {
      name: "container",
      desc: "组件容器",
      wemdSelector: ".wemd-magazine-cover",
    },
    {
      name: "title",
      desc: "主标题",
      wemdSelector: ".wemd-magazine-cover .wemd-mc-title",
    },
    {
      name: "subtitle",
      desc: "英文副标题",
      wemdSelector: ".wemd-magazine-cover .wemd-mc-subtitle",
    },
    {
      name: "divider",
      desc: "装饰分隔线",
      wemdSelector: ".wemd-magazine-cover .wemd-mc-divider",
    },
    {
      name: "desc",
      desc: "描述文字",
      wemdSelector: ".wemd-magazine-cover .wemd-mc-desc",
    },
  ],
};

const SECTION_DIVIDER: ComponentElementsDef = {
  type: "section-divider",
  label: "章节分隔标题",
  hasBody: false,
  containerSelector: ".wemd-section-divider",
  containerDesc: "组件容器",
  elements: [
    {
      name: "container",
      desc: "组件容器",
      wemdSelector: ".wemd-section-divider",
    },
    {
      name: "part",
      desc: "PART 编号（如 PART 01）",
      wemdSelector: ".wemd-section-divider .wemd-sd-part",
    },
    {
      name: "title",
      desc: "章节标题",
      wemdSelector: ".wemd-section-divider .wemd-sd-title",
    },
  ],
};

const TWO_COLUMN_CARDS: ComponentElementsDef = {
  type: "two-column-cards",
  label: "单列特性卡片",
  hasBody: false,
  containerSelector: ".wemd-two-column-cards",
  containerDesc: "组件容器",
  elements: [
    {
      name: "container",
      desc: "组件容器",
      wemdSelector: ".wemd-two-column-cards",
    },
    {
      name: "list",
      desc: "卡片列表容器",
      wemdSelector: ".wemd-two-column-cards .wemd-vc-list",
    },
    {
      name: "item",
      desc: "单个卡片项",
      wemdSelector: ".wemd-two-column-cards .wemd-vc-item",
    },
    {
      name: "stripe",
      desc: "左侧强调色带",
      wemdSelector: ".wemd-two-column-cards .wemd-vc-stripe",
    },
    {
      name: "body",
      desc: "卡片内容区",
      wemdSelector: ".wemd-two-column-cards .wemd-vc-body",
    },
    {
      name: "title",
      desc: "卡片标题",
      wemdSelector: ".wemd-two-column-cards .wemd-vc-title",
    },
    {
      name: "desc",
      desc: "卡片描述",
      wemdSelector: ".wemd-two-column-cards .wemd-vc-desc",
    },
  ],
};

const FULL_QUOTE: ComponentElementsDef = {
  type: "full-quote",
  label: "整行引用卡片",
  hasBody: false,
  containerSelector: ".wemd-full-quote",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-full-quote" },
    {
      name: "text",
      desc: "引用文字段落",
      wemdSelector: ".wemd-full-quote .wemd-fq-text",
    },
  ],
};

const IMAGE_CARD: ComponentElementsDef = {
  type: "image-card",
  label: "图片卡片",
  hasBody: false,
  containerSelector: ".wemd-image-card",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-image-card" },
    {
      name: "image",
      desc: "图片容器",
      wemdSelector: ".wemd-image-card .wemd-ic-image",
    },
    {
      name: "imageImg",
      desc: "图片元素",
      wemdSelector: ".wemd-image-card .wemd-ic-image img",
    },
    {
      name: "caption",
      desc: "图片说明文字",
      wemdSelector: ".wemd-image-card .wemd-ic-caption",
    },
  ],
};

const END_CARD: ComponentElementsDef = {
  type: "end-card",
  label: "结尾致谢卡片",
  hasBody: false,
  containerSelector: ".wemd-end-card",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-end-card" },
    {
      name: "title",
      desc: "主标题",
      wemdSelector: ".wemd-end-card .wemd-ec-title",
    },
    {
      name: "subtitle",
      desc: "副标题",
      wemdSelector: ".wemd-end-card .wemd-ec-subtitle",
    },
    {
      name: "deco",
      desc: "装饰元素",
      wemdSelector: ".wemd-end-card .wemd-ec-deco",
    },
  ],
};

const PRODUCT_CARD: ComponentElementsDef = {
  type: "product-card",
  label: "产品/商品卡片",
  hasBody: false,
  containerSelector: ".wemd-product-card",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-product-card" },
    {
      name: "image",
      desc: "产品图片",
      wemdSelector: ".wemd-product-card .wemd-pc-image img",
    },
    {
      name: "badge",
      desc: "角标（如 新品/热卖）",
      wemdSelector: ".wemd-product-card .wemd-pc-badge",
    },
    {
      name: "header",
      desc: "标题区容器",
      wemdSelector: ".wemd-product-card .wemd-pc-header",
    },
    {
      name: "title",
      desc: "产品标题",
      wemdSelector: ".wemd-product-card .wemd-pc-title",
    },
    {
      name: "subtitle",
      desc: "副标题",
      wemdSelector: ".wemd-product-card .wemd-pc-subtitle",
    },
    {
      name: "description",
      desc: "详细描述",
      wemdSelector: ".wemd-product-card .wemd-pc-description",
    },
    {
      name: "priceRow",
      desc: "价格行容器",
      wemdSelector: ".wemd-product-card .wemd-pc-price-row",
    },
    {
      name: "price",
      desc: "现价",
      wemdSelector: ".wemd-product-card .wemd-pc-price",
    },
    {
      name: "original",
      desc: "原价（删除线）",
      wemdSelector: ".wemd-product-card .wemd-pc-original",
    },
    {
      name: "metaRow",
      desc: "元信息行容器",
      wemdSelector: ".wemd-product-card .wemd-pc-meta-row",
    },
    {
      name: "rating",
      desc: "评分",
      wemdSelector: ".wemd-product-card .wemd-pc-rating",
    },
    {
      name: "sales",
      desc: "销量",
      wemdSelector: ".wemd-product-card .wemd-pc-sales",
    },
    {
      name: "stock",
      desc: "库存",
      wemdSelector: ".wemd-product-card .wemd-pc-stock",
    },
    {
      name: "button",
      desc: "购买按钮",
      wemdSelector: ".wemd-product-card .wemd-pc-button",
    },
    {
      name: "tags",
      desc: "标签行容器",
      wemdSelector: ".wemd-product-card .wemd-pc-tags",
    },
    {
      name: "tag",
      desc: "单个标签",
      wemdSelector: ".wemd-product-card .wemd-pc-tag",
    },
  ],
};

const BRAND_SIGN: ComponentElementsDef = {
  type: "brand-sign",
  label: "品牌签名",
  hasBody: false,
  containerSelector: ".wemd-brand-sign",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-brand-sign" },
    {
      name: "wrapper",
      desc: "内层包装器",
      wemdSelector: ".wemd-brand-sign .wemd-bs-wrapper",
    },
    {
      name: "logo",
      desc: "Logo 图标",
      wemdSelector: ".wemd-brand-sign .wemd-bs-logo",
    },
    {
      name: "brandName",
      desc: "品牌名",
      wemdSelector: ".wemd-brand-sign .wemd-bs-brand-name",
    },
    {
      name: "slogan",
      desc: "Slogan",
      wemdSelector: ".wemd-brand-sign .wemd-bs-slogan",
    },
    {
      name: "subtext",
      desc: "小字版权",
      wemdSelector: ".wemd-brand-sign .wemd-bs-subtext",
    },
  ],
};

const RESOURCE_LIST: ComponentElementsDef = {
  type: "resource-list",
  label: "资料/步骤清单",
  hasBody: false,
  containerSelector: ".wemd-resource-list",
  containerDesc: "组件容器",
  elements: [
    {
      name: "container",
      desc: "组件容器",
      wemdSelector: ".wemd-resource-list",
    },
    {
      name: "title",
      desc: "清单标题",
      wemdSelector: ".wemd-resource-list .wemd-rl-title",
    },
    {
      name: "subtitle",
      desc: "清单副标题",
      wemdSelector: ".wemd-resource-list .wemd-rl-subtitle",
    },
    {
      name: "items",
      desc: "列表容器",
      wemdSelector: ".wemd-resource-list .wemd-rl-items",
    },
    {
      name: "item",
      desc: "单个列表项",
      wemdSelector: ".wemd-resource-list .wemd-rl-item",
    },
    {
      name: "idx",
      desc: "序号（圆形数字）",
      wemdSelector: ".wemd-resource-list .wemd-rl-idx",
    },
    {
      name: "icon",
      desc: "类型图标",
      wemdSelector: ".wemd-resource-list .wemd-rl-icon",
    },
    {
      name: "main",
      desc: "内容主体容器",
      wemdSelector: ".wemd-resource-list .wemd-rl-main",
    },
    {
      name: "itemTitle",
      desc: "项标题",
      wemdSelector: ".wemd-resource-list .wemd-rl-item-title",
    },
    {
      name: "itemDesc",
      desc: "项描述",
      wemdSelector: ".wemd-resource-list .wemd-rl-item-desc",
    },
    {
      name: "meta",
      desc: "右侧元信息",
      wemdSelector: ".wemd-resource-list .wemd-rl-meta",
    },
    {
      name: "tag",
      desc: "标签",
      wemdSelector: ".wemd-resource-list .wemd-rl-tag",
    },
  ],
};

const TESTIMONIAL_CARD: ComponentElementsDef = {
  type: "testimonial-card",
  label: "名人推荐/客户背书",
  hasBody: false,
  containerSelector: ".wemd-testimonial-card",
  containerDesc: "组件容器",
  elements: [
    {
      name: "container",
      desc: "组件容器",
      wemdSelector: ".wemd-testimonial-card",
    },
    {
      name: "quote",
      desc: "引言正文",
      wemdSelector: ".wemd-testimonial-card .wemd-tc-quote",
    },
    {
      name: "source",
      desc: "来源说明",
      wemdSelector: ".wemd-testimonial-card .wemd-tc-source",
    },
    {
      name: "person",
      desc: "人物信息容器",
      wemdSelector: ".wemd-testimonial-card .wemd-tc-person",
    },
    {
      name: "avatar",
      desc: "头像图片",
      wemdSelector: ".wemd-testimonial-card .wemd-tc-avatar img",
    },
    {
      name: "personMeta",
      desc: "人物元信息容器",
      wemdSelector: ".wemd-testimonial-card .wemd-tc-person-meta",
    },
    {
      name: "name",
      desc: "姓名",
      wemdSelector: ".wemd-testimonial-card .wemd-tc-name",
    },
    {
      name: "title",
      desc: "职位",
      wemdSelector: ".wemd-testimonial-card .wemd-tc-title",
    },
    {
      name: "company",
      desc: "公司名",
      wemdSelector: ".wemd-testimonial-card .wemd-tc-company",
    },
    {
      name: "companyLogo",
      desc: "公司 Logo",
      wemdSelector: ".wemd-testimonial-card .wemd-tc-company-logo img",
    },
  ],
};

const SERIES_NAV: ComponentElementsDef = {
  type: "series-nav",
  label: "系列文章导航",
  hasBody: false,
  containerSelector: ".wemd-series-nav",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-series-nav" },
    {
      name: "header",
      desc: "头部区域",
      wemdSelector: ".wemd-series-nav .wemd-sn-header",
    },
    {
      name: "name",
      desc: "系列名",
      wemdSelector: ".wemd-series-nav .wemd-sn-name",
    },
    {
      name: "desc",
      desc: "系列简介",
      wemdSelector: ".wemd-series-nav .wemd-sn-desc",
    },
    {
      name: "progressBar",
      desc: "进度条",
      wemdSelector: ".wemd-series-nav .wemd-sn-progress-bar",
    },
    {
      name: "nav",
      desc: "上一篇/下一篇导航容器",
      wemdSelector: ".wemd-series-nav .wemd-sn-nav",
    },
    {
      name: "prev",
      desc: "上一篇区域",
      wemdSelector: ".wemd-series-nav .wemd-sn-prev",
    },
    {
      name: "next",
      desc: "下一篇区域",
      wemdSelector: ".wemd-series-nav .wemd-sn-next",
    },
    {
      name: "prevLabel",
      desc: "上一篇标签",
      wemdSelector: ".wemd-series-nav .wemd-sn-prev-label",
    },
    {
      name: "nextLabel",
      desc: "下一篇标签",
      wemdSelector: ".wemd-series-nav .wemd-sn-next-label",
    },
    {
      name: "prevTitle",
      desc: "上一篇标题",
      wemdSelector: ".wemd-series-nav .wemd-sn-prev-title",
    },
    {
      name: "nextTitle",
      desc: "下一篇标题",
      wemdSelector: ".wemd-series-nav .wemd-sn-next-title",
    },
    {
      name: "articles",
      desc: "文章列表容器",
      wemdSelector: ".wemd-series-nav .wemd-sn-articles",
    },
    {
      name: "item",
      desc: "单篇文章项",
      wemdSelector: ".wemd-series-nav .wemd-sn-item",
    },
    {
      name: "currentItem",
      desc: "当前高亮文章项",
      wemdSelector: ".wemd-series-nav .wemd-sn-item.current",
    },
    {
      name: "itemIdx",
      desc: "文章序号",
      wemdSelector: ".wemd-series-nav .wemd-sn-item-idx",
    },
  ],
};

// ============================================================
// 普通组件
//   - body 层组件（hasBody=true）：走 .wemd-component-body 内容层
//   - 语义槽组件（hasBody=false）：已迁移为语义类名，无 body 层
// ============================================================

const QUOTE_CARD: ComponentElementsDef = {
  type: "quote-card",
  label: "金句卡片",
  hasBody: false,
  containerSelector: ".wemd-quote-card",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-quote-card" },
    {
      name: "quote",
      desc: "金句正文",
      wemdSelector: ".wemd-quote-card .wemd-qc-quote",
    },
    {
      name: "author",
      desc: "署名",
      wemdSelector: ".wemd-quote-card .wemd-qc-author",
    },
  ],
};

const HERO_BANNER: ComponentElementsDef = {
  type: "hero-banner",
  label: "顶部头图 Banner",
  hasBody: true,
  containerSelector: ".wemd-hero-banner",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-hero-banner" },
    {
      name: "body",
      desc: "内容主体",
      wemdSelector: ".wemd-hero-banner .wemd-component-body",
    },
    {
      name: "title",
      desc: "主标题（第一段）",
      wemdSelector: ".wemd-hero-banner .wemd-component-body > p:first-child",
    },
    {
      name: "subtitle",
      desc: "副标题（第二段）",
      wemdSelector: ".wemd-hero-banner .wemd-component-body > p:nth-child(2)",
    },
    {
      name: "backgroundImage",
      desc: "背景图片（第一张 img）",
      wemdSelector: ".wemd-hero-banner .wemd-component-body img:first-child",
    },
  ],
};

const CTA_CARD: ComponentElementsDef = {
  type: "cta-card",
  label: "关注引导卡片",
  hasBody: false,
  containerSelector: ".wemd-cta-card",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-cta-card" },
    {
      name: "title",
      desc: "主标题（首段）",
      wemdSelector: ".wemd-cta-card .wemd-cta-title",
    },
    {
      name: "body",
      desc: "正文（中间段）",
      wemdSelector: ".wemd-cta-card .wemd-cta-body",
    },
    {
      name: "action",
      desc: "行动按钮（末段）",
      wemdSelector: ".wemd-cta-card .wemd-cta-action",
    },
  ],
};

const CALL_OUT_PRO: ComponentElementsDef = {
  type: "callout-pro",
  label: "强化提示框",
  hasBody: true,
  containerSelector: ".wemd-callout-pro",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-callout-pro" },
    {
      name: "body",
      desc: "内容主体",
      wemdSelector: ".wemd-callout-pro .wemd-component-body",
    },
    {
      name: "title",
      desc: "标题（第一段）",
      wemdSelector: ".wemd-callout-pro .wemd-component-body > p:first-child",
    },
    {
      name: "content",
      desc: "正文段落",
      wemdSelector: ".wemd-callout-pro .wemd-component-body > p",
    },
  ],
};

const SHARE_CARD: ComponentElementsDef = {
  type: "share-card",
  label: "引导分享",
  hasBody: true,
  containerSelector: ".wemd-share-card",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-share-card" },
    {
      name: "body",
      desc: "内容主体",
      wemdSelector: ".wemd-share-card .wemd-component-body",
    },
    {
      name: "text",
      desc: "收尾文字（第一段）",
      wemdSelector: ".wemd-share-card .wemd-component-body > p:first-child",
    },
  ],
};

const FAQ: ComponentElementsDef = {
  type: "faq",
  label: "常见问题",
  hasBody: true,
  containerSelector: ".wemd-faq",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-faq" },
    {
      name: "body",
      desc: "内容主体",
      wemdSelector: ".wemd-faq .wemd-component-body",
    },
    {
      name: "question",
      desc: "问题（带 strong 的段落）",
      wemdSelector: ".wemd-faq .wemd-component-body > p strong",
    },
    {
      name: "answer",
      desc: "回答段落",
      wemdSelector: ".wemd-faq .wemd-component-body > p:not(:has(strong))",
    },
  ],
};

const TIMELINE: ComponentElementsDef = {
  type: "timeline",
  label: "时间线",
  hasBody: false,
  containerSelector: ".wemd-timeline",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-timeline" },
    {
      name: "title",
      desc: "时间线标题（首行）",
      wemdSelector: ".wemd-timeline .wemd-tl-title",
    },
    {
      name: "events",
      desc: "事件列表容器",
      wemdSelector: ".wemd-timeline .wemd-tl-events",
    },
    {
      name: "item",
      desc: "时间线项",
      wemdSelector: ".wemd-timeline .wemd-tl-item",
    },
  ],
};

const AUTHOR_CARD: ComponentElementsDef = {
  type: "author-card",
  label: "作者卡片",
  hasBody: true,
  containerSelector: ".wemd-author-card",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-author-card" },
    {
      name: "body",
      desc: "内容主体",
      wemdSelector: ".wemd-author-card .wemd-component-body",
    },
    {
      name: "avatar",
      desc: "头像（第一张图片）",
      wemdSelector: ".wemd-author-card .wemd-component-body img:first-child",
    },
    {
      name: "name",
      desc: "名称（strong 文字）",
      wemdSelector:
        ".wemd-author-card .wemd-component-body > p:first-child strong",
    },
    {
      name: "role",
      desc: "角色（em 文字）",
      wemdSelector: ".wemd-author-card .wemd-component-body > p:first-child em",
    },
    {
      name: "bio",
      desc: "简介",
      wemdSelector:
        ".wemd-author-card .wemd-component-body > p:not(:first-child)",
    },
  ],
};

const STATS_BLOCK: ComponentElementsDef = {
  type: "stats-block",
  label: "数据统计块",
  hasBody: false,
  containerSelector: ".wemd-stats-block",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-stats-block" },
    {
      name: "items",
      desc: "数据条目容器",
      wemdSelector: ".wemd-stats-block .wemd-sb-items",
    },
    {
      name: "item",
      desc: "单个数据条目",
      wemdSelector: ".wemd-stats-block .wemd-sb-items-item",
    },
    {
      name: "value",
      desc: "数值高亮",
      wemdSelector: ".wemd-stats-block .wemd-sb-items-value",
    },
    {
      name: "label",
      desc: "指标说明",
      wemdSelector: ".wemd-stats-block .wemd-sb-items-label",
    },
  ],
};

const IMAGE_TEXT_ROW: ComponentElementsDef = {
  type: "image-text-row",
  label: "图文左右混排",
  hasBody: true,
  containerSelector: ".wemd-image-text-row",
  containerDesc: "组件容器",
  elements: [
    {
      name: "container",
      desc: "组件容器",
      wemdSelector: ".wemd-image-text-row",
    },
    {
      name: "body",
      desc: "内容主体",
      wemdSelector: ".wemd-image-text-row .wemd-component-body",
    },
    {
      name: "image",
      desc: "左侧图片（第一张 img）",
      wemdSelector: ".wemd-image-text-row .wemd-component-body img:first-child",
    },
    {
      name: "text",
      desc: "右侧文字段落",
      wemdSelector: ".wemd-image-text-row .wemd-component-body > p",
    },
  ],
};

const NUMBERED_HEADING: ComponentElementsDef = {
  type: "numbered-heading",
  label: "序号章节标题",
  hasBody: true,
  containerSelector: ".wemd-numbered-heading",
  containerDesc: "组件容器",
  elements: [
    {
      name: "container",
      desc: "组件容器",
      wemdSelector: ".wemd-numbered-heading",
    },
    {
      name: "body",
      desc: "内容主体",
      wemdSelector: ".wemd-numbered-heading .wemd-component-body",
    },
    {
      name: "number",
      desc: "大序号（第一段）",
      wemdSelector:
        ".wemd-numbered-heading .wemd-component-body > p:first-child",
    },
    {
      name: "title",
      desc: "标题文字（第二段）",
      wemdSelector:
        ".wemd-numbered-heading .wemd-component-body > p:nth-child(2)",
    },
  ],
};

const SECTION_TITLE: ComponentElementsDef = {
  type: "section-title",
  label: "章节小标题卡片",
  hasBody: true,
  containerSelector: ".wemd-section-title",
  containerDesc: "组件容器",
  elements: [
    {
      name: "container",
      desc: "组件容器",
      wemdSelector: ".wemd-section-title",
    },
    {
      name: "body",
      desc: "内容主体",
      wemdSelector: ".wemd-section-title .wemd-component-body",
    },
    {
      name: "title",
      desc: "标题文字（第一段）",
      wemdSelector: ".wemd-section-title .wemd-component-body > p:first-child",
    },
  ],
};

const IMAGE_GRID: ComponentElementsDef = {
  type: "image-grid",
  label: "图片网格",
  hasBody: true,
  containerSelector: ".wemd-image-grid",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-image-grid" },
    {
      name: "body",
      desc: "内容主体",
      wemdSelector: ".wemd-image-grid .wemd-component-body",
    },
    {
      name: "caption",
      desc: "标题说明（第一段）",
      wemdSelector: ".wemd-image-grid .wemd-component-body > p:first-child",
    },
    {
      name: "image",
      desc: "网格中的图片",
      wemdSelector: ".wemd-image-grid .wemd-component-body li img",
    },
  ],
};

const RELATED_POSTS: ComponentElementsDef = {
  type: "related-posts",
  label: "推荐阅读卡片",
  hasBody: false,
  containerSelector: ".wemd-related-posts",
  containerDesc: "组件容器",
  elements: [
    {
      name: "container",
      desc: "组件容器",
      wemdSelector: ".wemd-related-posts",
    },
    {
      name: "items",
      desc: "推荐条目容器",
      wemdSelector: ".wemd-related-posts .wemd-rp-items",
    },
    {
      name: "item",
      desc: "推荐项",
      wemdSelector: ".wemd-related-posts .wemd-rp-items-item",
    },
  ],
};

const TOC_NAV: ComponentElementsDef = {
  type: "toc-nav",
  label: "目录导航",
  hasBody: true,
  containerSelector: ".wemd-toc-nav",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-toc-nav" },
    {
      name: "body",
      desc: "内容主体",
      wemdSelector: ".wemd-toc-nav .wemd-component-body",
    },
    {
      name: "title",
      desc: "目录标题（第一段）",
      wemdSelector: ".wemd-toc-nav .wemd-component-body > p:first-child",
    },
    {
      name: "item",
      desc: "目录项（li）",
      wemdSelector: ".wemd-toc-nav .wemd-component-body li",
    },
    {
      name: "link",
      desc: "目录链接",
      wemdSelector: ".wemd-toc-nav .wemd-component-body li a",
    },
  ],
};

const TAG_LABEL: ComponentElementsDef = {
  type: "tag-label",
  label: "关键词标签",
  hasBody: true,
  containerSelector: ".wemd-tag-label",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-tag-label" },
    {
      name: "body",
      desc: "内容主体",
      wemdSelector: ".wemd-tag-label .wemd-component-body",
    },
    {
      name: "tag",
      desc: "单个标签",
      wemdSelector: ".wemd-tag-label .wemd-component-body > p",
    },
  ],
};

const IMAGE_CAPTION: ComponentElementsDef = {
  type: "image-caption",
  label: "图片说明图注",
  hasBody: true,
  containerSelector: ".wemd-image-caption",
  containerDesc: "组件容器",
  elements: [
    {
      name: "container",
      desc: "组件容器",
      wemdSelector: ".wemd-image-caption",
    },
    {
      name: "body",
      desc: "内容主体",
      wemdSelector: ".wemd-image-caption .wemd-component-body",
    },
    {
      name: "image",
      desc: "图片",
      wemdSelector: ".wemd-image-caption .wemd-component-body img",
    },
    {
      name: "caption",
      desc: "说明文字",
      wemdSelector: ".wemd-image-caption .wemd-component-body > p",
    },
  ],
};

const COPYRIGHT_NOTICE: ComponentElementsDef = {
  type: "copyright-notice",
  label: "转载声明",
  hasBody: true,
  containerSelector: ".wemd-copyright-notice",
  containerDesc: "组件容器",
  elements: [
    {
      name: "container",
      desc: "组件容器",
      wemdSelector: ".wemd-copyright-notice",
    },
    {
      name: "body",
      desc: "内容主体",
      wemdSelector: ".wemd-copyright-notice .wemd-component-body",
    },
    {
      name: "text",
      desc: "声明文字段落",
      wemdSelector: ".wemd-copyright-notice .wemd-component-body > p",
    },
  ],
};

const STYLED_TABLE: ComponentElementsDef = {
  type: "styled-table",
  label: "美化表格",
  hasBody: false,
  containerSelector: ".wemd-styled-table",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-styled-table" },
    {
      name: "table",
      desc: "表格容器",
      wemdSelector: ".wemd-styled-table .wemd-sbt-table",
    },
    {
      name: "tableEl",
      desc: "表格元素",
      wemdSelector: ".wemd-styled-table .wemd-sbt-table table",
    },
    {
      name: "th",
      desc: "表头单元格",
      wemdSelector: ".wemd-styled-table .wemd-sbt-table table th",
    },
    {
      name: "td",
      desc: "表体单元格",
      wemdSelector: ".wemd-styled-table .wemd-sbt-table table td",
    },
  ],
};

const CODE_FRAME: ComponentElementsDef = {
  type: "code-frame",
  label: "代码框",
  hasBody: false,
  containerSelector: ".wemd-code-frame",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-code-frame" },
    {
      name: "title",
      desc: "代码标题（首行）",
      wemdSelector: ".wemd-code-frame .wemd-cf-title",
    },
    {
      name: "code",
      desc: "代码内容",
      wemdSelector: ".wemd-code-frame .wemd-cf-code pre code",
    },
  ],
};

const DIVIDER_FANCY: ComponentElementsDef = {
  type: "divider-fancy",
  label: "装饰分割线",
  hasBody: false,
  containerSelector: ".wemd-divider-fancy",
  containerDesc: "组件容器",
  elements: [
    {
      name: "container",
      desc: "组件容器",
      wemdSelector: ".wemd-divider-fancy",
    },
    {
      name: "label",
      desc: "分隔线文字",
      wemdSelector: ".wemd-divider-fancy .wemd-df-label",
    },
  ],
};

const FOLLOW_BAR: ComponentElementsDef = {
  type: "follow-bar",
  label: "顶部关注引导条",
  hasBody: true,
  containerSelector: ".wemd-follow-bar",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-follow-bar" },
    {
      name: "body",
      desc: "内容主体",
      wemdSelector: ".wemd-follow-bar .wemd-component-body",
    },
    {
      name: "text",
      desc: "引导文字（第一段）",
      wemdSelector: ".wemd-follow-bar .wemd-component-body > p:first-child",
    },
    {
      name: "button",
      desc: "关注按钮（末段）",
      wemdSelector: ".wemd-follow-bar .wemd-component-body > p:last-child",
    },
  ],
};

const QR_CARD: ComponentElementsDef = {
  type: "qr-card",
  label: "二维码关注卡片",
  hasBody: true,
  containerSelector: ".wemd-qr-card",
  containerDesc: "组件容器",
  elements: [
    { name: "container", desc: "组件容器", wemdSelector: ".wemd-qr-card" },
    {
      name: "body",
      desc: "内容主体",
      wemdSelector: ".wemd-qr-card .wemd-component-body",
    },
    {
      name: "qrcode",
      desc: "二维码图片",
      wemdSelector: ".wemd-qr-card .wemd-component-body img:first-child",
    },
    {
      name: "name",
      desc: "公众号名称（第一段）",
      wemdSelector: ".wemd-qr-card .wemd-component-body > p:first-child",
    },
    {
      name: "slogan",
      desc: "Slogan（第二段）",
      wemdSelector: ".wemd-qr-card .wemd-component-body > p:nth-child(2)",
    },
  ],
};

// ============================================================
// 注册表
// ============================================================

/** 所有组件的语义元素描述 */
export const ALL_COMPONENT_ELEMENTS: Record<string, ComponentElementsDef> = {
  // 杂志级
  "magazine-cover": MAGAZINE_COVER,
  "section-divider": SECTION_DIVIDER,
  "two-column-cards": TWO_COLUMN_CARDS,
  "full-quote": FULL_QUOTE,
  "image-card": IMAGE_CARD,
  "end-card": END_CARD,
  "product-card": PRODUCT_CARD,
  "brand-sign": BRAND_SIGN,
  "resource-list": RESOURCE_LIST,
  "testimonial-card": TESTIMONIAL_CARD,
  "series-nav": SERIES_NAV,
  // 普通组件
  "quote-card": QUOTE_CARD,
  "hero-banner": HERO_BANNER,
  "cta-card": CTA_CARD,
  "callout-pro": CALL_OUT_PRO,
  "share-card": SHARE_CARD,
  faq: FAQ,
  timeline: TIMELINE,
  "author-card": AUTHOR_CARD,
  "stats-block": STATS_BLOCK,
  "image-text-row": IMAGE_TEXT_ROW,
  "numbered-heading": NUMBERED_HEADING,
  "section-title": SECTION_TITLE,
  "image-grid": IMAGE_GRID,
  "related-posts": RELATED_POSTS,
  "toc-nav": TOC_NAV,
  "tag-label": TAG_LABEL,
  "image-caption": IMAGE_CAPTION,
  "copyright-notice": COPYRIGHT_NOTICE,
  "styled-table": STYLED_TABLE,
  "code-frame": CODE_FRAME,
  "divider-fancy": DIVIDER_FANCY,
  "follow-bar": FOLLOW_BAR,
  "qr-card": QR_CARD,
};

/**
 * 生成 AI Phase 1 使用的组件元素描述文本
 * 告诉 AI 每个组件有哪些语义元素可以样式化
 */
export function describeElementsForPhase1(componentTypes: string[]): string {
  const lines: string[] = ["可用组件及其语义元素："];
  for (const type of componentTypes) {
    const def = ALL_COMPONENT_ELEMENTS[type];
    if (!def) continue;
    const elementNames = def.elements
      .filter((e) => e.name !== "container")
      .map((e) => `${e.name}（${e.desc}）`)
      .join("、");
    lines.push(`- ${type}（${def.label}）：${elementNames}`);
  }
  return lines.join("\n");
}

/**
 * 生成 AI Phase 2 使用的选择器映射参考
 * 告诉 AI 如何将自由选择器映射到 WeMD 标准选择器
 */
export function describeMappingForPhase2(componentTypes: string[]): string {
  const lines: string[] = ["WeMD 标准选择器映射参考："];
  for (const type of componentTypes) {
    const def = ALL_COMPONENT_ELEMENTS[type];
    if (!def) continue;
    lines.push(`\n## ${type}（${def.label}）`);
    lines.push(`容器：${def.containerSelector}`);
    for (const el of def.elements) {
      if (el.name === "container") continue;
      lines.push(`- ${el.name} → ${el.wemdSelector}`);
    }
  }
  return lines.join("\n");
}

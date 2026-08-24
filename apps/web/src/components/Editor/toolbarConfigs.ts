import {
  Award,
  Binary,
  Bold,
  BookPlus,
  Calendar,
  ChartColumn,
  ChartLine,
  Clock,
  Code,
  Columns,
  Database,
  FileArchive,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  HelpCircle,
  Image,
  ImagePlus,
  Italic,
  LayoutTemplate,
  Link,
  List,
  ListOrdered,
  MessageSquareQuote,
  Minus,
  PieChart,
  QrCode,
  Quote,
  Share2,
  ShoppingCart,
  Sparkles,
  Strikethrough,
  Table,
  Underline,
  User,
  UserPlus,
  Workflow,
  FileText,
  Flag,
  Sigma,
  Braces,
  Superscript,
  Subscript,
  Highlighter,
  Hash,
  ListTree,
  AlertCircle,
  CheckSquare,
  BookMarked,
  Smile,
  BarChart3,
  LayoutGrid,
  History,
  BookOpen,
  Tag,
  Copyright,
  Terminal,
  Footprints,
  ChevronsDownUp,
  AlertTriangle,
  Images,
  type LucideIcon,
} from "lucide-react";

export interface ToolbarInsertTool {
  icon: LucideIcon;
  label: string;
  prefix: string;
  suffix: string;
  placeholder: string;
}

export interface MermaidTemplate {
  icon: LucideIcon;
  label: string;
  code: string;
}

export interface ComponentTemplate {
  icon: LucideIcon;
  label: string;
  /** 组件名（用于 :::name{...} 语法） */
  name: string;
  /** 完整 props 字符串（不含大括号） */
  props: string;
  /** 组件 body 模板内容 */
  body: string;
  /** 简短描述，用于 tooltip */
  description: string;
}

// 公众号静态呈现优先：仅保留常用静态图类型，顺序按实际使用频率从高到低
export const mermaidPrimaryTemplates: MermaidTemplate[] = [
  {
    icon: Workflow,
    label: "流程图",
    code: `graph TD
    A[开始] --> B{判断}
    B -- 是 --> C[执行操作]
    B -- 否 --> D[结束]
    C --> D`,
  },
  {
    icon: ChartColumn,
    label: "柱状图",
    code: `xychart-beta
    title "建设成本对比"
    x-axis [ "风冷", "冷板式", "浸没式" ]
    y-axis "元/kW" 0 --> 25000
    bar [2500, 5500, 18000]`,
  },
  {
    icon: ChartLine,
    label: "折线图",
    code: `xychart-beta
    title "液冷渗透率趋势"
    x-axis [2022, 2024, 2026, 2028]
    y-axis "渗透率(%)" 0 --> 60
    line [8, 15, 30, 50]`,
  },
  {
    icon: PieChart,
    label: "饼图",
    code: `pie title 市场份额
    "产品 A" : 40
    "产品 B" : 30
    "产品 C" : 20
    "其他" : 10`,
  },
  {
    icon: Binary,
    label: "思维导图",
    code: `mindmap
  root((思维导图))
    主题一
      子节点 A
      子节点 B
    主题二
      子节点 C`,
  },
  {
    icon: Clock,
    label: "时序图",
    code: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I am good thanks!
    Bob->>John: Hello John!`,
  },
  {
    icon: Database,
    label: "ER 图",
    code: `erDiagram
    USER ||--o{ ORDER : places
    USER {
        int id
        string name
    }
    ORDER {
        int id
        string status
    }`,
  },
  {
    icon: Calendar,
    label: "时间线",
    code: `timeline
    title 项目里程碑
    2024-01-01 : 立项
    2024-02-15 : 原型完成
    2024-03-20 : 开发完成
    2024-04-01 : 上线`,
  },
];

export const textFormatTools: ToolbarInsertTool[] = [
  {
    icon: Bold,
    label: "粗体",
    prefix: "**",
    suffix: "**",
    placeholder: "粗体文字",
  },
  {
    icon: Italic,
    label: "斜体",
    prefix: "*",
    suffix: "*",
    placeholder: "斜体文字",
  },
  {
    icon: Underline,
    label: "下划线",
    prefix: "++",
    suffix: "++",
    placeholder: "下划线文字",
  },
  {
    icon: Strikethrough,
    label: "删除线",
    prefix: "~~",
    suffix: "~~",
    placeholder: "删除文字",
  },
];

export const headingOptions: ToolbarInsertTool[] = [
  {
    icon: Heading1,
    label: "一级标题",
    prefix: "# ",
    suffix: "",
    placeholder: "标题",
  },
  {
    icon: Heading2,
    label: "二级标题",
    prefix: "## ",
    suffix: "",
    placeholder: "标题",
  },
  {
    icon: Heading3,
    label: "三级标题",
    prefix: "### ",
    suffix: "",
    placeholder: "标题",
  },
  {
    icon: Heading4,
    label: "四级标题",
    prefix: "#### ",
    suffix: "",
    placeholder: "标题",
  },
];

export const listOptions: ToolbarInsertTool[] = [
  {
    icon: List,
    label: "无序列表",
    prefix: "- ",
    suffix: "",
    placeholder: "列表项",
  },
  {
    icon: ListOrdered,
    label: "有序列表",
    prefix: "1. ",
    suffix: "",
    placeholder: "列表项",
  },
];

export const blockTools: ToolbarInsertTool[] = [
  {
    icon: Quote,
    label: "引用",
    prefix: "> ",
    suffix: "",
    placeholder: "引用文字",
  },
  {
    icon: Code,
    label: "代码块",
    prefix: "```\n",
    suffix: "\n```",
    placeholder: "代码",
  },
  {
    icon: Link,
    label: "链接",
    prefix: "[",
    suffix: "](url)",
    placeholder: "链接文字",
  },
  {
    icon: Minus,
    label: "分割线",
    prefix: "\n---\n",
    suffix: "",
    placeholder: "",
  },
];

/**
 * 扩展 Markdown 语法（core 已支持、工具条补齐的插入入口）
 * 数学公式 / 高亮 / 上下标 / 脚注 / 目录 / 提示块 / 任务清单 / 定义列表 / Emoji
 */
export const syntaxTools: ToolbarInsertTool[] = [
  {
    icon: Sigma,
    label: "行内公式",
    prefix: "$",
    suffix: "$",
    placeholder: "a^2 + b^2 = c^2",
  },
  {
    icon: Braces,
    label: "块级公式",
    prefix: "$$\n",
    suffix: "\n$$",
    placeholder: "E = mc^2",
  },
  {
    icon: Highlighter,
    label: "高亮",
    prefix: "==",
    suffix: "==",
    placeholder: "重点内容",
  },
  {
    icon: Superscript,
    label: "上标",
    prefix: "^",
    suffix: "^",
    placeholder: "上标",
  },
  {
    icon: Subscript,
    label: "下标",
    prefix: "~",
    suffix: "~",
    placeholder: "下标",
  },
  {
    icon: Hash,
    label: "脚注",
    prefix: "文字[^1]\n\n[^1]: ",
    suffix: "",
    placeholder: "脚注内容",
  },
  {
    icon: ListTree,
    label: "目录",
    prefix: "[toc]\n\n",
    suffix: "",
    placeholder: "",
  },
  {
    icon: AlertCircle,
    label: "提示块",
    prefix: "> [!NOTE]\n> ",
    suffix: "",
    placeholder: "提示内容",
  },
  {
    icon: CheckSquare,
    label: "任务清单",
    prefix: "- [ ] ",
    suffix: "",
    placeholder: "待办事项",
  },
  {
    icon: BookMarked,
    label: "定义列表",
    prefix: "术语\n: ",
    suffix: "",
    placeholder: "定义说明",
  },
  {
    icon: Smile,
    label: "Emoji",
    prefix: ":",
    suffix: ":",
    placeholder: "smile",
  },
];

/**
 * 公众号组件模板（9 初始 + 13 扩展 = 22 个）
 * 通过 ::: name{props} ... ::: 语法插入
 */
export const componentTemplates: ComponentTemplate[] = [
  {
    icon: Quote,
    label: "金句卡片",
    name: "quote-card",
    props: 'author="作者名" role="身份"',
    body: "在这里写下值得被记住的金句",
    description: "高亮一段引用，带作者署名",
  },
  {
    icon: Sparkles,
    label: "装饰分割线",
    name: "divider-fancy",
    props: "",
    body: "",
    description: "比普通 hr 更精致的分割线",
  },
  {
    icon: LayoutTemplate,
    label: "关注引导",
    name: "cta-card",
    props: "",
    body: "如果觉得有用，欢迎关注\n点赞 + 在看，支持下作者\n点击关注",
    description: "末尾的关注/引导卡片",
  },
  {
    icon: Sparkles,
    label: "强化提示",
    name: "callout-pro",
    props: 'type="info"',
    body: "**提示标题**\n这里是正文内容，可以有多行。",
    description: "info/success/warning/danger/tip 五种类型",
  },
  {
    icon: User,
    label: "作者卡片",
    name: "author-card",
    props: "",
    body: "![](https://via.placeholder.com/128x128)\n**张三** *产品设计师 / 公众号主理人*\n专注于工具类产品设计与写作，分享设计方法论与行业观察。",
    description: "作者头像 + 简介，用于文末",
  },
  // === 第一批高频组件（8 个） ===
  {
    icon: UserPlus,
    label: "关注引导条",
    name: "follow-bar",
    props: "",
    body: "点击上方蓝字关注我们\n关注",
    description: "顶部渐变关注引导横条",
  },
  {
    icon: QrCode,
    label: "二维码卡片",
    name: "qr-card",
    props: "",
    body: "![](https://via.placeholder.com/140x140)\n**公众号名称**\n一句话简介，扫码关注",
    description: "二维码 + 公众号名称 + 简介",
  },
  {
    icon: Columns,
    label: "图文混排",
    name: "image-text-row",
    props: "",
    body: "![](https://via.placeholder.com/120x120)\n**卡片标题**\n这里是描述文字，图文左右混排展示，适合介绍产品或人物。",
    description: "图片 + 文字左右排布",
  },
  {
    icon: ImagePlus,
    label: "顶部头图",
    name: "hero-banner",
    props: "",
    body: "**文章主标题**\n一句话副标题，点明文章主旨",
    description: "渐变背景的头图 Banner",
  },
  {
    icon: Share2,
    label: "分享引导",
    name: "share-card",
    props: "",
    body: "如果这篇文章对你有帮助\n- **分享**\n- **点赞**\n- **在看**",
    description: "文末分享/点赞/在看三按钮",
  },
  // === 第二批中频组件（5 个） ===
  {
    icon: HelpCircle,
    label: "常见问题",
    name: "faq",
    props: 'title="常见问题解答"',
    body: "**问题一：如何使用？**\n\n这里是问题一的回答内容。\n\n**问题二：支持哪些功能？**\n\n这里是问题二的回答内容。",
    description: "FAQ 问答卡片，支持 card/simple 两种风格",
  },
  // === 杂志级排版组件（7 个） ===
  {
    icon: LayoutTemplate,
    label: "杂志封面",
    name: "magazine-cover",
    props: "",
    body: "盛夏时光\n\nSummer Breeze\n\n---\n\n愿所有美好\n如夏日微风一般如期而至。\n\n![封面图](https://picsum.photos/seed/cover/1200/630)",
    description: "大标题 + 英文副标题 + 装饰线 + 描述，末行图片作封面（无声发布等主题生效）",
  },
  {
    icon: Flag,
    label: "章节分隔",
    name: "section-divider",
    props: "",
    body: "PART 01\n\n夏日故事",
    description: "PART 编号 + 中文标题，居中分隔",
  },
  {
    icon: Image,
    label: "图片卡片",
    name: "image-card",
    props: "",
    body: "![](https://picsum.photos/600/400)\n\n图片说明文字",
    description: "白底卡片 + 阴影 + 圆角包裹图片",
  },
  {
    icon: FileText,
    label: "正文卡片",
    name: "text-card",
    props: "",
    body: "七月盛夏，阳光透过树叶洒落在地面，微风轻轻吹过，带来了青草与花朵的香气。\n\n我们在这个充满希望的季节，保持热爱，奔赴山海。",
    description: "白底卡片包裹正文段落，杂志风",
  },
  {
    icon: Quote,
    label: "整行引用",
    name: "full-quote",
    props: "",
    body: "愿这个夏天，所有期待都有回应。",
    description: "整块主色背景 + 白字 + 居中",
  },
  {
    icon: Columns,
    label: "两栏卡片",
    name: "two-column-cards",
    props: "",
    body: "- ☀️<br>**阳光**<br>每一天都充满能量\n- 🍃<br>**微风**<br>吹散所有烦恼",
    description: "flex 两栏，emoji + 标题 + 描述",
  },
  {
    icon: Sparkles,
    label: "结尾致谢",
    name: "end-card",
    props: "",
    body: "Thanks\n\n感谢阅读 · 期待下次相遇",
    description: "居中 Thanks 样式，文末收尾",
  },
  // === 第三批扩展组件（产品/品牌/资料/推荐/系列） ===
  {
    icon: ShoppingCart,
    label: "产品卡片",
    name: "product-card",
    props: 'variant="ecommerce"',
    body: "![product](https://via.placeholder.com/400x300)\n\n【限时特惠】 **星空投影灯 Pro**  居家氛围感神器\n\n360° 全景星空投影，支持蓝牙音箱二合一，卧室露营两用好物。\n\n💰 ¥399  ~~¥599~~\n\n⭐⭐⭐⭐⭐ 4.8   📦 已售 1.2w   🔥 仅剩 50 件\n\n【立即抢购】\n\n#顺丰包邮  #七天无理由  #品牌直发",
    description: "电商产品卡片：图片+价格+评分+购买按钮",
  },
  {
    icon: Award,
    label: "品牌签名",
    name: "brand-sign",
    props: 'variant="inline"',
    body: "![brand-logo](https://via.placeholder.com/64x64)\n\n**WeMD**\n\n优雅排版，不止所见\n\nstyle=inline divider=true\n\n*© 2026 WeMD Team*",
    description: "品牌 Logo + 名称 + Slogan 小标，用于开头/结尾",
  },
  {
    icon: FileArchive,
    label: "资料清单",
    name: "resource-list",
    props: 'variant="files"',
    body: "**新手入门资料包**\n\n从零开始学排版，一份齐全的资料清单\n\nnumbered=true layout=comfortable\n\n- [link|1] 排版规范手册 1.0  |D=官方整理的完整排版规范 |M=PDF · 3.2MB |T=必备 |U=https://example.com/1\n- [link|2] 主题模板合集  |D=12 套精选预设主题 |M=ZIP · 18MB |T=推荐 |U=https://example.com/2\n- [doc|3] Markdown 语法速查  |D=常用语法一页纸总结 |M=PNG · 500KB |T=速查 |U=https://example.com/3\n- [video|4] 3 分钟上手视频  |D=官方入门操作演示 |M=MP4 · 28MB |T=视频 |U=https://example.com/4",
    description: "资料下载/步骤清单/参考书目结构化列表",
  },
  {
    icon: MessageSquareQuote,
    label: "名人推荐",
    name: "testimonial-card",
    props: 'variant="classic"',
    body: "![avatar](https://via.placeholder.com/96x96)\n\n> **好的工具能让创作变得更有乐趣，而不是更繁琐。**\n\n> —— 《产品思维三十讲》\n\n**张三**  资深产品总监\n\n某知名互联网公司\n\n![brand](https://via.placeholder.com/120x36)",
    description: "头像+人名+公司+名言+来源 客户推荐/KOL背书",
  },
  {
    icon: BookPlus,
    label: "系列导航",
    name: "series-nav",
    props: 'variant="progress"',
    body: "📚 **Vue 3 从零到实战**  (第 3 / 10 篇)\n\n本系列带你系统学习 Vue 3，从基础语法到项目实战，循序渐进。\n\n⬅️ 上一篇：**第2篇** — Setup 语法糖与响应式\n\n➡️ 下一篇：**第4篇** — 计算属性与侦听器\n\n- [1]  Vue 3 项目初始化与工程配置  |U=https://example.com/1\n- [2]  Setup 语法糖与响应式基础  |U=https://example.com/2\n- [CURRENT]  组合式 API 深度解析\n- [4]  计算属性与侦听器  |U=https://example.com/4\n- [5]  组件通信与 Props  |U=https://example.com/5",
    description: "系列文章进度条 + 上下篇导航 + 全系列目录",
  },
  // === 语法补齐的缺失组件（13 个，body 由槽位驱动生成器自动补全） ===
  {
    icon: BarChart3,
    label: "数据统计",
    name: "stats-block",
    props: "",
    body: "",
    description: "标题 + 数据指标列表（数值 + 说明）",
  },
  {
    icon: LayoutGrid,
    label: "图片网格",
    name: "image-grid",
    props: "",
    body: "",
    description: "多图网格排布",
  },
  {
    icon: History,
    label: "时间线",
    name: "timeline",
    props: "",
    body: "",
    description: "标题 + 时间线条目",
  },
  {
    icon: BookOpen,
    label: "相关推荐",
    name: "related-posts",
    props: "",
    body: "",
    description: "文末相关文章 / 推荐列表",
  },
  {
    icon: ListTree,
    label: "目录导航",
    name: "toc-nav",
    props: "",
    body: "",
    description: "文章目录导航",
  },
  {
    icon: Tag,
    label: "标签",
    name: "tag-label",
    props: "",
    body: "",
    description: "标签样式文字",
  },
  {
    icon: Copyright,
    label: "版权声明",
    name: "copyright-notice",
    props: "",
    body: "",
    description: "文末版权声明",
  },
  {
    icon: Terminal,
    label: "代码块",
    name: "code-block",
    props: "",
    body: "",
    description: "代码块组件",
  },
  {
    icon: Footprints,
    label: "步骤",
    name: "steps",
    props: "",
    body: "",
    description: "有序步骤列表",
  },
  {
    icon: ChevronsDownUp,
    label: "折叠手风琴",
    name: "accordion",
    props: "",
    body: "",
    description: "可折叠的手风琴内容",
  },
  {
    icon: AlertTriangle,
    label: "通用提示",
    name: "callout",
    props: "",
    body: "",
    description: "通用提示框",
  },
  {
    icon: Images,
    label: "图片对比",
    name: "image-compare",
    props: "",
    body: "",
    description: "左右对比图",
  },
  {
    icon: Table,
    label: "表格组件",
    name: "table",
    props: "",
    body: "",
    description: "表格组件",
  },
];

/** 组件菜单分组顺序 */
export const componentGroupOrder = [
  "常用",
  "图文卡片",
  "数据与列表",
  "头尾引导",
  "品牌推荐",
] as const;

/** 组件 → 分组映射（菜单按用途分组展示，降低选择成本） */
export const componentGroups: Record<string, string> = {
  // 常用（高频块）
  "quote-card": "常用",
  "callout-pro": "常用",
  callout: "常用",
  "divider-fancy": "常用",
  "code-block": "常用",
  table: "常用",
  "tag-label": "常用",
  // 图文卡片（视觉主体）
  "magazine-cover": "图文卡片",
  "image-card": "图文卡片",
  "image-grid": "图文卡片",
  "image-text-row": "图文卡片",
  "image-compare": "图文卡片",
  "text-card": "图文卡片",
  "two-column-cards": "图文卡片",
  "full-quote": "图文卡片",
  "section-divider": "图文卡片",
  // 数据与列表
  "stats-block": "数据与列表",
  steps: "数据与列表",
  timeline: "数据与列表",
  "resource-list": "数据与列表",
  faq: "数据与列表",
  accordion: "数据与列表",
  "related-posts": "数据与列表",
  "toc-nav": "数据与列表",
  // 头尾引导（转化/收尾）
  "hero-banner": "头尾引导",
  "cta-card": "头尾引导",
  "follow-bar": "头尾引导",
  "qr-card": "头尾引导",
  "share-card": "头尾引导",
  "end-card": "头尾引导",
  "copyright-notice": "头尾引导",
  "author-card": "头尾引导",
  // 品牌推荐（商业化）
  "product-card": "品牌推荐",
  "brand-sign": "品牌推荐",
  "testimonial-card": "品牌推荐",
  "series-nav": "品牌推荐",
};

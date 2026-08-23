/**
 * 内置主题定义 —— ThemeDefinition JSON 格式
 *
 * 12 套可选主题 + 5 套 legacy（纯 CSS，兼容历史文章）
 *
 * 每套主题 = Meta + DesignTokens + LayoutPreference
 * Theme 只提供设计 Token（颜色/字体/圆角/阴影），组件自行消费 var(--wemd-*)。
 * 组件 variant 推荐写入 layout.defaultVariants，供 AI 排版参考。
 */
import type { ThemeDefinition } from "../theme-schema/types";
import { easternNotesTemplates } from "../themes/templates-eastern-notes";
import { clearGuideTemplates } from "../themes/templates-clear-guide";
import { whitespaceGalleryTemplates } from "../themes/templates-whitespace-gallery";
import { academicPaperTemplates } from "../themes/templates-academic-paper";
import { luxuryGoldTemplates } from "../themes/templates-luxury-gold";
import { morandiForestTemplates } from "../themes/templates-morandi-forest";
import { modernEditorialTemplates } from "../themes/templates-modern-editorial";
import { receiptTemplates } from "../themes/templates-receipt";
import { kbTemplates } from "../themes/templates-knowledge-base";
import { sfTemplates } from "../themes/templates-sunset-film";
import { skTemplates } from "../themes/templates-silent-keynote";
import { silentKeynoteSlotDefs } from "../themes/slotDefs-silent-keynote";
import { storybookTemplates } from "../themes/templates-storybook";
import { storybookSlotDefs } from "../themes/slotDefs-storybook";
import { shoppingGuideTemplates } from "../themes/templates-shopping-guide";
import { shoppingGuideSlotDefs } from "../themes/slotDefs-shopping-guide";
import { foodAtlasTemplates } from "../themes/templates-food-atlas";
import { foodAtlasSlotDefs } from "../themes/slotDefs-food-atlas";
import { stayNotesTemplates } from "../themes/templates-stay-notes";
import { stayNotesSlotDefs } from "../themes/slotDefs-stay-notes";
import { wanqingTemplates } from "../themes/templates-wanqing";
import { wanqingSlotDefs } from "../themes/slotDefs-wanqing";

// ============================================================
// 默认主题 · 微信绿
// 设计语言：经典微信绿主色，中性灰底，编辑式排版
// 全程不用投影、外发光、渐变或伪元素装饰，保证微信兼容性。
// ============================================================

const themeDefault: ThemeDefinition = {
  meta: {
    id: "default",
    name: "默认主题",
    description: "微信绿 · 经典编辑式排版，微信兼容稳定",
    keywords: ["通用", "微信绿", "编辑", "清新"],
    version: "2.0.0",
  },
  tokens: {
    color: {
      primary: "#07c160",
      primaryDark: "#0a8f4a",
      primaryLight: "#d1fae5",
      secondary: "#0a8f4a",
      accent: "#07c160",
      background: "#ffffff",
      bgSoft: "#f7f8fa",
      bgCard: "#ffffff",
      bgMuted: "#f0fdf4",
      textStrong: "#1a1a1a",
      textNormal: "#334155",
      textSoft: "#475569",
      border: "#e2e8f0",
      borderSoft: "#f0f0f0",
    },
    typography: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      fontSize: "16px",
      lineHeight: "1.8",
      letterSpacing: 0.4,
      heading: {
        h1: {
          fontSize: 30,
          color: "#1a1a1a",
          marginTop: 10,
          marginBottom: 28,
          fontWeight: "800",
          preset: "top-border",
          presetColor: "#07c160",
          letterSpacing: -0.3,
        },
        h2: {
          fontSize: 22,
          color: "#0a8f4a",
          marginTop: 42,
          marginBottom: 16,
          fontWeight: "700",
          preset: "bottom-border",
          presetColor: "#d1fae5",
          letterSpacing: 0.2,
        },
        h3: {
          fontSize: 18,
          color: "#0a8f4a",
          marginTop: 30,
          marginBottom: 12,
          fontWeight: "600",
          preset: "left-border",
          presetColor: "#07c160",
          letterSpacing: 0.2,
        },
        h4: {
          fontSize: 15,
          color: "#07c160",
          marginTop: 26,
          marginBottom: 10,
          fontWeight: "700",
          letterSpacing: 1,
        },
      },
      codeFontFamily:
        '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
    },
    spacing: { pagePadding: 8, paragraphMargin: 16 },
    border: { radius: 8 },
    shadow: { enabled: false, value: "" },
  },
  layout: {
    preferredComponents: [
      "quote-card",
      "divider-fancy",
      "share-card",
      "follow-bar",
    ],
    density: "medium",
    tone: ["warm", "modern"],
    defaultVariants: { "share-card": "warm" },
  },
};

// ============================================================
// 数据蓝图（科技蓝）
// ============================================================

const themeDataBlueprint: ThemeDefinition = {
  meta: {
    id: "data-blueprint",
    name: "数据蓝图",
    description: "科技蓝色调，理性专业，适合技术文章和数据报告",
    keywords: ["科技", "数据", "专业", "技术"],
    version: "1.0.0",
  },
  tokens: {
    color: {
      primary: "#0ea5e9",
      primaryDark: "#0369a1",
      primaryLight: "#e0f2fe",
      secondary: "#0369a1",
      accent: "#06b6d4",
      background: "#ffffff",
      bgSoft: "#f0f9ff",
      bgCard: "#0c4a6e",
      bgMuted: "#e0f2fe",
      textStrong: "#082f49",
      textNormal: "#1e293b",
      textSoft: "#475569",
      border: "#bae6fd",
      borderSoft: "#e0f2fe",
    },
    typography: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
      fontSize: "16px",
      lineHeight: "1.8",
      letterSpacing: 0.2,
      heading: {
        h1: {
          fontSize: 28,
          color: "#082f49",
          marginTop: 32,
          marginBottom: 18,
          fontWeight: "700",
          preset: "left-border",
          presetColor: "#0ea5e9",
        },
        h2: {
          fontSize: 22,
          color: "#0369a1",
          marginTop: 28,
          marginBottom: 14,
          fontWeight: "600",
          preset: "left-border",
          presetColor: "#0ea5e9",
        },
        h3: {
          fontSize: 19,
          color: "#0ea5e9",
          marginTop: 24,
          marginBottom: 12,
          fontWeight: "600",
        },
        h4: {
          fontSize: 17,
          color: "#06b6d4",
          marginTop: 20,
          marginBottom: 10,
          fontWeight: "600",
        },
      },
      codeFontFamily: '"SF Mono", Monaco, Consolas, monospace',
    },
    spacing: { pagePadding: 8, paragraphMargin: 12 },
    border: { radius: 6 },
    shadow: { enabled: false, value: "" },
  },
  layout: {
    preferredComponents: [
      "stats-block",
      "code-frame",
      "styled-table",
      "quote-card",
    ],
    density: "high",
    tone: ["rational", "serious"],
    defaultVariants: { "share-card": "tech" },
  },
  codeTheme: "github-dark",
};

// ============================================================
// 东方笺谱（朱砂红）
// ============================================================

const themeEasternNotes: ThemeDefinition = {
  meta: {
    id: "eastern-notes",
    name: "东方笺谱",
    description: "朱砂红 · 宣纸米 · 黛蓝点缀，文人书信风，适合文化艺术类内容",
    keywords: ["东方", "书信", "宣纸", "朱砂", "文人"],
    version: "2.0.0",
  },
  tokens: {
    color: {
      primary: "#a33a2b",       // 朱砂
      primaryDark: "#7e2d21",   // 深朱砂
      primaryLight: "#f2e4de",  // 朱砂淡罩
      secondary: "#3d5a63",     // 黛蓝
      accent: "#8a5a33",        // 赭石
      background: "#f6f1e8",    // 宣纸底
      bgSoft: "#efe8da",        // 深宣纸
      bgCard: "#faf6f0",        // 暖宣纸
      bgMuted: "#f2ede4",       // 温纸
      textStrong: "#2b2622",    // 墨
      textNormal: "#36322f",    // 浓墨
      textSoft: "#6b6159",      // 淡墨
      border: "#d8cfc0",        // 纸线
      borderSoft: "#e7dfcf",    // 淡纸线
    },
    typography: {
      fontFamily:
        '"Songti SC", "STSong", "Noto Serif CJK SC", "Source Han Serif SC", SimSun, "PingFang SC", serif',
      fontSize: "16px",
      lineHeight: "2.05",
      letterSpacing: 0.45,
      heading: {
        h1: {
          fontSize: 34,
          color: "#2b2622",
          marginTop: 38,
          marginBottom: 72,
          fontWeight: "700",
          preset: "bottom-border",
          presetColor: "#a33a2b",
          centered: true,
          letterSpacing: 1.6,
        },
        h2: {
          fontSize: 22,
          color: "#a33a2b",
          marginTop: 58,
          marginBottom: 26,
          fontWeight: "700",
          letterSpacing: 1.2,
        },
        h3: {
          fontSize: 18,
          color: "#a33a2b",
          marginTop: 40,
          marginBottom: 20,
          fontWeight: "700",
          letterSpacing: 1.0,
        },
        h4: {
          fontSize: 16,
          color: "#6b6159",
          marginTop: 29,
          marginBottom: 14,
          fontWeight: "700",
        },
      },
      codeFontFamily: '"SF Mono", "SFMono-Regular", Consolas, "Courier New", monospace',
    },
    spacing: { pagePadding: 8, paragraphMargin: 10 },
    border: { radius: 0 },
    shadow: { enabled: false, value: "" },
  },
  layout: {
    preferredComponents: ["quote-card", "divider-fancy", "end-card", "pullquote", "callout-pro"],
    density: "low",
    tone: ["warm", "elegant"],
    defaultVariants: { "share-card": "warm" },
  },
  // 主题自带骨架：未在此声明的组件自动回退到内置默认骨架（defaultTemplates.ts）。
  // 骨架模板按主题拆在 themes/templates-<id>.ts，公共结构复用 template-library，避免堆在一个文件。
  templates: easternNotesTemplates,
  codeTheme: "github-dark",
};

// ============================================================
// 清晰指南（学习手册：暖纸 + 荧光 + 橙红签名）
// ============================================================

const themeClearGuide: ThemeDefinition = {
  meta: {
    id: "clear-guide",
    name: "清晰指南",
    description: "学习手册风：暖纸为底 + 荧光划重点 + 橙红签名，适合教程文档与上手手册",
    keywords: ["清晰", "教程", "文档", "手册", "学习", "荧光"],
    version: "2.0.0",
  },
  tokens: {
    color: {
      primary: "#e8590c",
      primaryDark: "#c2410c",
      primaryLight: "#fff3ad",
      secondary: "#c2410c",
      accent: "#ffe14d",
      background: "#faf6ef",
      bgSoft: "#f2ead9",
      bgCard: "#fffdf8",
      bgMuted: "#f6efdf",
      textStrong: "#2b2118",
      textNormal: "#2b2118",
      textSoft: "#6b5d4f",
      border: "#e6dcc7",
      borderSoft: "#efe7d6",
    },
    typography: {
      fontFamily:
        '"Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", "PingFang SC", serif',
      fontSize: "15px",
      lineHeight: "2.05",
      letterSpacing: 0.3,
      heading: {
        h1: {
          fontSize: 28,
          color: "#2b2118",
          marginTop: 24,
          marginBottom: 20,
          fontWeight: "800",
          preset: "simple",
        },
        h2: {
          fontSize: 21,
          color: "#2b2118",
          marginTop: 46,
          marginBottom: 20,
          fontWeight: "700",
          preset: "simple",
        },
        h3: {
          fontSize: 18,
          color: "#e8590c",
          marginTop: 32,
          marginBottom: 16,
          fontWeight: "700",
        },
        h4: {
          fontSize: 16,
          color: "#c2410c",
          marginTop: 26,
          marginBottom: 13,
          fontWeight: "700",
        },
      },
      codeFontFamily: '"SF Mono", "Cascadia Code", Consolas, "JetBrains Mono", monospace',
    },
    spacing: { pagePadding: 8, paragraphMargin: 12 },
    border: { radius: 4 },
    shadow: { enabled: false, value: "" },
  },
  layout: {
    preferredComponents: [
      "toc-nav",
      "steps",
      "code-frame",
      "callout-pro",
      "quote-card",
      "section-divider",
    ],
    density: "medium",
    tone: ["warm", "handmade"],
    defaultVariants: { "share-card": "warm" },
  },
  // 清晰指南独立骨架：magazine-cover / section-divider / divider，
  // 其余组件（含 code-frame）复用内置默认骨架，仅靠皮肤差异化。
  templates: clearGuideTemplates,
  codeTheme: "github",
};

// ============================================================
// 留白画册（极简白）
// ============================================================

const themeWhitespaceGallery: ThemeDefinition = {
  meta: {
    id: "whitespace-gallery",
    name: "留白画册",
    description: "极简白色调，大量留白，适合品牌展示和设计感内容",
    keywords: ["极简", "留白", "品牌", "设计"],
    version: "1.0.0",
  },
  tokens: {
    color: {
      primary: "#1a1a1a",
      primaryDark: "#000000",
      primaryLight: "#f4f1ec",
      secondary: "#8a857d",
      accent: "#b08d57",
      background: "#ffffff",
      bgSoft: "#f7f5f1",
      bgCard: "#ffffff",
      bgMuted: "#f2efe9",
      textStrong: "#111111",
      textNormal: "#3a3a3a",
      textSoft: "#9a958d",
      border: "#e3dfd6",
      borderSoft: "#efede7",
    },
    typography: {
      fontFamily:
        '"Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", "PingFang SC", serif',
      fontSize: "16px",
      lineHeight: "2.1",
      letterSpacing: 0.5,
      heading: {
        h1: {
          fontSize: 30,
          color: "#111111",
          marginTop: 30,
          marginBottom: 42,
          fontWeight: "300",
          preset: "bottom-border",
          presetColor: "#e3dfd6",
        },
        h2: {
          fontSize: 23,
          color: "#111111",
          marginTop: 56,
          marginBottom: 24,
          fontWeight: "400",
          preset: "bottom-border",
          presetColor: "#e3dfd6",
        },
        h3: {
          fontSize: 16,
          color: "#b08d57",
          marginTop: 38,
          marginBottom: 18,
          fontWeight: "700",
        },
        h4: {
          fontSize: 15,
          color: "#6b6b6b",
          marginTop: 28,
          marginBottom: 14,
          fontWeight: "700",
        },
      },
      codeFontFamily: '"SF Mono", Monaco, Consolas, monospace',
    },
    spacing: { pagePadding: 12, paragraphMargin: 16 },
    border: { radius: 0 },
    shadow: { enabled: false, value: "" },
  },
  layout: {
    preferredComponents: [
      "magazine-cover",
      "section-divider",
      "image-card",
      "quote-card",
      "full-quote",
      "stats-block",
      "styled-table",
      "timeline",
      "end-card",
    ],
    density: "low",
    tone: ["minimal", "elegant", "editorial"],
    defaultVariants: { "share-card": "minimal" },
  },
  // 留白画册独立骨架：magazine-cover / section-divider / divider / divider-fancy，
  // 其余组件（含 code-frame）复用内置默认骨架，仅靠皮肤差异化。
  templates: whitespaceGalleryTemplates,
  codeTheme: "github",
};

// ============================================================
// 学术论文（米白底 + 深墨蓝 + 深蓝卡片）
// 设计语言：原"全黑严谨"在微信白底下过于沉重且 primary 与 textStrong 相同。
// 改为米白底+深墨蓝字（可读），深蓝卡片承载学术权威感，
// serif 字体 + 双横线标题预设保持学术克制。
// ============================================================

const themeAcademicPaper: ThemeDefinition = {
  meta: {
    id: "academic-paper",
    name: "学术论文",
    description: "米白底配深墨蓝，严谨克制，适合论文、深度分析",
    keywords: ["学术", "论文", "严谨", "深度"],
    version: "2.0.0",
  },
  tokens: {
    color: {
      primary: "#1e3a5f",
      primaryDark: "#0f2540",
      primaryLight: "#e3eaf2",
      secondary: "#0f2540",
      accent: "#8b0000",
      background: "#fbfaf7",
      bgSoft: "#f4f2ec",
      // bgCard 保持浅色：深蓝"定理框"由皮肤对 quote-card/full-quote/end-card/cta-card
      // 硬编码 #0f2540 承载；若 token 设深蓝，共享的 qr-card/product-card/series-nav 等
      // 会深底深字不可读（见 playbook 第 2 条）。
      bgCard: "#fbfaf7",
      bgMuted: "#eeebe2",
      textStrong: "#0f1b2d",
      textNormal: "#2c3e50",
      textSoft: "#5a6a7a",
      border: "#c8c0a8",
      borderSoft: "#e0dccf",
    },
    typography: {
      fontFamily:
        '"Georgia", "Times New Roman", "STSong", SimSun, "PingFang SC", serif',
      fontSize: "16px",
      lineHeight: "1.8",
      letterSpacing: 0.2,
      heading: {
        h1: {
          fontSize: 24,
          color: "#0f1b2d",
          marginTop: 36,
          marginBottom: 18,
          fontWeight: "700",
          centered: true,
        },
        h2: {
          fontSize: 20,
          color: "#1e3a5f",
          marginTop: 28,
          marginBottom: 14,
          fontWeight: "600",
          preset: "bottom-border",
          presetColor: "#1e3a5f",
        },
        h3: {
          fontSize: 17,
          color: "#1e3a5f",
          marginTop: 22,
          marginBottom: 10,
          fontWeight: "600",
        },
        h4: {
          fontSize: 15,
          color: "#5a6a7a",
          marginTop: 18,
          marginBottom: 8,
          fontWeight: "600",
        },
      },
      codeFontFamily: '"Source Code Pro", Consolas, monospace',
    },
    spacing: { pagePadding: 8, paragraphMargin: 6 },
    border: { radius: 0 },
    shadow: { enabled: false, value: "" },
  },
  layout: {
    preferredComponents: ["stats-block", "styled-table", "toc-nav"],
    density: "medium",
    tone: ["serious", "rational"],
    defaultVariants: { "share-card": "minimal" },
  },
  // 学术论文独立骨架：magazine-cover / section-divider / divider / divider-fancy，
  // 其余组件（含 code-frame）复用内置默认骨架，仅靠皮肤差异化。
  templates: academicPaperTemplates,
  codeTheme: "github",
};

// ============================================================
// 知识库（知识档案库 · 墨蓝 + 索书号 + 衬线）
// 设计语言：文献档案馆。墨蓝 #31517f 主色 + 衬线标题（文献感）+ 等宽索书号。
// 条目头 / 档案章节头 / 档案袋 / 档案查询终端为私有骨架；深墨蓝档案袋配浅字。
// ============================================================

const themeKnowledgeBase: ThemeDefinition = {
  meta: {
    id: "knowledge-base",
    name: "知识库",
    description: "知识档案库：墨蓝主色 + 衬线标题 + 索书号，适合知识管理、文档系统",
    keywords: ["知识", "文档", "档案", "专业", "参考"],
    version: "1.0.0",
  },
  tokens: {
    color: {
      primary: "#31517f",
      primaryDark: "#223a5e",
      primaryLight: "#e6ebf3",
      secondary: "#6f7f5a",
      accent: "#31517f",
      background: "#fbf9f3",
      bgSoft: "#f1f4f9",
      bgCard: "#ffffff",
      bgMuted: "#eef0e8",
      textStrong: "#2a2622",
      textNormal: "#2a2622",
      textSoft: "#7a7265",
      border: "#ddd6c6",
      borderSoft: "#e8e1d2",
    },
    typography: {
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      fontSize: "15px",
      lineHeight: "1.9",
      letterSpacing: 0.01,
      heading: {
        h1: {
          fontSize: 26,
          color: "#2a2622",
          marginTop: 26,
          marginBottom: 16,
          fontWeight: "800",
          preset: "plain",
        },
        h2: {
          fontSize: 20,
          color: "#2a2622",
          marginTop: 26,
          marginBottom: 12,
          fontWeight: "800",
          preset: "plain",
        },
        h3: {
          fontSize: 17,
          color: "#2a2622",
          marginTop: 20,
          marginBottom: 10,
          fontWeight: "700",
        },
        h4: {
          fontSize: 13,
          color: "#31517f",
          marginTop: 16,
          marginBottom: 8,
          fontWeight: "700",
        },
      },
      codeFontFamily: '"SF Mono", "Cascadia Code", Consolas, monospace',
    },
    spacing: { pagePadding: 8, paragraphMargin: 6 },
    border: { radius: 0 },
    shadow: { enabled: true, value: "0 2px 6px rgba(60,52,42,0.05)" },
  },
  layout: {
    preferredComponents: ["toc-nav", "callout-pro", "code-frame", "quote-card", "timeline"],
    density: "low",
    tone: ["rational", "minimal", "editorial"],
  },
  // Phase 5：知识库定制档案骨架（条目头 / 档案章节头 / 档案袋 / 档案查询终端）
  templates: kbTemplates,
  codeTheme: "github-dark",
};

// ============================================================
// 黑金奢华（暖米底 + 黑金荣誉卡 + 金色贯穿）
// 设计语言：微信约束下 #wemd 不能设 background-color，正文区用暖米底+深棕字（可读且有奢华温度）。
// 黑金的"黑"由皮肤对签名卡硬编码深棕黑 #1a1410 承载（quote-card / full-quote / end-card /
// cta-card / hero-banner / magazine-cover），金字 + 金框；bgCard token 保持浅色，避免共享的
// qr-card / product-card / series-nav 等组件深底深字不可读（见 playbook 第 2 条）。
// 金色贯穿所有装饰元素（标题/边框/分隔线/圆点）。
// ============================================================

const themeLuxuryGold: ThemeDefinition = {
  meta: {
    id: "luxury-gold",
    name: "黑金奢华",
    description:
      "暖米底配深棕卡片，金色贯穿装饰，奢华高端，适合品牌营销、高端内容",
    keywords: ["奢华", "高端", "黑金", "品牌"],
    version: "2.0.0",
  },
  tokens: {
    color: {
      primary: "#d4af37",
      primaryDark: "#b8960c",
      primaryLight: "#fef3c7",
      secondary: "#c5a028",
      accent: "#d4af37",
      background: "#faf6ed",
      bgSoft: "#f5edd6",
      bgCard: "#fbf6ea",
      bgMuted: "#f0e6d0",
      textStrong: "#1f1410",
      textNormal: "#3d2818",
      textSoft: "#7a6450",
      border: "#d4af37",
      borderSoft: "#e8d196",
    },
    typography: {
      fontFamily:
        '"Georgia", "Times New Roman", "PingFang SC", "Microsoft YaHei", serif',
      fontSize: "16px",
      lineHeight: "1.9",
      letterSpacing: 0.4,
      heading: {
        h1: {
          fontSize: 30,
          color: "#d4af37",
          marginTop: 40,
          marginBottom: 22,
          fontWeight: "700",
          preset: "double-line",
          centered: true,
        },
        h2: {
          fontSize: 22,
          color: "#d4af37",
          marginTop: 30,
          marginBottom: 16,
          fontWeight: "600",
          preset: "left-border",
        },
        h3: {
          fontSize: 19,
          color: "#c5a028",
          marginTop: 24,
          marginBottom: 12,
          fontWeight: "600",
        },
        h4: {
          fontSize: 17,
          color: "#d4af37",
          marginTop: 20,
          marginBottom: 10,
          fontWeight: "600",
        },
      },
      codeFontFamily: '"Fira Code", Consolas, monospace',
    },
    spacing: { pagePadding: 10, paragraphMargin: 10 },
    border: { radius: 2 },
    shadow: { enabled: true, value: "0 4px 24px rgba(212,175,55,0.18)" },
  },
  layout: {
    preferredComponents: [
      "hero-banner",
      "magazine-cover",
      "full-quote",
      "end-card",
    ],
    density: "high",
    tone: ["elegant", "warm"],
    defaultVariants: { "share-card": "warm" },
  },
  // 黑金奢华独立骨架：magazine-cover / section-divider / divider / divider-fancy，
  // 其余组件（含 code-frame）复用内置默认骨架，仅靠皮肤差异化。
  templates: luxuryGoldTemplates,
  codeTheme: "github",
};

// ============================================================
// 莫兰迪森林（柔和自然）
// ============================================================

const themeMorandiForest: ThemeDefinition = {
  meta: {
    id: "morandi-forest",
    name: "莫兰迪森林",
    description: "莫兰迪色系，柔和自然，适合生活方式、情感类内容",
    keywords: ["莫兰迪", "柔和", "自然", "生活方式"],
    version: "1.0.0",
  },
  tokens: {
    color: {
      primary: "#7f9070",
      primaryDark: "#5f7053",
      primaryLight: "#d3dbc9",
      secondary: "#a9b89a",
      accent: "#c08f77",
      background: "#f5f2ea",
      bgSoft: "#ece7d9",
      bgCard: "#fbf9f2",
      bgMuted: "#eef0e8",
      textStrong: "#33382e",
      textNormal: "#4a5248",
      textSoft: "#6d7465",
      border: "#d9d5c6",
      borderSoft: "#e4dfd0",
    },
    typography: {
      fontFamily:
        '"Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", "PingFang SC", serif',
      fontSize: "16px",
      lineHeight: "2",
      letterSpacing: 0.3,
      heading: {
        h1: {
          fontSize: 28,
          color: "#33382e",
          marginTop: 30,
          marginBottom: 34,
          fontWeight: "700",
        },
        h2: {
          fontSize: 21,
          color: "#33382e",
          marginTop: 46,
          marginBottom: 18,
          fontWeight: "700",
          preset: "left-border",
          presetColor: "#7f9070",
        },
        h3: {
          fontSize: 17,
          color: "#46573e",
          marginTop: 30,
          marginBottom: 14,
          fontWeight: "700",
        },
        h4: {
          fontSize: 15,
          color: "#6d7465",
          marginTop: 26,
          marginBottom: 14,
          fontWeight: "700",
        },
      },
      codeFontFamily: '"SF Mono", Monaco, Consolas, monospace',
    },
    spacing: { pagePadding: 8, paragraphMargin: 12 },
    border: { radius: 12 },
    shadow: { enabled: false, value: "" },
  },
  layout: {
    preferredComponents: [
      "magazine-cover",
      "section-divider",
      "quote-card",
      "image-card",
      "timeline",
      "end-card",
    ],
    density: "low",
    tone: ["warm", "elegant", "organic"],
    defaultVariants: { "share-card": "warm" },
  },
  // 莫兰迪森林独立骨架：magazine-cover / section-divider / divider / quote-card / end-card，
  // 其余组件（含 code-frame）复用内置默认骨架，仅靠皮肤差异化（timeline 叶节点由皮肤改形）。
  templates: morandiForestTemplates,
  codeTheme: "github",
};

// ============================================================
// 编辑部手记（纸媒编辑部）
// ============================================================

const themeModernEditorial: ThemeDefinition = {
  meta: {
    id: "modern-editorial",
    name: "编辑部手记",
    description: "现代杂志排版风格，适合深度长文、编辑精选",
    keywords: ["杂志", "编辑", "深度", "长文"],
    version: "1.0.0",
  },
  tokens: {
    color: {
      primary: "#1c1a17",
      primaryDark: "#000000",
      primaryLight: "#f1ede2",
      secondary: "#33302b",
      accent: "#d0342c",
      background: "#faf8f2",
      bgSoft: "#f1ede2",
      bgCard: "#faf8f2",
      bgMuted: "#f1ede2",
      textStrong: "#1c1a17",
      textNormal: "#33302b",
      textSoft: "#6b6760",
      border: "#d9d3c4",
      borderSoft: "#e4ded0",
    },
    typography: {
      fontFamily:
        '"Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", "PingFang SC", serif',
      fontSize: "16px",
      lineHeight: "2",
      letterSpacing: 0.2,
      heading: {
        h1: {
          fontSize: 30,
          color: "#1c1a17",
          marginTop: 18,
          marginBottom: 22,
          fontWeight: "800",
        },
        h2: {
          fontSize: 24,
          color: "#1c1a17",
          marginTop: 40,
          marginBottom: 16,
          fontWeight: "800",
          preset: "bottom-border",
          presetColor: "#d9d3c4",
        },
        h3: {
          fontSize: 19,
          color: "#1c1a17",
          marginTop: 30,
          marginBottom: 14,
          fontWeight: "700",
        },
        h4: {
          fontSize: 14,
          color: "#d0342c",
          marginTop: 24,
          marginBottom: 12,
          fontWeight: "700",
        },
      },
      codeFontFamily: '"SF Mono", Monaco, Consolas, monospace',
    },
    spacing: { pagePadding: 8, paragraphMargin: 12 },
    border: { radius: 0 },
    shadow: { enabled: false, value: "" },
  },
  layout: {
    preferredComponents: [
      "magazine-cover",
      "section-divider",
      "full-quote",
      "quote-card",
      "stats-block",
      "end-card",
    ],
    density: "medium",
    tone: ["elegant", "serious", "editorial"],
    defaultVariants: { "share-card": "minimal" },
  },
  // 编辑部手记主题私有骨架：magazine-cover / section-divider / divider /
  // quote-card / full-quote / end-card，其余组件（含 code-frame）复用内置默认骨架。
  templates: modernEditorialTemplates,
  codeTheme: "github",
};

// ============================================================
// 购物小票（复古热敏纸）
// ============================================================

const themeReceipt: ThemeDefinition = {
  meta: {
    id: "receipt",
    name: "购物小票",
    description: "热敏小票风格，墨黑正文 + 小票红 + 虚线/点线分隔，趣味清单合集",
    keywords: ["复古", "趣味", "清单", "小票", "收银"],
    version: "1.0.0",
  },
  tokens: {
    color: {
      primary: "#cf2323",
      primaryDark: "#a01b1b",
      primaryLight: "#fbe4e4",
      secondary: "#6b675e",
      accent: "#cf2323",
      background: "#ffffff",
      bgSoft: "#f7f5ee",
      bgCard: "#ffffff",
      bgMuted: "#f2efe6",
      textStrong: "#1f1d1a",
      textNormal: "#1f1d1a",
      textSoft: "#6b675e",
      border: "#c9c4b5",
      borderSoft: "#e3ded0",
    },
    typography: {
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      fontSize: "15px",
      lineHeight: "1.9",
      letterSpacing: 0,
      heading: {
        h1: {
          fontSize: 24,
          color: "#1f1d1a",
          marginTop: 24,
          marginBottom: 14,
          fontWeight: "800",
          preset: "plain",
          centered: true,
        },
        h2: {
          fontSize: 18,
          color: "#1f1d1a",
          marginTop: 22,
          marginBottom: 10,
          fontWeight: "700",
          preset: "plain",
          centered: true,
        },
        h3: {
          fontSize: 16,
          color: "#1f1d1a",
          marginTop: 18,
          marginBottom: 8,
          fontWeight: "700",
        },
        h4: {
          fontSize: 14,
          color: "#cf2323",
          marginTop: 16,
          marginBottom: 6,
          fontWeight: "700",
        },
      },
      codeFontFamily: '"SF Mono", "Cascadia Code", Consolas, monospace',
    },
    spacing: { pagePadding: 6, paragraphMargin: 4 },
    border: { radius: 0 },
    shadow: { enabled: false, value: "none" },
  },
  layout: {
    preferredComponents: ["quote-card", "stats-block", "styled-table", "timeline", "divider"],
    density: "low",
    tone: ["playful", "minimal", "retro"],
  },
  // Phase 5：购物小票定制小票风骨架（票头/单号/虚线分隔/集章卡）
  templates: receiptTemplates,
  codeTheme: "github",
};

// ============================================================
// 落日胶片（胶片黄昏 · 落日橙 + 暮紫 + 颗粒漏光）
// 设计语言：一张刚冲印出来的 35mm 胶片。暖奶油纸 + 落日橙 #f2762e + 暮紫 #4a2f4e。
// 封面静帧 / 胶卷盘 / 暗房终端 / 齿孔片边为私有骨架；颗粒（SVG 噪点）与漏光为真实元素。
// ============================================================

const themeSunsetFilm: ThemeDefinition = {
  meta: {
    id: "sunset-film",
    name: "落日胶片",
    description: "胶片黄昏：落日橙 + 暮紫 + 颗粒漏光，适合旅行、摄影、故事、回忆类内容",
    keywords: ["胶片", "黄昏", "摄影", "旅行", "怀旧"],
    version: "1.0.0",
  },
  tokens: {
    color: {
      primary: "#f2762e",
      primaryDark: "#c45a1f",
      primaryLight: "#fde7d3",
      secondary: "#4a2f4e",
      accent: "#f2762e",
      background: "#f6f1ea",
      bgSoft: "#fffaf0",
      bgCard: "#fffaf0",
      bgMuted: "#f1e6d2",
      textStrong: "#352b2a",
      textNormal: "#352b2a",
      textSoft: "#8a7466",
      border: "#e2d5c2",
      borderSoft: "#efe3d0",
    },
    typography: {
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      fontSize: "15px",
      lineHeight: "1.9",
      letterSpacing: 0.01,
      heading: {
        h1: {
          fontSize: 26,
          color: "#352b2a",
          marginTop: 26,
          marginBottom: 16,
          fontWeight: "800",
          preset: "plain",
          centered: true,
        },
        h2: {
          fontSize: 20,
          color: "#352b2a",
          marginTop: 26,
          marginBottom: 12,
          fontWeight: "800",
          preset: "plain",
        },
        h3: {
          fontSize: 17,
          color: "#352b2a",
          marginTop: 20,
          marginBottom: 10,
          fontWeight: "700",
        },
        h4: {
          fontSize: 13,
          color: "#f2762e",
          marginTop: 16,
          marginBottom: 8,
          fontWeight: "700",
        },
      },
      codeFontFamily: '"SF Mono", "Cascadia Code", Consolas, monospace',
    },
    spacing: { pagePadding: 8, paragraphMargin: 6 },
    border: { radius: 0 },
    shadow: { enabled: false, value: "none" },
  },
  layout: {
    preferredComponents: ["quote-card", "image-card", "hero-banner", "timeline", "divider"],
    density: "low",
    tone: ["warm", "nostalgic", "editorial"],
  },
  // Phase 5：落日胶片定制胶片骨架（封面静帧 / 胶卷盘 / 暗房终端 / 齿孔片边）
  templates: sfTemplates,
  codeTheme: "github-dark",
};

// ============================================================
// 无声发布 · Silent Keynote
// 设计语言：一场发布会——黑屏开场 + 白场正文 + 黑屏收场。
// 唯一强调色 = 荧光橙（舞台灯光）；无衬线正文 + 等宽编号/参数。
// 封面/收场为深黑面板（浅字），正文区白场（深字）；#wemd 不设整篇背景。
// 带图封面（magazine-cover 扩展 image 槽）+ 章节编号拆分（number-prefix）
// + 黑屏收场（end-card）为私有骨架。
// ============================================================

const themeSilentKeynote: ThemeDefinition = {
  meta: {
    id: "silent-keynote",
    name: "无声发布",
    description: "黑屏开场 + 白场正文 + 荧光橙舞台光，发布会式极简，适合科技、产品发布、年度回顾",
    keywords: ["发布", "极简", "科技", "产品", "留白"],
    version: "1.0.0",
  },
  tokens: {
    color: {
      primary: "#ff4d00",
      primaryDark: "#d63d00",
      primaryLight: "#ffe8dd",
      secondary: "#ff8a5c",
      accent: "#ff4d00",
      background: "",
      bgSoft: "#f1f1ec",
      bgCard: "#ffffff",
      bgMuted: "#ecece6",
      textStrong: "#18181c",
      textNormal: "#18181c",
      textSoft: "#6f6f78",
      border: "#d9d9d2",
      borderSoft: "#e6e6e0",
    },
    typography: {
      fontFamily: '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif',
      fontSize: "16px",
      lineHeight: "1.9",
      letterSpacing: 0.01,
      heading: {
        h1: {
          fontSize: 28,
          color: "#18181c",
          marginTop: 28,
          marginBottom: 18,
          fontWeight: "900",
          preset: "plain",
        },
        h2: {
          fontSize: 22,
          color: "#18181c",
          marginTop: 30,
          marginBottom: 16,
          fontWeight: "800",
          preset: "plain",
        },
        h3: {
          fontSize: 18,
          color: "#18181c",
          marginTop: 24,
          marginBottom: 12,
          fontWeight: "700",
        },
        h4: {
          fontSize: 13,
          color: "#ff4d00",
          marginTop: 16,
          marginBottom: 8,
          fontWeight: "700",
        },
      },
      codeFontFamily: '"SF Mono", "Cascadia Code", Consolas, monospace',
    },
    spacing: { pagePadding: 8, paragraphMargin: 6 },
    border: { radius: 0 },
    shadow: { enabled: true, value: "0 12px 40px rgba(0,0,0,0.08)" },
  },
  layout: {
    preferredComponents: [
      "magazine-cover",
      "numbered-heading",
      "stats-block",
      "timeline",
      "styled-table",
      "quote-card",
      "end-card",
    ],
    density: "low",
    tone: ["modern", "minimal"],
  },
  // 无声发布定制骨架：带图封面 / 编号章节 / 黑屏收场 / 无声分隔线
  templates: skTemplates,
  // 主题级扩展槽：magazine-cover 封面图 + numbered-heading/section-title 编号拆分
  slotDefs: silentKeynoteSlotDefs,
  codeTheme: "github",
};

// ============================================================
// 故事集 · Storybook
// 设计语言：像翻开一本装帧精良的小说——纯图片封面叠层文字、暖纸白承载、
// 墨黑衬线正文、暮霞红唯一强调色。首屏封面 = 图 + 标题，沉浸式故事阅读。
// 封面（magazine-cover 扩展 image 槽：图 + 遮罩 + 叠层文字）、引子卡
// （text-card 扩展 title 槽）、章节分隔、金句、结尾为私有骨架。
// ============================================================

const themeStorybook: ThemeDefinition = {
  meta: {
    id: "storybook",
    name: "故事集",
    description:
      "纯图片封面 · 沉浸式故事阅读，暖纸衬线，适合短篇故事、个人叙事与旅行随笔",
    keywords: ["故事", "叙事", "小说", "随笔", "衬线"],
    version: "1.0.0",
  },
  tokens: {
    color: {
      primary: "#b5533a",
      primaryDark: "#8f3f2b",
      primaryLight: "#f0ded5",
      secondary: "#b5533a",
      accent: "#b5533a",
      background: "transparent",
      bgSoft: "#f7f2e8",
      bgCard: "#fbf7ee",
      bgMuted: "#efe7d6",
      textStrong: "#1f1a16",
      textNormal: "#33291f",
      textSoft: "#6b5f50",
      border: "#d8cbb2",
      borderSoft: "#e6dcc6",
    },
    typography: {
      fontFamily:
        '"Noto Serif SC", "Songti SC", "SimSun", "Source Han Serif SC", Georgia, serif',
      fontSize: "15.5px",
      lineHeight: "1.9",
      letterSpacing: 0.03,
      heading: {
        h1: {
          fontSize: 28,
          color: "#1f1a16",
          marginTop: 48,
          marginBottom: 22,
          fontWeight: "700",
          preset: "plain",
          letterSpacing: 0.5,
        },
        h2: {
          fontSize: 23,
          color: "#1f1a16",
          marginTop: 40,
          marginBottom: 18,
          fontWeight: "700",
          preset: "plain",
          letterSpacing: 0.5,
        },
        h3: {
          fontSize: 18,
          color: "#1f1a16",
          marginTop: 32,
          marginBottom: 14,
          fontWeight: "700",
        },
        h4: {
          fontSize: 14,
          color: "#b5533a",
          marginTop: 28,
          marginBottom: 12,
          fontWeight: "700",
          letterSpacing: 1,
        },
      },
      codeFontFamily: '"SF Mono", "Cascadia Code", Consolas, monospace',
    },
    spacing: { pagePadding: 8, paragraphMargin: 16 },
    border: { radius: 4 },
    shadow: { enabled: false, value: "none" },
  },
  layout: {
    preferredComponents: [
      {
        name: "magazine-cover",
        reason: "纯图片封面：图 + 标题 + 引子句叠层，首屏呈现故事开头",
      },
      {
        name: "text-card",
        reason: "引子卡：kicker「引子」+ 大字衬线正文，引导进入正文",
      },
      {
        name: "section-divider",
        reason: "章节分隔：壹/贰 + 章名 + 细线，分段不打断阅读",
      },
      {
        name: "quote-card",
        reason: "金句：居中双线 + 引号，情绪停顿点",
      },
      {
        name: "image-caption",
        reason: "场景图 + 图注，补充叙事与呼吸感",
      },
      {
        name: "end-card",
        reason: "结尾：「完」+ 后记，优雅收场",
      },
      { name: "callout", reason: "对话/旁白纸面块" },
      { name: "pullquote", reason: "原生引用居中呈现" },
    ],
    density: "low",
    tone: ["warm", "editorial", "nostalgic"],
  },
  // 故事集私有骨架：纯图封面 / 引子卡 / 章节分隔 / 金句 / 结尾
  templates: storybookTemplates,
  // 主题级扩展槽：magazine-cover 封面图 + text-card 引子标记
  slotDefs: storybookSlotDefs,
  codeTheme: "github",
};

// ============================================================
// 好物种草 · Shopping Guide
// ============================================================
const themeShoppingGuide: ThemeDefinition = {
  meta: {
    id: "shopping-guide",
    name: "好物种草",
    description:
      "温暖日杂买手感：实物摄影 + 编号标签 + 珊瑚橘价格签，适合好物推荐、开箱、种草清单",
    keywords: ["种草", "好物", "推荐", "购物", "清单"],
    version: "1.0.0",
  },
  tokens: {
    color: {
      primary: "#d9583b",
      primaryDark: "#b9442a",
      primaryLight: "#f6e5dc",
      secondary: "#d9583b",
      accent: "#d9583b",
      background: "transparent",
      bgSoft: "#faf6ef",
      bgCard: "#faf6ef",
      bgMuted: "#f4ecdd",
      textStrong: "#2a2520",
      textNormal: "#3a332c",
      textSoft: "#8a7f72",
      border: "#e5ddd0",
      borderSoft: "#ede5d6",
    },
    typography: {
      fontFamily:
        '"Noto Serif SC", "Songti SC", "SimSun", "Source Han Serif SC", Georgia, serif',
      fontSize: "15.5px",
      lineHeight: "1.9",
      letterSpacing: 0.02,
      heading: {
        h1: {
          fontSize: 28,
          color: "#2a2520",
          marginTop: 40,
          marginBottom: 16,
          fontWeight: "800",
          preset: "plain",
          letterSpacing: 0.5,
        },
        h2: {
          fontSize: 23,
          color: "#2a2520",
          marginTop: 40,
          marginBottom: 16,
          fontWeight: "800",
          preset: "plain",
          letterSpacing: 0.5,
        },
        h3: {
          fontSize: 18,
          color: "#2a2520",
          marginTop: 32,
          marginBottom: 14,
          fontWeight: "800",
        },
        h4: {
          fontSize: 14,
          color: "#d9583b",
          marginTop: 28,
          marginBottom: 12,
          fontWeight: "700",
          letterSpacing: 1,
        },
      },
      codeFontFamily: '"SF Mono", "Cascadia Code", Consolas, monospace',
    },
    spacing: { pagePadding: 8, paragraphMargin: 16 },
    border: { radius: 4 },
    shadow: { enabled: false, value: "none" },
  },
  layout: {
    preferredComponents: [
      {
        name: "magazine-cover",
        reason: "封面：实物大图 + kicker/大标题叠层，首屏种草氛围",
      },
      {
        name: "text-card",
        reason: "引言：筛选标准小标 + 大字推荐原则",
      },
      {
        name: "image-caption",
        reason: "好物卡：产品图 + 编号标签 + 价格签 + 推荐理由",
      },
      { name: "divider", reason: "好物之间细线分隔" },
      { name: "quote-card", reason: "金句 / 总结收束" },
      {
        name: "end-card",
        reason: "落款：短线 + 署名 + 日期",
      },
    ],
    density: "low",
    tone: ["warm", "editorial", "playful"],
  },
  // 好物种草私有骨架：封面 / 引言 / 好物卡 / 落款
  templates: shoppingGuideTemplates,
  // 主题级扩展槽：magazine-cover 封面图 + image-caption 好物字段拆分
  slotDefs: shoppingGuideSlotDefs,
  codeTheme: "github",
};

// ============================================================
// 美食图谱 · Food Atlas
// ============================================================
const themeFoodAtlas: ThemeDefinition = {
  meta: {
    id: "food-atlas",
    name: "美食图谱",
    description:
      "现代美食推荐风：暖橙主调 + 圆角卡片 + TOP 排名徽章 + 标签，适合美食探店、菜品图谱、好味清单",
    keywords: ["美食", "探店", "推荐", "图谱", "榜单"],
    version: "1.0.0",
  },
  tokens: {
    color: {
      primary: "#e87525",
      primaryDark: "#d96a24",
      primaryLight: "#fff8f1",
      secondary: "#e87525",
      accent: "#e87525",
      background: "transparent",
      bgSoft: "#fffaf5",
      bgCard: "#fffaf5",
      bgMuted: "#fff0df",
      textStrong: "#34251d",
      textNormal: "#4a3a2f",
      textSoft: "#7b6253",
      border: "#f1dfd0",
      borderSoft: "#f3e8dc",
    },
    typography: {
      fontFamily:
        '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", -apple-system, sans-serif',
      fontSize: "15.5px",
      lineHeight: "1.85",
      letterSpacing: 0.01,
      heading: {
        h1: {
          fontSize: 26,
          color: "#34251d",
          marginTop: 36,
          marginBottom: 16,
          fontWeight: "800",
          preset: "plain",
        },
        h2: {
          fontSize: 22,
          color: "#34251d",
          marginTop: 36,
          marginBottom: 16,
          fontWeight: "800",
          preset: "plain",
          presetColor: "#e87525",
        },
        h3: {
          fontSize: 18,
          color: "#34251d",
          marginTop: 30,
          marginBottom: 12,
          fontWeight: "700",
        },
        h4: {
          fontSize: 14,
          color: "#e87525",
          marginTop: 26,
          marginBottom: 12,
          fontWeight: "700",
          letterSpacing: 1,
        },
      },
      codeFontFamily: '"SF Mono", "Cascadia Code", Consolas, monospace',
    },
    spacing: { pagePadding: 8, paragraphMargin: 16 },
    border: { radius: 16 },
    shadow: { enabled: true, value: "0 6px 22px rgba(87,52,28,0.1)" },
  },
  layout: {
    preferredComponents: [
      {
        name: "magazine-cover",
        reason: "封面：美食大图 + 暖橙标语 + 标题叠层，首屏探店氛围",
      },
      {
        name: "text-card",
        reason: "引言：推荐语小标 + 大字开场",
      },
      {
        name: "image-caption",
        reason: "美食卡：全幅图 + TOP 徽章 + 菜名 + 门店 + 标签 + 描述",
      },
      { name: "divider", reason: "菜与菜之间细线分隔" },
      { name: "quote-card", reason: "金句 / 总结收束" },
      {
        name: "end-card",
        reason: "落款：短线 + 署名 + 日期",
      },
    ],
    density: "medium",
    tone: ["warm", "playful", "editorial"],
  },
  // 美食图谱私有骨架：封面 / 引言 / 美食卡 / 落款
  templates: foodAtlasTemplates,
  // 主题级扩展槽：magazine-cover 封面图 + image-caption 美食卡字段拆分
  slotDefs: foodAtlasSlotDefs,
  codeTheme: "github",
};

// ============================================================
// 民宿纪 · Stay Notes
// ============================================================
const themeStayNotes: ThemeDefinition = {
  meta: {
    id: "stay-notes",
    name: "民宿纪",
    description:
      "原木奶油·大地暖调民宿风：燕麦米白承载 + 暖木陶土 + 鼠尾草绿点缀，适合民宿推介、住一晚手记、度假清单",
    keywords: ["民宿", "酒店", "度假", "慢住", "山野"],
    version: "1.0.0",
  },
  tokens: {
    color: {
      primary: "#b06a44",
      primaryDark: "#955431",
      primaryLight: "#f7efe1",
      secondary: "#8d9a77",
      accent: "#b06a44",
      background: "transparent",
      bgSoft: "#f4efe5",
      bgCard: "#fdfaf3",
      bgMuted: "#f7efe1",
      textStrong: "#4d3d2f",
      textNormal: "#71624f",
      textSoft: "#b7a588",
      border: "#e7dfcd",
      borderSoft: "#e7dfcd",
    },
    typography: {
      fontFamily:
        '"Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", Georgia, serif',
      fontSize: "15.5px",
      lineHeight: "1.9",
      letterSpacing: 0.02,
      heading: {
        h1: {
          fontSize: 27,
          color: "#4d3d2f",
          marginTop: 38,
          marginBottom: 16,
          fontWeight: "700",
          preset: "plain",
        },
        h2: {
          fontSize: 22,
          color: "#4d3d2f",
          marginTop: 38,
          marginBottom: 16,
          fontWeight: "700",
          preset: "plain",
        },
        h3: {
          fontSize: 18,
          color: "#4d3d2f",
          marginTop: 30,
          marginBottom: 12,
          fontWeight: "700",
        },
        h4: {
          fontSize: 14,
          color: "#b06a44",
          marginTop: 26,
          marginBottom: 12,
          fontWeight: "700",
          letterSpacing: 2,
        },
      },
      codeFontFamily: '"SF Mono", "Cascadia Code", Consolas, monospace',
    },
    spacing: { pagePadding: 8, paragraphMargin: 16 },
    border: { radius: 16 },
    shadow: { enabled: true, value: "0 8px 26px rgba(90,60,25,0.08)" },
  },
  layout: {
    preferredComponents: [
      {
        name: "magazine-cover",
        reason: "封面：民宿暖光大图 + 腰牌小标 + 标题叠层，首屏住宿氛围",
      },
      {
        name: "text-card",
        reason: "导语：选房标准小标 + 大字开场",
      },
      {
        name: "image-caption",
        reason: "民宿卡：全幅图 + 木牌编号 + 价格签 + 店名 + 一句推荐",
      },
      { name: "divider", reason: "民宿与民宿之间细线分隔" },
      { name: "quote-card", reason: "主人的话 / 总结收束" },
      {
        name: "end-card",
        reason: "落款：短线 + 署名 + 日期",
      },
    ],
    density: "medium",
    tone: ["warm", "organic", "handmade"],
  },
  // 民宿纪私有骨架：封面 / 导语 / 民宿卡 / 落款
  templates: stayNotesTemplates,
  // 主题级扩展槽：magazine-cover 封面图 + image-caption 民宿卡字段拆分
  slotDefs: stayNotesSlotDefs,
  codeTheme: "github",
};

// ============================================================
// 晚晴 · Wanqing
// 设计语言：写给岁月的一份温柔——米纸承载、楷宋书卷气、赭橘唯一强调色、墨绿作叶脉辅助。
// 面向长辈的高可读性：大字（正文 17px+ / 行距 2）、高对比暖棕墨字压米纸、
// 宽呼吸、少装饰干扰、无盖章痕迹。封面用 background-image + 底部渐变叠字（position 会被公众号删除）。
// 开卷封面（magazine-cover 扩展 image 槽）+ 引子卡（text-card 首字下沉）+ 螺纹分隔（divider）
// + 引语（quote-card）+ 纯文字落款（end-card）为私有骨架。
// ============================================================

const themeWanqing: ThemeDefinition = {
  meta: {
    id: "wanqing",
    name: "晚晴",
    description:
      "写给岁月的一份温柔。米纸楷宋、赭橘暖调、大字高对比，适合老年情感、怀旧随笔、家常家书与岁月感悟",
    keywords: ["情感", "怀旧", "温情", "家书", "随笔", "楷体", "大字"],
    version: "1.0.0",
  },
  tokens: {
    color: {
      primary: "#a8613a",
      primaryDark: "#8f4f2d",
      primaryLight: "#f0e2d0",
      secondary: "#a8613a",
      accent: "#a8613a",
      background: "transparent",
      bgSoft: "#f6efe0",
      bgCard: "#fbf6ea",
      bgMuted: "#efe1c8",
      textStrong: "#3d3128",
      textNormal: "#3d3128",
      textSoft: "#6b5a4a",
      border: "#d6c49c",
      borderSoft: "#e4d6b8",
    },
    typography: {
      fontFamily:
        '"PingFang SC", "Microsoft YaHei", "Songti SC", "SimSun", sans-serif',
      fontSize: "17px",
      lineHeight: "2",
      letterSpacing: 0.02,
      heading: {
        h1: {
          fontSize: 28,
          color: "#3d3128",
          marginTop: 44,
          marginBottom: 20,
          fontWeight: "800",
          preset: "plain",
          letterSpacing: 0.8,
        },
        h2: {
          fontSize: 23,
          color: "#3d3128",
          marginTop: 38,
          marginBottom: 16,
          fontWeight: "800",
          preset: "plain",
          letterSpacing: 0.6,
        },
        h3: {
          fontSize: 19,
          color: "#3d3128",
          marginTop: 30,
          marginBottom: 12,
          fontWeight: "700",
        },
        h4: {
          fontSize: 14,
          color: "#a8613a",
          marginTop: 26,
          marginBottom: 10,
          fontWeight: "700",
          letterSpacing: 1,
        },
      },
      codeFontFamily: '"SF Mono", "Cascadia Code", Consolas, monospace',
    },
    spacing: { pagePadding: 8, paragraphMargin: 16 },
    border: { radius: 4 },
    shadow: { enabled: true, value: "0 18px 40px rgba(80,55,30,0.12)" },
  },
  layout: {
    preferredComponents: [
      {
        name: "magazine-cover",
        reason: "开卷封面：background-image 背景图 + 底部渐变叠字，首屏即「晚晴」",
      },
      {
        name: "text-card",
        reason: "引子卡：小标「写给岁月」+ 首字下沉 + 大字衬线正文",
      },
      {
        name: "quote-card",
        reason: "引语：上下赭橘双线 + 居中大字，情绪停顿点",
      },
      { name: "pullquote", reason: "原生引用：左侧赭橘竖条 + 楷体大字" },
      { name: "divider", reason: "螺纹分隔：发丝线 + ❖，分段呼吸" },
      { name: "image-caption", reason: "场景图 + 图注，补充叙事" },
      {
        name: "end-card",
        reason: "落款：淡线 + 落款标记 + 收束句，无声收场",
      },
    ],
    density: "low",
    tone: ["warm", "editorial", "nostalgic"],
  },
  // 晚晴私有骨架：background-image 封面 / 引子卡 / 螺纹分隔 / 引语 / 落款
  templates: wanqingTemplates,
  // 主题级扩展槽：magazine-cover 封面图 + text-card 引子标记 + end-card 落款
  slotDefs: wanqingSlotDefs,
  codeTheme: "github",
};

// ============================================================
// 导出
// ============================================================

/** 18 套可选的内置主题 */
export const builtInThemeDefinitions: ThemeDefinition[] = [
  themeDefault,
  themeDataBlueprint,
  themeEasternNotes,
  themeClearGuide,
  themeWhitespaceGallery,
  themeAcademicPaper,
  themeKnowledgeBase,
  themeLuxuryGold,
  themeMorandiForest,
  themeModernEditorial,
  themeReceipt,
  themeSunsetFilm,
  themeSilentKeynote,
  themeStorybook,
  themeShoppingGuide,
  themeFoodAtlas,
  themeStayNotes,
  themeWanqing,
];

/** 按 ID 查找内置主题定义 */
export function getBuiltInThemeDefinition(
  id: string,
): ThemeDefinition | undefined {
  return builtInThemeDefinitions.find((t) => t.meta.id === id);
}

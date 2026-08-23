/**
 * ThemeRenderer —— 从 ThemeDefinition JSON 生成完整 CSS
 *
 * 渲染管线：
 *   ThemeDefinition
 *     ├─ renderBaseCss()           → 基础重置样式
 *     ├─ renderTokenCss()          → #wemd { --wemd-* } 变量块
 *     ├─ renderTypographyCss()     → 段落/标题/列表排版
 *     ├─ renderComponentCss()      → 引用/代码/表格/图片/脚注
 *     ├─ injectVariantCss()        → 全部变体 CSS + overrides + 轨道 B AI variantCss
 *     ├─ injectCodeTheme()         → 代码高亮主题（github / github-dark）
 *     ├─ injectComponentStyles()   → 30 个 WeMD 组件默认样式
 *     ├─ renderExtrasCss()         → Callout / Mermaid / Imageflow
 *     └─ injectExtraCss()          → styles/components.css + extras.css（Phase 4）
 *
 *   → 拼接为完整 CSS 字符串
 */

import type {
  ThemeDefinition,
  ComponentStyleOverride,
} from "../theme-schema/types";
import type { SlotDef } from "../plugins/component/slotTypes";
import { renderBaseCss } from "./baseCss";
import { renderTokenCss } from "./tokenCss";
import { renderTypographyCss } from "./typographyCss";
import { renderComponentCss } from "./componentCss";
import { renderExtrasCss } from "./extrasCss";
import { VARIANT_CSS_MAP } from "../components/variants/variantCss";
import { codeGithubTheme } from "../themes/code-github";
import { codeGithubDarkTheme } from "../themes/code-github-dark";
import { componentStylesDefault } from "../themes/components-default";
import { componentStylesExtra } from "../themes/components-extra";
import { componentStylesExtended } from "../themes/components-extended";
import { componentStylesFaq } from "../themes/components-faq";
import { componentStylesMagazine } from "../themes/components-magazine";
import { componentStylesEasternNotes } from "../themes/components-eastern-notes";
import { componentStylesDataBlueprint } from "../themes/components-data-blueprint";
import { componentStylesClearGuide } from "../themes/components-clear-guide";
import { componentStylesWhitespaceGallery } from "../themes/components-whitespace-gallery";
import { componentStylesAcademicPaper } from "../themes/components-academic-paper";
import { componentStylesLuxuryGold } from "../themes/components-luxury-gold";
import { componentStylesMorandiForest } from "../themes/components-morandi-forest";
import { componentStylesModernEditorial } from "../themes/components-modern-editorial";
import { componentStylesReceipt } from "../themes/components-receipt";
import { componentStylesKnowledgeBase } from "../themes/components-knowledge-base";
import { componentStylesSunsetFilm } from "../themes/components-sunset-film";
import { componentStylesSilentKeynote } from "../themes/components-silent-keynote";
import { componentStylesStorybook } from "../themes/components-storybook";
import { componentStylesShoppingGuide } from "../themes/components-shopping-guide";
import { componentStylesFoodAtlas } from "../themes/components-food-atlas";
import { componentStylesStayNotes } from "../themes/components-stay-notes";
import { componentStylesWanqing } from "../themes/components-wanqing";

/**
 * 内置主题的专属组件级皮肤（覆盖共享组件样式，实现「同骨架 · 强差异化」）。
 * 以主题 id 为键，追加在所有共享组件样式与变体之后（最终视觉话语权）。
 * 其他主题未登记时沿用共享组件样式（仅靠 token 差异化）。
 */
const BUILTIN_THEME_COMPONENT_STYLES: Record<string, string> = {
  "eastern-notes": componentStylesEasternNotes,
  "data-blueprint": componentStylesDataBlueprint,
  "clear-guide": componentStylesClearGuide,
  "whitespace-gallery": componentStylesWhitespaceGallery,
  "academic-paper": componentStylesAcademicPaper,
  "luxury-gold": componentStylesLuxuryGold,
  "morandi-forest": componentStylesMorandiForest,
  "modern-editorial": componentStylesModernEditorial,
  receipt: componentStylesReceipt,
  "knowledge-base": componentStylesKnowledgeBase,
  "sunset-film": componentStylesSunsetFilm,
  "silent-keynote": componentStylesSilentKeynote,
  storybook: componentStylesStorybook,
  "shopping-guide": componentStylesShoppingGuide,
  "food-atlas": componentStylesFoodAtlas,
  "stay-notes": componentStylesStayNotes,
  wanqing: componentStylesWanqing,
};

/** renderTheme 扩展选项（Phase 4） */
export interface RenderThemeOptions {
  /** styles/components.css 内容 */
  componentsCss?: string;
  /** styles/extras.css 内容 */
  extrasCss?: string;
  /** 资源图片映射（key → base64 data URL），注入为 --wemd-asset-xxx CSS 变量 */
  assets?: Map<string, string>;
}

/**
 * 从主题定义（内置或 AI 生成）提取组件骨架模板 Map。
 *
 * 内置主题与 AI 生成主题（ThemePackageManifest）共用此入口：
 * 两者都通过 ThemeDefinition.templates 携带组件骨架，渲染链路无需区分来源。
 * 组件未在主题中声明时，由渲染器回退到内置默认骨架（defaultTemplates.ts）。
 */
export function getThemeTemplates(
  theme?: ThemeDefinition,
): Map<string, string> {
  return new Map(Object.entries(theme?.templates ?? {}));
}

/**
 * 从主题定义提取主题级扩展槽位 Map（组件 id → 追加槽位数组）。
 * 与 getThemeTemplates 同源：内置主题与 AI 生成主题共用 ThemeDefinition.slotDefs。
 * 组件未声明扩展槽时，解析器仅用共享 slotDefs（行为与现状一致）。
 */
export function getThemeSlotDefs(
  theme?: ThemeDefinition,
): Map<string, SlotDef[]> {
  return new Map(Object.entries(theme?.slotDefs ?? {}));
}

/**
 * 渲染完整的主题 CSS
 *
 * 按层拼接，顺序与 legacy buildThemeCss 严格对齐：
 *   1. renderBaseCss           基础重置（等价 basicTheme）
 *   2. renderTokenCss          --wemd-* 变量（等价 themeVars）
 *   3. renderTypographyCss     段落/标题/列表排版
 *   4. renderComponentCss      引用/代码/表格/图片/脚注元素样式
 *   5. injectCodeTheme         代码高亮主题（等价 codeTheme）
 *   6. injectComponentStyles   30 个 WeMD 组件默认样式（Default+Extra+Faq+Magazine）
 *   7. injectVariantCss        全部变体 CSS + overrides + 轨道 B AI variantCss（在最末）
 *   8. renderExtrasCss         Callout / Mermaid / Imageflow
 *   9. injectExtraCss          styles/components.css + extras.css（Phase 4）
 *
 * 顺序依赖：componentStyles 必须在 variantCss 之前（否则 variant 被默认覆盖）。
 */
export function renderTheme(
  theme: ThemeDefinition,
  options?: RenderThemeOptions,
): string {
  const parts: string[] = [
    renderBaseCss(),
    renderTokenCss(theme.tokens, options?.assets),
    renderTypographyCss(theme.tokens),
    renderComponentCss(theme.tokens),
    injectCodeTheme(theme.codeTheme),
    injectComponentStyles(),
    injectVariantCss(theme.components),
    renderExtrasCss(),
    injectExtraCss(options),
  ];

  // 内置主题专属组件皮肤：置于最末，覆盖共享组件样式（最终视觉话语权）
  const themedCss = BUILTIN_THEME_COMPONENT_STYLES[theme.meta.id];
  if (themedCss) {
    parts.push(`/* === ${theme.meta.name} · 主题皮肤 === */\n${themedCss}`);
  }

  return parts.filter(Boolean).join("\n\n");
}

/**
 * 规范化 AI 生成的 variant CSS，确保所有选择器都有 #wemd 前缀。
 *
 * 默认组件样式使用 #wemd .wemd-hero-banner（优先级 0,1,1,0），
 * 而 AI 生成的 variant CSS 通常使用 .wemd-hero-banner[data-variant="xxx"]（优先级 0,2,0）。
 * ID 选择器 (#wemd) 的优先级高于类/属性选择器，导致默认样式覆盖 AI 自定义样式。
 *
 * 本函数为缺少 #wemd 前缀的选择器自动添加，使优先级提升到 0,1,2,0，确保 AI 样式生效。
 */
function normalizeVariantCss(css: string): string {
  if (!css || css.includes("#wemd")) return css;

  // 逐条规则处理：找到 selector { 模式
  // 对每条规则，先剥离选择器中的注释用于判断，然后在原始选择器前添加 #wemd
  return css.replace(/([^{}]+)\{/g, (match, selectorGroup: string) => {
    const trimmed = selectorGroup.trim();

    // 剥离选择器中的注释，用于判断规则类型
    const cleanSelector = trimmed.replace(/\/\*[\s\S]*?\*\//g, "").trim();

    // 跳过 @ 规则（如 @media、@keyframes）
    if (cleanSelector.startsWith("@")) return match;
    // 跳过已经有 #wemd 的规则
    if (cleanSelector.startsWith("#wemd")) return match;

    // 用干净的（无注释）选择器来分割逗号
    // 然后在原始选择器字符串上定位每个选择器的位置并添加 #wemd
    const parts = cleanSelector
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // 在原始选择器中依次查找每个干净选择器，添加 #wemd 前缀
    let resultSelector = trimmed;
    for (const part of parts) {
      if (!part) continue;
      // 用 indexOf 在原始选择器中定位这个选择器
      const idx = resultSelector.indexOf(part);
      if (idx !== -1) {
        // 检查是否已经添加了 #wemd 前缀
        const before = resultSelector.substring(0, idx);
        if (!before.endsWith("#wemd ")) {
          resultSelector = before + "#wemd " + resultSelector.substring(idx);
        }
      }
    }

    return `${resultSelector} {`;
  });
}

/**
 * 注入变体 CSS
 *
 * 对 ThemeDefinition.components 里有自定义覆盖的组件，根据数据情况注入：
 *   - 有 AI 自定义 variantCss（轨道 B）：只注入 AI CSS，不注入内置变体 CSS
 *     （AI CSS 是完整的视觉替代，而非补丁，混合注入会导致样式冲突）
 *   - 无 AI variantCss 但有 variant：注入选定变体的内置 CSS
 *   - overrides（CSS 属性细粒度覆盖，如 { fontSize: "20px", borderWidth: "3px" }）
 *
 * 无组件定义时（向后兼容）：注入全部内置变体 CSS
 */
function injectVariantCss(
  components?: Record<string, ComponentStyleOverride>,
): string {
  const cssParts: string[] = [];

  if (components) {
    const compKeys = Object.keys(components);
    const hasVariantCss = Object.values(components).some((c) => c.variantCss);
    console.log(
      `[injectVariantCss] components keys (${compKeys.length}):`,
      compKeys.slice(0, 3),
      "...",
    );
    console.log(`[injectVariantCss] has variantCss:`, hasVariantCss);

    // 主题有明确的组件变体定义：只注入选中的变体
    for (const [compType, override] of Object.entries(components)) {
      if (!override.enabled) continue;

      // 安全检查：variantCssFree 标记在渲染前应已被翻译引擎移除
      if (override.variantCssFree) {
        console.warn(
          `[injectVariantCss] ${compType}: variantCssFree 标记仍存在，CSS 未翻译！`,
          `请在 renderTheme() 前调用 translateThemeFreeCss()。`,
        );
      }

      const variant = override.variant;
      const builtInVariants = VARIANT_CSS_MAP[compType];

      // 有 AI 自定义 variantCss 时：只注入 AI CSS，跳过内置变体 CSS
      // AI CSS 是完整的视觉替代，混合内置 CSS 会导致样式冲突
      if (override.variantCss) {
        // 规范化：确保 AI CSS 选择器有 #wemd 前缀，避免被默认组件样式覆盖
        cssParts.push(normalizeVariantCss(override.variantCss));
      } else {
        // 无 AI variantCss 时：注入选中变体的内置 CSS
        if (variant && builtInVariants?.[variant]) {
          cssParts.push(builtInVariants[variant]);
        }
      }

      // 注入细粒度 CSS 属性覆盖（无论是否有 AI variantCss，都追加）
      if (override.overrides) {
        const declarations = Object.entries(override.overrides)
          .map(([k, v]) => {
            const cssKey = k.replace(/[A-Z]/g, (ch) => `-${ch.toLowerCase()}`);
            return `  ${cssKey}: ${v};`;
          })
          .join("\n");
        if (declarations) {
          cssParts.push(
            `#wemd .wemd-component[data-type="${compType}"] {\n${declarations}\n}`,
          );
        }
      }
    }
  } else {
    // 无组件定义时（向后兼容）：注入全部内置变体 CSS
    for (const variants of Object.values(VARIANT_CSS_MAP)) {
      for (const css of Object.values(variants)) {
        cssParts.push(css);
      }
    }
  }

  return cssParts.length ? cssParts.join("\n\n") : "";
}

/**
 * 注入代码高亮主题 CSS
 */
function injectCodeTheme(codeTheme?: "github" | "github-dark"): string {
  return codeTheme === "github-dark" ? codeGithubDarkTheme : codeGithubTheme;
}

/**
 * 注入 30 个 WeMD 组件的默认样式
 *
 * 顺序：default → extra → extended → faq → magazine
 * 组件样式通过 var(--wemd-*) 引用主题色，实现跟随主题。
 */
function injectComponentStyles(): string {
  return [
    componentStylesDefault,
    componentStylesExtra,
    componentStylesExtended,
    componentStylesFaq,
    componentStylesMagazine,
  ].join("\n\n");
}

/**
 * 注入扩展 CSS（Phase 4）
 * - styles/components.css
 * - styles/extras.css
 */
function injectExtraCss(options?: RenderThemeOptions): string {
  if (!options) return "";
  const parts: string[] = [];
  if (options.componentsCss) {
    parts.push("/* styles/components.css */\n" + options.componentsCss);
  }
  if (options.extrasCss) {
    parts.push("/* styles/extras.css */\n" + options.extrasCss);
  }
  return parts.join("\n\n");
}

export {
  renderBaseCss,
  renderTokenCss,
  renderTypographyCss,
  renderComponentCss,
  renderExtrasCss,
};

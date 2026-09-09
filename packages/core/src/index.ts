export * from "./MarkdownParser";
export * from "./ThemeProcessor";
export * from "./themes";
export {
  renderTheme,
  getThemeTemplates,
  getThemeSlotDefs,
} from "./theme-renderer/index";
export type { RenderThemeOptions } from "./theme-renderer/index";
export { getVariantCss } from "./components/index";
export {
  builtInThemeDefinitions,
  getBuiltInThemeDefinition,
} from "./builtin-themes/index";
export type {
  ThemeDefinition,
  ThemeMeta,
  DesignTokens,
  ComponentStyleOverride,
  LayoutPreference,
} from "./theme-schema/types";
export {
  convertCssToWeChatDarkMode,
  convertToWeChatDarkMode,
} from "./wechatDarkMode";

// 微信公众号兼容规则（单一来源，供内联器/校验器/快照生成复用）
export {
  PSEUDO_ELEMENT_REGEX,
  STRUCTURAL_PSEUDO_REGEX,
  EXTERNAL_LINK_REGEX,
  FORBIDDEN_TAG_REGEX,
  ZIP_ASSET_URL_REGEX,
  FORBIDDEN_CSS_PATTERNS,
  FORBIDDEN_CSS_RULES,
} from "./wechatCompat/whitelist";
export type { ForbiddenCssRule } from "./wechatCompat/whitelist";

// CSS 简写家族表（内联简写顺序归一 + scan-shorthand 快照的真源）
export { SHORTHAND_FAMILIES } from "./ThemeProcessor";

// Theme Registry（Validator + Loader + 组件注册表）
export {
  validateThemePackageManifest,
  scanSvgSafety,
} from "./theme-registry/ThemeValidator";
export {
  loadThemePackageFromJSON,
  loadThemePackageFromZip,
  repackThemePackage,
} from "./theme-registry/themePackageLoader";
export type {
  LoadedThemePackage,
  LoaderResult,
  LoaderSuccess,
  LoaderFailure,
} from "./theme-registry/themePackageLoader";
export {
  LEGAL_COMPONENTS,
  LEGAL_COMPONENT_SET,
  BUILTIN_PRESET_VARIANTS,
  SUPPORTED_SDK_VERSIONS,
  LEGAL_DENSITY_VALUES,
} from "./theme-registry/componentRegistry";
export type { LegalComponent } from "./theme-registry/componentRegistry";
export type {
  ThemePackageManifest,
  ThemePackageAssets,
  ImageAsset,
  ValidationError,
  ValidationResult,
} from "./theme-schema/types";

// 组件 Slot 契约（骨架校验复用权威真源）
export {
  getBuiltinSlotDef,
  getComponentAbbr,
  getFallbackSlotDef,
} from "./plugins/component/slotDefs";
export { getComponentSampleMarkdown } from "./plugins/component/slotSamples";
export { exportThemeComponentGuide } from "./plugins/component/component-export";
export { buildAIGuide } from "./plugins/component/component-export";
export type {
  ComponentExportOptions,
  AIGuideOptions,
} from "./plugins/component/component-export";
export { parseSkeletonSlots } from "./plugins/component/skeletonSlotMap";
export type { SkeletonSlotInfo } from "./plugins/component/skeletonSlotMap";
export type {
  ComponentSlotDef,
  SlotDef,
  SlotType,
  SlotInputRule,
  ListItem,
} from "./plugins/component/slotTypes";

// CSS 翻译引擎（AI 两阶段翻译系统）
export {
  ALL_COMPONENT_ELEMENTS,
  describeElementsForPhase1,
  describeMappingForPhase2,
  translateComponentCss,
  translateBatchCss,
  translateThemeFreeCss,
} from "./css-translator";

export type {
  ComponentElement,
  ComponentElementsDef,
  AiAdapter,
  TranslationInput,
  TranslationResult,
} from "./css-translator";

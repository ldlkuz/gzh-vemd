/**
 * 主题公共模板片段库
 *
 * 定位：内置默认骨架（defaultTemplates.ts）是"所有主题兜底"；
 * 本库是"主题可复用的结构片段"，供各主题的 templates-<id>.ts 组装。
 *
 * 复用边界（判断要不要抽到这里）：
 * - 结构被多个主题共用、仅配色不同 → 抽公共片段，颜色交给主题 CSS（var / 具体色值）。
 * - 结构真正不同（印章字、竖排、特殊布局）→ 留在各主题 templates-<id>.ts 写差异。
 *
 * 产出都是完整组件模板（含外层 wemd-component 容器），可直接放进 ThemeDefinition.templates。
 */

/** 多色块分割线：墨线 + 三色块拼接（a 朱砂 / b 黛蓝 / c 赭石，颜色由主题 CSS 定） */
export const dividerMultiColor = (): string =>
  [
    '<section class="wemd-component wemd-divider" data-component="divider">',
    '<div class="wemd-component-body">',
    '<span class="wemd-dv-line wemd-dv-line-left">&nbsp;</span>',
    '<span class="wemd-dv-dot wemd-dv-dot-a">&nbsp;</span>',
    '<span class="wemd-dv-dot wemd-dv-dot-b">&nbsp;</span>',
    '<span class="wemd-dv-dot wemd-dv-dot-c">&nbsp;</span>',
    '<span class="wemd-dv-line wemd-dv-line-right">&nbsp;</span>',
    "</div>",
    "</section>",
  ].join("\n");

/**
 * 带印章的装饰分割线：左右线 + 朱砂印章 + 文字；无文字时回退装饰点。
 * @param sealText 印章内文字（如"笺"），由主题决定
 */
export const dividerFancySeal = (sealText: string): string =>
  [
    '<section class="wemd-component wemd-divider-fancy" data-component="divider-fancy">',
    '<section class="wemd-df-label">',
    '<span class="wemd-df-line wemd-df-line-left">&nbsp;</span>',
    "{{#if label}}",
    `<span class="wemd-df-seal">${sealText}</span>`,
    '<span class="wemd-df-text">{{slot:label}}</span>',
    "{{else}}",
    '<span class="wemd-df-dots">\u00B7 \u00B7 \u00B7</span>',
    "{{/if}}",
    '<span class="wemd-df-line wemd-df-line-right">&nbsp;</span>',
    "</section>",
    "</section>",
  ].join("\n");

/** 章节分隔：PART + 标题 + 双色线（a / b 两段，颜色由主题 CSS 定） */
export const sectionDividerDualLine = (): string =>
  [
    '<section class="wemd-component wemd-section-divider" data-component="section-divider">',
    '<section class="wemd-sd-part">{{slot:part}}</section>',
    '<section class="wemd-sd-title">{{slot:title}}</section>',
    '<section class="wemd-sd-line"><span class="wemd-sd-line-a">&nbsp;</span><span class="wemd-sd-line-b">&nbsp;</span></section>',
    "</section>",
  ].join("\n");

/** 行动卡片：标题 + 正文 + 按钮 + 底部双色条（a / b 两段，颜色由主题 CSS 定） */
export const ctaCardDualFoot = (): string =>
  [
    '<section class="wemd-component wemd-cta-card" data-component="cta-card">',
    '{{#if title}}<section class="wemd-cta-title">{{slot:title}}</section>{{/if}}',
    '{{#if body}}<section class="wemd-cta-body">{{slot:body}}</section>{{/if}}',
    '{{#if action}}<section class="wemd-cta-action">{{slot:action}}</section>{{/if}}',
    '<section class="wemd-cta-foot"><span class="wemd-cta-foot-a">&nbsp;</span><span class="wemd-cta-foot-b">&nbsp;</span></section>',
    "</section>",
  ].join("\n");

/** 强化提示框：body 槽 + 底部色条（多色拼接点睛，颜色由主题 CSS 定） */
export const calloutProFoot = (): string =>
  [
    '<section class="wemd-component wemd-callout-pro" data-component="callout-pro">',
    '<div class="wemd-component-body">{{slot:body}}</div>',
    '<span class="wemd-cp-foot">&nbsp;</span>',
    "</section>",
  ].join("\n");

/** 文末致谢：标题 + 副标题 + 落款印章（印章字由主题决定，替代默认 deco 装饰） */
export const endCardSeal = (sealText: string): string =>
  [
    '<section class="wemd-component wemd-end-card" data-component="end-card">',
    '{{#if title}}<section class="wemd-ec-title">{{slot:title}}</section>{{/if}}',
    '{{#if subtitle}}<section class="wemd-ec-subtitle">{{slot:subtitle}}</section>{{/if}}',
    '{{#if body}}<section class="wemd-ec-body">{{slot:body}}</section>{{/if}}',
    `<span class="wemd-ec-seal">${sealText}</span>`,
    "</section>",
  ].join("\n");

/** 金句卡片：引文 + 两侧色点 + 作者（带破折号）。侧点 / 破折号均为真实元素，微信可保留 */
export const quoteCardDualDot = (): string =>
  [
    '<section class="wemd-component wemd-quote-card" data-component="quote-card">',
    '<span class="wemd-qc-dot wemd-qc-dot-l">&nbsp;</span>',
    '<section class="wemd-qc-quote">{{slot:quote}}</section>',
    '{{#if author}}<section class="wemd-qc-author"><span class="wemd-qc-dash">——</span>{{slot:author}}</section>{{/if}}',
    '<span class="wemd-qc-dot wemd-qc-dot-r">&nbsp;</span>',
    "</section>",
  ].join("\n");

/** 行动卡片：印章圆标 + 标题 + 正文 + 按钮 + 底部双色条（真实元素，微信可保留） */
export const ctaCardSealFoot = (): string =>
  [
    '<section class="wemd-component wemd-cta-card" data-component="cta-card">',
    '<span class="wemd-cta-seal">笺</span>',
    '{{#if title}}<section class="wemd-cta-title">{{slot:title}}</section>{{/if}}',
    '{{#if body}}<section class="wemd-cta-body">{{slot:body}}</section>{{/if}}',
    '{{#if action}}<section class="wemd-cta-action">{{slot:action}}</section>{{/if}}',
    '<section class="wemd-cta-foot"><span class="wemd-cta-foot-a">&nbsp;</span><span class="wemd-cta-foot-b">&nbsp;</span></section>',
    "</section>",
  ].join("\n");

/** 大段引用：左上/右下双色直角装饰（真实元素承载，公众号兼容）。
   直角视觉由容器 background-image 渐变承载（见各主题皮肤），容器加
   `wemd-pq-cornered` 标记供物化器识别「已定制双角线 → 不注入共享引号」，
   不再放子 span（避免空元素/display:none 在微信被降级成可见点）。
   内容槽由原生 > 引用或 ::: pullquote 注入。 */
export const pullquoteCorners = (): string =>
  [
    '<section class="wemd-component wemd-pullquote wemd-pq-cornered" data-component="pullquote">',
    '<div class="wemd-component-body">{{slot:body}}</div>',
    "</section>",
  ].join("\n");

/** 杂志封面（文章开头页头）：印章 + 主标题 + 英文副标 + 双色线。还原"东方信笺"页头排版 */
export const magazineCoverSeal = (): string =>
  [
    '<section class="wemd-component wemd-magazine-cover" data-component="magazine-cover">',
    '<span class="wemd-mc-seal">笺</span>',
    '{{#if title}}<section class="wemd-mc-title">{{slot:title}}</section>{{/if}}',
    '{{#if subtitle}}<section class="wemd-mc-subtitle">{{slot:subtitle}}</section>{{/if}}',
    '<section class="wemd-mc-line"><span class="wemd-mc-line-a">&nbsp;</span><span class="wemd-mc-line-b">&nbsp;</span></section>',
    '{{#if desc}}<section class="wemd-mc-desc">{{slot:desc}}</section>{{/if}}',
    "</section>",
  ].join("\n");

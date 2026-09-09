/**
 * 莫兰迪森林 · 主题骨架模板（雾林 · 层林）
 *
 * 设计：按「层林」视觉稿（林冠垂饰 + 大编辑式章节号 + 悬挂果实金句 + 深松收束）规划，
 * 只写真正需要结构差异的组件。
 * - magazine-cover（层林封面：林冠叶片垂饰 + 小标 + 大标题 + 陶土雾线 + 描述 + 山形雾线）
 * - section-divider（大编辑式章节号：超大数字 + 标题 + 细线 + 叶片）
 * - divider（林冠分隔线：细线 + 垂坠叶片）
 * - quote-card（悬挂果实：卡顶藤蔓 + 垂坠陶土叶片）
 * - end-card（深松收束：顶部叶片林冠 + 标题 + 副标 + 雾线）
 * - 其余组件（timeline 叶节点 / stats-block / styled-table / steps / callout-pro /
 *   code-frame 等）复用内置默认骨架，仅靠皮肤差异化（timeline 圆点改叶形由皮肤实现）。
 *
 * 微信约束：所有装饰均为真实 DOM 元素（无伪元素、无结构伪类）。
 */

/** 层林封面：林冠叶片垂饰 + 小标 + 大标题 + 陶土雾线 + 描述 + 山形雾线（真实元素） */
export const morandiForestMagazineCover = (): string =>
  [
    '<section class="wemd-component wemd-magazine-cover" data-component="magazine-cover">',
    // 装饰元素均带 &nbsp; 真实内容（空元素会被公众号删除），皮肤以 font-size:0 隐形
    '<div class="wemd-mf-canopy">',
    '<span class="wemd-mf-vine">&nbsp;</span>',
    '<span class="wemd-mf-leaf">&nbsp;</span>',
    '<span class="wemd-mf-leaf wemd-mf-leaf-pine">&nbsp;</span>',
    '<span class="wemd-mf-leaf wemd-mf-leaf-mist">&nbsp;</span>',
    '<span class="wemd-mf-leaf">&nbsp;</span>',
    '<span class="wemd-mf-vine">&nbsp;</span>',
    "</div>",
    '{{#if subtitle}}<section class="wemd-mf-kicker">{{slot:subtitle}}</section>{{/if}}',
    '{{#if title}}<section class="wemd-mf-title">{{slot:title}}</section>{{/if}}',
    '<span class="wemd-mf-mistline">&nbsp;</span>',
    '{{#if desc}}<section class="wemd-mf-desc">{{slot:desc}}</section>{{/if}}',
    '<span class="wemd-mf-ridge">&nbsp;</span>',
    "</section>",
  ].join("\n");

/** 大编辑式章节号：超大数字 + 标题 + 细线 + 叶片（真实元素） */
export const morandiForestSectionDivider = (): string =>
  [
    '<section class="wemd-component wemd-section-divider" data-component="section-divider">',
    '<span class="wemd-mf-big">{{slot:part}}</span>',
    '<div class="wemd-mf-row">',
    '<section class="wemd-mf-title">{{slot:title}}</section>',
    '<span class="wemd-mf-line">&nbsp;</span>',
    '<span class="wemd-mf-leaf">&nbsp;</span>',
    "</div>",
    "</section>",
  ].join("\n");

/** 林冠分隔线：细线 + 垂坠叶片（真实元素） */
export const morandiForestDivider = (): string =>
  [
    '<section class="wemd-component wemd-divider" data-component="divider">',
    '<div class="wemd-component-body">',
    '<span class="wemd-mf-dline">&nbsp;</span>',
    '<span class="wemd-mf-drip"><span class="wemd-mf-leaf">&nbsp;</span></span>',
    '<span class="wemd-mf-drip"><span class="wemd-mf-leaf wemd-mf-leaf-mist">&nbsp;</span></span>',
    '<span class="wemd-mf-dline">&nbsp;</span>',
    "</div>",
    "</section>",
  ].join("\n");

/** 金句卡 · 悬挂果实：卡顶藤蔓 + 垂坠陶土叶片（真实元素） */
export const morandiForestQuoteCard = (): string =>
  [
    '<section class="wemd-component wemd-quote-card" data-component="quote-card">',
    '<span class="wemd-mf-hang"><span class="wemd-mf-stem">&nbsp;</span><span class="wemd-mf-leaf wemd-mf-leaf-clay">&nbsp;</span></span>',
    '<section class="wemd-qc-quote">{{slot:quote}}</section>',
    '{{#if author}}<section class="wemd-qc-author">{{slot:author}}</section>{{/if}}',
    "</section>",
  ].join("\n");

/** 结尾 · 深松收束：顶部叶片林冠 + 标题 + 副标 + 雾线（真实元素） */
export const morandiForestEndCard = (): string =>
  [
    '<section class="wemd-component wemd-end-card" data-component="end-card">',
    '<div class="wemd-mf-canopy">',
    '<span class="wemd-mf-leaf">&nbsp;</span>',
    '<span class="wemd-mf-leaf">&nbsp;</span>',
    '<span class="wemd-mf-leaf">&nbsp;</span>',
    "</div>",
    '{{#if title}}<section class="wemd-ec-title">{{slot:title}}</section>{{/if}}',
    '{{#if subtitle}}<section class="wemd-ec-subtitle">{{slot:subtitle}}</section>{{/if}}',
    '{{#if body}}<section class="wemd-ec-body">{{slot:body}}</section>{{/if}}',
    '<span class="wemd-mf-mistline">&nbsp;</span>',
    "</section>",
  ].join("\n");

export const morandiForestTemplates: Record<string, string> = {
  "magazine-cover": morandiForestMagazineCover(),
  "section-divider": morandiForestSectionDivider(),
  divider: morandiForestDivider(),
  "quote-card": morandiForestQuoteCard(),
  "end-card": morandiForestEndCard(),
};

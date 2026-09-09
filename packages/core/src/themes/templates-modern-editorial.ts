/**
 * 编辑部手记 · 主题私有骨架模板（纸媒编辑部 Newsroom Editorial）
 *
 * 设计：按「纸媒编辑部」视觉稿规划（左对齐编辑式排版：刊头 / 章节编辑号 / 栏线 /
 * 超大引号引语 / 版权页），只写真正需要结构差异的组件。
 * - magazine-cover（刊头：顶栏 + 大标题 + 粗细栏线 + 导语）
 * - section-divider（章节：编辑号 + 标题 + 细栏线）
 * - divider（栏线：粗线 + ◆ + 细线）
 * - quote-card（大引语：超大引号 + 引文 + 署名）
 * - full-quote（编辑式引语：超大引号 + 引文）
 * - end-card（版权页 colophon：标题 + 副标 + 分隔线 + 编辑名单）
 * - 其余组件（stats-block / timeline / styled-table / steps / callout-pro /
 *   code-frame 等）复用内置默认骨架，仅靠皮肤差异化。
 *
 * 微信约束：所有装饰均为真实 DOM 元素（无伪元素、无结构伪类）。
 */

/** 刊头：顶栏 + 大标题 + 粗细栏线 + 导语（真实元素） */
export const modernEditorialMagazineCover = (): string =>
  [
    '<section class="wemd-component wemd-magazine-cover" data-component="magazine-cover">',
    '<div class="wemd-me-topline">',
    '{{#if subtitle}}<span class="wemd-me-brand">{{slot:subtitle}}</span>{{/if}}',
    '<span class="wemd-me-tag">EDITORIAL</span>',
    "</div>",
    '{{#if title}}<section class="wemd-me-title">{{slot:title}}</section>{{/if}}',
    '<div class="wemd-me-rules">',
    '<span class="wemd-me-thick">&nbsp;</span>',
    '<span class="wemd-me-thin">&nbsp;</span>',
    "</div>",
    '{{#if desc}}<section class="wemd-me-desc">{{slot:desc}}</section>{{/if}}',
    "</section>",
  ].join("\n");

/** 章节：编辑号 + 标题 + 细栏线（真实元素） */
export const modernEditorialSectionDivider = (): string =>
  [
    '<section class="wemd-component wemd-section-divider" data-component="section-divider">',
    '<span class="wemd-me-no">{{slot:part}}</span>',
    '<section class="wemd-me-title">{{slot:title}}</section>',
    '<span class="wemd-me-rule">&nbsp;</span>',
    "</section>",
  ].join("\n");

/** 栏线：粗线 + ◆ + 细线（真实元素） */
export const modernEditorialDivider = (): string =>
  [
    '<section class="wemd-component wemd-divider" data-component="divider">',
    '<div class="wemd-component-body">',
    '<span class="wemd-me-thick">&nbsp;</span>',
    '<span class="wemd-me-glyph">\u25C6</span>',
    '<span class="wemd-me-thin">&nbsp;</span>',
    "</div>",
    "</section>",
  ].join("\n");

/** 大引语：引文 + 署名（真实元素，竖条由皮肤 border-left 表达） */
export const modernEditorialQuoteCard = (): string =>
  [
    '<section class="wemd-component wemd-quote-card" data-component="quote-card">',
    '<section class="wemd-qc-quote">{{slot:quote}}</section>',
    '{{#if author}}<section class="wemd-qc-author">{{slot:author}}</section>{{/if}}',
    "</section>",
  ].join("\n");

/** 编辑式引语：竖条 + 引文（真实元素） */
export const modernEditorialFullQuote = (): string =>
  [
    '<section class="wemd-component wemd-full-quote" data-component="full-quote">',
    '<section class="wemd-fq-text">{{slot:text}}</section>',
    "</section>",
  ].join("\n");

/** 版权页：标题 + 副标 + 分隔线 + 编辑名单（真实元素） */
export const modernEditorialEndCard = (): string =>
  [
    '<section class="wemd-component wemd-end-card" data-component="end-card">',
    '{{#if title}}<section class="wemd-ec-title">{{slot:title}}</section>{{/if}}',
    '{{#if subtitle}}<section class="wemd-ec-subtitle">{{slot:subtitle}}</section>{{/if}}',
    '{{#if body}}<section class="wemd-ec-body">{{slot:body}}</section>{{/if}}',
    '<span class="wemd-me-line">&nbsp;</span>',
    '{{#if deco}}<section class="wemd-me-editors">{{slot:deco}}</section>{{/if}}',
    "</section>",
  ].join("\n");

export const modernEditorialTemplates: Record<string, string> = {
  "magazine-cover": modernEditorialMagazineCover(),
  "section-divider": modernEditorialSectionDivider(),
  divider: modernEditorialDivider(),
  "quote-card": modernEditorialQuoteCard(),
  "full-quote": modernEditorialFullQuote(),
  "end-card": modernEditorialEndCard(),
};

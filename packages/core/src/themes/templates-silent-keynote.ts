/**
 * 无声发布主题 - 独立骨架（SILENT KEYNOTE）
 *
 * 需要结构差异的组件才定制骨架：
 * - magazine-cover   黑屏封面。槽位映射注意：共享解析 title=首行 / subtitle=次行，
 *                   故"eyebrow（首行斜体小字）"用 title 槽，"大标题（次行粗体）"用 subtitle 槽
 * - numbered-heading 章节编号（橙色编号 + 深色标题 行内）
 * - section-title    章节小标题（兼容无编号：纯深色标题）
 * - end-card         黑屏收场（同 magazine-cover 槽位映射：eyebrow←title、大标题←subtitle）
 * - divider          无声细线（等宽符号，中和共享 ::before/::after 防双线）
 * 其余组件复用内置默认骨架，由 components-silent-keynote.ts 皮肤差异化。
 * 所有装饰均为真实元素（topline / line / note / dots），无伪元素。
 */

export const skMagazineCover = (): string =>
  [
    '<section class="wemd-component wemd-magazine-cover" data-component="magazine-cover">',
    '<section class="wemd-sk-cover">',
    '<span class="wemd-sk-topline">&nbsp;</span>',
    '{{#if title}}<section class="wemd-sk-eyebrow">{{slot:title}}</section>{{/if}}',
    '{{#if subtitle}}<section class="wemd-sk-title">{{slot:subtitle}}</section>{{/if}}',
    '{{#if desc}}<section class="wemd-sk-sub">{{slot:desc}}</section>{{/if}}',
    '{{#if image}}<section class="wemd-sk-cover-img">{{slot:image}}</section>{{/if}}',
    '<span class="wemd-sk-note">SILENT KEYNOTE</span>',
    "</section>",
    "</section>",
  ].join("\n");

export const skNumberedHeading = (): string =>
  [
    '<section class="wemd-component wemd-numbered-heading" data-component="numbered-heading">',
    '<section class="wemd-sk-sec-head">',
    '{{#if part}}<span class="wemd-sk-sec-num">{{slot:part}}</span>{{/if}}',
    '<span class="wemd-sk-sec-body">{{slot:body}}</span>',
    "</section>",
    "</section>",
  ].join("\n");

export const skSectionTitle = (): string =>
  [
    '<section class="wemd-component wemd-section-title" data-component="section-title">',
    '<section class="wemd-sk-sec-head">',
    '{{#if part}}<span class="wemd-sk-sec-num">{{slot:part}}</span>{{/if}}',
    '<span class="wemd-sk-sec-body">{{slot:body}}</span>',
    "</section>",
    "</section>",
  ].join("\n");

export const skEndCard = (): string =>
  [
    '<section class="wemd-component wemd-end-card" data-component="end-card">',
    '<section class="wemd-sk-end">',
    '<span class="wemd-sk-end-line">&nbsp;</span>',
    '{{#if title}}<section class="wemd-sk-end-eyebrow">{{slot:title}}</section>{{/if}}',
    '{{#if subtitle}}<section class="wemd-sk-end-title">{{slot:subtitle}}</section>{{/if}}',
    '{{#if body}}<section class="wemd-ec-body">{{slot:body}}</section>{{/if}}',
    '{{#if deco}}<section class="wemd-sk-end-meta">{{slot:deco}}</section>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

export const skDivider = (): string =>
  [
    '<section class="wemd-component wemd-divider" data-component="divider">',
    '<section class="wemd-component-body">',
    '<span class="wemd-sk-dots">· · ·</span>',
    "</section>",
    "</section>",
  ].join("\n");

export const skTemplates: Record<string, string> = {
  "magazine-cover": skMagazineCover(),
  "numbered-heading": skNumberedHeading(),
  "section-title": skSectionTitle(),
  "end-card": skEndCard(),
  divider: skDivider(),
};

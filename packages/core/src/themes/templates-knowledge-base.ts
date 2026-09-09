/**
 * 知识库文章主题 - 独立骨架（知识档案库 Knowledge Archive）
 *
 * 只有真正需要结构差异的组件才定制骨架：
 * - magazine-cover  条目头（小标签 + 衬线标题 + 索书号元信息）
 * - section-divider 档案章节头（PART 编号 + 标题 + 细线）
 * - end-card        档案袋（小标签 + 衬线标题 + 元信息，深墨蓝）
 * - code-frame      档案查询终端（mac 红黄绿圆点 + 标题 + 代码）
 * 其余组件复用内置默认骨架，由 components-knowledge-base.ts 皮肤差异化。
 * 所有装饰均为真实元素（dot / line / label / meta），无伪元素。
 */

export const kbMagazineCover = (): string =>
  [
    '<section class="wemd-component wemd-magazine-cover" data-component="magazine-cover">',
    '{{#if subtitle}}<div class="wemd-kb-label">{{slot:subtitle}}</div>{{/if}}',
    '{{#if title}}<div class="wemd-kb-title">{{slot:title}}</div>{{/if}}',
    '{{#if desc}}<div class="wemd-kb-meta">{{slot:desc}}</div>{{/if}}',
    "</section>",
  ].join("\n");

export const kbSectionDivider = (): string =>
  [
    '<section class="wemd-component wemd-section-divider" data-component="section-divider">',
    '<div class="wemd-kb-sec-head">',
    '{{#if part}}<span class="wemd-kb-part">{{slot:part}}</span>{{/if}}',
    '{{#if title}}<span class="wemd-kb-sec-title">{{slot:title}}</span>{{/if}}',
    "</div>",
    '<span class="wemd-kb-sec-line">&nbsp;</span>',
    "</section>",
  ].join("\n");

export const kbEndCard = (): string =>
  [
    '<section class="wemd-component wemd-end-card" data-component="end-card">',
    '{{#if subtitle}}<div class="wemd-kb-bag-lbl">{{slot:subtitle}}</div>{{/if}}',
    '{{#if title}}<div class="wemd-kb-bag-title">{{slot:title}}</div>{{/if}}',
    '{{#if body}}<div class="wemd-ec-body">{{slot:body}}</div>{{/if}}',
    '{{#if deco}}<div class="wemd-kb-bag-meta">{{slot:deco}}</div>{{/if}}',
    "</section>",
  ].join("\n");

export const kbCodeFrame = (): string =>
  [
    '<section class="wemd-component wemd-code-frame" data-component="code-frame">',
    '<div class="wemd-cf-header">',
    '<span class="wemd-kb-dot wemd-kb-dot-r">&nbsp;</span>',
    '<span class="wemd-kb-dot wemd-kb-dot-y">&nbsp;</span>',
    '<span class="wemd-kb-dot wemd-kb-dot-g">&nbsp;</span>',
    '{{#if title}}<span class="wemd-cf-title">{{slot:title}}</span>{{/if}}',
    "</div>",
    '{{#if code}}<div class="wemd-cf-code">{{slot:code}}</div>{{/if}}',
    "</section>",
  ].join("\n");

export const kbTemplates: Record<string, string> = {
  "magazine-cover": kbMagazineCover(),
  "section-divider": kbSectionDivider(),
  "end-card": kbEndCard(),
  "code-frame": kbCodeFrame(),
};

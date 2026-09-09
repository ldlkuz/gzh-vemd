/**
 * 落日胶片主题 - 独立骨架（胶片黄昏 Sunset Film）
 *
 * 只有真正需要结构差异的组件才定制骨架：
 * - magazine-cover  封面静帧（kicker + 衬线标题 + sub + 颗粒 + 底缘光边）
 * - end-card        胶卷盘（lbl + 标题 + 元信息 + 颗粒，深紫黑）
 * - code-frame      暗房终端（mac 红黄绿圆点 + 标题 + 代码）
 * - divider         齿孔片边（中和共享 ::before/::after 双线，sprocket 渐变带）
 * 其余组件复用内置默认骨架，由 components-sunset-film.ts 皮肤差异化。
 * 所有装饰均为真实元素（grain / edge / strip / dot），无伪元素。
 */

export const sfMagazineCover = (): string =>
  [
    '<section class="wemd-component wemd-magazine-cover" data-component="magazine-cover">',
    '<div class="wemd-sf-frame">',
    '<span class="wemd-sf-grain">&nbsp;</span>',
    '{{#if subtitle}}<div class="wemd-sf-kicker">{{slot:subtitle}}</div>{{/if}}',
    '{{#if title}}<div class="wemd-sf-title">{{slot:title}}</div>{{/if}}',
    '{{#if desc}}<div class="wemd-sf-sub">{{slot:desc}}</div>{{/if}}',
    '<span class="wemd-sf-edge">&nbsp;</span>',
    "</div>",
    "</section>",
  ].join("\n");

export const sfEndCard = (): string =>
  [
    '<section class="wemd-component wemd-end-card" data-component="end-card">',
    '<span class="wemd-sf-grain">&nbsp;</span>',
    '{{#if subtitle}}<div class="wemd-sf-lbl">{{slot:subtitle}}</div>{{/if}}',
    '{{#if title}}<div class="wemd-sf-reel-title">{{slot:title}}</div>{{/if}}',
    '{{#if body}}<div class="wemd-ec-body">{{slot:body}}</div>{{/if}}',
    '{{#if deco}}<div class="wemd-sf-meta">{{slot:deco}}</div>{{/if}}',
    "</section>",
  ].join("\n");

export const sfCodeFrame = (): string =>
  [
    '<section class="wemd-component wemd-code-frame" data-component="code-frame">',
    '<div class="wemd-cf-header">',
    '<span class="wemd-sf-dot wemd-sf-dot-r">&nbsp;</span>',
    '<span class="wemd-sf-dot wemd-sf-dot-y">&nbsp;</span>',
    '<span class="wemd-sf-dot wemd-sf-dot-g">&nbsp;</span>',
    '{{#if title}}<span class="wemd-cf-title">{{slot:title}}</span>{{/if}}',
    "</div>",
    '{{#if code}}<div class="wemd-cf-code">{{slot:code}}</div>{{/if}}',
    "</section>",
  ].join("\n");

export const sfDivider = (): string =>
  [
    '<section class="wemd-component wemd-divider" data-component="divider">',
    '<div class="wemd-component-body">',
    '<span class="wemd-sf-sprocket">&nbsp;</span>',
    "</div>",
    "</section>",
  ].join("\n");

export const sfTemplates: Record<string, string> = {
  "magazine-cover": sfMagazineCover(),
  "end-card": sfEndCard(),
  "code-frame": sfCodeFrame(),
  divider: sfDivider(),
};

/**
 * 故事集主题 - 独立骨架（STORYBOOK）
 *
 * 需要结构差异的组件才定制骨架：
 * - magazine-cover  纯图片封面：图 + 深色遮罩 + 标题/副题/引子句叠层
 *   （槽位映射：title=主标题、subtitle=副题、desc=引子句；image 由扩展槽取自 body 首图）
 * - text-card       引子卡：kicker（title 扩展槽「引子」）+ 大字衬线正文
 * - section-divider 章节分隔：上细线 + 章标（壹/贰）+ 章名 + 下细线
 * - quote-card      金句：居中双线 + 引号 + 署名
 * - end-card        结尾：完 + 后记（title=「完」、subtitle=后记文字）
 * 其余组件复用内置默认骨架，由 components-storybook.ts 皮肤差异化。
 * 所有装饰均为真实元素（line / shade / rule），无伪元素。
 */

export const storyMagazineCover = (): string =>
  [
    '<section class="wemd-component wemd-magazine-cover" data-component="magazine-cover">',
    // 封面用 background-image（图床 URL）+ 底部渐变叠加，文字在正常流中靠 padding-top 压出图区、
    // 锚在底部。公众号会删除 position，不能用绝对定位叠字；background-image 是编辑器原生支持的方案。
    '<section class="wemd-sk-cover" style="background-image:linear-gradient(to top,rgba(15,10,7,0.82) 0%,rgba(15,10,7,0.32) 40%,rgba(15,10,7,0.06) 100%),url({{slot:imageUrl}});background-size:cover,cover;background-position:center,center;background-repeat:no-repeat;">',
    '{{#if title}}<h2 class="wemd-sk-heading">{{slot:title}}</h2>{{/if}}',
    '{{#if subtitle}}<p class="wemd-sk-subtitle">{{slot:subtitle}}</p>{{/if}}',
    '{{#if desc}}<p class="wemd-sk-opening">{{slot:desc}}</p>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

export const storyTextCard = (): string =>
  [
    '<section class="wemd-component wemd-text-card" data-component="text-card">',
    '<section class="wemd-sk-lead">',
    '{{#if title}}<span class="wemd-sk-lead-kicker">{{slot:title}}</span>{{/if}}',
    // 首字下沉 span 必须内联进正文 <p> 开头（与正文同一段落、文字紧邻其后绕排）。
    // 公众号编辑器对「段落内联浮动」保留，对「独立浮动 span（<p> 兄弟）」会丢失 float。
    // body 槽输出为裸文本（paragraph 源用 <br> 拼接、不带 <p>），
    // 故骨架把 p 放在最外层承载整段（含首字 span + 正文）。
    // 注：dropcap 不包 {{#if}} 条件——模板引擎不支持嵌套 {{#if}}，
    // 内层 {{#if dropcap}} 会以原文输出。改为始终渲染空 span（无内容时不占位）。
    '{{#if body}}<p class="wemd-sk-lead-body"><span class="wemd-sk-dropcap">{{slot:dropcap}}</span>{{slot:body}}</p>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

export const storySectionDivider = (): string =>
  [
    '<section class="wemd-component wemd-section-divider" data-component="section-divider">',
    '<section class="wemd-sk-chapter">',
    '{{#if part}}<span class="wemd-sk-chapter-part">{{slot:part}}</span>{{/if}}',
    '{{#if title}}<p class="wemd-sk-chapter-title">{{slot:title}}</p>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

export const storyQuoteCard = (): string =>
  [
    '<section class="wemd-component wemd-quote-card" data-component="quote-card">',
    '<section class="wemd-sk-quote">',
    '{{#if quote}}<p class="wemd-sk-quote-text">{{slot:quote}}</p>{{/if}}',
    '{{#if author}}<p class="wemd-sk-quote-author">{{slot:author}}</p>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

export const storyEndCard = (): string =>
  [
    '<section class="wemd-component wemd-end-card" data-component="end-card">',
    '<section class="wemd-sk-end">',
    '<span class="wemd-sk-end-rule">&nbsp;</span>',
    '{{#if title}}<p class="wemd-sk-end-mark">{{slot:title}}</p>{{/if}}',
    '{{#if heading}}<p class="wemd-sk-end-heading">{{slot:heading}}</p>{{/if}}',
    '{{#if subtitle}}<p class="wemd-sk-end-text">{{slot:subtitle}}</p>{{/if}}',
    '{{#if body}}<section class="wemd-ec-body">{{slot:body}}</section>{{/if}}',
    '<span class="wemd-sk-end-rule">&nbsp;</span>',
    "</section>",
    "</section>",
  ].join("\n");

/** 主题骨架 Map（组件 id → 模板字符串） */
export const storybookTemplates: Record<string, string> = {
  "magazine-cover": storyMagazineCover(),
  "text-card": storyTextCard(),
  "section-divider": storySectionDivider(),
  "quote-card": storyQuoteCard(),
  "end-card": storyEndCard(),
};

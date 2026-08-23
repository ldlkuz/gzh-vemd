/**
 * 晚晴主题 - 独立骨架（WANQING）
 *
 * 设计语言：写给岁月的一份温柔——米纸承载、楷宋书卷气、赭橘唯一强调色。
 * 面向长辈的高可读性：大字、高对比、宽行距、少装饰干扰、无盖章痕迹。
 * 需要结构差异的组件才定制骨架：
 * - magazine-cover   开卷封面：background-image（图床）+ 底部渐变叠字，文字正常流锚底部。
 *                    槽位映射（与无声发布同思路）：title=竖排意味的引子小标（首行）、
 *                    subtitle=大标题（次行）、desc=一句温情话。
 * - text-card        引子卡：小标 + 首字下沉 + 大字衬线正文（首字 span 内联进 <p>，
 *                    公众号保留段落内浮动）。
 * - divider          螺纹分隔：两侧发丝线 + 中央 ❖（真实元素，中和共享 ::before/::after）。
 * - quote-card       引语：上下双色角线 + 居中大字（不盖章，只留文字）。
 * - end-card         落款：淡线分隔 + 落款标记 + 收束句（纯文字，无印章）。
 * 其余组件复用内置默认骨架，由 components-wanqing.ts 皮肤差异化。
 * 所有装饰均为真实元素（thread / mark / rule），无伪元素。
 */

// 封面：background-image（图床 URL）+ 底部渐变叠加。公众号会删除 position，
// 禁止绝对定位叠字；background-image 是编辑器原生支持、两链路一致的方案。
export const wqMagazineCover = (): string =>
  [
    '<section class="wemd-component wemd-magazine-cover" data-component="magazine-cover">',
    '<section class="wemd-wq-cover" style="background-image:linear-gradient(to top,rgba(40,30,22,0.66) 0%,rgba(40,30,22,0.28) 46%,rgba(40,30,22,0.05) 100%),url({{slot:imageUrl}});background-size:cover,cover;background-position:center,center;background-repeat:no-repeat;">',
    '{{#if title}}<p class="wemd-wq-eyebrow">{{slot:title}}</p>{{/if}}',
    '{{#if subtitle}}<h2 class="wemd-wq-title">{{slot:subtitle}}</h2>{{/if}}',
    '{{#if desc}}<p class="wemd-wq-opening">{{slot:desc}}</p>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

// 引子卡：首字 span 内联进正文 <p> 开头（与正文同一段落、文字紧邻其后绕排），
// 公众号对「段落内联浮动」保留、对「独立浮动 span」会丢失 float。
// dropcap 不包 {{#if}}——模板引擎不支持嵌套 {{#if}}，直接渲染空 span。
export const wqTextCard = (): string =>
  [
    '<section class="wemd-component wemd-text-card" data-component="text-card">',
    '<section class="wemd-wq-lead">',
    '{{#if title}}<span class="wemd-wq-lead-kicker">{{slot:title}}</span>{{/if}}',
    '{{#if body}}<p class="wemd-wq-lead-body"><span class="wemd-wq-dropcap">{{slot:dropcap}}</span>{{slot:body}}</p>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

// 螺纹分隔：两侧发丝线 + 中央 ❖。共享 divider 的 ::before/::after 双线由皮肤中和。
export const wqDivider = (): string =>
  [
    '<section class="wemd-component wemd-divider" data-component="divider">',
    '<section class="wemd-wq-divider">',
    '<span class="wemd-wq-thread">&nbsp;</span>',
    '<span class="wemd-wq-mark">❖</span>',
    '<span class="wemd-wq-thread">&nbsp;</span>',
    "</section>",
    "</section>",
  ].join("\n");

// 引语：上下双色角线 + 居中大字（不加印章，只留文字）。
export const wqQuoteCard = (): string =>
  [
    '<section class="wemd-component wemd-quote-card" data-component="quote-card">',
    '<section class="wemd-wq-quote">',
    '{{#if quote}}<p class="wemd-wq-quote-text">{{slot:quote}}</p>{{/if}}',
    '{{#if author}}<p class="wemd-wq-quote-author">{{slot:author}}</p>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

// 落款：淡线分隔 + 落款标记（title）+ 收束句（subtitle），纯文字无印章。
export const wqEndCard = (): string =>
  [
    '<section class="wemd-component wemd-end-card" data-component="end-card">',
    '<section class="wemd-wq-end">',
    '<span class="wemd-wq-end-rule">&nbsp;</span>',
    '{{#if title}}<p class="wemd-wq-end-mark">{{slot:title}}</p>{{/if}}',
    '{{#if subtitle}}<p class="wemd-wq-end-text">{{slot:subtitle}}</p>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

/** 主题骨架 Map（组件 id → 模板字符串） */
export const wanqingTemplates: Record<string, string> = {
  "magazine-cover": wqMagazineCover(),
  "text-card": wqTextCard(),
  divider: wqDivider(),
  "quote-card": wqQuoteCard(),
  "end-card": wqEndCard(),
};
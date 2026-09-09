/**
 * 好物种草主题 - 独立骨架（SHOPPING GUIDE）
 *
 * 需要结构差异的组件才定制骨架：
 * - magazine-cover  纯图封面：图 + 深色遮罩 + kicker/大标题/副题叠层
 *   （槽位映射：title=kicker、subtitle=大标题、image=扩展槽首图、desc=副题+meta）
 * - text-card       引言：kicker（title 扩展槽）+ 大字引言正文
 * - image-caption   好物卡：图 + 编号标签 + 价格签 + 名称 + 推荐理由
 *   （扩展槽：image=首图、number=编号、title=名称、price=价格、body=理由）
 * - end-card        落款：短线 + 署名 + 日期
 * 其余组件复用内置默认骨架，由 components-shopping-guide.ts 皮肤差异化。
 * 所有装饰均为真实元素（shade / no / price / rule），无伪元素。
 */

export const shoppingMagazineCover = (): string =>
  [
    '<section class="wemd-component wemd-magazine-cover" data-component="magazine-cover">',
    // 封面用 background-image（图床 URL）+ 底部渐变叠加，文字正常流中靠 padding-top 压出图区。
    // 公众号会删除 position，不能绝对定位；background-image 是编辑器原生支持的方案。
    '<section class="wemd-sg-cover" style="background-image:linear-gradient(to top,rgba(25,18,12,0.78) 0%,rgba(25,18,12,0.28) 42%,rgba(25,18,12,0.06) 100%),url({{slot:imageUrl}});background-size:cover,cover;background-position:center,center;background-repeat:no-repeat;">',
    '{{#if title}}<p class="wemd-sg-cover-kicker">{{slot:title}}</p>{{/if}}',
    '{{#if subtitle}}<h2 class="wemd-sg-cover-title">{{slot:subtitle}}</h2>{{/if}}',
    '{{#if desc}}<p class="wemd-sg-cover-sub">{{slot:desc}}</p>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

export const shoppingTextCard = (): string =>
  [
    '<section class="wemd-component wemd-text-card" data-component="text-card">',
    '<section class="wemd-sg-intro">',
    '{{#if title}}<p class="wemd-sg-intro-tag">{{slot:title}}</p>{{/if}}',
    '{{#if body}}<p class="wemd-sg-intro-text">{{slot:body}}</p>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

export const shoppingImageCaption = (): string =>
  [
    '<section class="wemd-component wemd-image-caption" data-component="image-caption">',
    '<section class="wemd-sg-item">',
    // 好物图作 background-image（图床 URL），编号/价格在正常流中叠在图上：
    // 编号是 fig 首个内联元素（顶部左上角），fill 用 padding-top 压出图区高度，
    // 价格行 text-align:right 锚在底部右下角。全程无 position（公众号会删）。
    '<section class="wemd-sg-item-fig" style="background-image:url({{slot:imageUrl}});background-size:cover;background-position:center;background-repeat:no-repeat;">',
    '{{#if number}}<span class="wemd-sg-item-no">{{slot:number}}</span>{{/if}}',
    // fill 用 &nbsp; 真实内容（空元素会被公众号删除），font-size:0 隐形，padding-top 撑出图区
    '<p class="wemd-sg-item-fill">&nbsp;</p>',
    '{{#if price}}<p class="wemd-sg-item-price-row"><span class="wemd-sg-item-price">{{slot:price}}</span></p>{{/if}}',
    "</section>",
    '{{#if title}}<p class="wemd-sg-item-title">{{slot:title}}</p>{{/if}}',
    '{{#if body}}<p class="wemd-sg-item-desc">{{slot:body}}</p>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

export const shoppingEndCard = (): string =>
  [
    '<section class="wemd-component wemd-end-card" data-component="end-card">',
    '<section class="wemd-sg-signoff">',
    '<span class="wemd-sg-signoff-rule">&nbsp;</span>',
    '{{#if title}}<p class="wemd-sg-signoff-name">{{slot:title}}</p>{{/if}}',
    '{{#if subtitle}}<p class="wemd-sg-signoff-date">{{slot:subtitle}}</p>{{/if}}',
    "</section>",
    '{{#if body}}<section class="wemd-ec-body">{{slot:body}}</section>{{/if}}',
    "</section>",
  ].join("\n");

/** 主题骨架 Map（组件 id → 模板字符串） */
export const shoppingGuideTemplates: Record<string, string> = {
  "magazine-cover": shoppingMagazineCover(),
  "text-card": shoppingTextCard(),
  "image-caption": shoppingImageCaption(),
  "end-card": shoppingEndCard(),
};

/**
 * 民宿纪主题 - 独立骨架（STAY NOTES）
 *
 * 需要结构差异的组件才定制骨架：
 * - magazine-cover  民宿封面：腰牌小标 + 大标题 + 描述，background-image 图床铺底
 *   （槽位映射：title=腰牌、subtitle=大标题、desc=描述；image 由扩展槽取自 body 首图）
 * - text-card       导语：顶线 + 选房标准小标 + 大字引言
 * - image-caption   民宿卡：图 + 木牌编号 + 价格签 + 一店一名 + 精选理由
 *   （扩展槽：imageUrl=图、no=木牌编号、title=店名、price=价格、location=位置/含早/可住、
 *      slogan=一句推荐、body=推荐理由、tags=标签）
 * - end-card        落款：短线 + 署名 + 日期
 * 其余组件复用内置默认骨架，由 components-stay-notes.ts 皮肤差异化。
 * 所有装饰均为真实元素（rule / no / price / slogan），无伪元素、无 position（公众号兼容）。
 */

export const stayMagazineCover = (): string =>
  [
    '<section class="wemd-component wemd-magazine-cover" data-component="magazine-cover">',
    // 封面用 background-image（图床 URL）+ 底部渐变压暗，文字正常流中靠 padding-top 压出图区。
    // 公众号会删除 position，禁止绝对定位叠字；background-image 是编辑器原生支持的方案。
    '<section class="wemd-st-cover" style="background-image:linear-gradient(to top,rgba(41,28,15,0.85) 0%,rgba(41,28,15,0.38) 44%,rgba(41,28,15,0.05) 100%),url({{slot:imageUrl}});background-size:cover,cover;background-position:center,center;background-repeat:no-repeat;">',
    '{{#if title}}<p class="wemd-st-sign">{{slot:title}}</p>{{/if}}',
    '{{#if subtitle}}<h2 class="wemd-st-title">{{slot:subtitle}}</h2>{{/if}}',
    '{{#if desc}}<p class="wemd-st-caption">{{slot:desc}}</p>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

export const stayTextCard = (): string =>
  [
    '<section class="wemd-component wemd-text-card" data-component="text-card">',
    '<section class="wemd-st-intro">',
    '<span class="wemd-st-intro-rule">&nbsp;</span>',
    '{{#if title}}<p class="wemd-st-intro-tag">{{slot:title}}</p>{{/if}}',
    '{{#if body}}<p class="wemd-st-intro-text">{{slot:body}}</p>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

export const stayImageCaption = (): string =>
  [
    '<section class="wemd-component wemd-image-caption" data-component="image-caption">',
    '<section class="wemd-st-stay">',
    // 民宿图作 background-image（图床 URL），木牌编号/价格在正常流中叠在图上：
    // 编号是 fig 首个内联元素（顶部左上角），fill 用 &nbsp; 撑出图区高度，
    // 价格行 text-align:right 锚在底部右下角。全程无 position（公众号会删）。
    '<section class="wemd-st-fig" style="background-image:url({{slot:imageUrl}});background-size:cover;background-position:center;background-repeat:no-repeat;">',
    '{{#if no}}<span class="wemd-st-no">{{slot:no}}</span>{{/if}}',
    // fill 用 &nbsp; 真实内容（空元素会被公众号删除），font-size:0 隐形，padding-top 撑出图区
    '<p class="wemd-st-fill">&nbsp;</p>',
    '{{#if price}}<p class="wemd-st-price-row"><span class="wemd-st-price">{{slot:price}}</span></p>{{/if}}',
    "</section>",
    '<section class="wemd-st-inner">',
    '{{#if title}}<h3 class="wemd-st-name">{{slot:title}}</h3>{{/if}}',
    '{{#if slogan}}<p class="wemd-st-slogan">{{slot:slogan}}</p>{{/if}}',
    '{{#if location}}<p class="wemd-st-meta">{{slot:location}}</p>{{/if}}',
    '{{#if body}}<p class="wemd-st-desc">{{slot:body}}</p>{{/if}}',
    '{{#if tags}}<p class="wemd-st-tags">{{slot:tags}}</p>{{/if}}',
    "</section>",
    "</section>",
    "</section>",
  ].join("\n");

export const stayEndCard = (): string =>
  [
    '<section class="wemd-component wemd-end-card" data-component="end-card">',
    '<section class="wemd-st-signoff">',
    '<span class="wemd-st-signoff-rule">&nbsp;</span>',
    '{{#if title}}<p class="wemd-st-signoff-name">{{slot:title}}</p>{{/if}}',
    '{{#if subtitle}}<p class="wemd-st-signoff-date">{{slot:subtitle}}</p>{{/if}}',
    "</section>",
    '{{#if body}}<section class="wemd-ec-body">{{slot:body}}</section>{{/if}}',
    "</section>",
  ].join("\n");

/** 主题骨架 Map（组件 id → 模板字符串） */
export const stayNotesTemplates: Record<string, string> = {
  "magazine-cover": stayMagazineCover(),
  "text-card": stayTextCard(),
  "image-caption": stayImageCaption(),
  "end-card": stayEndCard(),
};

/**
 * 美食图谱主题 - 独立骨架（FOOD ATLAS）
 *
 * 需要结构差异的组件才定制骨架：
 * - magazine-cover  美食推荐封面：眼标 + 大标题 + 标语 + 描述，background-image 图床铺底
 *   （槽位映射：title=眼标、subtitle=大标题、desc=描述；image 由扩展槽取自 body 首图）
 * - text-card       引言：kicker（title 扩展槽）+ 大字引言
 * - image-caption   美食卡：图 + 排名徽章 + 菜名 + 门店 + 标签 + 描述
 *   （扩展槽：imageUrl=图、number=排名、title=菜名、location=门店、tags=标签、body=描述）
 * - end-card        落款：短线 + 署名 + 日期
 * 其余组件复用内置默认骨架，由 components-food-atlas.ts 皮肤差异化。
 * 所有装饰均为真实元素（rank / fill / tags），无伪元素、无 position（公众号兼容）。
 */
export const foodMagazineCover = (): string =>
  [
    '<section class="wemd-component wemd-magazine-cover" data-component="magazine-cover">',
    // 封面用 background-image（图床 URL）+ 右侧压暗渐变，文字正常流中靠 padding-top 压出图区
    '<section class="wemd-fa-cover" style="background-image:linear-gradient(90deg,rgba(42,24,15,0.94) 0%,rgba(42,24,15,0.70) 42%,rgba(42,24,15,0.10) 100%),url({{slot:imageUrl}});background-size:cover,cover;background-position:center,center;background-repeat:no-repeat;">',
    '{{#if title}}<p class="wemd-fa-hero-eyebrow">{{slot:title}}</p>{{/if}}',
    '{{#if subtitle}}<h2 class="wemd-fa-hero-title">{{slot:subtitle}}</h2>{{/if}}',
    '{{#if desc}}<p class="wemd-fa-hero-desc">{{slot:desc}}</p>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

export const foodTextCard = (): string =>
  [
    '<section class="wemd-component wemd-text-card" data-component="text-card">',
    '<section class="wemd-fa-intro">',
    '{{#if title}}<span class="wemd-fa-intro-tag">{{slot:title}}</span>{{/if}}',
    '{{#if body}}<p class="wemd-fa-intro-text">{{slot:body}}</p>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

export const foodImageCaption = (): string =>
  [
    '<section class="wemd-component wemd-image-caption" data-component="image-caption">',
    '<section class="wemd-fa-dish">',
    // 美食图作 background-image（图床 URL），排名徽章是 fig 首个内联元素（顶部左上角），
    // fill 用 &nbsp; 真实内容（空元素会被公众号删除）撑出图区；无 position。
    '<section class="wemd-fa-dish-fig" style="background-image:url({{slot:imageUrl}});background-size:cover;background-position:center;background-repeat:no-repeat;">',
    '{{#if number}}<span class="wemd-fa-dish-rank">{{slot:number}}</span>{{/if}}',
    '<p class="wemd-fa-dish-fill">&nbsp;</p>',
    "</section>",
    '{{#if title}}<h3 class="wemd-fa-dish-name">{{slot:title}}</h3>{{/if}}',
    '{{#if location}}<p class="wemd-fa-dish-location">{{slot:location}}</p>{{/if}}',
    '{{#if tags}}<p class="wemd-fa-dish-tags">{{slot:tags}}</p>{{/if}}',
    '{{#if body}}<p class="wemd-fa-dish-desc">{{slot:body}}</p>{{/if}}',
    "</section>",
    "</section>",
  ].join("\n");

export const foodEndCard = (): string =>
  [
    '<section class="wemd-component wemd-end-card" data-component="end-card">',
    '<section class="wemd-fa-signoff">',
    '<span class="wemd-fa-signoff-rule">&nbsp;</span>',
    '{{#if title}}<p class="wemd-fa-signoff-name">{{slot:title}}</p>{{/if}}',
    '{{#if subtitle}}<p class="wemd-fa-signoff-date">{{slot:subtitle}}</p>{{/if}}',
    "</section>",
    '{{#if body}}<section class="wemd-ec-body">{{slot:body}}</section>{{/if}}',
    "</section>",
  ].join("\n");

/** 主题骨架 Map（组件 id → 模板字符串） */
export const foodAtlasTemplates: Record<string, string> = {
  "magazine-cover": foodMagazineCover(),
  "text-card": foodTextCard(),
  "image-caption": foodImageCaption(),
  "end-card": foodEndCard(),
};

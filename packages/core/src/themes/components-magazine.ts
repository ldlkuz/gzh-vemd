/**
 * 杂志级组件样式
 *
 * 组件结构（全部 section 嵌套，兼容微信内联）：
 * - magazine-cover:
 *   .wemd-magazine-cover
 *     .wemd-mc-title       主标题
 *     .wemd-mc-subtitle    英文副标题
 *     .wemd-mc-divider     装饰线
 *     .wemd-mc-desc        描述文字
 *
 * - section-divider:
 *   .wemd-section-divider
 *     .wemd-sd-part        PART 编号
 *     .wemd-sd-title       章节标题
 *
 * - image-card:
 *   .wemd-image-card
 *     .wemd-ic-image       图片容器
 *     .wemd-ic-caption     图片说明
 *
 * - text-card:
 *   .wemd-text-card
 *     （内部是普通 markdown 内容）
 *
 * - full-quote:
 *   .wemd-full-quote
 *     .wemd-fq-text        引用文字（多段）
 *
 * - two-column-cards:
 *   .wemd-two-column-cards
 *     .wemd-vc-list     单列列表容器
 *       .wemd-vc-item   卡片项
 *         .wemd-vc-stripe  左侧强调色带
 *         .wemd-vc-body    内容区
 *           .wemd-vc-title 标题
 *           .wemd-vc-desc  描述
 *
 * - end-card:
 *   .wemd-end-card
 *     .wemd-ec-title       主标题
 *     .wemd-ec-subtitle    副标题
 *     .wemd-ec-deco        装饰元素
 */

export const componentStylesMagazine = `/* === magazine-cover 杂志封面卡片 === */
#wemd .wemd-magazine-cover {
  margin: 24px 0;
  padding: 40px 24px;
  background: var(--wemd-bg-card, #ffffff);
  border-radius: calc(var(--wemd-border-radius, 8px) + 10px);
  text-align: center;
  border: 1px solid var(--wemd-border-soft, #e8ebe8);
  box-sizing: border-box;
  box-shadow: var(--wemd-shadow, none);
}

#wemd .wemd-magazine-cover .wemd-mc-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--wemd-primary, #07c160);
  letter-spacing: 2px;
  line-height: 1.3;
}

#wemd .wemd-magazine-cover .wemd-mc-subtitle {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: var(--wemd-text-soft, #8a8a8a);
  letter-spacing: 1px;
}

#wemd .wemd-magazine-cover .wemd-mc-divider {
  margin: 20px auto;
  width: 60px;
  height: 4px;
  background: var(--wemd-primary, #07c160);
  border-radius: 2px;
}

#wemd .wemd-magazine-cover .wemd-mc-desc {
  margin: 0;
  font-size: 15px;
  line-height: 2;
  color: var(--wemd-text-soft, #666666);
}

/* === section-divider 章节分隔标题 === */
#wemd .wemd-section-divider {
  margin: 40px 0 20px 0;
  text-align: center;
}

#wemd .wemd-section-divider .wemd-sd-part {
  margin: 0;
  font-size: 15px;
  color: var(--wemd-primary, #07c160);
  letter-spacing: 2px;
  font-weight: 500;
}

#wemd .wemd-section-divider .wemd-sd-title {
  margin: 8px 0 0 0;
  font-size: 26px;
  font-weight: 700;
  color: var(--wemd-text-strong, #1a1a1a);
  line-height: 1.35;
}

/* === image-card 图片卡片 === */
#wemd .wemd-image-card {
  margin: 24px 0;
  padding: 8px;
  background: var(--wemd-bg-card, #ffffff);
  border-radius: calc(var(--wemd-border-radius, 8px) + 6px);
  box-shadow: var(--wemd-shadow, 0 4px 12px rgba(0, 0, 0, 0.06));
  box-sizing: border-box;
}

#wemd .wemd-image-card .wemd-ic-image {
  margin: 0;
  padding: 0;
}

#wemd .wemd-image-card .wemd-ic-image img {
  width: 100%;
  display: block;
  border-radius: calc(var(--wemd-border-radius, 8px) + 2px);
  margin: 0;
  padding: 0;
}

#wemd .wemd-image-card .wemd-ic-caption {
  margin: 8px 4px 2px 4px;
  font-size: 12px;
  color: var(--wemd-text-soft, #999999);
  text-align: center;
  line-height: 1.6;
}

/* === text-card 正文卡片（配合 article-section 全卡片化使用） === */
#wemd .wemd-text-card {
  margin: 16px 0;
  padding: 20px 22px;
  background: var(--wemd-bg-card, #ffffff);
  border-radius: calc(var(--wemd-border-radius, 8px) + 6px);
  box-shadow: var(--wemd-shadow, 0 2px 8px rgba(0, 0, 0, 0.04));
  box-sizing: border-box;
  line-height: 1.8;
  font-size: 15px;
  color: var(--wemd-text-normal, #333333);
}

#wemd .wemd-text-card p {
  margin: 0 0 14px 0;
  line-height: 1.8;
}

#wemd .wemd-text-card p:last-child {
  margin-bottom: 0;
}

/* === full-quote 整行引用卡片 === */
#wemd .wemd-full-quote {
  margin: 28px 0;
  padding: 22px 24px;
  background: var(--wemd-primary, #07c160);
  border-radius: calc(var(--wemd-border-radius, 8px) + 4px);
  text-align: center;
  box-sizing: border-box;
}

#wemd .wemd-full-quote .wemd-fq-text {
  margin: 0;
  color: #ffffff;
  font-size: 16px;
  line-height: 1.8;
}

#wemd .wemd-full-quote .wemd-fq-text + .wemd-fq-text {
  margin-top: 8px;
}

/* === two-column-cards 单列特性卡片（左色带）=== */
#wemd .wemd-two-column-cards {
  margin: 24px 0;
}

#wemd .wemd-two-column-cards .wemd-vc-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

#wemd .wemd-two-column-cards .wemd-vc-item {
  display: flex;
  align-items: stretch;
  gap: 12px;
  padding: 14px 12px;
  background: var(--wemd-bg-card, #ffffff);
  border: 1px solid var(--wemd-border, #e2e8f0);
  border-radius: calc(var(--wemd-border-radius, 8px) + 4px);
  box-shadow: var(--wemd-shadow, 0 1px 5px rgba(0, 0, 0, 0.04));
  min-width: 0;
  word-break: break-word;
}

#wemd .wemd-two-column-cards .wemd-vc-stripe {
  flex: none;
  align-self: stretch;
  width: 5px;
  border-radius: 3px;
  background: var(--wemd-primary, #5468ff);
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}

#wemd .wemd-two-column-cards .wemd-vc-body {
  flex: 1;
  min-width: 0;
  align-self: center;
}

#wemd .wemd-two-column-cards .wemd-vc-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--wemd-text-strong, #1a1a1a);
}

#wemd .wemd-two-column-cards .wemd-vc-desc {
  margin: 4px 0 0 0;
  font-size: 13px;
  line-height: 1.65;
  color: var(--wemd-text-soft, #475569);
}

/* === end-card 结尾致谢卡片 === */
#wemd .wemd-end-card {
  margin: 40px 0 20px 0;
  text-align: center;
}

#wemd .wemd-end-card .wemd-ec-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--wemd-primary, #07c160);
  letter-spacing: 1px;
}

#wemd .wemd-end-card .wemd-ec-subtitle {
  margin: 10px 0 0 0;
  font-size: 13px;
  color: var(--wemd-text-soft, #999999);
  line-height: 1.6;
}

/* end-card 正文承接：多段结语正文以可读段落呈现（容器居中，正文左对齐便于长文阅读） */
#wemd .wemd-end-card .wemd-ec-body,
#wemd .wemd-end-card .wemd-ec-body p {
  margin: 0 0 0 0;
  text-align: left;
  font-size: 16px;
  line-height: 1.75;
  /* 注意：正文段落色必须连 <p> 一起声明。全局 #wemd p 会直接给段落上色，
     仅改 section 会被继承丢失；深色底主题覆盖时应联动 p。 */
  color: var(--wemd-text-normal, #333333);
}

#wemd .wemd-end-card .wemd-ec-body > p {
  margin: 0 0 10px 0;
}

#wemd .wemd-end-card .wemd-ec-body > p:last-child {
  margin-bottom: 0;
}

#wemd .wemd-end-card .wemd-ec-deco {
  margin: 12px 0 0 0;
  font-size: 20px;
  opacity: 0.6;
}
`;

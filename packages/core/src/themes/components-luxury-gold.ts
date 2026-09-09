/**
 * 黑金奢华 · 主题皮肤（黑金荣誉证书风）
 *
 * 设计语言：一间暗金色调的高端会所 ——
 *   暖米纸底 #faf6ed · 深棕黑"荣誉卡" #1a1410（金字）· 鎏金 #d4af37 贯穿 ·
 *   Georgia 衬线 · 金边金点。
 * 场景：品牌营销 / 高端内容 / 产品发布 / 荣誉榜。
 *
 * 微信约束：
 * - #wemd 不设整篇背景（背景交给公众号编辑器），纸感用极淡渐变表达。
 * - 装饰全部真实 DOM / 边框 / 渐变，无伪元素、无结构伪类；
 *   仅用 `content: none` 中和共享 ::before（避免双条叠加）。
 * - 深色卡（黑金）一律配金/浅字（颜色冲撞检查点）。
 * - bgCard token 保持浅色：深棕黑只由皮肤对签名卡硬编码承载，
 *   避免共享 qr-card/product-card/series-nav 等深底深字（见 playbook 第 2 条）。
 * - code-frame 保持内置默认骨架与皮肤（本主题不定制代码块）。
 */

export const componentStylesLuxuryGold = `/* === 黑金奢华：荣誉证书 · 全局皮肤 === */

/* 全局：暖米纸感 + 深棕字 + 衬线（不写整篇背景色） */
#wemd {
  color: #3d2818;
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", "PingFang SC", serif;
  font-size: 16px;
  line-height: 1.95;
  letter-spacing: 0.03em;
  background-image: none;
}

/* 正文：深棕字，两端对齐 */
#wemd p {
  margin: 0 0 22px;
  color: #3d2818;
  font-size: 16px;
  line-height: 1.95;
  text-align: justify;
}
#wemd p b {
  color: #1a1410;
}

/* ---- 标题（金色贯穿） ---- */
#wemd h1 {
  margin: 30px 0 34px;
  padding: 0 0 20px;
  border: none;
  border-bottom: 1px solid #d4af37;
  text-align: center;
}
#wemd h1 .content {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  color: #b8960c;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.55;
  letter-spacing: 0.08em;
  text-wrap: balance;
}

/* h2：金 + 底部金线 */
#wemd h2 {
  margin: 42px 0 18px;
  padding: 0 0 12px;
  border: none;
  border-bottom: 1px solid #d4af37;
  text-align: left;
}
#wemd h2 .content {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  color: #a9860f;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-wrap: balance;
}

/* 章节标题组件（## 标题）——去掉共享 left-border 卡片皮肤，保留金线 */
#wemd .wemd-section-title {
  padding: 0;
  background: transparent;
  border-left: none;
  border-radius: 0;
}
#wemd .wemd-section-title .wemd-component-body > h2 {
  margin-top: 38px;
  margin-right: 0;
  margin-bottom: 18px;
  margin-left: 0;
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 12px;
  padding-left: 0;
  border-top: none;
  border-right: none;
  border-bottom: 1px solid #d4af37;
  border-left: none;
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 21px;
  font-weight: 700;
  color: #a9860f;
  letter-spacing: 0.04em;
  text-align: left;
}

/* h3 / h4：金 / 棕灰 */
#wemd h3 {
  margin: 28px 0 12px;
  padding: 0;
  border: none;
  text-align: left;
}
#wemd h3 .content {
  color: #b8960c;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-wrap: balance;
}
#wemd h4 {
  margin: 22px 0 10px;
  padding: 0;
  border: none;
  text-align: left;
}
#wemd h4 .content {
  color: #7a6450;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

/* ============================================================
   组件级差异化（覆盖共享组件样式，全部真实元素 / 边框表达）
   ============================================================ */

/* === magazine-cover · 黑金封面（骨架定制：内框容器 + 金色小标 + 标题 + 分隔 + 描述） === */
#wemd .wemd-magazine-cover {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin: 0 0 42px;
  padding: 20px;
  background: #16120d;
  background-image: linear-gradient(165deg, #241b12, #16120d 55%, #100d09);
  border: 1px solid #d4af37;
  border-radius: 2px;
  text-align: center;
  overflow: hidden;
}
/* 徽章：圆形「臻」金印（正常流居中，公众号兼容） */
#wemd .wemd-magazine-cover .wemd-lg-badge {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  width: 76px;
  height: 76px;
  margin: 0 auto 22px;
  border: 1px solid #b9922f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
#wemd .wemd-magazine-cover .wemd-lg-badge-ch {
  font-family: "Songti SC", "STSong", "Noto Serif SC", serif;
  font-size: 28px;
  font-weight: 600;
  color: #e6c97a;
}
#wemd .wemd-magazine-cover .wemd-lg-kicker {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 11px;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: #e6c97a;
}
#wemd .wemd-magazine-cover .wemd-lg-title {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin-top: 24px;
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.45;
  letter-spacing: 0.1em;
  color: #f8ecc4;
  background-image: linear-gradient(180deg, #f8ecc4 0%, #e6c97a 55%, #c09a4a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
#wemd .wemd-magazine-cover .wemd-lg-rule {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  display: block;
  width: 60px;
  height: 2px;
  margin: 26px auto 0;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-magazine-cover .wemd-lg-desc {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin-top: 18px;
  font-size: 13.5px;
  line-height: 1.9;
  color: #e2d4ae;
}
/* 底部纹样：旋转菱块 + ✦ + 细线（真实元素） */
#wemd .wemd-magazine-cover .wemd-lg-flourish {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin-top: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
#wemd .wemd-magazine-cover .wemd-lg-flourish .wemd-lg-sw {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #c9a24a;
  transform: rotate(45deg);
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-magazine-cover .wemd-lg-flourish .wemd-lg-d {
  font-size: 12px;
  line-height: 1;
  color: #b9922f;
  letter-spacing: 2px;
}
#wemd .wemd-magazine-cover .wemd-lg-flourish .wemd-lg-line {
  width: 44px;
  height: 1px;
  background: rgba(185, 146, 47, 0.45);
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}

/* === section-divider · 章节（骨架定制） === */
#wemd .wemd-section-divider {
  margin: 48px 0 24px;
  text-align: center;
}
#wemd .wemd-section-divider .wemd-lg-part {
  display: inline-block;
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: #e6c97a;
}
#wemd .wemd-section-divider .wemd-lg-title {
  margin-top: 8px;
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 23px;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.05em;
  color: #1f1410;
}
#wemd .wemd-section-divider .wemd-lg-rule {
  display: block;
  width: 56px;
  height: 2px;
  margin: 18px auto 0;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}

/* === divider · 金线 + ◆ + 金线（骨架定制） === */
#wemd .wemd-divider {
  margin: 40px 0;
}
#wemd .wemd-divider .wemd-component-body {
  display: flex;
  align-items: center;
  gap: 16px;
}
/* 中和共享 ::before/::after 实线，避免骨架金线与其叠加成双线 */
#wemd .wemd-divider .wemd-component-body::before,
#wemd .wemd-divider .wemd-component-body::after {
  content: none;
}
#wemd .wemd-lg-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-lg-glyph {
  color: #d4af37;
  font-size: 12px;
}

/* === divider-fancy · 金色装饰线（骨架定制） === */
#wemd .wemd-divider-fancy {
  margin: 40px 0;
}
#wemd .wemd-divider-fancy .wemd-df-label .wemd-df-line {
  height: 1px;
  background: linear-gradient(to right, transparent, #d4af37, transparent);
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-divider-fancy .wemd-df-label .wemd-df-text {
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 12px;
  letter-spacing: 0.24em;
  color: #b8960c;
  text-transform: uppercase;
}
#wemd .wemd-divider-fancy .wemd-df-label .wemd-df-dots {
  color: #d4af37;
}

/* === pullquote · 暖金引用（暖米底 + 金左条） === */
#wemd .wemd-pullquote {
  margin: 36px 0;
  padding: 26px 28px;
  background: #f5edd6;
  border-left: 4px solid #d4af37;
  border-radius: 0;
}
#wemd .wemd-pullquote .wemd-component-body blockquote p {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 18px;
  line-height: 1.95;
  color: #1f1410;
  font-weight: 600;
}

/* === quote-card · 黑金荣誉卡（深棕黑底 + 金字 + 顶部镀金饰带 + 双层金框） === */
#wemd .wemd-quote-card {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin: 40px 0;
  padding: 40px 30px 36px;
  background: linear-gradient(165deg, #241b12, #16120d);
  border: 1px solid #d4af37;
  border-left: 4px solid #d4af37;
  border-radius: 2px;
  box-shadow: none;
  text-align: center;
}
/* 顶部镀金饰带：双层金线（真实元素，正常流） */
#wemd .wemd-quote-card .wemd-lg-qband {
  display: block;
  margin: 0 auto 26px;
  width: 100%;
  height: 4px;
  border-top: 1px solid rgba(212, 175, 55, 0.7);
  border-bottom: 1px solid rgba(212, 175, 55, 0.4);
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-quote-card .wemd-qc-quote {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 20px;
  line-height: 2;
  color: #faf3e0;
  font-weight: 400;
  letter-spacing: 0.03em;
  text-align: center;
}
#wemd .wemd-quote-card .wemd-qc-author {
  margin-top: 18px;
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 11px;
  letter-spacing: 0.26em;
  color: #e6c97a;
  text-transform: uppercase;
}

/* === full-quote · 黑金大引言（深棕黑底 + 金字） === */
#wemd .wemd-full-quote {
  margin: 36px 0;
  padding: 42px 30px;
  background: linear-gradient(165deg, #241b12, #16120d);
  border: 1px solid #d4af37;
  border-left: 4px solid #d4af37;
  border-radius: 2px;
  text-align: center;
}
#wemd .wemd-full-quote .wemd-fq-text {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 19px;
  line-height: 2;
  color: #faf3e0;
  letter-spacing: 0.03em;
}

/* === text-card · 暖金正文卡（暖米底 + 金左条，浅底深字） === */
#wemd .wemd-text-card {
  margin: 28px 0;
  padding: 26px 28px;
  background: #fbf6ea;
  border: 1px solid #e8d196;
  border-left: 3px solid #d4af37;
  border-radius: 2px;
  box-shadow: none;
  font-size: 15.5px;
  line-height: 1.95;
  color: #3d2818;
}
#wemd .wemd-text-card p {
  margin: 0 0 14px;
  color: #3d2818;
}
#wemd .wemd-text-card p b {
  color: #1a1410;
}

/* === callout / callout-pro · 暖金提示（米底 + 金条） === */
#wemd .wemd-callout {
  margin: 28px 0;
  padding: 20px 22px;
  background: #f5edd6;
  border: 1px solid #e8d196;
  border-left: 3px solid #d4af37;
  border-radius: 2px;
}
#wemd .wemd-callout .wemd-component-body > p {
  color: #3d2818;
  font-size: 15px;
  line-height: 1.95;
}
#wemd .wemd-callout .wemd-component-body > p strong {
  color: #b8960c;
}
#wemd .wemd-callout-pro {
  margin: 28px 0;
  padding: 18px 22px;
  background: #fbf6ea;
  border: 1px solid #e8d196;
  border-left: 3px solid #d4af37;
  border-radius: 2px;
  box-shadow: none;
  transform: none;
}
#wemd .wemd-callout-pro::before {
  content: none;
}
#wemd .wemd-callout-pro .wemd-component-body > p {
  font-size: 15px;
  line-height: 1.95;
  color: #3d2818;
  margin: 0;
}
#wemd .wemd-callout-pro .wemd-component-body > p b {
  color: #b8960c;
}

/* === stats-block · 数据（暖金卡 + 金字数字） === */
#wemd .wemd-stats-block {
  margin: 32px 0;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
}
#wemd .wemd-stats-block .wemd-sb-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
#wemd .wemd-stats-block .wemd-sb-items-item {
  flex: 1;
  min-width: 150px;
  margin: 0;
  padding: 22px 20px;
  background: #fbf6ea;
  border: 1px solid #e8d196;
  border-radius: 2px;
  box-shadow: 0 4px 18px rgba(180, 150, 12, 0.08);
}
#wemd .wemd-stats-block .wemd-sb-items-value {
  color: #b8960c;
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
#wemd .wemd-stats-block .wemd-sb-items-label {
  margin-top: 8px;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: #7a6450;
  line-height: 1.6;
}

/* === timeline · 金色时间线（金点 + 金线） === */
#wemd .wemd-timeline {
  margin: 28px 0;
  padding: 26px 26px;
  background: #fbf6ea;
  border: 1px solid #e8d196;
  border-radius: 2px;
}
#wemd .wemd-timeline .wemd-tl-title {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 16px;
  font-weight: 700;
  color: #1f1410;
  letter-spacing: 0.06em;
  margin-bottom: 14px;
}
#wemd .wemd-timeline .wemd-tl-events {
  border-left: 1px solid #e8d196;
  margin-left: 6px;
}
#wemd .wemd-timeline .wemd-tl-dot {
  background: #d4af37;
  border: 2px solid #fbf6ea;
  box-shadow: 0 0 0 2px #e8d196;
}
#wemd .wemd-timeline .wemd-tl-text {
  color: #3d2818;
}

/* === styled-table · 金色表格（金表头 + 发丝行线） === */
#wemd .wemd-styled-table .wemd-sbt-table {
  border: 1px solid #e8d196;
  border-radius: 2px;
  overflow: hidden;
  background: #fbf6ea;
}
#wemd .wemd-styled-table .wemd-sbt-table table th {
  background: #f5edd6;
  color: #1f1410;
  font-weight: 700;
  text-align: left;
  padding: 12px 15px;
  font-size: 13px;
  letter-spacing: 0.06em;
  border-bottom: 2px solid #d4af37;
}
#wemd .wemd-styled-table .wemd-sbt-table table td {
  padding: 12px 15px;
  border-top: 1px solid #efe2c2;
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 13px;
  color: #3d2818;
}

/* === 图片类 · 暖金画框 === */
#wemd .wemd-image-card {
  margin: 36px 0;
  padding: 8px;
  background: #fbf6ea;
  border: 1px solid #e8d196;
  border-radius: 2px;
  box-shadow: none;
}
#wemd .wemd-image-card .wemd-ic-image img {
  border-radius: 0;
}
#wemd .wemd-image-card .wemd-ic-caption {
  margin: 12px 4px 4px;
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #7a6450;
}
#wemd .wemd-image-caption .wemd-component-body p {
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #7a6450;
  font-style: normal;
}
#wemd .wemd-image-caption .wemd-component-body p em {
  color: #7a6450;
  font-style: normal;
}
#wemd .wemd-image-grid .wemd-component-body p img {
  border: 1px solid #e8d196;
  border-radius: 0;
}
#wemd .wemd-image-compare .wemd-component-body figure {
  border: 1px solid #e8d196;
  border-radius: 0;
}
#wemd .wemd-image-compare .wemd-component-body figure img {
  border-radius: 0;
}
#wemd .wemd-image-text-row {
  margin: 28px 0;
  background: transparent;
  border: 1px solid #e8d196;
  border-radius: 2px;
  padding: 18px;
}
#wemd .wemd-image-text-row .wemd-component-body p {
  color: #3d2818;
}

/* === toc-nav · 金色目录（米底 + 金编号） === */
#wemd .wemd-toc-nav {
  margin: 20px 0;
  padding: 24px 26px;
  background: #fbf6ea;
  border: 1px solid #e8d196;
  border-radius: 2px;
}
#wemd .wemd-toc-nav .wemd-component-body > p:first-child {
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #b8960c;
  margin: 0 0 14px;
}
#wemd .wemd-toc-nav .wemd-component-body ul,
#wemd .wemd-toc-nav .wemd-component-body ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
#wemd .wemd-toc-nav .wemd-component-body li {
  padding: 11px 0;
  border-bottom: 1px dashed #e8d196;
  font-size: 15px;
  line-height: 1.8;
  color: #1f1410;
}
#wemd .wemd-toc-nav .wemd-component-body li span.toc-num {
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #b8960c;
  min-width: 30px;
}

/* === steps · 金色步骤（暖金卡 + 金序号） === */
#wemd .wemd-steps {
  margin: 26px 0;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
}
#wemd .wemd-steps .wemd-component-body {
  padding: 0;
}
#wemd .wemd-steps .wemd-component-body > p:first-child {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #1f1410;
  margin: 0 0 16px;
}
#wemd .wemd-steps .wemd-component-body ol,
#wemd .wemd-steps .wemd-component-body ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
#wemd .wemd-steps .wemd-component-body li {
  margin: 0 0 14px;
  padding: 18px 20px 18px 56px;
  background: #fbf6ea;
  border: 1px solid #e8d196;
  border-radius: 2px;
  font-size: 15px;
  line-height: 1.9;
  color: #3d2818;
}
#wemd .wemd-steps .wemd-component-body li strong {
  color: #b8960c;
}

/* === faq · 金色问答（米底 + 金挂角） === */
#wemd .wemd-faq {
  margin: 28px 0;
}
#wemd .wemd-faq .wemd-component-body {
  border: 1px solid #e8d196;
  background: #fbf6ea;
  box-shadow: none;
  border-radius: 2px;
  padding: 54px 24px 24px;
}
#wemd .wemd-faq .wemd-component-body > p.wemd-q strong {
  color: #1f1410;
}
#wemd .wemd-faq .wemd-component-body > p {
  color: #3d2818;
}

/* === end-card · 黑金结论卡（深棕黑底 + 金字） === */
#wemd .wemd-end-card {
  margin: 48px 0 8px;
  padding: 44px 24px 40px;
  text-align: center;
  background: linear-gradient(165deg, #241b12, #16120d);
  border: 1px solid #d4af37;
  border-radius: 2px;
  color: #faf3e0;
}
#wemd .wemd-end-card .wemd-ec-title {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #e6c97a;
}
#wemd .wemd-end-card .wemd-ec-subtitle {
  margin-top: 14px;
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 12px;
  letter-spacing: 0.26em;
  color: #e2d4ae;
}
#wemd .wemd-end-card .wemd-ec-deco {
  margin-top: 16px;
  font-size: 18px;
  color: #e6c97a;
  opacity: 1;
}
/* 深咖金底正文：必须连 <p> 覆盖（全局 #wemd p 会染深字），浅米字保证可读 */
#wemd .wemd-end-card .wemd-ec-body,
#wemd .wemd-end-card .wemd-ec-body p {
  color: #faf3e0;
}
#wemd .wemd-end-card .wemd-ec-body strong {
  color: #e6c97a;
}

/* === share-card · 分享（顶金线） === */
#wemd .wemd-share-card {
  margin: 44px 0 26px;
  padding: 24px 16px 20px;
  text-align: center;
  border-top: 1px solid #e8d196;
}
#wemd .wemd-share-card .wemd-component-body p {
  color: #7a6450;
  font-size: 13px;
  letter-spacing: 0.08em;
}

/* === hero-banner · 黑金横幅（深棕黑底 + 金字） === */
#wemd .wemd-hero-banner {
  margin: 0 0 40px;
  border-radius: 2px;
  border: 1px solid #d4af37;
  background: linear-gradient(165deg, #241b12, #16120d 55%, #211a13);
  overflow: hidden;
}
#wemd .wemd-hero-banner .wemd-component-body {
  padding: 48px 32px;
  text-align: center;
}
#wemd .wemd-hero-banner .wemd-hb-title {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #faf3e0;
  text-align: center;
}
#wemd .wemd-hero-banner .wemd-hb-title strong {
  color: #e6c97a;
}
#wemd .wemd-hero-banner .wemd-hb-subtitle {
  font-size: 14px;
  letter-spacing: 0.12em;
  color: #e2d4ae;
  text-align: center;
}

/* === cta-card · 黑金行动卡（深棕黑底 + 金字 + 金色牌匾） === */
#wemd .wemd-cta-card {
  margin: 36px 0;
  padding: 38px 28px;
  background: linear-gradient(165deg, #241b12, #16120d);
  border: 1px solid #d4af37;
  border-radius: 2px;
  text-align: center;
  color: #faf3e0;
}
#wemd .wemd-cta-card .wemd-cta-title {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #faf3e0;
}
#wemd .wemd-cta-card .wemd-cta-body {
  font-size: 14px;
  line-height: 1.9;
  color: #e2d4ae;
}
#wemd .wemd-cta-card .wemd-cta-action {
  display: inline-block;
  padding: 6px 22px;
  background: transparent;
  border: 1px solid #d4af37;
  border-radius: 2px;
  font-size: 13px;
  letter-spacing: 0.12em;
  color: #e6c97a;
  margin: 14px 0 0;
}

/* === follow-bar · 黑金关注条（同路径同特异性覆盖共享白色文本） === */
#wemd .wemd-follow-bar {
  margin: 0 0 26px;
  padding: 13px 18px;
  background: linear-gradient(165deg, #241b12, #16120d);
  border: 1px solid #d4af37;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #faf3e0;
}
#wemd .wemd-follow-bar .wemd-component-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
}
#wemd .wemd-follow-bar .wemd-component-body > p:first-child {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #faf3e0;
  flex: 1;
}
#wemd .wemd-follow-bar .wemd-component-body > p:first-child strong {
  color: #e6c97a;
  font-weight: 600;
}
#wemd .wemd-follow-bar .wemd-component-body > p:last-child:not(:first-child) {
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: #e6c97a;
  flex-shrink: 0;
}

/* === brand-sign · 金色落款 === */
#wemd .wemd-brand-sign {
  margin: 36px 0;
  padding: 0;
}
#wemd .wemd-brand-sign .wemd-bs-wrapper {
  padding: 30px 24px;
  border: 1px solid #e8d196;
  border-radius: 2px;
  background: #fbf6ea;
}
#wemd .wemd-brand-sign .wemd-bs-brand-name {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #1f1410;
}
#wemd .wemd-brand-sign .wemd-bs-tagline {
  font-size: 13px;
  letter-spacing: 0.08em;
  color: #7a6450;
}
#wemd .wemd-brand-sign .wemd-bs-slogan {
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 11px;
  letter-spacing: 0.24em;
  color: #b8960c;
}
#wemd .wemd-brand-sign .wemd-bs-logo {
  color: #d4af37;
}
#wemd .wemd-brand-sign .wemd-bs-divider-dot {
  color: #d4af37;
}

/* === copyright-notice · 版权（顶金线） === */
#wemd .wemd-copyright-notice {
  margin: 26px 0;
  padding: 15px 18px;
  background: transparent;
  border-left: none;
  border-top: 1px solid #e8d196;
  border-radius: 0;
  font-size: 12px;
}
#wemd .wemd-copyright-notice .wemd-component-body p {
  font-size: 12px;
  line-height: 1.8;
  color: #7a6450;
}

/* === resource-list / tag-label · 金色清单与标签 === */
#wemd .wemd-resource-list {
  background: #fbf6ea;
  border: 1px solid #e8d196;
  border-radius: 2px;
}
#wemd .wemd-resource-list .wemd-rl-title {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  color: #1f1410;
}
#wemd .wemd-resource-list .wemd-rl-item {
  background: #ffffff;
  border: 1px solid #efe2c2;
  border-radius: 2px;
}
#wemd .wemd-tag-label .wemd-component-body > p,
#wemd .wemd-tag-label .wemd-component-body li {
  background: #f5edd6;
  color: #b8960c;
  border: 1px solid #e8d196;
  border-radius: 2px;
}
`;

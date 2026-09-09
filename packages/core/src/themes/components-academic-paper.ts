/**
 * 学术论文 · 主题皮肤（学术期刊风）
 *
 * 设计语言：一本严谨的学术期刊 ——
 *   米白纸底 #fbfaf7 · 深墨蓝墨色 #1e3a5f · 深蓝"定理框" #0f2540（白字）·
 *   朱批红点缀 #8b0000 · 双横线章节标题（border-style: double，无伪元素）。
 * 场景：论文 / 深度分析 / 学术引用 / 研究报告。
 *
 * 微信约束：
 * - #wemd 不设整篇背景（背景交给公众号编辑器），纸感用极淡渐变表达。
 * - 装饰全部真实 DOM / 边框 / 渐变，无伪元素、无结构伪类；
 *   仅用 `content: none` 中和共享 ::before（避免双条叠加）。
 * - 深蓝卡片一律配白/浅字（颜色冲撞检查点）。
 * - code-frame 保持内置默认骨架与皮肤（本主题不定制代码块）。
 */

export const componentStylesAcademicPaper = `/* === 学术论文：学术期刊 · 全局皮肤 === */

/* 全局：衬线 + 米白纸感（不写整篇背景色） */
#wemd {
  color: #2c3e50;
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", "PingFang SC", serif;
  font-size: 16px;
  line-height: 1.9;
  letter-spacing: 0.02em;
  background-image: none;
}

/* 正文：墨蓝灰，两端对齐 */
#wemd p {
  margin: 0 0 20px;
  color: #2c3e50;
  font-size: 16px;
  line-height: 1.9;
  text-align: justify;
}
#wemd p b {
  color: #0f2540;
}

/* ---- 标题（双横线用 border-style: double，无伪元素） ---- */
#wemd h1 {
  margin: 28px 0 34px;
  padding: 0 0 22px;
  border: none;
  border-bottom: 2px double #1e3a5f;
  text-align: center;
}
#wemd h1 .content {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  color: #0f1b2d;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.55;
  letter-spacing: 0.05em;
  text-wrap: balance;
}

/* h2：墨蓝 + 底部双横线 */
#wemd h2 {
  margin: 44px 0 18px;
  padding: 0 0 12px;
  border: none;
  border-bottom: 3px double #1e3a5f;
  text-align: left;
}
#wemd h2 .content {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  color: #1e3a5f;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-wrap: balance;
}

/* 章节标题组件（## 标题）——去掉共享 left-border 卡片皮肤，保留双横线 */
#wemd .wemd-section-title {
  padding: 0;
  background: transparent;
  border-left: none;
  border-radius: 0;
}
#wemd .wemd-section-title .wemd-component-body > h2 {
  margin-top: 40px;
  margin-right: 0;
  margin-bottom: 18px;
  margin-left: 0;
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 12px;
  padding-left: 0;
  border-top: none;
  border-right: none;
  border-bottom: 3px double #1e3a5f;
  border-left: none;
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 20px;
  font-weight: 700;
  color: #1e3a5f;
  letter-spacing: 0.04em;
  text-align: left;
}

/* h3 / h4：墨蓝 / 灰蓝 */
#wemd h3 {
  margin: 28px 0 12px;
  padding: 0;
  border: none;
  text-align: left;
}
#wemd h3 .content {
  color: #1e3a5f;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-wrap: balance;
}
#wemd h4 {
  margin: 22px 0 10px;
  padding: 0;
  border: none;
  text-align: left;
}
#wemd h4 .content {
  color: #5a6a7a;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

/* ============================================================
   组件级差异化（覆盖共享组件样式，全部真实元素 / 边框表达）
   ============================================================ */

/* === magazine-cover · 期刊封面（骨架定制） === */
#wemd .wemd-magazine-cover {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin: 0 0 40px;
  padding: 52px 30px 46px;
  background: linear-gradient(180deg, #fbfaf7, #f2efe8);
  border: 1px solid #c8c0a8;
  border-radius: 0;
  text-align: center;
  overflow: hidden;
  /* 内衬画框：outline 内缩形成双层框（不占布局、不依赖 position，微信 100% 保留） */
  outline: 1px solid #e0dccf;
  outline-offset: -12px;
}
/* frame span 不再承载视觉（曾用 position:absolute 定位，公众号删 position 会丢），
   内框改由容器 outline 承载；span 保留仅防骨架空元素 */
#wemd .wemd-ap-frame {
  display: none;
}
#wemd .wemd-magazine-cover .wemd-ap-kicker {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  font-family: "Source Code Pro", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #8b0000;
}
#wemd .wemd-magazine-cover .wemd-ap-title {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin-top: 22px;
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.04em;
  color: #0f1b2d;
}
#wemd .wemd-magazine-cover .wemd-ap-rule {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  display: block;
  width: 120px;
  height: 0;
  margin: 24px auto 0;
  border-bottom: 3px double #1e3a5f;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-magazine-cover .wemd-ap-desc {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin-top: 18px;
  font-size: 13.5px;
  line-height: 1.9;
  color: #5a6a7a;
}

/* === section-divider · 章节（骨架定制） === */
#wemd .wemd-section-divider {
  margin: 48px 0 24px;
  text-align: left;
}
#wemd .wemd-section-divider .wemd-ap-part {
  display: inline-block;
  font-family: "Source Code Pro", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: #8b0000;
}
#wemd .wemd-section-divider .wemd-ap-title {
  margin-top: 8px;
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.03em;
  color: #0f1b2d;
}
#wemd .wemd-section-divider .wemd-ap-rule {
  display: block;
  width: 100%;
  height: 0;
  margin-top: 16px;
  border-bottom: 3px double #1e3a5f;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}

/* === divider · 细线 + § + 细线（骨架定制） === */
#wemd .wemd-divider {
  margin: 40px 0;
}
#wemd .wemd-divider .wemd-component-body {
  display: flex;
  align-items: center;
  gap: 16px;
}
/* 中和共享 ::before/::after 实线，避免骨架细线与其叠加成双线 */
#wemd .wemd-divider .wemd-component-body::before,
#wemd .wemd-divider .wemd-component-body::after {
  content: none;
}
#wemd .wemd-ap-line {
  flex: 1;
  height: 1px;
  background: #c8c0a8;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-ap-glyph {
  color: #8b0000;
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 16px;
}

/* === divider-fancy · 学术装饰线（骨架定制） === */
#wemd .wemd-divider-fancy {
  margin: 40px 0;
}
#wemd .wemd-divider-fancy .wemd-df-label .wemd-df-line {
  height: 1px;
  background: linear-gradient(to right, transparent, #c8c0a8, transparent);
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-divider-fancy .wemd-df-label .wemd-df-text {
  font-family: "Source Code Pro", Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.2em;
  color: #8b0000;
  text-transform: uppercase;
}
#wemd .wemd-divider-fancy .wemd-df-label .wemd-df-dots {
  color: #8b0000;
}

/* === pullquote · 学术引用（米白底 + 墨蓝左条） === */
#wemd .wemd-pullquote {
  margin: 36px 0;
  padding: 24px 26px;
  background: #f4f2ec;
  border-left: 4px solid #1e3a5f;
  border-radius: 0;
}
#wemd .wemd-pullquote .wemd-component-body blockquote p {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 18px;
  line-height: 1.95;
  color: #0f1b2d;
  font-weight: 600;
}

/* === quote-card · 定理框（深蓝底 + 白字 + 朱批左条） === */
#wemd .wemd-quote-card {
  margin: 36px 0;
  padding: 34px 30px;
  background: #0f2540;
  border: none;
  border-left: 4px solid #8b0000;
  border-radius: 2px;
  box-shadow: none;
  text-align: center;
}
#wemd .wemd-quote-card .wemd-qc-quote {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 19px;
  line-height: 2;
  color: #ffffff;
  font-weight: 400;
  letter-spacing: 0.02em;
  text-align: center;
}
#wemd .wemd-quote-card .wemd-qc-author {
  margin-top: 18px;
  font-family: "Source Code Pro", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #e3eaf2;
}

/* === full-quote · 深蓝大引言（白字） === */
#wemd .wemd-full-quote {
  margin: 36px 0;
  padding: 38px 30px;
  background: #0f2540;
  border: none;
  border-left: 4px solid #8b0000;
  border-radius: 2px;
  text-align: center;
}
#wemd .wemd-full-quote .wemd-fq-text {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 18px;
  line-height: 2;
  color: #ffffff;
  letter-spacing: 0.02em;
}

/* === text-card · 正文卡片去整块底色（米白 + 细框 + 墨蓝左条，浅底深字） === */
#wemd .wemd-text-card {
  margin: 28px 0;
  padding: 24px 28px;
  background: #f4f2ec;
  border: 1px solid #c8c0a8;
  border-left: 3px solid #1e3a5f;
  border-radius: 0;
  box-shadow: none;
  font-size: 15.5px;
  line-height: 1.9;
  color: #2c3e50;
}
#wemd .wemd-text-card p {
  margin: 0 0 14px;
  color: #2c3e50;
}
#wemd .wemd-text-card p b {
  color: #0f2540;
}

/* === callout-pro · 定义/备注框（米白 + 朱批左条，中和共享墨蓝竖条） === */
#wemd .wemd-callout-pro {
  margin: 28px 0;
  padding: 18px 22px;
  background: #fbfaf7;
  border: 1px solid #c8c0a8;
  border-left: 3px solid #8b0000;
  border-radius: 0;
  box-shadow: none;
  transform: none;
}
#wemd .wemd-callout-pro::before {
  content: none;
}
#wemd .wemd-callout-pro .wemd-component-body > p {
  font-size: 15px;
  line-height: 1.9;
  color: #2c3e50;
  margin: 0;
}
#wemd .wemd-callout-pro .wemd-component-body > p b {
  color: #8b0000;
}

/* === stats-block · 数据（米白卡 + 细框 + 墨蓝数字） === */
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
  background: #fbfaf7;
  border: 1px solid #c8c0a8;
  border-radius: 0;
  box-shadow: none;
}
#wemd .wemd-stats-block .wemd-sb-items-value {
  color: #0f2540;
  font-family: "Source Code Pro", Consolas, monospace;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
#wemd .wemd-stats-block .wemd-sb-items-label {
  margin-top: 8px;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: #5a6a7a;
  line-height: 1.6;
}

/* === timeline · 研究历程（细线 + 朱批点） === */
#wemd .wemd-timeline {
  margin: 28px 0;
  padding: 26px 26px;
  background: transparent;
  border: 1px solid #c8c0a8;
  border-radius: 0;
}
#wemd .wemd-timeline .wemd-tl-title {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 16px;
  font-weight: 700;
  color: #1e3a5f;
  letter-spacing: 0.04em;
  margin-bottom: 14px;
}
#wemd .wemd-timeline .wemd-tl-events {
  border-left: 1px solid #c8c0a8;
  margin-left: 6px;
}
#wemd .wemd-timeline .wemd-tl-dot {
  background: #8b0000;
  border: 2px solid #fbfaf7;
  box-shadow: 0 0 0 2px #c8c0a8;
}
#wemd .wemd-timeline .wemd-tl-text {
  color: #2c3e50;
}

/* === styled-table · 严谨表格（墨蓝表头 + 发丝行线） === */
#wemd .wemd-styled-table .wemd-sbt-table {
  border: 1px solid #c8c0a8;
  border-radius: 0;
  overflow: hidden;
  background: #fbfaf7;
}
#wemd .wemd-styled-table .wemd-sbt-table table th {
  background: #f2efe8;
  color: #0f2540;
  font-weight: 700;
  text-align: left;
  padding: 12px 15px;
  font-size: 13px;
  letter-spacing: 0.04em;
  border-bottom: 2px solid #1e3a5f;
}
#wemd .wemd-styled-table .wemd-sbt-table table td {
  padding: 12px 15px;
  border-top: 1px solid #e0dccf;
  font-family: "Source Code Pro", Consolas, monospace;
  font-size: 13px;
  color: #2c3e50;
}

/* === 图片类 · 图表画框 + 图注小标 === */
#wemd .wemd-image-card {
  margin: 36px 0;
  padding: 8px;
  background: #ffffff;
  border: 1px solid #c8c0a8;
  border-radius: 0;
  box-shadow: none;
}
#wemd .wemd-image-card .wemd-ic-image img {
  border-radius: 0;
}
#wemd .wemd-image-card .wemd-ic-caption {
  margin: 12px 4px 4px;
  font-family: "Source Code Pro", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: #5a6a7a;
}
#wemd .wemd-image-caption .wemd-component-body p {
  font-family: "Source Code Pro", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: #5a6a7a;
  font-style: normal;
}
#wemd .wemd-image-caption .wemd-component-body p em {
  color: #5a6a7a;
  font-style: normal;
}
#wemd .wemd-image-grid .wemd-component-body p img {
  border: 1px solid #c8c0a8;
  border-radius: 0;
}
#wemd .wemd-image-compare .wemd-component-body figure {
  border: 1px solid #c8c0a8;
  border-radius: 0;
}
#wemd .wemd-image-compare .wemd-component-body figure img {
  border-radius: 0;
}
#wemd .wemd-image-text-row {
  margin: 28px 0;
  background: transparent;
  border: 1px solid #c8c0a8;
  border-radius: 0;
  padding: 18px;
}
#wemd .wemd-image-text-row .wemd-component-body p {
  color: #2c3e50;
}

/* === toc-nav · 学术目录（米白 + 朱批编号） === */
#wemd .wemd-toc-nav {
  margin: 20px 0;
  padding: 24px 26px;
  background: #fbfaf7;
  border: 1px solid #c8c0a8;
  border-radius: 0;
}
#wemd .wemd-toc-nav .wemd-component-body > p:first-child {
  font-family: "Source Code Pro", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #8b0000;
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
  border-bottom: 1px dashed #c8c0a8;
  font-size: 15px;
  line-height: 1.8;
  color: #0f1b2d;
}
#wemd .wemd-toc-nav .wemd-component-body li span.toc-num {
  font-family: "Source Code Pro", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #8b0000;
  min-width: 30px;
}

/* === steps · 研究方法步骤（米白卡 + 朱批强调） === */
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
  color: #0f2540;
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
  background: #fbfaf7;
  border: 1px solid #c8c0a8;
  border-radius: 0;
  font-size: 15px;
  line-height: 1.9;
  color: #2c3e50;
}
#wemd .wemd-steps .wemd-component-body li strong {
  color: #8b0000;
}

/* === faq · 问答（米白 + 墨蓝挂角） === */
#wemd .wemd-faq {
  margin: 28px 0;
}
#wemd .wemd-faq .wemd-component-body {
  border: 1px solid #c8c0a8;
  background: #fbfaf7;
  box-shadow: none;
  border-radius: 0;
  padding: 54px 24px 24px;
}
#wemd .wemd-faq .wemd-component-body > p.wemd-q strong {
  color: #0f2540;
}
#wemd .wemd-faq .wemd-component-body > p {
  color: #2c3e50;
}

/* === end-card · 深蓝结论卡（白字 + 朱批顶线） === */
#wemd .wemd-end-card {
  margin: 48px 0 8px;
  padding: 42px 24px 38px;
  text-align: center;
  background: #0f2540;
  border: none;
  border-top: 4px solid #8b0000;
  border-radius: 0;
  color: #ffffff;
}
#wemd .wemd-end-card .wemd-ec-title {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #ffffff;
}
#wemd .wemd-end-card .wemd-ec-subtitle {
  margin-top: 14px;
  font-family: "Source Code Pro", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: #e3eaf2;
}
#wemd .wemd-end-card .wemd-ec-deco {
  margin-top: 16px;
  font-size: 16px;
  color: #8b0000;
  opacity: 1;
}
/* 深藏蓝盘底正文：必须连 <p> 覆盖（全局 #wemd p 会染深字），浅字保证可读 */
#wemd .wemd-end-card .wemd-ec-body,
#wemd .wemd-end-card .wemd-ec-body p {
  color: #ffffff;
}
#wemd .wemd-end-card .wemd-ec-body strong {
  color: #ffd9d9;
}

/* === share-card · 分享（顶发丝线） === */
#wemd .wemd-share-card {
  margin: 44px 0 26px;
  padding: 24px 16px 20px;
  text-align: center;
  border-top: 1px solid #c8c0a8;
}
#wemd .wemd-share-card .wemd-component-body p {
  color: #5a6a7a;
  font-size: 13px;
  letter-spacing: 0.06em;
}

/* === hero-banner · 学术横幅（细框 + 大留白） === */
#wemd .wemd-hero-banner {
  margin: 0 0 36px;
  border-radius: 0;
  border: 1px solid #c8c0a8;
}
#wemd .wemd-hero-banner .wemd-component-body {
  padding: 44px 30px;
  text-align: center;
}
#wemd .wemd-hero-banner .wemd-hb-title {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #0f1b2d;
  text-align: center;
}
#wemd .wemd-hero-banner .wemd-hb-subtitle {
  font-size: 14px;
  letter-spacing: 0.06em;
  color: #5a6a7a;
  text-align: center;
}

/* === cta-card · 深蓝行动卡（白字 + 描边牌匾，不做按钮状） === */
#wemd .wemd-cta-card {
  margin: 36px 0;
  padding: 36px 28px;
  background: #0f2540;
  border: none;
  border-top: 4px solid #8b0000;
  border-radius: 0;
  text-align: center;
  color: #ffffff;
}
#wemd .wemd-cta-card .wemd-cta-title {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #ffffff;
}
#wemd .wemd-cta-card .wemd-cta-body {
  font-size: 14px;
  line-height: 1.9;
  color: #e3eaf2;
}
#wemd .wemd-cta-card .wemd-cta-action {
  display: inline-block;
  padding: 6px 20px;
  background: transparent;
  border: 1px solid #e3eaf2;
  border-radius: 0;
  font-size: 13px;
  letter-spacing: 0.08em;
  color: #ffffff;
  margin: 12px 0 0;
}

/* === follow-bar · 关注条（去按钮化，纯文字提醒） === */
#wemd .wemd-follow-bar {
  margin: 0 0 26px;
  padding: 13px 18px;
  background: #fbfaf7;
  border: 1px solid #c8c0a8;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #0f1b2d;
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
  color: #2c3e50;
  flex: 1;
}
#wemd .wemd-follow-bar .wemd-component-body > p:first-child strong {
  color: #0f2540;
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
  letter-spacing: 0.1em;
  color: #8b0000;
  flex-shrink: 0;
}

/* === brand-sign · 学术落款 === */
#wemd .wemd-brand-sign {
  margin: 36px 0;
  padding: 0;
}
#wemd .wemd-brand-sign .wemd-bs-wrapper {
  padding: 28px 24px;
  border: 1px solid #c8c0a8;
  border-radius: 0;
  background: #fbfaf7;
}
#wemd .wemd-brand-sign .wemd-bs-brand-name {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #0f1b2d;
}
#wemd .wemd-brand-sign .wemd-bs-tagline {
  font-size: 13px;
  letter-spacing: 0.06em;
  color: #5a6a7a;
}
#wemd .wemd-brand-sign .wemd-bs-slogan {
  font-family: "Source Code Pro", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  color: #8b0000;
}
#wemd .wemd-brand-sign .wemd-bs-logo {
  color: #8b0000;
}
#wemd .wemd-brand-sign .wemd-bs-divider-dot {
  color: #8b0000;
}

/* === copyright-notice · 版权（去左侧条，仅顶发丝线） === */
#wemd .wemd-copyright-notice {
  margin: 26px 0;
  padding: 15px 18px;
  background: transparent;
  border-left: none;
  border-top: 1px solid #e0dccf;
  border-radius: 0;
  font-size: 12px;
}
#wemd .wemd-copyright-notice .wemd-component-body p {
  font-size: 12px;
  line-height: 1.8;
  color: #5a6a7a;
}

/* === resource-list / tag-label · 学术清单与标签 === */
#wemd .wemd-resource-list {
  background: #fbfaf7;
  border: 1px solid #c8c0a8;
  border-radius: 0;
}
#wemd .wemd-resource-list .wemd-rl-title {
  font-family: "Georgia", "Times New Roman", "Songti SC", "STSong", "Source Han Serif SC", serif;
  color: #0f1b2d;
}
#wemd .wemd-resource-list .wemd-rl-item {
  background: #ffffff;
  border: 1px solid #e0dccf;
  border-radius: 0;
}
#wemd .wemd-tag-label .wemd-component-body > p,
#wemd .wemd-tag-label .wemd-component-body li {
  background: #f4f2ec;
  color: #1e3a5f;
  border: 1px solid #c8c0a8;
  border-radius: 0;
}
`;

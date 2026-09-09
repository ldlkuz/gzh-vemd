/**
 * 知识库文章主题 - 皮肤（知识档案库 Knowledge Archive）
 *
 * 设计：一座文献档案馆。
 * - 米白纸底交给编辑器，墨蓝 #31517f 主色贯穿
 * - 条目标题 / 章节标题用衬线字体（文献感），编号 / 索书号用等宽字体
 * - 分类色点缀：摘录=赭黄 / 修订=陶土 / 路径=苔绿 / 其余墨蓝
 * - 全部真实 DOM，无伪元素、无整篇背景、无按钮式互动
 */

export const componentStylesKnowledgeBase = `/* === 知识库文章（知识档案库）组件样式 === */

/* 全局 */
#wemd {
  color: #2a2622;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 15px;
  line-height: 1.9;
  letter-spacing: 0.01em;
  background-image: none;
}

#wemd p {
  margin: 0 0 14px;
  color: #2a2622;
  font-size: 15px;
  line-height: 1.9;
  text-align: justify;
}

#wemd p b,
#wemd p strong {
  color: #31517f;
  font-weight: 700;
}

#wemd a {
  color: #31517f;
  text-decoration: none;
  border-bottom: 1px dotted #31517f;
}

/* === 标题（衬线文献感） === */
#wemd h1 {
  margin: 26px 0 16px;
  padding: 0 0 10px;
  border-bottom: 2px solid #2a2622;
}
#wemd h1 .content {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1.45;
  color: #2a2622;
}

#wemd h2 {
  margin: 26px 0 12px;
  padding: 0 0 8px;
  border-bottom: 1px solid #ddd6c6;
}
#wemd h2 .content {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1.5;
  color: #2a2622;
}

#wemd h3 {
  margin: 20px 0 10px;
}
#wemd h3 .content {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #2a2622;
}

#wemd h4 .content {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #31517f;
}

/* section-title 跟随 h2 衬线 */
#wemd .wemd-section-title {
  margin: 26px 0 12px;
  padding: 0 0 8px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #ddd6c6;
  border-radius: 0;
  box-shadow: none;
}
#wemd .wemd-section-title .wemd-component-body > h2 {
  margin: 0;
  padding: 0;
  border: none;
}
#wemd .wemd-section-title .wemd-component-body > h2 .content {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #2a2622;
}

/* === 条目头 magazine-cover（小标签 + 衬线标题 + 索书号） === */
#wemd .wemd-magazine-cover {
  margin: 4px 0 26px;
  padding: 0 0 18px;
  background: transparent;
  border: none;
  border-bottom: 2px solid #2a2622;
  border-radius: 0;
}
#wemd .wemd-magazine-cover .wemd-kb-label {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.24em;
  color: #31517f;
}
#wemd .wemd-magazine-cover .wemd-kb-title {
  margin-top: 6px;
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1.45;
  color: #2a2622;
}
#wemd .wemd-magazine-cover .wemd-kb-meta {
  margin-top: 12px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #7a7265;
}

/* === 档案章节头 section-divider === */
#wemd .wemd-section-divider {
  margin: 30px 0 16px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
}
#wemd .wemd-section-divider .wemd-kb-sec-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
#wemd .wemd-section-divider .wemd-kb-part {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #31517f;
  flex-shrink: 0;
}
#wemd .wemd-section-divider .wemd-kb-sec-title {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #2a2622;
}
#wemd .wemd-section-divider .wemd-kb-sec-line {
  display: block;
  margin-top: 8px;
  border-top: 1px solid #ddd6c6;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}

/* === divider 细线（中和共享双线） === */
#wemd .wemd-divider {
  margin: 24px 0;
  height: auto;
  display: block;
}
#wemd .wemd-divider .wemd-component-body {
  border-top: 1px solid #ddd6c6;
}
#wemd .wemd-divider .wemd-component-body::before,
#wemd .wemd-divider .wemd-component-body::after {
  content: none;
}

/* === divider-fancy 档案细线 === */
#wemd .wemd-divider-fancy {
  margin: 24px 0;
  height: auto;
}
#wemd .wemd-divider-fancy .wemd-df-label {
  border-top: 1px solid #ddd6c6;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: #7a7265;
}
#wemd .wemd-divider-fancy .wemd-df-dots {
  color: #31517f;
  font-size: 16px;
}

/* === 档案摘录 quote-card（赭黄左条 + 浅蓝底） === */
#wemd .wemd-quote-card {
  margin: 24px 0;
  padding: 16px 20px;
  background: #f1f4f9;
  border: 1px solid #d9e0ec;
  border-left: 4px solid #c9a24b;
  border-radius: 0;
  box-shadow: none;
}
#wemd .wemd-quote-card .wemd-qc-quote {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.9;
  color: #2a2622;
}
#wemd .wemd-quote-card .wemd-qc-author {
  display: block;
  margin-top: 10px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: #c9a24b;
}

/* === full-quote 档案引语 === */
#wemd .wemd-full-quote {
  margin: 24px 0;
  padding: 16px 20px;
  background: #f1f4f9;
  border: 1px solid #d9e0ec;
  border-left: 4px solid #31517f;
  border-radius: 0;
  box-shadow: none;
}
#wemd .wemd-full-quote .wemd-fq-text {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.9;
  color: #2a2622;
}
#wemd .wemd-full-quote .wemd-fq-text em {
  color: #31517f;
  font-style: normal;
}

/* === pullquote 摘录条 === */
#wemd .wemd-pullquote {
  margin: 22px 0;
  padding: 14px 16px;
  background: #f1f4f9;
  border: 1px solid #d9e0ec;
  border-left: 4px solid #31517f;
  border-radius: 0;
}
#wemd .wemd-pullquote .wemd-component-body blockquote p {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.9;
  color: #2a2622;
}

/* === callout / callout-pro（档案提示卡） === */
#wemd .wemd-callout {
  margin: 22px 0;
  padding: 14px 16px;
  background: #ffffff;
  border: 1px solid #ddd6c6;
  border-left: 4px solid #31517f;
  border-radius: 0;
  box-shadow: 0 2px 6px rgba(60, 52, 42, 0.05);
}
#wemd .wemd-callout .wemd-component-body > p {
  font-size: 14px;
  line-height: 1.9;
  color: #2a2622;
}
#wemd .wemd-callout .wemd-component-body > p strong {
  color: #31517f;
}

#wemd .wemd-callout-pro {
  margin: 22px 0;
  padding: 14px 16px;
  background: #ffffff;
  border: 1px solid #ddd6c6;
  border-left: 4px solid #31517f;
  border-radius: 0;
  box-shadow: 0 2px 6px rgba(60, 52, 42, 0.05);
  transform: none;
}
#wemd .wemd-callout-pro::before {
  content: none; /* 档案竖条由 border-left 承担 */
}
#wemd .wemd-callout-pro .wemd-component-body > p {
  font-size: 14px;
  line-height: 1.9;
  color: #2a2622;
}
#wemd .wemd-callout-pro .wemd-component-body > p b {
  color: #31517f;
}

/* === text-card 档案便签 === */
#wemd .wemd-text-card {
  margin: 22px 0;
  padding: 16px 18px;
  background: #ffffff;
  border: 1px solid #ddd6c6;
  border-left: 4px solid #31517f;
  border-radius: 0;
  box-shadow: 0 2px 6px rgba(60, 52, 42, 0.05);
  font-size: 14px;
  line-height: 1.9;
  color: #2a2622;
}

/* === stats-block 条目统计（档案卡） === */
#wemd .wemd-stats-block {
  margin: 24px 0;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
}
#wemd .wemd-stats-block .wemd-sb-title {
  margin: 0 0 10px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #31517f;
}
#wemd .wemd-stats-block .wemd-sb-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
#wemd .wemd-stats-block .wemd-sb-items-item {
  flex: 1 1 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 12px 14px;
  background: #ffffff;
  border: 1px solid #ddd6c6;
  border-radius: 0;
  box-shadow: 0 2px 6px rgba(60, 52, 42, 0.05);
}
#wemd .wemd-stats-block .wemd-sb-items-value {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 22px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: #31517f;
}
#wemd .wemd-stats-block .wemd-sb-items-label {
  margin-top: 4px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #7a7265;
}

/* === styled-table 资料对照表 === */
#wemd .wemd-styled-table {
  margin: 20px 0;
  background: transparent;
  border: none;
  border-top: 2px solid #2a2622;
  border-bottom: 1px solid #2a2622;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
}
#wemd .wemd-styled-table table {
  border: none;
}
#wemd .wemd-styled-table table th {
  padding: 9px 0;
  border-bottom: 1px solid #2a2622;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-align: left;
  color: #2a2622;
  background: transparent;
}
#wemd .wemd-styled-table table td {
  padding: 8px 0;
  border-bottom: 1px dotted #ddd6c6;
  font-size: 14px;
  color: #2a2622;
}

/* === timeline 修订记录（陶土小方块 + 点线行） === */
#wemd .wemd-timeline {
  margin: 20px 0;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
}
#wemd .wemd-timeline .wemd-tl-title {
  margin: 0 0 8px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #31517f;
}
#wemd .wemd-timeline .wemd-tl-events {
  border-left: none;
  margin-left: 0;
  padding: 0;
}
#wemd .wemd-timeline .wemd-tl-item {
  position: static;
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px dotted #ddd6c6;
}
#wemd .wemd-timeline .wemd-tl-item:last-child {
  border-bottom: none;
}
#wemd .wemd-timeline .wemd-tl-dot {
  position: static;
  display: inline-block;
  flex-shrink: 0;
  transform: none; /* 关闭共享圆点尺寸无关居中（本主题用行内布局） */
  width: 7px;
  height: 7px;
  background: #b8724e;
  border: none;
  border-radius: 0;
  box-shadow: none;
}
#wemd .wemd-timeline .wemd-tl-text {
  flex: 1;
  font-size: 14px;
  color: #2a2622;
}

/* === steps 检索路径（苔绿编号 + 顶线） === */
#wemd .wemd-steps {
  margin: 20px 0;
  padding: 0;
  background: transparent;
  border: none;
  border-top: 1px solid #2a2622;
  border-radius: 0;
}
#wemd .wemd-steps .wemd-component-body > p:first-child {
  margin: 0 0 6px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #31517f;
}
#wemd .wemd-steps .wemd-component-body li {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  padding: 9px 0;
  background: transparent;
  border: none;
  border-bottom: 1px dotted #ddd6c6;
  border-radius: 0;
  font-size: 14px;
  line-height: 1.9;
  color: #2a2622;
}
#wemd .wemd-steps .wemd-component-body li:last-child {
  border-bottom: none;
}
#wemd .wemd-steps .wemd-component-body li span {
  color: #6f7f5a;
  font-weight: 800;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
}

/* === toc-nav 条目索引（编号行） === */
#wemd .wemd-toc-nav {
  margin: 20px 0;
  padding: 0;
  background: transparent;
  border: none;
  border-top: 1px solid #2a2622;
  border-bottom: 1px solid #2a2622;
  border-radius: 0;
  box-shadow: none;
}
#wemd .wemd-toc-nav .wemd-component-body > p:first-child {
  margin: 0 0 6px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.24em;
  color: #31517f;
}
#wemd .wemd-toc-nav .wemd-component-body li {
  padding: 8px 0;
  border-bottom: 1px dotted #ddd6c6;
  font-size: 14px;
  color: #2a2622;
}
#wemd .wemd-toc-nav .wemd-component-body li:last-child {
  border-bottom: none;
}
#wemd .wemd-toc-nav .wemd-component-body li span {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: #31517f;
  min-width: 26px;
}

/* === faq 问答卡 === */
#wemd .wemd-faq {
  margin: 22px 0;
}
#wemd .wemd-faq .wemd-component-body {
  padding: 40px 16px 14px;
  background: #ffffff;
  border: 1px solid #ddd6c6;
  border-radius: 0;
  box-shadow: 0 2px 6px rgba(60, 52, 42, 0.05);
}
#wemd .wemd-faq .wemd-component-body > p {
  font-size: 14px;
  line-height: 1.9;
  color: #2a2622;
}
#wemd .wemd-faq .wemd-component-body > p.wemd-q {
  color: #31517f;
  font-weight: 700;
}

/* === hero-banner 条目横幅 === */
#wemd .wemd-hero-banner {
  margin: 4px 0 26px;
  background: transparent;
  border: none;
  border-top: 2px solid #2a2622;
  border-bottom: 1px solid #ddd6c6;
  border-radius: 0;
}
#wemd .wemd-hero-banner .wemd-component-body {
  padding: 30px 20px;
}
#wemd .wemd-hero-banner .wemd-hb-title {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #2a2622;
}
#wemd .wemd-hero-banner .wemd-hb-title strong {
  color: #31517f;
}
#wemd .wemd-hero-banner .wemd-hb-subtitle {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 13px;
  letter-spacing: 0.08em;
  color: #7a7265;
}

/* === cta-card 归档提示（去按钮化） === */
#wemd .wemd-cta-card {
  margin: 24px 0;
  padding: 16px 0;
  background: transparent;
  border: none;
  border-top: 1px solid #ddd6c6;
  border-bottom: 1px solid #ddd6c6;
  border-radius: 0;
  text-align: left;
  color: #2a2622;
}
#wemd .wemd-cta-card .wemd-cta-title {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #2a2622;
}
#wemd .wemd-cta-card .wemd-cta-body {
  font-size: 13px;
  line-height: 1.9;
  color: #7a7265;
}
#wemd .wemd-cta-card .wemd-cta-action {
  display: inline-block;
  padding: 4px 0;
  background: transparent;
  border: none;
  border-bottom: 1px dotted #31517f;
  border-radius: 0;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.14em;
  color: #31517f;
  margin: 8px 0 0;
}

/* === follow-bar 订阅更新（同路径同特异性，去按钮化） === */
#wemd .wemd-follow-bar {
  margin: 0 0 20px;
  padding: 12px 14px;
  background: #ffffff;
  border: 1px solid #ddd6c6;
  border-left: 4px solid #31517f;
  border-radius: 0;
  box-shadow: 0 2px 6px rgba(60, 52, 42, 0.05);
  color: #2a2622;
}
#wemd .wemd-follow-bar .wemd-component-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
}
#wemd .wemd-follow-bar .wemd-component-body > p:first-child {
  margin: 0;
  flex: 1;
  font-size: 13px;
  color: #2a2622;
}
#wemd .wemd-follow-bar .wemd-component-body > p:first-child strong {
  color: #2a2622;
  font-weight: 700;
}
#wemd .wemd-follow-bar .wemd-component-body > p:last-child:not(:first-child) {
  margin: 0;
  flex-shrink: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #31517f;
  border-bottom: 1px dotted #31517f;
}

/* === 档案袋 end-card（深墨蓝，浅字） === */
#wemd .wemd-end-card {
  margin: 30px 0;
  padding: 24px 20px;
  background: linear-gradient(135deg, #26324a 0%, #1d2536 100%);
  border: 1px solid #2c3547;
  border-radius: 0;
  box-shadow: none;
  text-align: center;
}
#wemd .wemd-end-card .wemd-kb-bag-lbl {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.28em;
  color: #9fb0cd;
}
#wemd .wemd-end-card .wemd-kb-bag-title {
  margin-top: 10px;
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #f2f5fa;
}
#wemd .wemd-end-card .wemd-kb-bag-title strong {
  color: #7fb0e8;
}
#wemd .wemd-end-card .wemd-kb-bag-meta {
  margin-top: 12px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #9fb0cd;
}
/* 深灰蓝袋底正文：必须连 <p> 覆盖（全局 #wemd p 会染深字），浅字保证可读 */
#wemd .wemd-end-card .wemd-ec-body,
#wemd .wemd-end-card .wemd-ec-body p {
  color: #dfe5ef;
}
#wemd .wemd-end-card .wemd-ec-body strong {
  color: #f2f5fa;
}

/* === share-card 分享页脚 === */
#wemd .wemd-share-card {
  margin: 24px 0 16px;
  padding: 12px 0;
  border-top: 1px solid #ddd6c6;
}
#wemd .wemd-share-card .wemd-component-body p {
  margin: 0;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 13px;
  letter-spacing: 0.08em;
  color: #7a7265;
}

/* === brand-sign 档案落款 === */
#wemd .wemd-brand-sign {
  margin: 24px 0;
}
#wemd .wemd-brand-sign .wemd-bs-wrapper {
  padding: 20px;
  background: #ffffff;
  border: 1px solid #ddd6c6;
  border-left: 4px solid #31517f;
  border-radius: 0;
}
#wemd .wemd-brand-sign .wemd-bs-brand-name {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #2a2622;
}
#wemd .wemd-brand-sign .wemd-bs-tagline {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: #7a7265;
}
#wemd .wemd-brand-sign .wemd-bs-slogan {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #31517f;
}
#wemd .wemd-brand-sign .wemd-bs-logo {
  color: #31517f;
}
#wemd .wemd-brand-sign .wemd-bs-divider-dot {
  color: #31517f;
}

/* === copyright 档案版权脚 === */
#wemd .wemd-copyright-notice {
  margin: 18px 0;
  padding: 10px 0;
  background: transparent;
  border: none;
  border-top: 1px solid #ddd6c6;
  border-left: none;
  border-radius: 0;
}
#wemd .wemd-copyright-notice .wemd-component-body p {
  margin: 0;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  line-height: 1.8;
  letter-spacing: 0.08em;
  color: #7a7265;
}

/* === tag-label 档案标签（描边胶囊） === */
#wemd .wemd-tag-label .wemd-component-body > p,
#wemd .wemd-tag-label .wemd-component-body > p span {
  display: inline-block;
  margin: 0 6px 6px 0;
  padding: 3px 12px;
  background: #ffffff;
  border: 1px solid #d9e0ec;
  border-radius: 0;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: #31517f;
}

/* === resource-list 资料卡 === */
#wemd .wemd-resource-list {
  margin: 22px 0;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #ddd6c6;
  border-left: 4px solid #31517f;
  border-radius: 0;
}
#wemd .wemd-resource-list .wemd-rl-title {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 15px;
  font-weight: 800;
  color: #2a2622;
}
#wemd .wemd-resource-list .wemd-rl-item {
  background: #ffffff;
  border: 1px solid #ddd6c6;
  border-radius: 0;
}
#wemd .wemd-resource-list .wemd-rl-item .wemd-rl-item-title {
  color: #2a2622;
}

/* === code-frame 档案查询终端（深墨蓝 + mac 圆点） === */
#wemd .wemd-code-frame {
  margin: 24px 0;
  background: #232a38;
  border: 1px solid #2c3547;
  border-radius: 0;
  overflow: hidden;
}
#wemd .wemd-code-frame .wemd-cf-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #1c2230;
  border-bottom: 1px solid #2c3547;
}
#wemd .wemd-code-frame .wemd-kb-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-code-frame .wemd-kb-dot-r { background: #c25450; }
#wemd .wemd-code-frame .wemd-kb-dot-y { background: #d8a24a; }
#wemd .wemd-code-frame .wemd-kb-dot-g { background: #58a06b; }
#wemd .wemd-code-frame .wemd-cf-title {
  margin-left: 8px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: #8fa0b8;
}
#wemd .wemd-code-frame .wemd-cf-code pre {
  margin: 0;
  padding: 14px 16px;
  overflow-x: auto;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 13px;
  line-height: 1.8;
  color: #d7e0ee;
  text-align: left;
}
#wemd .wemd-code-frame .wemd-cf-code pre code {
  background: transparent;
  color: #d7e0ee;
}

/* === 图片（档案图框） === */
#wemd .wemd-image-card {
  margin: 24px 0;
  padding: 6px;
  background: #ffffff;
  border: 1px solid #ddd6c6;
  border-radius: 0;
  box-shadow: none;
}
#wemd .wemd-image-card .wemd-ic-image img {
  border-radius: 0;
}
#wemd .wemd-image-card .wemd-ic-caption {
  margin: 10px 2px 2px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #7a7265;
}
#wemd .wemd-image-caption .wemd-component-body p {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #7a7265;
}
#wemd .wemd-image-caption .wemd-component-body p em {
  color: #7a7265;
  font-style: normal;
}
#wemd .wemd-image-grid .wemd-component-body p img {
  border: 1px solid #ddd6c6;
  border-radius: 0;
}
#wemd .wemd-image-compare .wemd-component-body figure {
  border: 1px solid #ddd6c6;
  border-radius: 0;
}
#wemd .wemd-image-text-row {
  margin: 22px 0;
  padding: 14px;
  background: #ffffff;
  border: 1px solid #ddd6c6;
  border-radius: 0;
}
`;

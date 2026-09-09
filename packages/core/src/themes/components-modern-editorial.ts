/**
 * 编辑部手记 · 主题皮肤（纸媒编辑部 Newsroom Editorial）
 *
 * 设计语言：报纸暖纸 #faf8f2 · 墨黑铅字 #1c1a17 · 编辑部红 #d0342c（唯一强调色）。
 * 左对齐编辑式排版：粗/细栏线、眉题、编辑号、版权页；所有区块不用整块底色，
 * 靠栏线与纸感区分。
 * 场景：深度长文 / 编辑精选 / 杂志 / 报道。
 *
 * 微信约束：
 * - #wemd 不设整篇背景（背景交给公众号编辑器），纸感用极淡渐变表达。
 * - 装饰全部真实 DOM / 边框 / 渐变，无伪元素、无结构伪类；
 *   仅用 `content: none` 中和共享 ::before（避免双条叠加）。
 * - 深色块（版权页墨黑底）一律配浅字（颜色冲撞检查点）。
 * - code-frame 保持内置默认骨架与皮肤（本主题不定制代码块）。
 */

export const componentStylesModernEditorial = `/* === 编辑部手记：纸媒编辑部 · 全局皮肤 === */

/* 全局：报纸暖纸 + 墨黑铅字（不写整篇背景色） */
#wemd {
  color: #1c1a17;
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", "PingFang SC", serif;
  font-size: 16px;
  line-height: 2;
  letter-spacing: 0.01em;
  background-image: none;
}

/* 正文 */
#wemd p {
  margin: 0 0 26px;
  color: #1c1a17;
  font-size: 16px;
  line-height: 2;
  text-align: justify;
}
#wemd p b {
  color: #1c1a17;
}

/* ---- 标题（编辑式，左对齐） ---- */
#wemd h1 {
  margin: 18px 0 22px;
  padding: 0;
  border: none;
  text-align: left;
}
#wemd h1 .content {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  color: #1c1a17;
  font-size: 30px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: 0.01em;
  text-wrap: balance;
}

/* h2：墨黑 + 底部细栏线 */
#wemd h2 {
  margin: 40px 0 16px;
  padding: 0 0 10px;
  border: none;
  border-bottom: 1px solid #d9d3c4;
  text-align: left;
}
#wemd h2 .content {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  color: #1c1a17;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 0.01em;
  text-wrap: balance;
}

/* 章节标题组件（## 标题）——去掉共享 left-border 卡片皮肤，保留底部栏线 */
#wemd .wemd-section-title {
  padding: 0;
  background: transparent;
  border-left: none;
  border-radius: 0;
}
#wemd .wemd-section-title .wemd-component-body > h2 {
  margin-top: 38px;
  margin-right: 0;
  margin-bottom: 16px;
  margin-left: 0;
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 10px;
  padding-left: 0;
  border-top: none;
  border-right: none;
  border-bottom: 1px solid #d9d3c4;
  border-left: none;
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 24px;
  font-weight: 800;
  color: #1c1a17;
  letter-spacing: 0.01em;
  text-align: left;
}

/* h3 / h4：墨黑 / 编辑部红眉题 */
#wemd h3 {
  margin: 30px 0 14px;
  padding: 0;
  border: none;
  text-align: left;
}
#wemd h3 .content {
  color: #1c1a17;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-wrap: balance;
}
#wemd h4 {
  margin: 24px 0 12px;
  padding: 0;
  border: none;
  text-align: left;
}
#wemd h4 .content {
  color: #d0342c;
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

/* ============================================================
   组件级差异化（覆盖共享组件样式，全部真实元素 / 边框表达）
   ============================================================ */

/* 栏线基础元素 */
#wemd .wemd-me-thick {
  height: 4px;
  background: #1c1a17;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-me-thin {
  height: 1px;
  background: #d9d3c4;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}

/* === magazine-cover · 刊头（骨架定制） === */
#wemd .wemd-magazine-cover {
  margin: 0 0 40px;
  padding: 30px 0 0;
  background: transparent;
  border: none;
  border-top: 3px solid #1c1a17;
  border-radius: 0;
  text-align: left;
}
#wemd .wemd-magazine-cover .wemd-me-topline {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d3c4;
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: #6b6760;
  text-transform: uppercase;
}
#wemd .wemd-me-tag {
  color: #d0342c;
  font-weight: 700;
}
#wemd .wemd-magazine-cover .wemd-me-title {
  margin: 30px 0 0;
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 40px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #1c1a17;
  text-align: left;
}
#wemd .wemd-magazine-cover .wemd-me-rules {
  display: flex;
  gap: 6px;
  margin-top: 24px;
}
#wemd .wemd-magazine-cover .wemd-me-thick {
  width: 96px;
}
#wemd .wemd-magazine-cover .wemd-me-thin {
  flex: 1;
}
#wemd .wemd-magazine-cover .wemd-me-desc {
  margin: 24px 0 0;
  padding: 0 0 30px;
  border-bottom: 2px solid #1c1a17;
  font-size: 16px;
  line-height: 2;
  color: #1c1a17;
}

/* === section-divider · 章节（骨架定制） === */
#wemd .wemd-section-divider {
  margin: 50px 0 24px;
  padding-top: 16px;
  border-top: 3px solid #1c1a17;
  text-align: left;
}
#wemd .wemd-section-divider .wemd-me-no {
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: #d0342c;
}
#wemd .wemd-section-divider .wemd-me-title {
  margin-top: 8px;
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.01em;
  color: #1c1a17;
}
#wemd .wemd-section-divider .wemd-me-rule {
  display: block;
  height: 1px;
  margin-top: 14px;
  background: #d9d3c4;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}

/* === divider · 栏线（骨架定制） === */
#wemd .wemd-divider {
  margin: 44px 0;
}
#wemd .wemd-divider .wemd-component-body {
  display: flex;
  align-items: center;
  gap: 10px;
}
/* 中和共享 ::before/::after 实线，避免骨架栏线与其叠加成双线 */
#wemd .wemd-divider .wemd-component-body::before,
#wemd .wemd-divider .wemd-component-body::after {
  content: none;
}
#wemd .wemd-divider .wemd-me-thick {
  width: 64px;
}
#wemd .wemd-divider .wemd-me-thin {
  flex: 1;
}
#wemd .wemd-me-glyph {
  color: #d0342c;
  font-family: Georgia, serif;
  font-size: 16px;
}

/* === quote-card · 大引语（骨架定制：超大引号，左对齐） === */
#wemd .wemd-quote-card {
  margin: 40px 0; /* 不加 margin-left：竖条与正文左缘齐平（普通段落 margin-left:0） */
  padding: 10px 0 12px 28px;
  background: transparent;
  border: none;
  border-left: 3px solid #d0342c;
  border-radius: 0;
  box-shadow: none;
  text-align: left;
  /* 无引号装饰：仅左侧竖条，引文从 padding-top 开始正常流 */
}
/* 无超大引号：本主题 quote-card 仅由左侧红竖条 + 引文表达引语 */
#wemd .wemd-quote-card .wemd-qc-quote {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.7;
  color: #1c1a17;
  text-align: left;
}
#wemd .wemd-quote-card .wemd-qc-author {
  display: block;
  margin-top: 14px;
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #6b6760;
  text-transform: uppercase;
}

/* === full-quote · 编辑式引语（骨架定制） === */
#wemd .wemd-full-quote {
  margin: 40px 0; /* 不加 margin-left：竖条与正文左缘齐平（普通段落 margin-left:0） */
  padding: 18px 0 18px 26px;
  background: transparent;
  border: none;
  border-left: 4px solid #1c1a17;
  border-radius: 0;
  text-align: left;
  /* 无引号装饰：仅左侧竖条，引文从 padding-top 开始正常流 */
}
#wemd .wemd-full-quote .wemd-fq-text {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 21px;
  font-weight: 700;
  line-height: 1.8;
  color: #1c1a17;
  text-align: left;
}

/* === pullquote · 编辑式引用（红左条） === */
#wemd .wemd-pullquote {
  margin: 36px 0;
  padding: 22px 24px;
  background: transparent;
  border: 1px solid #d9d3c4;
  border-left: 4px solid #d0342c;
  border-radius: 0;
}
#wemd .wemd-pullquote .wemd-component-body blockquote p {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 18px;
  line-height: 2;
  color: #1c1a17;
  font-weight: 600;
}

/* === text-card · 正文卡（无底色，仅栏线 + 墨黑左条） === */
#wemd .wemd-text-card {
  margin: 30px 0;
  padding: 24px 28px;
  background: transparent;
  border: 1px solid #d9d3c4;
  border-left: 4px solid #1c1a17;
  border-radius: 0;
  box-shadow: none;
  font-size: 15.5px;
  line-height: 2;
  color: #1c1a17;
}
#wemd .wemd-text-card p {
  margin: 0 0 14px;
  color: #1c1a17;
}
#wemd .wemd-text-card p b {
  color: #1c1a17;
}

/* === callout / callout-pro · 编辑部红提示（栏线 + 红左条） === */
#wemd .wemd-callout {
  margin: 30px 0;
  padding: 20px 24px;
  background: transparent;
  border: 1px solid #d9d3c4;
  border-left: 4px solid #d0342c;
  border-radius: 0;
}
#wemd .wemd-callout .wemd-component-body > p {
  color: #1c1a17;
  font-size: 15px;
  line-height: 2;
}
#wemd .wemd-callout .wemd-component-body > p strong {
  color: #d0342c;
}
#wemd .wemd-callout-pro {
  margin: 30px 0;
  padding: 20px 24px;
  background: transparent;
  border: 1px solid #d9d3c4;
  border-left: 4px solid #d0342c;
  border-radius: 0;
  box-shadow: none;
  transform: none;
}
#wemd .wemd-callout-pro::before {
  content: none;
}
#wemd .wemd-callout-pro .wemd-component-body > p {
  font-size: 15px;
  line-height: 2;
  color: #1c1a17;
  margin: 0;
}
#wemd .wemd-callout-pro .wemd-component-body > p b {
  color: #d0342c;
}

/* === stats-block · 数据（上下栏线，无卡片） === */
#wemd .wemd-stats-block {
  margin: 38px 0;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  border-top: 3px solid #1c1a17;
  border-bottom: 1px solid #d9d3c4;
}
#wemd .wemd-stats-block .wemd-sb-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 0;
}
#wemd .wemd-stats-block .wemd-sb-items-item {
  flex: 1;
  margin: 0;
  padding: 22px 18px 20px;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  text-align: center;
}
#wemd .wemd-stats-block .wemd-sb-items-value {
  color: #1c1a17;
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", serif;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
#wemd .wemd-stats-block .wemd-sb-items-label {
  margin-top: 8px;
  font-size: 12px;
  letter-spacing: 0.14em;
  color: #d0342c;
  line-height: 1.6;
  text-transform: uppercase;
}

/* === timeline · 档案编年（墨点 + 栏线） === */
#wemd .wemd-timeline {
  margin: 34px 0;
  padding: 26px 26px;
  background: transparent;
  border: 1px solid #d9d3c4;
  border-radius: 0;
}
#wemd .wemd-timeline .wemd-tl-title {
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: #d0342c;
  text-transform: uppercase;
  margin-bottom: 20px;
}
#wemd .wemd-timeline .wemd-tl-events {
  border-left: 1px solid #d9d3c4;
  margin-left: 8px;
  padding: 0; /* 去掉共享 padding-left:20px，让圆点能落在竖线上 */
}
#wemd .wemd-timeline .wemd-tl-item {
  display: flex;
  align-items: flex-start;
  padding: 8px 0 8px 0;
  margin: 0;
}
/* 墨点定位：flex 子项 + 负 margin-left 跨到竖线中心（公众号保留 flex，不依赖 position）。
   几何：events border-left 1px + margin-left:8px → 竖线中心 x=8.5；padding:0 → item 内容起点
   x=9；墨点宽 10px 半径 5px，margin-left:-5px 让左边缘到 x=9-5=4 → 圆心落在 x=4+5=9（≈竖线中心 8.5）。 */
#wemd .wemd-timeline .wemd-tl-dot {
  flex: none;
  width: 10px;
  height: 10px;
  margin-top: 6px;
  margin-left: -5px;
  margin-right: 12px;
  border-radius: 50%;
  background: #1c1a17;
  border: none;
  box-shadow: none;
}
#wemd .wemd-timeline .wemd-tl-text {
  flex: 1;
  color: #1c1a17;
}

/* === styled-table · 编辑数据表（栏线） === */
#wemd .wemd-styled-table .wemd-sbt-table {
  border: none;
  border-top: 3px solid #1c1a17;
  border-bottom: 1px solid #d9d3c4;
  border-radius: 0;
  overflow: hidden;
  background: transparent;
}
#wemd .wemd-styled-table .wemd-sbt-table table th {
  padding: 13px 14px;
  border-bottom: 1px solid #d9d3c4;
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: #d0342c;
  text-align: left;
  background: transparent;
}
#wemd .wemd-styled-table .wemd-sbt-table table td {
  padding: 13px 14px;
  border-top: 1px solid #ece6d8;
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", serif;
  font-size: 14px;
  color: #1c1a17;
}

/* === 图片类 · 墨框画框 === */
#wemd .wemd-image-card {
  margin: 34px 0;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
}
#wemd .wemd-image-card .wemd-ic-image img {
  border: 1px solid #1c1a17;
  border-radius: 0;
}
#wemd .wemd-image-card .wemd-ic-caption {
  margin: 12px 0 4px;
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #6b6760;
  text-align: left;
}
#wemd .wemd-image-caption .wemd-component-body p {
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #6b6760;
  font-style: normal;
}
#wemd .wemd-image-caption .wemd-component-body p em {
  color: #6b6760;
  font-style: normal;
}
#wemd .wemd-image-grid .wemd-component-body p img {
  border: 1px solid #1c1a17;
  border-radius: 0;
}
#wemd .wemd-image-compare .wemd-component-body figure {
  border: 1px solid #1c1a17;
  border-radius: 0;
}
#wemd .wemd-image-compare .wemd-component-body figure img {
  border-radius: 0;
}
#wemd .wemd-image-text-row {
  margin: 30px 0;
  background: transparent;
  border: 1px solid #d9d3c4;
  border-radius: 0;
  padding: 16px;
}
#wemd .wemd-image-text-row .wemd-component-body p {
  color: #1c1a17;
}

/* === toc-nav · 目录（上下栏线 + 红编号） === */
#wemd .wemd-toc-nav {
  margin: 24px 0;
  padding: 0;
  background: transparent;
  border: none;
  border-top: 3px solid #1c1a17;
  border-bottom: 1px solid #d9d3c4;
  border-radius: 0;
}
#wemd .wemd-toc-nav .wemd-component-body > p:first-child {
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #d0342c;
  margin: 0 0 12px;
}
#wemd .wemd-toc-nav .wemd-component-body ul,
#wemd .wemd-toc-nav .wemd-component-body ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
#wemd .wemd-toc-nav .wemd-component-body li {
  padding: 11px 0;
  border-bottom: 1px dashed #d9d3c4;
  font-size: 15px;
  line-height: 1.8;
  color: #1c1a17;
}
#wemd .wemd-toc-nav .wemd-component-body li span.toc-num {
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #d0342c;
  min-width: 30px;
}

/* === steps · 编辑流程（栏线卡 + 序号） === */
#wemd .wemd-steps {
  margin: 32px 0;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
}
#wemd .wemd-steps .wemd-component-body {
  padding: 0;
}
#wemd .wemd-steps .wemd-component-body > p:first-child {
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: #d0342c;
  text-transform: uppercase;
  margin: 0 0 18px;
}
#wemd .wemd-steps .wemd-component-body ol,
#wemd .wemd-steps .wemd-component-body ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
#wemd .wemd-steps .wemd-component-body li {
  margin: 0 0 12px;
  padding: 16px 18px 16px 54px;
  background: transparent;
  border: 1px solid #d9d3c4;
  border-left: 4px solid #1c1a17;
  border-radius: 0;
  font-size: 15px;
  line-height: 1.9;
  color: #1c1a17;
}
#wemd .wemd-steps .wemd-component-body li strong {
  color: #1c1a17;
}

/* === faq · 问答（栏线） === */
#wemd .wemd-faq {
  margin: 32px 0;
}
#wemd .wemd-faq .wemd-component-body {
  border: 1px solid #d9d3c4;
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  padding: 52px 24px 24px;
}
#wemd .wemd-faq .wemd-component-body > p.wemd-q strong {
  color: #1c1a17;
}
#wemd .wemd-faq .wemd-component-body > p {
  color: #1c1a17;
}

/* === end-card · 版权页 colophon（骨架定制：墨黑底 + 浅字） === */
#wemd .wemd-end-card {
  margin: 56px 0 10px;
  padding: 40px 40px 36px;
  text-align: left;
  background: #1c1a17;
  border: none;
  border-radius: 0;
  color: #faf8f2;
}
#wemd .wemd-end-card .wemd-ec-title {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: #faf8f2;
  text-align: left;
}
#wemd .wemd-end-card .wemd-ec-subtitle {
  display: block;
  margin-top: 18px;
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  color: #b9b2a4;
  text-transform: uppercase;
}
/* 深墨底正文：必须连 <p> 覆盖（全局 #wemd p 会染深字），近白字保证可读 */
#wemd .wemd-end-card .wemd-ec-body,
#wemd .wemd-end-card .wemd-ec-body p {
  color: #faf8f2;
}
#wemd .wemd-end-card .wemd-ec-body strong {
  color: #ffffff;
}
/* 深底上任意槽位的加粗字统一浅色：短句加粗可能被 subtitle 槽吞（≤30 字无句读），
   而全局 #wemd strong 会把它内联成墨色，与深底同色不可见；更具体选择器兜底 */
#wemd .wemd-end-card .wemd-ec-subtitle strong {
  color: #faf8f2;
}
#wemd .wemd-end-card .wemd-me-line {
  display: block;
  height: 1px;
  margin: 22px 0;
  background: #4a453e;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-end-card .wemd-me-editors {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", serif;
  font-size: 13px;
  line-height: 2;
  color: #cfc9bb;
}

/* === share-card · 分享（顶栏线） === */
#wemd .wemd-share-card {
  margin: 44px 0 28px;
  padding: 24px 16px 20px;
  text-align: left;
  border-top: 1px solid #d9d3c4;
}
#wemd .wemd-share-card .wemd-component-body p {
  color: #6b6760;
  font-size: 13px;
  letter-spacing: 0.06em;
  text-align: left;
}

/* === hero-banner · 编辑横幅（墨黑顶线 + 栏线框） === */
#wemd .wemd-hero-banner {
  margin: 0 0 40px;
  border: 1px solid #d9d3c4;
  border-top: 3px solid #1c1a17;
  border-radius: 0;
}
#wemd .wemd-hero-banner .wemd-component-body {
  padding: 44px 34px;
  text-align: left;
}
#wemd .wemd-hero-banner .wemd-hb-title {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.01em;
  color: #1c1a17;
  text-align: left;
}
#wemd .wemd-hero-banner .wemd-hb-title strong {
  color: #d0342c;
}
#wemd .wemd-hero-banner .wemd-hb-subtitle {
  font-size: 14px;
  letter-spacing: 0.1em;
  color: #6b6760;
  text-align: left;
}

/* === cta-card · 编辑行动条（上下栏线 + 红下划线动作） === */
#wemd .wemd-cta-card {
  margin: 36px 0;
  padding: 32px 28px;
  background: transparent;
  border: none;
  border-top: 3px solid #1c1a17;
  border-bottom: 1px solid #d9d3c4;
  border-radius: 0;
  text-align: left;
  color: #1c1a17;
}
#wemd .wemd-cta-card .wemd-cta-title {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: #1c1a17;
  text-align: left;
}
#wemd .wemd-cta-card .wemd-cta-body {
  font-size: 14px;
  line-height: 1.9;
  color: #6b6760;
}
#wemd .wemd-cta-card .wemd-cta-action {
  display: inline-block;
  padding: 6px 0;
  background: transparent;
  border: none;
  border-bottom: 2px solid #d0342c;
  border-radius: 0;
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: #d0342c;
  margin: 12px 0 0;
  text-transform: uppercase;
}

/* === follow-bar · 订阅条（同路径同特异性覆盖共享白色文本，去按钮化） === */
#wemd .wemd-follow-bar {
  margin: 0 0 26px;
  padding: 16px 20px;
  background: #f1ede2;
  border: none;
  border-top: 1px solid #d9d3c4;
  border-left: 4px solid #d0342c;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #1c1a17;
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
  color: #1c1a17;
  flex: 1;
}
#wemd .wemd-follow-bar .wemd-component-body > p:first-child strong {
  color: #1c1a17;
  font-weight: 600;
}
#wemd .wemd-follow-bar .wemd-component-body > p:last-child:not(:first-child) {
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: #d0342c;
  flex-shrink: 0;
  text-transform: uppercase;
}

/* === brand-sign · 编辑部落款 === */
#wemd .wemd-brand-sign {
  margin: 36px 0;
  padding: 0;
}
#wemd .wemd-brand-sign .wemd-bs-wrapper {
  padding: 28px 24px;
  border: 1px solid #d9d3c4;
  border-top: 3px solid #1c1a17;
  border-radius: 0;
  background: transparent;
}
#wemd .wemd-brand-sign .wemd-bs-brand-name {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #1c1a17;
}
#wemd .wemd-brand-sign .wemd-bs-tagline {
  font-size: 13px;
  letter-spacing: 0.08em;
  color: #6b6760;
}
#wemd .wemd-brand-sign .wemd-bs-slogan {
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #d0342c;
}
#wemd .wemd-brand-sign .wemd-bs-logo {
  color: #1c1a17;
}
#wemd .wemd-brand-sign .wemd-bs-divider-dot {
  color: #d0342c;
}

/* === copyright-notice · 版权（顶栏线） === */
#wemd .wemd-copyright-notice {
  margin: 26px 0;
  padding: 16px 18px;
  background: transparent;
  border-left: none;
  border-top: 1px solid #d9d3c4;
  border-radius: 0;
  font-size: 12px;
}
#wemd .wemd-copyright-notice .wemd-component-body p {
  font-size: 12px;
  line-height: 1.8;
  color: #6b6760;
}

/* === resource-list / tag-label · 编辑部清单与标签 === */
#wemd .wemd-resource-list {
  background: transparent;
  border: 1px solid #d9d3c4;
  border-top: 3px solid #1c1a17;
  border-radius: 0;
}
#wemd .wemd-resource-list .wemd-rl-title {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  color: #1c1a17;
}
#wemd .wemd-resource-list .wemd-rl-item {
  background: #ffffff;
  border: 1px solid #e6e0d1;
  border-radius: 0;
}
#wemd .wemd-tag-label .wemd-component-body > p,
#wemd .wemd-tag-label .wemd-component-body li {
  background: transparent;
  color: #1c1a17;
  border: 1px solid #d9d3c4;
  border-radius: 0;
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 12px;
  letter-spacing: 0.08em;
}
`;

/**
 * 清晰指南 · 主题皮肤（学习手册风）
 *
 * 设计语言：一本被荧光笔认真学过的手册 ——
 *   暖纸为底 #faf6ef · 荧光黄划重点 #ffe14d · 橙红签名 #e8590c · 墨字 #2b2118。
 * 场景：教程 / 文档 / 操作指南 / 上手手册。
 *
 * 微信约束：
 * - #wemd 不设整篇背景（背景交给公众号编辑器，纸感用极淡渐变表达）。
 * - 装饰全部真实 DOM / 渐变 / 边框，无伪元素、无结构伪类。
 * - 荧光划重点用 linear-gradient 底部覆盖（真实背景），不用 ::after。
 * - code-frame 保持内置默认骨架与皮肤（本主题不定制代码块）。
 */

export const componentStylesClearGuide = `/* === 清晰指南：学习手册 · 全局皮肤 === */

/* 全局：暖纸 + 墨字。不写整篇背景色（微信整篇铺背景会出问题），底色透明 */
#wemd {
  color: #2b2118;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", "PingFang SC", serif;
  font-size: 15px;
  line-height: 2.05;
  letter-spacing: 0.03em;
}

/* 正文 */
#wemd p {
  margin: 0 0 22px;
  color: #2b2118;
  font-size: 15px;
  line-height: 2.05;
  text-align: justify;
}
#wemd p b { color: #c2410c; }

/* ---- 标题 ---- */
#wemd h1 {
  margin: 24px 0 20px;
  text-align: left;
  border: none;
}
#wemd h1 .content {
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", serif;
  color: #2b2118;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.5;
  letter-spacing: 0.02em;
  text-wrap: balance;
}

/* h2：墨 + 荧光下划线 */
#wemd h2 {
  margin: 46px 0 20px;
  padding: 0 0 6px;
  border: none;
  text-align: left;
}
#wemd h2 .content {
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", serif;
  color: #2b2118;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-wrap: balance;
  background: linear-gradient(180deg, transparent 62%, #ffe14d 62%, #ffe14d 92%, transparent 92%);
}

/* 章节标题组件（## 标题）——去掉共享 left-border 卡片皮肤 */
#wemd .wemd-section-title {
  padding: 0;
  background: transparent;
  border-left: none;
  border-radius: 0;
}
#wemd .wemd-section-title .wemd-component-body > h2 {
  margin-top: 44px;
  margin-right: 0;
  margin-bottom: 20px;
  margin-left: 0;
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 6px;
  padding-left: 0;
  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left: none;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", serif;
  font-size: 21px;
  font-weight: 700;
  color: #2b2118;
  letter-spacing: 0.02em;
  text-align: left;
  background: linear-gradient(180deg, transparent 62%, #ffe14d 62%, #ffe14d 92%, transparent 92%);
}

/* h3 / h4：橙红 */
#wemd h3 {
  margin: 32px 0 16px;
  padding: 0;
  border: none;
  text-align: left;
}
#wemd h3 .content {
  color: #e8590c;
  font-size: 18px;
  font-weight: 700;
}
#wemd h4 {
  margin: 26px 0 13px;
  padding: 0;
  border: none;
  text-align: left;
}
#wemd h4 .content {
  color: #c2410c;
  font-size: 16px;
  font-weight: 700;
}

/* ============================================================
   组件级差异化（覆盖共享组件样式，真实元素 / 渐变表达）
   ============================================================ */

/* === magazine-cover · 学习手册封面（骨架定制） === */
#wemd .wemd-magazine-cover {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin: 18px 0 36px;
  padding: 48px 30px 36px;
  background: linear-gradient(180deg, #fdfaf2, #f6efdf);
  border: 1px solid #e6dcc7;
  border-radius: 6px;
  /* 不裁切：让挂顶胶带能露出卡片上边界（公众号兼容，负 margin 方案） */
}
#wemd .wemd-cg-tape {
  display: block;
  width: 170px;
  height: 26px;
  margin: -54px auto 26px;
  background: rgba(255, 225, 77, 0.55);
  border: 1px solid rgba(200, 170, 40, 0.28);
  transform: rotate(-2deg);
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-cg-stamp {
  float: right;
  width: 62px;
  height: 62px;
  margin: 0 0 14px 12px;
  border-radius: 50%;
  border: 2px dashed #e8590c;
  color: #e8590c;
  font-family: "SF Mono", Consolas, monospace;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  box-sizing: border-box;
  padding: 14px 4px;
  letter-spacing: 0.08em;
  transform: rotate(8deg);
  opacity: 0.88;
}
/* 让标题/落款从印章下方开始（float 不占流，需 clear 避免被标题文字重叠遮挡） */
#wemd .wemd-cg-kicker {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  clear: both;
  font-size: 12px;
  letter-spacing: 0.28em;
  color: #6b5d4f;
}
#wemd .wemd-cg-title {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin-top: 16px;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", serif;
  font-size: 30px;
  font-weight: 800;
  line-height: 1.5;
  letter-spacing: 0.02em;
  color: #2b2118;
}
#wemd .wemd-cg-desc {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin-top: 14px;
  font-size: 13.5px;
  line-height: 2;
  color: #6b5d4f;
}

/* === section-divider · 手写编号 + 荧光下划线（骨架定制） === */
#wemd .wemd-section-divider {
  margin: 46px 0 18px;
}
#wemd .wemd-cg-no {
  display: inline-block;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", serif;
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
  color: #e8590c;
  transform: rotate(-6deg);
}
#wemd .wemd-cg-title {
  margin: 12px 0 0;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", serif;
  font-size: 21px;
  font-weight: 700;
  line-height: 1.6;
  color: #2b2118;
  background: linear-gradient(180deg, transparent 62%, #ffe14d 62%, #ffe14d 92%, transparent 92%);
}

/* === steps · 荧光编号 + 便利贴批注（默认骨架 + 皮肤） === */
#wemd .wemd-steps {
  margin: 8px 0;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
}
#wemd .wemd-steps .wemd-component-body {
  padding: 0;
}
#wemd .wemd-steps .wemd-component-body > p:first-child {
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", serif;
  font-size: 16px;
  font-weight: 700;
  color: #c2410c;
  margin: 0 0 10px 0;
}
#wemd .wemd-steps .wemd-component-body ol,
#wemd .wemd-steps .wemd-component-body ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
#wemd .wemd-steps .wemd-component-body li {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin: 0 0 12px;
  padding: 16px 18px 16px 56px;
  background: #fffdf8;
  border: 1px solid #e6dcc7;
  border-radius: 6px;
  font-size: 14.5px;
  line-height: 1.9;
  color: #2b2118;
}
/* 步骤序号：真实数字（markdown 有序列表自带）用荧光圆点强调，无伪元素 */
#wemd .wemd-steps .wemd-component-body li strong {
  color: #c2410c;
}

/* === toc-nav · 手写目录（默认骨架 + 皮肤） === */
#wemd .wemd-toc-nav {
  margin: 8px 0;
  padding: 20px 22px;
  background: #fffdf8;
  border: 1px solid #e6dcc7;
  border-radius: 6px;
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  box-shadow: none;
}
#wemd .wemd-toc-nav .wemd-component-body > p:first-child {
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #e8590c;
  margin: 0 0 14px 0;
}
#wemd .wemd-toc-nav .wemd-component-body ul,
#wemd .wemd-toc-nav .wemd-component-body ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
#wemd .wemd-toc-nav .wemd-component-body li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px dashed #e6dcc7;
  font-size: 14.5px;
  line-height: 1.8;
  color: #2b2118;
}
#wemd .wemd-toc-nav .wemd-component-body li span.toc-num {
  font-family: "SF Mono", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  color: #e8590c;
  min-width: 26px;
}
#wemd .wemd-toc-nav .wemd-component-body li a {
  color: #2b2118;
}

/* === quote-card · 整段荧光重点（默认骨架 + 皮肤） === */
#wemd .wemd-quote-card {
  margin: 28px 0;
  padding: 22px 24px;
  background: linear-gradient(180deg, transparent 30%, #ffe14d 30%, #ffe14d 100%);
  border-left: 5px solid #e8590c;
  border-radius: 0;
  box-shadow: none;
}
#wemd .wemd-quote-card .wemd-qc-quote {
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", serif;
  font-size: 16px;
  line-height: 2;
  color: #2b2118;
  font-weight: 700;
}
#wemd .wemd-quote-card .wemd-qc-author {
  margin-top: 10px;
  font-family: "SF Mono", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #6b5d4f;
}

/* === callout-pro · 便利贴（默认骨架 + 皮肤） === */
#wemd .wemd-callout-pro {
  margin: 26px 0;
  padding: 18px 20px;
  background: #fff3ad;
  border: 1px solid #e8d476;
  border-left: 5px solid #e8590c;
  border-radius: 3px;
  box-shadow: 4px 5px 0 rgba(200, 170, 40, 0.14);
  transform: rotate(-0.4deg);
}
/* 左侧条已用 border-left 表达，去掉共享 ::before 色条，避免预览与导出出现双竖线 */
#wemd .wemd-callout-pro::before {
  content: none;
}
#wemd .wemd-callout-pro .wemd-component-body > p {
  font-size: 14px;
  line-height: 2;
  color: #2b2118;
  margin: 0;
}
#wemd .wemd-callout-pro .wemd-component-body > p b {
  color: #c2410c;
}

/* === end-card · 手写落款（默认骨架 + 皮肤） === */
#wemd .wemd-end-card {
  margin: 40px 0 6px;
  padding: 34px 22px;
  text-align: center;
  background: #f2ead9;
  border-top: 2px solid #e6dcc7;
  border-radius: 0;
  color: #2b2118;
}
#wemd .wemd-end-card .wemd-ec-title {
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.18em;
  color: #c2410c;
}
#wemd .wemd-end-card .wemd-ec-subtitle {
  margin-top: 12px;
  font-family: "SF Mono", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  color: #6b5d4f;
}

/* === styled-table · 手写纸表（默认骨架 + 皮肤） === */
#wemd .wemd-styled-table .wemd-sbt-table {
  border: 1px solid #e6dcc7;
  border-radius: 6px;
  overflow: hidden;
  background: #fffdf8;
}
#wemd .wemd-styled-table .wemd-sbt-table table th {
  background: #f2ead9;
  color: #2b2118;
  font-weight: 700;
  text-align: left;
  padding: 11px 14px;
  font-size: 12px;
  letter-spacing: 0.08em;
  border-bottom: 2px solid #e6dcc7;
}
#wemd .wemd-styled-table .wemd-sbt-table table td {
  padding: 11px 14px;
  border-top: 1px solid #e6dcc7;
  font-family: "SF Mono", Consolas, monospace;
  font-size: 12.5px;
  color: #2b2118;
}

/* === divider · 手写虚线 + ✦（骨架定制） === */
#wemd .wemd-divider {
  margin: 40px 0;
}
#wemd .wemd-divider .wemd-component-body {
  display: flex;
  align-items: center;
  gap: 14px;
}
#wemd .wemd-cg-dvline {
  flex: 1;
  border-bottom: 2px dashed #e6dcc7;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-cg-glyph {
  color: #e8590c;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", serif;
  font-size: 14px;
  letter-spacing: 0.2em;
  transform: rotate(-3deg);
}

/* === timeline · 手写纸线（默认骨架 + 皮肤） === */
#wemd .wemd-timeline {
  margin: 24px 0;
  padding: 20px 24px;
  background: #fffdf8;
  border: 1px solid #e6dcc7;
  border-radius: 6px;
}
#wemd .wemd-timeline .wemd-tl-title {
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", serif;
  font-size: 15px;
  font-weight: 700;
  color: #c2410c;
  margin-bottom: 13px;
}
#wemd .wemd-timeline .wemd-tl-events {
  border-left: 2px dashed #e6dcc7;
  margin-left: 8px;
}
#wemd .wemd-timeline .wemd-tl-dot {
  background: #e8590c;
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 2px #e6dcc7;
}
#wemd .wemd-timeline .wemd-tl-text {
  color: #2b2118;
}
`;

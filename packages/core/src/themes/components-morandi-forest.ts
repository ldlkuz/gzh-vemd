/**
 * 莫兰迪森林 · 主题皮肤（雾林 · 层林）
 *
 * 设计语言：深松 #46573e → 雾苔 #a9b89a → 雾气 #eef0e8 的纵向层次，
 *   苔绿 #7f9070 主 · 雾蓝/雾苔 #a9b89a 辅 · 陶土 #c08f77 点缀，圆润柔和、大留白。
 * 场景：生活方式 / 情感 / 自然观察 / 品牌叙事。
 *
 * 微信约束：
 * - #wemd 不设整篇背景（背景交给公众号编辑器），纸感用极淡渐变表达。
 * - 装饰全部真实 DOM / 边框 / 渐变，无伪元素、无结构伪类；
 *   仅用 `content: none` 中和共享 ::before（避免双条叠加）。
 * - 叶片造型用真实 span 的 border-radius 圆角实现（0 50% 50% 50%）。
 * - 深色块（深松收束）一律配浅字（颜色冲撞检查点）。
 * - code-frame 保持内置默认骨架与皮肤（本主题不定制代码块）。
 */

export const componentStylesMorandiForest = `/* === 莫兰迪森林：层林 · 全局皮肤 === */

/* 全局：衬线 + 墨绿灰字（不写整篇背景色） */
#wemd {
  color: #33382e;
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", "PingFang SC", serif;
  font-size: 16px;
  line-height: 2;
  letter-spacing: 0.02em;
  background-image: none;
}

/* 正文 */
#wemd p {
  margin: 0 0 26px;
  color: #33382e;
  font-size: 16px;
  line-height: 2;
  text-align: justify;
}
#wemd p b {
  color: #46573e;
}

/* ---- 标题（圆润柔和） ---- */
#wemd h1 {
  margin: 30px 0 34px;
  text-align: center;
}
#wemd h1 .content {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  color: #33382e;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1.5;
  text-wrap: balance;
}

/* h2：苔绿左条 */
#wemd h2 {
  margin: 46px 0 18px;
  padding: 0 0 10px 16px;
  border: none;
  border-left: 5px solid #7f9070;
  text-align: left;
}
#wemd h2 .content {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  color: #33382e;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-wrap: balance;
}

/* 章节标题组件（## 标题）——去掉共享 left-border 卡片皮肤，保留苔绿左条 */
#wemd .wemd-section-title {
  padding: 0;
  background: transparent;
  border-left: none;
  border-radius: 0;
}
#wemd .wemd-section-title .wemd-component-body > h2 {
  margin-top: 42px;
  margin-right: 0;
  margin-bottom: 18px;
  margin-left: 0;
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 10px;
  padding-left: 16px;
  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left: 5px solid #7f9070;
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 21px;
  font-weight: 700;
  color: #33382e;
  letter-spacing: 0.08em;
  text-align: left;
}

/* h3 / h4：深松 / 灰绿 */
#wemd h3 {
  margin: 30px 0 14px;
  padding: 0;
  border: none;
  text-align: left;
}
#wemd h3 .content {
  color: #46573e;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-wrap: balance;
}
#wemd h4 {
  margin: 26px 0 14px;
  padding: 0;
  border: none;
  text-align: left;
}
#wemd h4 .content {
  color: #6d7465;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

/* ============================================================
   叶片基础造型（真实元素，圆角叶片）
   ============================================================ */
#wemd .wemd-mf-leaf {
  display: inline-block;
  width: 12px;
  height: 17px;
  border-radius: 0 50% 50% 50%;
  background: #7f9070;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-mf-leaf-pine { background: #46573e; }
#wemd .wemd-mf-leaf-mist { background: #a9b89a; }
#wemd .wemd-mf-leaf-clay { background: #c08f77; }

/* ============================================================
   组件级差异化（覆盖共享组件样式，全部真实元素 / 渐变表达）
   ============================================================ */

/* === magazine-cover · 层林封面（骨架定制） === */
#wemd .wemd-magazine-cover {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin: 0 0 44px;
  padding: 36px 30px 0;
  background: linear-gradient(180deg, #f5f3ea 0%, #dde5d0 52%, #8fa383 100%);
  border: 1px solid #d9d5c6;
  border-radius: 18px;
  text-align: center;
  overflow: hidden;
}
#wemd .wemd-magazine-cover .wemd-mf-canopy {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 14px;
  margin-bottom: 30px;
}
#wemd .wemd-mf-vine {
  width: 1px;
  height: 42px;
  background: linear-gradient(180deg, transparent, #7f9070);
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-magazine-cover .wemd-mf-canopy .wemd-mf-leaf-pine {
  width: 11px;
  height: 15px;
  align-self: center;
}
#wemd .wemd-magazine-cover .wemd-mf-kicker {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  color: #46573e;
}
#wemd .wemd-magazine-cover .wemd-mf-title {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin-top: 22px;
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 0.18em;
  line-height: 1.45;
  color: #33382e;
}
#wemd .wemd-mf-mistline {
  display: block;
  width: 56px;
  height: 3px;
  margin: 24px auto 0;
  border-radius: 99px;
  background: linear-gradient(90deg, transparent, #c08f77, transparent);
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-magazine-cover .wemd-mf-desc {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin-top: 22px;
  font-size: 14px;
  line-height: 2.1;
  color: #33382e;
}
#wemd .wemd-mf-ridge {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  display: block;
  height: 24px;
  margin: 26px -30px 0;
  background:
    linear-gradient(135deg, transparent 49%, #b9c4a8 50%) left/50% 100% no-repeat,
    linear-gradient(45deg, transparent 49%, #a9b89a 50%) right/50% 100% no-repeat;
  opacity: 0.7;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}

/* === section-divider · 大编辑式章节号（骨架定制） === */
#wemd .wemd-section-divider {
  margin: 56px 0 26px;
}
#wemd .wemd-section-divider .wemd-mf-big {
  display: block;
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", serif;
  font-size: 64px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.04em;
  color: #a9b89a;
}
#wemd .wemd-section-divider .wemd-mf-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-top: 8px;
}
#wemd .wemd-section-divider .wemd-mf-title {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #33382e;
}
#wemd .wemd-section-divider .wemd-mf-line {
  flex: 1;
  height: 1px;
  background: #d9d5c6;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-section-divider .wemd-mf-leaf {
  width: 11px;
  height: 15px;
}

/* === divider · 林冠分隔线（骨架定制） === */
#wemd .wemd-divider {
  margin: 44px 0;
}
#wemd .wemd-divider .wemd-component-body {
  display: flex;
  align-items: center;
  gap: 12px;
}
/* 中和共享 ::before/::after 实线，避免骨架细线与其叠加成双线 */
#wemd .wemd-divider .wemd-component-body::before,
#wemd .wemd-divider .wemd-component-body::after {
  content: none;
}
#wemd .wemd-mf-dline {
  flex: 1;
  height: 1px;
  background: #a9b89a;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-mf-drip {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#wemd .wemd-mf-drip .wemd-mf-leaf {
  width: 12px;
  height: 17px;
}

/* === quote-card · 悬挂果实（骨架定制） === */
#wemd .wemd-quote-card {
  margin: 44px 0;
  padding: 46px 30px 32px;
  background: #fbf9f2;
  border: 1px solid #d9d5c6;
  border-left: 1px solid #d9d5c6;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(80, 95, 55, 0.07);
  text-align: center;
  /* 容器不用 position:relative；悬挂装饰通过正常流 + 负 margin 挂出顶边 */
}
/* 悬挂果实（真实元素：span.wemd-mf-hang 内含 stem + leaf-clay）。
   原 position:absolute; top:0; left:50%; transform:translateX(-50%);
   → 改为正常流 flex 容器 + 块级水平居中（margin auto）：
   - padding-top:46 → 要从容器顶部（y=0）开始：margin-top: -46px
   - stem(18) + leaf(18) = 总高 36，结束 y=36。需盒子结束于 y=46（padding-top 内顶），
     使 qc-quote 从 y=46 开始不被装饰挤压 → margin-bottom = 46 - 36 - (-46+46)？
     公式：盒子净高度 = mt + height + mb；目标净占用 0（相对容器内容起点 y=46）：
     - 盒子放在正常流中「本应从 y=46 开始」+ mt=-46 → 实际起点 y=0
     - content 高 36，结束 y=36
     - 需要后续元素（qc-quote）仍从 y=46 开始 → mb = 46 - 36 = 10px
   - 水平居中：display:flex（块级）+ margin: -46px auto 10px auto → 完美居中。 */
#wemd .wemd-quote-card .wemd-mf-hang {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: -46px auto 10px auto;
}
#wemd .wemd-mf-stem {
  width: 1px;
  height: 18px;
  background: #c08f77;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-quote-card .wemd-mf-hang .wemd-mf-leaf-clay {
  width: 13px;
  height: 18px;
}
#wemd .wemd-quote-card .wemd-qc-quote {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 20px;
  line-height: 2;
  color: #33382e;
  font-weight: 400;
  letter-spacing: 0.06em;
  text-align: center;
}
#wemd .wemd-quote-card .wemd-qc-author {
  display: block;
  margin-top: 16px;
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.24em;
  color: #46573e;
}

/* === full-quote · 苔绿淡底引语条 === */
#wemd .wemd-full-quote {
  margin: 42px 0;
  padding: 40px 34px 34px;
  background: linear-gradient(180deg, #e7ecdc, #dce4cc);
  border-top: 1px solid #d3dbc9;
  border-bottom: 1px solid #d3dbc9;
  border-left: none;
  border-radius: 0;
  text-align: center;
}
#wemd .wemd-full-quote .wemd-fq-text {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 20px;
  line-height: 2;
  color: #33382e;
  letter-spacing: 0.05em;
}

/* === pullquote · 苔绿淡底引用（雾底 + 苔绿左条） === */
#wemd .wemd-pullquote {
  margin: 36px 0;
  padding: 26px 28px;
  background: #eef0e8;
  border-left: 5px solid #7f9070;
  border-radius: 14px;
}
#wemd .wemd-pullquote .wemd-component-body blockquote p {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 18px;
  line-height: 2;
  color: #33382e;
  font-weight: 600;
}

/* === text-card · 米白正文卡（圆润 + 苔绿左条） === */
#wemd .wemd-text-card {
  margin: 32px 0;
  padding: 26px 28px;
  background: #fbf9f2;
  border: 1px solid #d9d5c6;
  border-left: 5px solid #7f9070;
  border-radius: 16px;
  box-shadow: none;
  font-size: 15.5px;
  line-height: 2;
  color: #33382e;
}
#wemd .wemd-text-card p {
  margin: 0 0 14px;
  color: #33382e;
}
#wemd .wemd-text-card p b {
  color: #46573e;
}

/* === callout / callout-pro · 陶土提示（米底 + 陶土左条） === */
#wemd .wemd-callout {
  margin: 32px 0;
  padding: 22px 26px;
  background: #f4f1e8;
  border: 1px solid #d9d5c6;
  border-left: 5px solid #c08f77;
  border-radius: 14px;
}
#wemd .wemd-callout .wemd-component-body > p {
  color: #33382e;
  font-size: 15px;
  line-height: 2;
}
#wemd .wemd-callout .wemd-component-body > p strong {
  color: #c08f77;
}
#wemd .wemd-callout-pro {
  margin: 32px 0;
  padding: 22px 26px;
  background: #f4f1e8;
  border: 1px solid #d9d5c6;
  border-left: 5px solid #c08f77;
  border-radius: 14px;
  box-shadow: none;
  transform: none;
}
#wemd .wemd-callout-pro::before {
  content: none;
}
#wemd .wemd-callout-pro .wemd-component-body > p {
  font-size: 15px;
  line-height: 2;
  color: #33382e;
  margin: 0;
}
#wemd .wemd-callout-pro .wemd-component-body > p b {
  color: #c08f77;
}

/* === stats-block · 数据（米白卡 + 苔绿顶边 + 深松数字） === */
#wemd .wemd-stats-block {
  margin: 36px 0;
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
  gap: 12px;
  flex-wrap: wrap;
}
#wemd .wemd-stats-block .wemd-sb-items-item {
  flex: 1;
  min-width: 150px;
  margin: 0;
  padding: 26px 18px;
  background: #fbf9f2;
  border: 1px solid #d9d5c6;
  border-top: 4px solid #7f9070;
  border-radius: 16px;
  box-shadow: none;
  text-align: center;
}
#wemd .wemd-stats-block .wemd-sb-items-value {
  color: #46573e;
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", serif;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
#wemd .wemd-stats-block .wemd-sb-items-label {
  margin-top: 10px;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: #6d7465;
  line-height: 1.6;
}

/* === timeline · 藤蔓时间线（叶节点，真实元素改形） === */
#wemd .wemd-timeline {
  margin: 32px 0;
  padding: 30px 30px 22px;
  background: #fbf9f2;
  border: 1px solid #d9d5c6;
  border-radius: 16px;
}
#wemd .wemd-timeline .wemd-tl-title {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 16px;
  font-weight: 700;
  color: #33382e;
  letter-spacing: 0.1em;
  margin-bottom: 22px;
}
#wemd .wemd-timeline .wemd-tl-events {
  border-left: 1px solid #a9b89a;
  margin-left: 10px;
  padding: 0; /* 去掉共享 padding-left:20px，让叶节点能落在竖线上 */
}
#wemd .wemd-timeline .wemd-tl-item {
  display: flex;
  align-items: flex-start;
  padding: 8px 0 8px 0;
  margin: 0;
}
/* 叶节点定位：flex 子项 + 负 margin-left 跨到竖线中心（公众号保留 flex，不依赖 position）。
   几何：events border-left 1px + margin-left:10px → 竖线中心 x=10.5；padding:0 → item 内容起点
   x≈11；叶水平半宽 6.5px，margin-left:-7px 让左边缘到 x=11-7=4 → 中心落在 x=4+6.5=10.5（=竖线中心）。 */
#wemd .wemd-timeline .wemd-tl-dot {
  flex: none;
  width: 13px;
  height: 18px;
  margin-top: 4px;
  margin-left: -7px;
  margin-right: 12px;
  border-radius: 0 50% 50% 50%;
  background: #7f9070;
  border: none;
  box-shadow: none;
}
#wemd .wemd-timeline .wemd-tl-text {
  flex: 1;
  color: #33382e;
}

/* === styled-table · 苔绿表格（雾苔表头 + 细线） === */
#wemd .wemd-styled-table .wemd-sbt-table {
  border: 1px solid #d9d5c6;
  border-radius: 14px;
  overflow: hidden;
  background: #fbf9f2;
}
#wemd .wemd-styled-table .wemd-sbt-table table th {
  background: #d3dbc9;
  color: #46573e;
  font-weight: 700;
  text-align: left;
  padding: 14px 16px;
  font-size: 13px;
  letter-spacing: 0.1em;
  border-bottom: 2px solid #7f9070;
}
#wemd .wemd-styled-table .wemd-sbt-table table td {
  padding: 14px 16px;
  border-top: 1px solid #ece7d8;
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", serif;
  font-size: 13px;
  color: #33382e;
}

/* === 图片类 · 圆润画框 === */
#wemd .wemd-image-card {
  margin: 36px 0;
  padding: 10px;
  background: #fbf9f2;
  border: 1px solid #d9d5c6;
  border-radius: 16px;
  box-shadow: none;
}
#wemd .wemd-image-card .wemd-ic-image img {
  border-radius: 10px;
}
#wemd .wemd-image-card .wemd-ic-caption {
  margin: 12px 4px 4px;
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #6d7465;
}
#wemd .wemd-image-caption .wemd-component-body p {
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #6d7465;
  font-style: normal;
}
#wemd .wemd-image-caption .wemd-component-body p em {
  color: #6d7465;
  font-style: normal;
}
#wemd .wemd-image-grid .wemd-component-body p img {
  border: 1px solid #d9d5c6;
  border-radius: 12px;
}
#wemd .wemd-image-compare .wemd-component-body figure {
  border: 1px solid #d9d5c6;
  border-radius: 12px;
}
#wemd .wemd-image-compare .wemd-component-body figure img {
  border-radius: 8px;
}
#wemd .wemd-image-text-row {
  margin: 32px 0;
  background: transparent;
  border: 1px solid #d9d5c6;
  border-radius: 14px;
  padding: 18px;
}
#wemd .wemd-image-text-row .wemd-component-body p {
  color: #33382e;
}

/* === toc-nav · 目录（米白卡 + 苔绿编号） === */
#wemd .wemd-toc-nav {
  margin: 24px 0;
  padding: 26px 28px;
  background: #fbf9f2;
  border: 1px solid #d9d5c6;
  border-radius: 16px;
}
#wemd .wemd-toc-nav .wemd-component-body > p:first-child {
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #46573e;
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
  border-bottom: 1px dashed #d9d5c6;
  font-size: 15px;
  line-height: 1.8;
  color: #33382e;
}
#wemd .wemd-toc-nav .wemd-component-body li span.toc-num {
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #7f9070;
  min-width: 30px;
}

/* === steps · 步骤（米白卡 + 圆序号） === */
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
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #33382e;
  margin: 0 0 20px;
}
#wemd .wemd-steps .wemd-component-body ol,
#wemd .wemd-steps .wemd-component-body ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
#wemd .wemd-steps .wemd-component-body li {
  margin: 0 0 16px;
  padding: 20px 20px 20px 62px;
  background: #fbf9f2;
  border: 1px solid #d9d5c6;
  border-radius: 16px;
  font-size: 15px;
  line-height: 1.95;
  color: #33382e;
}
#wemd .wemd-steps .wemd-component-body li strong {
  color: #46573e;
}

/* === faq · 问答（米白 + 苔绿挂角） === */
#wemd .wemd-faq {
  margin: 32px 0;
}
#wemd .wemd-faq .wemd-component-body {
  border: 1px solid #d9d5c6;
  background: #fbf9f2;
  box-shadow: none;
  border-radius: 16px;
  padding: 54px 26px 24px;
}
#wemd .wemd-faq .wemd-component-body > p.wemd-q strong {
  color: #46573e;
}
#wemd .wemd-faq .wemd-component-body > p {
  color: #33382e;
}

/* === end-card · 深松收束（骨架定制） === */
#wemd .wemd-end-card {
  margin: 56px 0 10px;
  padding: 48px 30px 46px;
  text-align: center;
  background: linear-gradient(180deg, #52644a, #34452e);
  border: none;
  border-radius: 18px;
  color: #f4f3ec;
}
#wemd .wemd-end-card .wemd-mf-canopy {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-bottom: 24px;
}
#wemd .wemd-end-card .wemd-mf-canopy .wemd-mf-leaf {
  background: #d9e2c8;
}
#wemd .wemd-end-card .wemd-ec-title {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: #f6f4ec;
}
#wemd .wemd-end-card .wemd-ec-subtitle {
  display: block;
  margin-top: 16px;
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.26em;
  color: #c6d1b4;
}
/* 深色林底上的正文：覆盖共享 .wemd-ec-body 的深字兜底，且必须连 <p> 一起覆盖——
   全局 #wemd p { color:#33382e } 会直接声明在段落上，仅改 section 会被继承丢失 */
#wemd .wemd-end-card .wemd-ec-body,
#wemd .wemd-end-card .wemd-ec-body p {
  color: #dfe6d2;
}
#wemd .wemd-end-card .wemd-ec-body strong {
  color: #f6f4ec;
}
#wemd .wemd-end-card .wemd-mf-mistline {
  display: block;
  width: 52px;
  height: 3px;
  margin: 26px auto 0;
  border-radius: 99px;
  background: linear-gradient(90deg, transparent, #c6d1b4, transparent);
}

/* === share-card · 分享（顶细线） === */
#wemd .wemd-share-card {
  margin: 44px 0 28px;
  padding: 24px 16px 20px;
  text-align: center;
  border-top: 1px solid #d9d5c6;
}
#wemd .wemd-share-card .wemd-component-body p {
  color: #6d7465;
  font-size: 13px;
  letter-spacing: 0.08em;
}

/* === hero-banner · 圆润横幅（米白 + 苔绿边框） === */
#wemd .wemd-hero-banner {
  margin: 0 0 40px;
  border-radius: 18px;
  border: 1px solid #d9d5c6;
}
#wemd .wemd-hero-banner .wemd-component-body {
  padding: 48px 32px;
  text-align: center;
}
#wemd .wemd-hero-banner .wemd-hb-title {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #33382e;
  text-align: center;
}
#wemd .wemd-hero-banner .wemd-hb-title strong {
  color: #46573e;
}
#wemd .wemd-hero-banner .wemd-hb-subtitle {
  font-size: 14px;
  letter-spacing: 0.12em;
  color: #6d7465;
  text-align: center;
}

/* === cta-card · 苔绿行动卡（米白 + 苔绿顶边 + 圆润牌匾） === */
#wemd .wemd-cta-card {
  margin: 36px 0;
  padding: 36px 28px;
  background: #fbf9f2;
  border: 1px solid #d9d5c6;
  border-top: 4px solid #7f9070;
  border-radius: 16px;
  text-align: center;
  color: #33382e;
}
#wemd .wemd-cta-card .wemd-cta-title {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #33382e;
}
#wemd .wemd-cta-card .wemd-cta-body {
  font-size: 14px;
  line-height: 1.95;
  color: #6d7465;
}
#wemd .wemd-cta-card .wemd-cta-action {
  display: inline-block;
  padding: 6px 22px;
  background: transparent;
  border: 1px solid #7f9070;
  border-radius: 99px;
  font-size: 13px;
  letter-spacing: 0.1em;
  color: #46573e;
  margin: 14px 0 0;
}

/* === follow-bar · 关注条（同路径同特异性覆盖共享白色文本，去按钮化） === */
#wemd .wemd-follow-bar {
  margin: 0 0 28px;
  padding: 16px 20px;
  background: #fbf9f2;
  border: 1px solid #d9d5c6;
  border-left: 5px solid #7f9070;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #33382e;
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
  color: #33382e;
  flex: 1;
}
#wemd .wemd-follow-bar .wemd-component-body > p:first-child strong {
  color: #46573e;
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
  letter-spacing: 0.16em;
  color: #c08f77;
  flex-shrink: 0;
}

/* === brand-sign · 森林落款 === */
#wemd .wemd-brand-sign {
  margin: 36px 0;
  padding: 0;
}
#wemd .wemd-brand-sign .wemd-bs-wrapper {
  padding: 30px 24px;
  border: 1px solid #d9d5c6;
  border-radius: 16px;
  background: #fbf9f2;
}
#wemd .wemd-brand-sign .wemd-bs-brand-name {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #33382e;
}
#wemd .wemd-brand-sign .wemd-bs-tagline {
  font-size: 13px;
  letter-spacing: 0.08em;
  color: #6d7465;
}
#wemd .wemd-brand-sign .wemd-bs-slogan {
  font-family: "SF Mono", "Cascadia Code", Consolas, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #46573e;
}
#wemd .wemd-brand-sign .wemd-bs-logo {
  color: #7f9070;
}
#wemd .wemd-brand-sign .wemd-bs-divider-dot {
  color: #c08f77;
}

/* === copyright-notice · 版权（顶细线） === */
#wemd .wemd-copyright-notice {
  margin: 26px 0;
  padding: 16px 18px;
  background: transparent;
  border-left: none;
  border-top: 1px solid #d9d5c6;
  border-radius: 0;
  font-size: 12px;
}
#wemd .wemd-copyright-notice .wemd-component-body p {
  font-size: 12px;
  line-height: 1.8;
  color: #6d7465;
}

/* === resource-list / tag-label · 森林清单与标签 === */
#wemd .wemd-resource-list {
  background: #fbf9f2;
  border: 1px solid #d9d5c6;
  border-radius: 14px;
}
#wemd .wemd-resource-list .wemd-rl-title {
  font-family: "Georgia", "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC", serif;
  color: #33382e;
}
#wemd .wemd-resource-list .wemd-rl-item {
  background: #ffffff;
  border: 1px solid #e0dccb;
  border-radius: 12px;
}
#wemd .wemd-tag-label .wemd-component-body > p,
#wemd .wemd-tag-label .wemd-component-body li {
  background: #f0f2e9;
  color: #46573e;
  border: 1px solid #d3dbc9;
  border-radius: 99px;
}
`;

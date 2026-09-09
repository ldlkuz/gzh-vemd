/**
 * 落日胶片主题 - 皮肤（胶片黄昏 Sunset Film）
 *
 * 设计：一张刚冲印出来的 35mm 胶片。
 * - 暖奶油纸 + 落日橙 #f2762e + 暮紫 #4a2f4e + 金 #ffcf87
 * - 胶片颗粒（SVG feTurbulence 噪点，组件级覆盖层）+ 漏光（径向光晕）
 * - 齿孔带（repeating-linear-gradient）、双线片框、暗房深紫黑终端
 * - 无整篇背景（#wemd 交给编辑器）；全部真实 DOM，无伪元素、无按钮式互动
 * - 注意：SVG data URI 颗粒不能放进 background-image（公众号内联解析会因逗号/括号/引号
 *   嵌套丢弃整条 background），故封面/落款改用单段线性渐变近似黄昏质感。
 */

export const componentStylesSunsetFilm = `/* === 落日胶片（胶片黄昏）组件样式 === */

/* 全局 */
#wemd {
  color: #352b2a;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 15px;
  line-height: 1.9;
  letter-spacing: 0.01em;
  background-image: none;
}

#wemd p {
  margin: 0 0 14px;
  color: #352b2a;
  font-size: 15px;
  line-height: 1.9;
  text-align: justify;
}

#wemd p b,
#wemd p strong {
  color: #f2762e;
  font-weight: 700;
}

#wemd em {
  font-style: normal;
  color: #4a2f4e;
  font-weight: 700;
}

#wemd a {
  color: #f2762e;
  text-decoration: none;
  border-bottom: 1px dotted #f2762e;
}

/* 胶片颗粒：SVG data URI 无法安全进入 background-image（公众号内联解析会丢弃整条背景）。
   颗粒质感放弃，改为单段线性渐变（封面/落款）近似黄昏层次；
   原骨架中的 .wemd-sf-grain span 设为 display:none 避免占空间（带 &nbsp; 不会被当空元素删除）。 */
#wemd .wemd-sf-grain {
  display: none;
}

/* === 标题（衬线 + 黄昏调） === */
#wemd h1 {
  margin: 26px 0 16px;
  padding: 0 0 10px;
  border-bottom: 2px solid #352b2a;
  text-align: center;
}
#wemd h1 .content {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #352b2a;
  text-align: center;
}

#wemd h2 {
  margin: 26px 0 12px;
  padding: 0 0 8px;
  border-bottom: 1px solid #e2d5c2;
}
#wemd h2 .content {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #352b2a;
}

#wemd h3 {
  margin: 20px 0 10px;
}
#wemd h3 .content {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #352b2a;
}

#wemd h4 .content {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: #f2762e;
}

/* section-title 跟随 h2 */
#wemd .wemd-section-title {
  margin: 26px 0 12px;
  padding: 0 0 8px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #e2d5c2;
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
  letter-spacing: 0.05em;
  color: #352b2a;
}

/* === 封面静帧 magazine-cover === */
#wemd .wemd-magazine-cover {
  margin: 4px 0 26px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
}
#wemd .wemd-magazine-cover .wemd-sf-frame {
  /* 封面黄昏背景：单段 linear-gradient（公众号 100% 可解析，不依赖多段背景/data URI）。
     用密集 color-stop 近似原「漏光 + 暗角」层次：左上金 → 中段落日橙 → 右下暮紫。
     颗粒质感已放弃（SVG data URI 进 background 会导致整条背景在公众号丢失）。 */
  padding: 20px 22px 22px;
  border: 2px solid #352b2a;
  outline: 1px solid #352b2a;
  outline-offset: 4px;
  background-image: linear-gradient(160deg, #f9c27a 0%, #f9a860 22%, #f2762e 45%, #d6635f 65%, #b74f5e 78%, #6a3a52 92%, #4a2f4e 100%);
  overflow: hidden;
  text-align: center;
  color: #fff6ea;
  /* 容器不用 position:relative（公众号会删除 relative/absolute；背景为单段渐变，无定位依赖） */
}
#wemd .wemd-magazine-cover .wemd-sf-kicker {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.34em;
  color: rgba(255, 246, 234, 0.85);
}
#wemd .wemd-magazine-cover .wemd-sf-title {
  margin-top: 14px;
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1.3;
  color: #fff6ea;
  text-shadow: 0 2px 14px rgba(74, 47, 78, 0.4);
}
#wemd .wemd-magazine-cover .wemd-sf-sub {
  margin-top: 12px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.26em;
  color: rgba(255, 246, 234, 0.85);
}
/* 封面底边缘渐变光（真实元素 span，骨架最后一个子元素）。
   原 position:absolute; left/right/bottom:0; height:8px;
   → 正常流 block + 负 margin 抵消容器左右/底部 padding，让它贴底铺满。
   容器 padding: 20px 22px 22px → margin-left/right -22px, margin-bottom -22px。 */
#wemd .wemd-magazine-cover .wemd-sf-edge {
  display: block;
  width: auto;
  height: 8px;
  margin: 20px -22px -22px -22px;
  background: linear-gradient(180deg, transparent, rgba(255, 246, 234, 0.18));
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}

/* === 镜头号 section-divider === */
#wemd .wemd-section-divider {
  margin: 30px 0 16px;
  padding: 0 0 8px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #e2d5c2;
  border-radius: 0;
}
#wemd .wemd-section-divider .wemd-sd-part {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.28em;
  color: #f2762e;
}
#wemd .wemd-section-divider .wemd-sd-title {
  margin-top: 4px;
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #352b2a;
}

/* === divider 齿孔片边（中和共享双线） === */
#wemd .wemd-divider {
  margin: 24px 0;
  height: auto;
  display: block;
}
#wemd .wemd-divider .wemd-component-body::before,
#wemd .wemd-divider .wemd-component-body::after {
  content: none;
}
#wemd .wemd-divider .wemd-sf-sprocket {
  display: block;
  height: 16px;
  background:
    linear-gradient(to right, transparent 0 10px, #e2d5c2 10px 14px) 0 0/22px 100% repeat-x;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}

/* === divider-fancy 胶片细线 === */
#wemd .wemd-divider-fancy {
  margin: 24px 0;
  height: auto;
}
#wemd .wemd-divider-fancy .wemd-df-label {
  border-top: 1px solid #e2d5c2;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: #8a7466;
}
#wemd .wemd-divider-fancy .wemd-df-dots {
  color: #f2762e;
  font-size: 16px;
}

/* === 漏光引语 quote-card === */
#wemd .wemd-quote-card {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin: 26px 0;
  padding: 20px 22px;
  background:
    radial-gradient(120% 90% at 92% -8%, rgba(242, 118, 46, 0.16) 0%, transparent 50%),
    #fffaf0;
  border: 1px solid #e2d5c2;
  border-left: 4px solid #f2762e;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
}
#wemd .wemd-quote-card .wemd-qc-quote {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  z-index: 1;
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.9;
  color: #352b2a;
}
#wemd .wemd-quote-card .wemd-qc-author {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  z-index: 1;
  display: block;
  margin-top: 10px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: #4a2f4e;
}

/* === full-quote 漏光引语 === */
#wemd .wemd-full-quote {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  margin: 26px 0;
  padding: 20px 22px;
  background:
    radial-gradient(120% 90% at 92% -8%, rgba(242, 118, 46, 0.16) 0%, transparent 50%),
    #fffaf0;
  border: 1px solid #e2d5c2;
  border-left: 4px solid #f2762e;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
}
#wemd .wemd-full-quote .wemd-fq-text {
  /* 已移除 position: relative —— 公众号会删除 position: relative/absolute，所有装饰已改用正常流/flex+负 margin/border 实现，详见 theme-development-guide.md */
  z-index: 1;
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.9;
  color: #352b2a;
}
#wemd .wemd-full-quote .wemd-fq-text em {
  color: #4a2f4e;
  font-style: normal;
}

/* === pullquote 摘录 === */
#wemd .wemd-pullquote {
  margin: 22px 0;
  padding: 14px 16px;
  background: #fffaf0;
  border: 1px solid #e2d5c2;
  border-left: 4px solid #f2762e;
  border-radius: 0;
}
#wemd .wemd-pullquote .wemd-component-body blockquote p {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.9;
  color: #352b2a;
}

/* === callout / callout-pro（暖调提示卡） === */
#wemd .wemd-callout {
  margin: 22px 0;
  padding: 14px 16px;
  background: #fffaf0;
  border: 1px solid #e2d5c2;
  border-left: 4px solid #f2762e;
  border-radius: 0;
  box-shadow: none;
}
#wemd .wemd-callout .wemd-component-body > p {
  font-size: 14px;
  line-height: 1.9;
  color: #352b2a;
}
#wemd .wemd-callout .wemd-component-body > p strong {
  color: #f2762e;
}

#wemd .wemd-callout-pro {
  margin: 22px 0;
  padding: 14px 16px;
  background: #fffaf0;
  border: 1px solid #e2d5c2;
  border-left: 4px solid #f2762e;
  border-radius: 0;
  box-shadow: none;
  transform: none;
}
#wemd .wemd-callout-pro::before {
  content: none;
}
#wemd .wemd-callout-pro .wemd-component-body > p {
  font-size: 14px;
  line-height: 1.9;
  color: #352b2a;
}
#wemd .wemd-callout-pro .wemd-component-body > p b {
  color: #f2762e;
}

/* === text-card 暖调便签 === */
#wemd .wemd-text-card {
  margin: 22px 0;
  padding: 16px 18px;
  background: #fffaf0;
  border: 1px solid #e2d5c2;
  border-left: 4px solid #f2762e;
  border-radius: 0;
  box-shadow: none;
  font-size: 14px;
  line-height: 1.9;
  color: #352b2a;
}

/* === stats-block 拍摄参数条（暮紫数值右对齐） === */
#wemd .wemd-stats-block {
  margin: 24px 0;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
}
#wemd .wemd-stats-block .wemd-sb-title {
  margin: 0 0 8px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #f2762e;
}
#wemd .wemd-stats-block .wemd-sb-items {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 2px solid #352b2a;
}
#wemd .wemd-stats-block .wemd-sb-items-item {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: baseline;
  margin: 0;
  padding: 8px 0;
  background: transparent;
  border: none;
  border-bottom: 1px dotted #e2d5c2;
  border-radius: 0;
  box-shadow: none;
}
#wemd .wemd-stats-block .wemd-sb-items-item:last-child {
  border-bottom: none;
}
#wemd .wemd-stats-block .wemd-sb-items-value {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 14px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: #4a2f4e;
}
#wemd .wemd-stats-block .wemd-sb-items-label {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
  color: #8a7466;
}

/* === styled-table 参数对照表 === */
#wemd .wemd-styled-table {
  margin: 20px 0;
  background: transparent;
  border: none;
  border-top: 2px solid #352b2a;
  border-bottom: 1px solid #352b2a;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
}
#wemd .wemd-styled-table table {
  border: none;
}
#wemd .wemd-styled-table table th {
  padding: 9px 0;
  border-bottom: 1px solid #352b2a;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-align: left;
  color: #352b2a;
  background: transparent;
}
#wemd .wemd-styled-table table td {
  padding: 8px 0;
  border-bottom: 1px dotted #e2d5c2;
  font-size: 14px;
  color: #352b2a;
}

/* === timeline 冲印记录（落日橙小方块 + 点线行） === */
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
  color: #f2762e;
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
  border-bottom: 1px dotted #e2d5c2;
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
  background: #f2762e;
  border: none;
  border-radius: 0;
  box-shadow: none;
}
#wemd .wemd-timeline .wemd-tl-text {
  flex: 1;
  font-size: 14px;
  color: #352b2a;
}

/* === steps 冲印流程（落日橙编号 + 顶线） === */
#wemd .wemd-steps {
  margin: 20px 0;
  padding: 0;
  background: transparent;
  border: none;
  border-top: 1px solid #e2d5c2;
  border-radius: 0;
}
#wemd .wemd-steps .wemd-component-body > p:first-child {
  margin: 0 0 6px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #f2762e;
}
#wemd .wemd-steps .wemd-component-body li {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  padding: 9px 0;
  background: transparent;
  border: none;
  border-bottom: 1px dotted #e2d5c2;
  border-radius: 0;
  font-size: 14px;
  line-height: 1.9;
  color: #352b2a;
}
#wemd .wemd-steps .wemd-component-body li:last-child {
  border-bottom: none;
}
#wemd .wemd-steps .wemd-component-body li span {
  color: #f2762e;
  font-weight: 800;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
}

/* === toc-nav 片单索引 === */
#wemd .wemd-toc-nav {
  margin: 20px 0;
  padding: 0;
  background: transparent;
  border: none;
  border-top: 1px solid #352b2a;
  border-bottom: 1px solid #352b2a;
  border-radius: 0;
  box-shadow: none;
}
#wemd .wemd-toc-nav .wemd-component-body > p:first-child {
  margin: 0 0 6px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.24em;
  color: #f2762e;
}
#wemd .wemd-toc-nav .wemd-component-body li {
  padding: 8px 0;
  border-bottom: 1px dotted #e2d5c2;
  font-size: 14px;
  color: #352b2a;
}
#wemd .wemd-toc-nav .wemd-component-body li:last-child {
  border-bottom: none;
}
#wemd .wemd-toc-nav .wemd-component-body li span {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: #f2762e;
  min-width: 26px;
}

/* === faq 问答卡 === */
#wemd .wemd-faq {
  margin: 22px 0;
}
#wemd .wemd-faq .wemd-component-body {
  padding: 40px 16px 14px;
  background: #fffaf0;
  border: 1px solid #e2d5c2;
  border-radius: 0;
  box-shadow: none;
}
#wemd .wemd-faq .wemd-component-body > p {
  font-size: 14px;
  line-height: 1.9;
  color: #352b2a;
}
#wemd .wemd-faq .wemd-component-body > p.wemd-q {
  color: #f2762e;
  font-weight: 700;
}

/* === hero-banner 横幅 === */
#wemd .wemd-hero-banner {
  margin: 4px 0 26px;
  background: transparent;
  border: none;
  border-top: 2px solid #352b2a;
  border-bottom: 1px solid #e2d5c2;
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
  color: #352b2a;
}
#wemd .wemd-hero-banner .wemd-hb-title strong {
  color: #f2762e;
}
#wemd .wemd-hero-banner .wemd-hb-subtitle {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 13px;
  letter-spacing: 0.08em;
  color: #8a7466;
}

/* === cta-card 收卷提示（去按钮化） === */
#wemd .wemd-cta-card {
  margin: 24px 0;
  padding: 16px 0;
  background: transparent;
  border: none;
  border-top: 1px solid #e2d5c2;
  border-bottom: 1px solid #e2d5c2;
  border-radius: 0;
  text-align: left;
  color: #352b2a;
}
#wemd .wemd-cta-card .wemd-cta-title {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #352b2a;
}
#wemd .wemd-cta-card .wemd-cta-body {
  font-size: 13px;
  line-height: 1.9;
  color: #8a7466;
}
#wemd .wemd-cta-card .wemd-cta-action {
  display: inline-block;
  padding: 4px 0;
  background: transparent;
  border: none;
  border-bottom: 1px dotted #f2762e;
  border-radius: 0;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.14em;
  color: #f2762e;
  margin: 8px 0 0;
}

/* === follow-bar 关注（同路径同特异性，去按钮化） === */
#wemd .wemd-follow-bar {
  margin: 0 0 20px;
  padding: 12px 14px;
  background: #fffaf0;
  border: 1px solid #e2d5c2;
  border-left: 4px solid #f2762e;
  border-radius: 0;
  box-shadow: none;
  color: #352b2a;
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
  color: #352b2a;
}
#wemd .wemd-follow-bar .wemd-component-body > p:first-child strong {
  color: #352b2a;
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
  color: #f2762e;
  border-bottom: 1px dotted #f2762e;
}

/* === 胶卷盘 end-card（深紫黑，浅字） === */
#wemd .wemd-end-card {
  margin: 30px 0;
  padding: 30px 20px 24px;
  /* 深紫黑背景：单段 linear-gradient（公众号 100% 可解析；不用多段背景/data URI 颗粒） */
  background-image: linear-gradient(150deg, #3a2436 0%, #241a24 100%);
  border: 1px solid #4a3044;
  border-radius: 0;
  box-shadow: none;
  text-align: center;
  overflow: hidden;
}
#wemd .wemd-end-card .wemd-sf-lbl {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.3em;
  color: #d9a06a;
}
#wemd .wemd-end-card .wemd-sf-reel-title {
  margin-top: 12px;
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #f7ead8;
}
#wemd .wemd-end-card .wemd-sf-reel-title strong {
  color: #ffb36b;
}
#wemd .wemd-end-card .wemd-sf-meta {
  margin-top: 12px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #c9a8b6;
}
/* 深紫黑盘底上的正文：必须连 <p> 覆盖（全局 #wemd p 会把段落染成深字），浅字保证可读 */
#wemd .wemd-end-card .wemd-ec-body,
#wemd .wemd-end-card .wemd-ec-body p {
  color: #e4d2c2;
}
#wemd .wemd-end-card .wemd-ec-body strong {
  color: #f7ead8;
}

/* === share-card 分享页脚 === */
#wemd .wemd-share-card {
  margin: 24px 0 16px;
  padding: 12px 0;
  border-top: 1px solid #e2d5c2;
}
#wemd .wemd-share-card .wemd-component-body p {
  margin: 0;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 13px;
  letter-spacing: 0.08em;
  color: #8a7466;
}

/* === brand-sign 落款 === */
#wemd .wemd-brand-sign {
  margin: 24px 0;
}
#wemd .wemd-brand-sign .wemd-bs-wrapper {
  padding: 20px;
  background: #fffaf0;
  border: 1px solid #e2d5c2;
  border-left: 4px solid #f2762e;
  border-radius: 0;
}
#wemd .wemd-brand-sign .wemd-bs-brand-name {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #352b2a;
}
#wemd .wemd-brand-sign .wemd-bs-tagline {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: #8a7466;
}
#wemd .wemd-brand-sign .wemd-bs-slogan {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #f2762e;
}
#wemd .wemd-brand-sign .wemd-bs-logo {
  color: #f2762e;
}
#wemd .wemd-brand-sign .wemd-bs-divider-dot {
  color: #f2762e;
}

/* === copyright 版权页脚 === */
#wemd .wemd-copyright-notice {
  margin: 18px 0;
  padding: 10px 0;
  background: transparent;
  border: none;
  border-top: 1px solid #e2d5c2;
  border-left: none;
  border-radius: 0;
}
#wemd .wemd-copyright-notice .wemd-component-body p {
  margin: 0;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  line-height: 1.8;
  letter-spacing: 0.08em;
  color: #8a7466;
}

/* === tag-label 胶片标签 === */
#wemd .wemd-tag-label .wemd-component-body > p,
#wemd .wemd-tag-label .wemd-component-body > p span {
  display: inline-block;
  margin: 0 6px 6px 0;
  padding: 3px 12px;
  background: #fffaf0;
  border: 1px solid #e2d5c2;
  border-radius: 0;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: #f2762e;
}

/* === resource-list 资料卡 === */
#wemd .wemd-resource-list {
  margin: 22px 0;
  padding: 16px;
  background: #fffaf0;
  border: 1px solid #e2d5c2;
  border-left: 4px solid #f2762e;
  border-radius: 0;
}
#wemd .wemd-resource-list .wemd-rl-title {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-size: 15px;
  font-weight: 800;
  color: #352b2a;
}
#wemd .wemd-resource-list .wemd-rl-item {
  background: #fffaf0;
  border: 1px solid #e2d5c2;
  border-radius: 0;
}
#wemd .wemd-resource-list .wemd-rl-item .wemd-rl-item-title {
  color: #352b2a;
}

/* === code-frame 暗房终端（深紫黑 + mac 圆点） === */
#wemd .wemd-code-frame {
  margin: 24px 0;
  background: #221d24;
  border: 1px solid #332b36;
  border-radius: 0;
  overflow: hidden;
}
#wemd .wemd-code-frame .wemd-cf-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #191520;
  border-bottom: 1px solid #332b36;
}
#wemd .wemd-code-frame .wemd-sf-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-code-frame .wemd-sf-dot-r { background: #c25450; }
#wemd .wemd-code-frame .wemd-sf-dot-y { background: #d8a24a; }
#wemd .wemd-code-frame .wemd-sf-dot-g { background: #58a06b; }
#wemd .wemd-code-frame .wemd-cf-title {
  margin-left: 8px;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: #c9b8c4;
}
#wemd .wemd-code-frame .wemd-cf-code pre {
  margin: 0;
  padding: 14px 16px;
  overflow-x: auto;
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 13px;
  line-height: 1.8;
  color: #eadbe4;
  text-align: left;
}
#wemd .wemd-code-frame .wemd-cf-code pre code {
  background: transparent;
  color: #eadbe4;
}

/* === 图片（胶片片框） === */
#wemd .wemd-image-card {
  margin: 24px 0;
  padding: 6px;
  background: #fffaf0;
  border: 1px solid #e2d5c2;
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
  color: #8a7466;
}
#wemd .wemd-image-caption .wemd-component-body p {
  font-family: "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #8a7466;
}
#wemd .wemd-image-caption .wemd-component-body p em {
  color: #8a7466;
  font-style: normal;
}
#wemd .wemd-image-grid .wemd-component-body p img {
  border: 1px solid #e2d5c2;
  border-radius: 0;
}
#wemd .wemd-image-compare .wemd-component-body figure {
  border: 1px solid #e2d5c2;
  border-radius: 0;
}
#wemd .wemd-image-text-row {
  margin: 22px 0;
  padding: 14px;
  background: #fffaf0;
  border: 1px solid #e2d5c2;
  border-radius: 0;
}
`;

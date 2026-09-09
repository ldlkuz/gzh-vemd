/**
 * 数据蓝图 · 主题皮肤（覆盖共享组件样式）
 *
 * 背景：数据蓝图 token 把 bgCard 设为深蓝 #0c4a6e。共享组件样式大量用
 * `background: var(--wemd-bg-card)`，导致 text-card / stats-block / timeline /
 * qr-card / product-card / series-nav / steps / table / image-card /
 * two-column-cards 等组件在数据蓝图下变成「深蓝底 + 深色字」，严重不协调。
 *
 * 处理策略（考虑颜色冲撞）：
 * - 内容承载类（text-card / steps / timeline / table / image-card /
 *   two-column-cards / author-card）：去整块底色 → 白/透明 + 细科技蓝边框，
 *   文字用数据蓝图深墨 #082f49（深底黑字问题消失）。
 * - 数据类卡片（stats-block / qr-card / product-card / series-nav）：
 *   改浅底（白 + 浅蓝边），数字/标题用主蓝点缀，保留数据感。
 *
 * 微信约束：不写伪元素 / 结构伪类；装饰用真实 border / 边框线。
 */

export const componentStylesDataBlueprint = `/* === 数据蓝图：正文/内容类组件去深蓝整块底色 === */

/* text-card：透明 + 细边框 + 左侧科技蓝条 */
#wemd .wemd-text-card {
  margin: 18px 0;
  padding: 18px 20px;
  background: transparent;
  border: 1px solid #bae6fd;
  border-left: 3px solid #0ea5e9;
  border-radius: 0 10px 10px 0;
  box-shadow: none;
  box-sizing: border-box;
  line-height: 1.8;
  font-size: 15px;
  color: #082f49;
}
#wemd .wemd-text-card p {
  margin: 0 0 14px 0;
  line-height: 1.8;
  color: #082f49;
}
#wemd .wemd-text-card p b {
  color: #0369a1;
}

/* full-quote：透明 + 上下科技蓝细线 */
#wemd .wemd-full-quote {
  margin: 26px 0;
  padding: 22px 24px;
  background: transparent;
  border-top: 2px solid #0ea5e9;
  border-bottom: 2px solid #0ea5e9;
  border-left: none;
  border-right: none;
  border-radius: 0;
  box-shadow: none;
  box-sizing: border-box;
}
#wemd .wemd-full-quote .wemd-fq-text {
  color: #082f49;
  font-size: 17px;
  line-height: 1.9;
  font-weight: 600;
}

/* author-card：去深蓝底，白底 + 细边框 */
#wemd .wemd-author-card {
  margin: 24px 0;
  padding: 20px 24px;
  background: #ffffff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  box-shadow: none;
}
#wemd .wemd-author-card .wemd-component-body > p {
  color: #082f49;
}

/* steps 列表项：去深蓝底，白底 + 细边框 */
#wemd .wemd-steps .wemd-component-body li {
  background: #ffffff;
  border: 1px solid #bae6fd;
  border-radius: 10px;
  color: #082f49;
}

/* timeline：去深蓝底，白底 + 细边框 */
#wemd .wemd-timeline {
  margin: 24px 0;
  padding: 20px 24px;
  background: #ffffff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
}
#wemd .wemd-timeline .wemd-tl-title {
  color: #082f49;
}
#wemd .wemd-timeline .wemd-tl-text {
  color: #1e293b;
}

/* styled-table / table 单元格：去深蓝底，白底 + 浅蓝分隔线 */
#wemd .wemd-styled-table .wemd-sbt-table table td,
#wemd .wemd-table .wemd-component-body .table-container table td {
  background: #ffffff;
  color: #1e293b;
  border-bottom: 1px solid #e0f2fe;
}
#wemd .wemd-styled-table .wemd-sbt-table table th,
#wemd .wemd-table .wemd-component-body .table-container table th {
  background: #0369a1;
  color: #ffffff;
}

/* image-card / two-column-cards：去深蓝底，白底 + 细科技蓝边框 */
#wemd .wemd-image-card {
  background: #ffffff;
  border: 1px solid #bae6fd;
  box-shadow: none;
}
#wemd .wemd-two-column-cards .wemd-vc-list {
  background: transparent;
}
#wemd .wemd-two-column-cards .wemd-vc-item {
  background: #ffffff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  box-shadow: none;
}

/* === 数据类卡片：改浅底（白 + 浅蓝边），保留数据感 === */

/* stats-block：白底容器 + 浅蓝 item 卡 */
#wemd .wemd-stats-block {
  margin: 24px 0;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
}
#wemd .wemd-stats-block .wemd-sb-items-item {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 10px;
  color: #082f49;
}
#wemd .wemd-stats-block .wemd-sb-items-value {
  color: #0369a1;
}

/* qr-card：白底 + 细边框 */
#wemd .wemd-qr-card {
  background: #ffffff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
}

/* product-card：白底 + 细边框 */
#wemd .wemd-product-card {
  background: #ffffff;
  border: 1px solid #bae6fd;
  border-radius: 16px;
}

/* series-nav：白底 + 细边框 */
#wemd .wemd-series-nav {
  background: #ffffff;
  border: 1px solid #bae6fd;
  border-radius: 16px;
}

/* magazine-cover：本应深色强调，但强制文字白/浅，避免深底深字 */
#wemd .wemd-magazine-cover {
  background: linear-gradient(135deg, #0c4a6e, #0369a1);
}
#wemd .wemd-magazine-cover .wemd-mc-title {
  color: #ffffff;
}
#wemd .wemd-magazine-cover .wemd-mc-subtitle {
  color: #bae6fd;
}
#wemd .wemd-magazine-cover .wemd-mc-desc {
  color: #e0f2fe;
}

/* callout-pro：左侧色条用 border-left 跟随主题主色（科技蓝 #0ea5e9） */
#wemd .wemd-callout-pro {
  background: #ffffff;
  border-top: 1px solid #bae6fd;
  border-right: 1px solid #bae6fd;
  border-bottom: 1px solid #bae6fd;
  /* 左侧色条：用 border-left（原生边框，微信保留） */
  border-left: 4px solid #0ea5e9;
}
#wemd .wemd-callout-pro .wemd-component-body > p {
  color: #082f49;
}
`;

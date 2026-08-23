/**
 * 晚晴主题 - 皮肤（WANQING）
 *
 * 设计：写给岁月的一份温柔——米纸承载、楷宋书卷气、赭橘唯一强调色、墨绿只作叶脉辅助。
 * 面向长辈的高可读性：
 * - 大字：正文 17px+、行距 2+；标题更大；首字下沉、金句再放大。
 * - 高对比：暖棕墨字压米纸，不做灰糊浅字；深色封面配浅字。
 * - 少干扰：图不叠字（封面用 background-image + 渐变）、引语不盖章，只留文字。
 * - #wemd 不设整篇背景（交给公众号编辑器）；装饰为纯边框/单段渐变/真实元素。
 * - 无伪元素（仅用 content:none 中和共享伪元素装饰），无按钮式互动。
 */
const PAPER = "#f6efe0"; // 米纸
const PAPER_DEEP = "#efe1c8";
const INK = "#3d3128"; // 暖棕墨
const INK_SOFT = "#6b5a4a";
const ACCENT = "#a8613a"; // 赭橘（唯一强调色）
const LEAF = "#64705a"; // 墨绿（叶脉辅助）
const THREAD = "#d6c49c"; // 米金发丝线

export const componentStylesWanqing = `/* === 晚晴（写给岁月）组件样式 === */

/* 全局：楷宋书卷气 + 宽松行距（大字高可读，长辈友好） */
#wemd {
  font-family: "PingFang SC", "Microsoft YaHei", "Songti SC", "SimSun", sans-serif;
  color: ${INK};
  font-size: 17px;
  line-height: 2;
  letter-spacing: 0.02em;
}
#wemd p {
  margin: 0 0 1.6em;
  color: ${INK};
  font-size: 17px;
  line-height: 2;
  text-align: justify;
}
#wemd p b,
#wemd p strong {
  color: ${INK};
  font-weight: 700;
}
#wemd em {
  font-style: normal;
  color: ${INK};
  font-weight: 600;
  background: linear-gradient(transparent 60%, rgba(168,97,58,0.2) 60%, rgba(168,97,58,0.2) 96%, transparent 96%);
}
#wemd a {
  color: ${ACCENT};
  text-decoration: none;
  border-bottom: 1px dotted ${ACCENT};
}

/* === 标题 === */
#wemd h1 {
  margin: 44px 0 20px;
}
#wemd h1 .content {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: ${INK};
}
#wemd h2 {
  margin: 38px 0 16px;
}
#wemd h2 .content {
  font-size: 23px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: ${INK};
}
#wemd h3 {
  margin: 30px 0 12px;
}
#wemd h3 .content {
  font-size: 19px;
  font-weight: 700;
  color: ${INK};
}
#wemd h4 {
  margin: 26px 0 10px;
}
#wemd h4 .content {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: ${ACCENT};
}

/* === 封面（background-image + 底部渐变，文字正常流锚底部） ===
   公众号会删除 position，禁止绝对定位叠字；封面图用 background-image（图床 URL）+
   底部渐变叠加，文字正常流中靠 padding-top 压出图区、锚在底部，两链路一致。 */
/* 清除共享卡片样式（border / 卡片底 / padding / 圆角 / 居中），否则封面外套一圈卡片边框 */
#wemd .wemd-magazine-cover {
  margin: 0 0 2.2em;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  text-align: left;
}
/* 图区高度：padding-top 百分比相对容器宽度，背景 cover 铺满；文字正常流接在其后 */
#wemd .wemd-magazine-cover .wemd-wq-cover {
  padding: 50% 24px 30px;
  border-radius: 4px;
  overflow: hidden;
}
#wemd .wemd-magazine-cover .wemd-wq-eyebrow {
  margin: 0;
  color: rgba(250,241,224,0.92);
  font-family: "KaiTi", "STKaiti", "Songti SC", serif;
  font-size: clamp(13px, 2vw, 15px);
  letter-spacing: 0.4em;
  line-height: 2;
}
#wemd .wemd-magazine-cover .wemd-wq-title {
  margin: 6px 0 0;
  color: #fff8ea;
  font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
  font-size: clamp(32px, 7vw, 46px);
  font-weight: 700;
  letter-spacing: 0.14em;
  line-height: 1.2;
  text-shadow: 0 2px 24px rgba(30,20,12,0.5);
}
#wemd .wemd-magazine-cover .wemd-wq-title b,
#wemd .wemd-magazine-cover .wemd-wq-title strong,
#wemd .wemd-magazine-cover .wemd-wq-title em {
  color: inherit;
  font-style: inherit;
}
#wemd .wemd-magazine-cover .wemd-wq-opening {
  margin: 16px 0 0;
  color: rgba(250,241,224,0.92);
  font-size: clamp(13.5px, 2.2vw, 16px);
  letter-spacing: 0.16em;
  text-align: left;
}

/* === 引子卡（text-card） === */
#wemd .wemd-text-card {
  margin: 2em 0;
  padding: 26px 24px;
  background: ${PAPER};
  border: 1px solid ${THREAD};
  border-radius: 4px;
}
#wemd .wemd-text-card .wemd-wq-lead-kicker {
  display: inline-block;
  font-family: "KaiTi", "Noto Serif SC", serif;
  font-size: 13.5px;
  letter-spacing: 0.36em;
  color: ${ACCENT};
  margin: 0 0 12px;
}
/* 引子正文基准字号：让 dropcap 的 em 以正文 18px 为参照（3em=54px≈1.4 行高）。
   注意：骨架里首字 span 内联在正文 <p> 内，.wemd-wq-lead-body 即该 <p> 本身 */
#wemd .wemd-text-card .wemd-wq-lead-body {
  margin: 0;
  font-size: 18px;
  line-height: 2.1;
  color: ${INK};
}
/* 首字下沉：赭橘大字、恰两行高（真实 span 承载，非伪元素）。采用「弹性浮高」：
   line-height:1 让浮动盒高度=字号本身，font-size:3em 落在正文一行与两行之间，
   第 1–2 行自然绕排、第 3 行回到最左。字号/行高全用 em 相对值，两链路一致。 */
#wemd .wemd-text-card .wemd-wq-lead-body .wemd-wq-dropcap {
  float: left;
  font-family: "KaiTi", "Songti SC", serif;
  font-size: 3em;
  line-height: 1;
  margin: 2px 8px 0 0;
  font-weight: 700;
  color: ${ACCENT};
}

/* === 螺纹分隔（divider） ===
   共享 divider 用 ::before/::after 双线，本主题改为发丝线 + 中央 ❖；
   双线必须中和（否则双横线叠加）。 */
#wemd .wemd-divider {
  margin: 2.6em 0;
  padding: 0;
  background: transparent;
  border: none;
}
#wemd .wemd-divider .wemd-component-body::before,
#wemd .wemd-divider .wemd-component-body::after {
  content: none;
}
#wemd .wemd-divider .wemd-wq-divider {
  display: flex;
  align-items: center;
  gap: 14px;
}
#wemd .wemd-divider .wemd-wq-thread {
  flex: 1;
  height: 1px;
  background: ${THREAD};
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-divider .wemd-wq-mark {
  flex: none;
  color: ${ACCENT};
  font-size: 13px;
  line-height: 1;
  letter-spacing: 0.1em;
}

/* === 引语（quote-card：上下赭橘双线，不盖章、不叠杂饰） === */
#wemd .wemd-quote-card {
  margin: 2.8em 0;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
}
#wemd .wemd-quote-card .wemd-wq-quote {
  margin: 0 4px;
  padding: 30px 22px 26px;
  border-top: 2px solid ${ACCENT};
  border-bottom: 2px solid ${ACCENT};
  background: rgba(239,225,200,0.5);
  text-align: center;
}
#wemd .wemd-quote-card .wemd-wq-quote::before,
#wemd .wemd-quote-card .wemd-wq-quote::after {
  content: none;
}
#wemd .wemd-quote-card .wemd-wq-quote-text {
  margin: 0 0 12px;
  font-family: "KaiTi", "Noto Serif SC", serif;
  font-size: 22px;
  font-weight: 600;
  line-height: 2;
  color: ${INK};
  letter-spacing: 0.05em;
  text-align: center;
}
#wemd .wemd-quote-card .wemd-wq-quote-author {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.34em;
  color: ${INK_SOFT};
  text-align: center;
}
#wemd .wemd-quote-card .wemd-wq-quote-author strong {
  color: inherit;
  font-weight: 400;
}

/* === 落款（end-card：纯文字，无印章） === */
#wemd .wemd-end-card {
  margin: 3.4em 0 1em;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
}
#wemd .wemd-end-card .wemd-wq-end {
  padding: 10px 0;
  text-align: center;
}
#wemd .wemd-end-card .wemd-wq-end-rule {
  display: block;
  width: 100%;
  height: 1px;
  background: ${THREAD};
  font-size: 0;
  line-height: 0;
  overflow: hidden;
}
#wemd .wemd-end-card .wemd-wq-end-mark {
  margin: 22px 0 10px;
  font-family: "KaiTi", "Noto Serif SC", serif;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.34em;
  color: ${INK};
  text-align: center;
}
#wemd .wemd-end-card .wemd-wq-end-text {
  margin: 0;
  font-family: "KaiTi", "Noto Serif SC", serif;
  font-size: 17px;
  letter-spacing: 0.16em;
  color: ${INK_SOFT};
  text-align: center;
}

/* === 其他组件微调：保持默认 + 局部暖纸 / 高对比 === */

/* 原生引用 / pullquote：左侧发丝线 + 赭橘竖条，大字高对比（中和共享伪元素） */
#wemd .wemd-pullquote {
  margin: 2.4em 0;
  padding: 20px 22px;
  border-left: 4px solid ${ACCENT};
  background: rgba(246,239,224,0.6);
}
#wemd .wemd-pullquote::before,
#wemd .wemd-pullquote::after {
  content: none;
}
#wemd .wemd-pullquote p {
  font-family: "KaiTi", "Noto Serif SC", serif;
  font-size: 19px;
  line-height: 2.1;
  color: ${INK};
}

/* 节选 tip (callout)：米纸块 + 深字，不用 type 语义色 */
#wemd .wemd-callout {
  margin: 2.2em 0;
  padding: 22px 24px;
  background: ${PAPER_DEEP};
  border: 1px solid ${THREAD};
  border-radius: 4px;
}
#wemd .wemd-callout p {
  color: ${INK};
}
#wemd .wemd-callout::after {
  content: none;
}

/* 图片：暖调 + 圆角 + 米金细边，弱化卡片边框 */
#wemd .wemd-image-card .wemd-ic-image img,
#wemd .wemd-image-grid .wemd-component-body img {
  display: block;
  width: 100%;
  border-radius: 4px;
  border: 1px solid ${THREAD};
  filter: saturate(0.92);
}
#wemd .wemd-image-card .wemd-ic-caption {
  color: ${INK_SOFT};
  font-size: 13px;
  letter-spacing: 0.1em;
  margin-top: 10px;
}`;
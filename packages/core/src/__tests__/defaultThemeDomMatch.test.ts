// @vitest-environment happy-dom
/**
 * 架构改版后「组件 CSS 选择器 ↔ 新 DOM 结构」对齐验证。
 *
 * 背景：组件骨架随主题迁移后，section-title / numbered-heading 的 body 内是 markdown
 * 渲染的 h2，image-grid 的图片在单个 <p> 内，qr-card 的图被 figure 包裹……而旧组件 CSS
 * 还在选 p:first-child / ul/ol / img:first-child，导致组件级样式不生效。
 *
 * 这里用真实默认主题 CSS（renderTheme）+ 真实渲染管线（processHtml, 内联导出）断言
 * 修复后的选择器确实把组件级样式落到了 DOM 上。
 */
import { describe, expect, it } from "vitest";
import { createMarkdownParser } from "../MarkdownParser";
import { processHtml } from "../ThemeProcessor";
import {
  renderTheme,
  getThemeTemplates,
  getThemeSlotDefs,
  getBuiltInThemeDefinition,
} from "../index";

function renderWithDataBlueprint(md: string): string {
  const theme = getBuiltInThemeDefinition("data-blueprint")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const parser = createMarkdownParser({
    getTemplate: (id) => templates.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

function renderWithDefaultTheme(md: string): string {
  const theme = getBuiltInThemeDefinition("default")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const parser = createMarkdownParser({
    getTemplate: (id) => templates.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

describe("默认主题：组件 CSS 选择器与新 DOM 对齐", () => {
  it("section-title：body 内是 h2，组件级样式落到 h2 上（18px 主色、无全局装饰）", () => {
    const out = renderWithDefaultTheme("## 组件让内容更有结构");
    // 套了 section-title 容器
    expect(out).toContain('class="wemd-component wemd-section-title"');
    const h2 = out.match(/<h2[^>]*>/g)?.[0] ?? "";
    // h2 被组件级样式覆盖：18px 主色
    expect(h2).toContain("font-size: 18px");
    expect(h2).toContain("color: #07c160");
    // 全局 h2 的大间距与下划线被逐个长属性归零（避免 42px 顶距 + 双重下划线）
    expect(h2).toContain("margin-top: 0");
    expect(h2).toContain("border-bottom: none");
  });

  it("numbered-heading：body 内是 h2，全局 h2 大间距被归零", () => {
    const out = renderWithDefaultTheme("## 01 开场与导航");
    expect(out).toContain('class="wemd-component wemd-numbered-heading"');
    const h2 = out.match(/<h2[^>]*>/g)?.[0] ?? "";
    // 组件容器自带 32px 上边距，h2 不应再有全局 42px 顶距
    expect(h2).toContain("margin-top: 0");
    expect(h2).toContain("margin-bottom: 0");
    expect(h2).toContain("border-bottom: none");
  });

  it("image-grid：图片在单个 <p> 内，p 变为双列网格", () => {
    const out = renderWithDefaultTheme(
      "![a](https://a.com/1.png)\n![b](https://a.com/2.png)",
    );
    expect(out).toContain('class="wemd-component wemd-image-grid"');
    const imgP = out.match(
      /<p[^>]*class="wemd-component-body"[^>]*>[\s\S]{0,80}<p[^>]*>/,
    );
    // 网格容器的 p 应带 grid-template-columns
    expect(out).toMatch(/grid-template-columns:\s*repeat\(2, 1fr\)/);
    // 图片进入网格（不再是竖直堆叠的单列块）
    expect(out).toContain("display: grid");
  });

  it("qr-card：二维码图被 figure 包裹后仍拿到 140px 圆形卡片样式", () => {
    const out = renderWithDefaultTheme(
      `::: qr-card
![qr](https://a.com/qr.png)

公众号名称

扫码关注公众号
:::`,
    );
    expect(out).toContain('class="wemd-component wemd-qr-card"');
    // 图拿到 140px 尺寸（旧选择器 img:first-child 选不到 figure 里的图，修复后生效）
    expect(out).toMatch(/width:\s*140px/);
  });

  it("callout-pro：左侧色条用 border-left 跟随主题主色（默认 → 微信绿，非 type 固定紫）", () => {
    const out = renderWithDefaultTheme(
      `::: callout-pro{type="tip"}
**使用建议**

- 第一点
:::`,
    );
    expect(out).toContain('class="wemd-component wemd-callout-pro"');
    // 竖条用容器 border-left（原生边框，微信保留），跟随主题主色 #07c160（非 type 紫）
    const sec =
      out.match(
        /<section class="wemd-component wemd-callout-pro"[^>]*>/,
      )?.[0] ?? "";
    expect(sec).toContain("border-left: 4px solid #07c160");
    expect(out).not.toMatch(/background:\s*#8b5cf6/);
    // 不再有物化的绝对定位色条 span
    expect(out).not.toMatch(/wemd-mat[^>]*width: 4px/);
  });

  it("timeline：圆点空心居中跨竖线（flex+负 margin，无 position 依赖）", () => {
    const out = renderWithDefaultTheme(
      "::: timeline\n发展历程\n- **2020** 立项\n- **2022** 发布\n:::",
    );
    expect(out).toContain("wemd-tl-events");
    expect(out).toContain("wemd-tl-dot");
    const item = out.slice(out.indexOf("wemd-tl-item"));
    const dot = out.slice(out.indexOf("wemd-tl-dot"));
    // 公众号兼容：item 用 flex，圆点用负 margin-left 跨竖线（不依赖 position:absolute）
    expect(item).toContain("display: flex");
    expect(dot).toContain("margin-left: -27px");
    // 空心点：白底 + 绿边框（而非纯绿实心），颜色跟随主题主色
    expect(dot).toContain("background: #ffffff");
    expect(dot).toContain("border: 2px solid #07c160");
    expect(dot).toContain("border-radius: 50%");
    // 不再用 absolute 定位（公众号会删，导致圆点退回流内变实心绿点错位）
    expect(out).not.toMatch(/wemd-tl-dot[^>]*position: absolute/);
  });
});

function renderWithEasternNotes(md: string): string {
  const theme = getBuiltInThemeDefinition("eastern-notes")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const parser = createMarkdownParser({
    getTemplate: (id) => templates.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

describe("东方笺谱：同骨架 · 主题皮肤差异化", () => {
  it("全局皮肤：宋体 + 墨色 + 朱砂 h2 居中", () => {
    const out = renderWithEasternNotes("## 一 · 序章\n\n正文内容");
    // 宋体栈 + 墨色正文（页面底色按项目约束交给微信编辑器）
    expect(out).toMatch(/font-family: &quot;Songti SC&quot;/);
    expect(out).toContain("color: #36322f");
    // h2 内容为朱砂、居中（公众号统一居中）
    const h2 = out.match(/<h2[^>]*>[\s\S]{0,400}?<\/h2>/)?.[0] ?? "";
    expect(h2).toContain("#a33a2b");
    expect(h2).toContain("text-align: center");
  });

  it("divider-fancy：无 label 时朱砂装饰点", () => {
    const out = renderWithEasternNotes(
      `::: divider-fancy
:::`,
    );
    expect(out).toContain("wemd-df-dots");
    expect(out).toContain("#a33a2b");
  });

  it("divider-fancy：有 label 时朱砂印章 + 文字（主题定制骨架）", () => {
    const out = renderWithEasternNotes(
      `::: divider-fancy
第一章 · 落款
:::`,
    );
    expect(out).toContain("wemd-df-seal");
    expect(out).toContain("第一章 · 落款");
  });

  it("divider：定制骨架物化三色块（墨线 + 朱砂/黛蓝/赭石）", () => {
    const out = renderWithEasternNotes("---");
    expect(out).toContain('class="wemd-component wemd-divider"');
    expect(out).toContain("wemd-dv-dot-a");
    expect(out).toContain("wemd-dv-dot-b");
    expect(out).toContain("wemd-dv-dot-c");
    expect(out).toContain("background: #a33a2b");
    expect(out).toContain("background: #3d5a63");
  });

  it("section-divider：定制骨架双色线（朱砂 + 黛蓝）", () => {
    const out = renderWithEasternNotes(
      `::: section-divider
PART 01

开场与导航
:::`,
    );
    expect(out).toContain("wemd-sd-line");
    expect(out).toContain("wemd-sd-line-a");
    expect(out).toContain("wemd-sd-line-b");
    expect(out).toContain("background: #3d5a63");
  });

  it("cta-card：定制骨架底部双色条", () => {
    const out = renderWithEasternNotes(
      `::: cta-card
主标题

正文内容

按钮
:::`,
    );
    expect(out).toContain("wemd-cta-foot");
    expect(out).toContain("wemd-cta-foot-a");
    expect(out).toContain("#3d5a63");
  });

  it("end-card：定制骨架落款印章", () => {
    const out = renderWithEasternNotes(
      `::: end-card
感谢阅读

期待下次相遇
:::`,
    );
    expect(out).toContain('class="wemd-ec-seal"');
    expect(out).toContain("笺");
  });

  it("callout-pro：定制骨架底部色条（正常流，无 position 依赖）", () => {
    const out = renderWithEasternNotes(
      `::: callout-pro
**小贴士**

- 内容
:::`,
    );
    expect(out).toContain("wemd-cp-foot");
    expect(out).toContain("background: #8a5a33");
    // 底部短线改为正常流 block + margin auto 靠右（不再用 absolute right/bottom 贴底）
    const foot = out.slice(out.indexOf("wemd-cp-foot"));
    expect(foot).toContain("margin: 14px 0 0 auto");
    expect(out).not.toMatch(/wemd-cp-foot[^>]*position: absolute/);
  });

  it("quote-card：上下朱砂线夹金句", () => {
    const out = renderWithEasternNotes(
      `::: quote-card
好文章是写给读者的信。

署名：**随园主人**
:::`,
    );
    expect(out).toContain("wemd-quote-card");
    expect(out).toMatch(/border-top:\s*3px solid #a33a2b/);
    expect(out).toMatch(/border-bottom:\s*3px solid #a33a2b/);
  });

  it("quote-card：定制骨架带双侧点 + 作者破折号（真实元素，微信可保留）", () => {
    const out = renderWithEasternNotes(
      `::: quote-card
好文章是写给读者的信。

署名：**随园主人**
:::`,
    );
    expect(out).toContain("wemd-qc-dot-l");
    expect(out).toContain("wemd-qc-dot-r");
    expect(out).toContain("wemd-qc-dash");
    expect(out).toContain("——");
  });

  it("页面无整篇背景（微信不铺网格），纸纹只落在卡片局部", () => {
    const out = renderWithEasternNotes(
      "## 一 · 序章\n\n::: quote-card\n金句\n\n署名：**主**\n:::\n\n正文",
    );
    // #wemd 不再设整篇背景（微信整篇铺网格），纸纹只落在卡片局部
    const wemd = out.match(/<section id="wemd"[^>]*>/)?.[0] ?? "";
    expect(wemd).not.toMatch(/background-image/);
    expect(wemd).not.toMatch(/background-color/);
    // 卡片（quote-card 等）带纸纹
    expect(out).toContain("repeating-linear-gradient");
  });

  it("callout-pro：色条跟随主题朱砂（物化后内联）", () => {
    const out = renderWithEasternNotes(
      `::: callout-pro
**小贴士**

- 内容
:::`,
    );
    // 色条用容器 border-left（原生边框，微信保留），不再物化 wemd-mat 背景竖条
    const sec =
      out.match(
        /<section class="wemd-component wemd-callout-pro"[^>]*>/,
      )?.[0] ?? "";
    expect(sec).toContain("border-left: 4px solid #a33a2b");
    // 不应再有 4px 宽的物化 wemd-mat 竖条（中和了 ::before）
    expect(out).not.toMatch(/wemd-mat[^>]*width:\s*4px/);
  });

  it("pullquote：左上/右下双色直角由纯边框承载（微信兼容、无渐变解析风险）", () => {
    const out = renderWithEasternNotes(
      `::: pullquote
落笔时不必慌张。
:::`,
    );
    expect(out).toContain("wemd-pullquote");
    // 容器带 wemd-pq-cornered 标记（供物化器抑制共享引号），不再有角标 span 子元素
    expect(out).toMatch(/wemd-pullquote wemd-pq-cornered/);
    expect(out).not.toMatch(/wemd-pq-corner-tl/);
    expect(out).not.toMatch(/wemd-pq-corner-br/);
    // 直角由容器四边双色边框承载（左上黛蓝 + 右下朱砂），微信 100% 保留
    const cover =
      out.match(
        /<section class="wemd-component wemd-pullquote[^>]*"[^>]*>/,
      )?.[0] ?? "";
    expect(cover).toContain("border-top: 3px solid #3d5a63");
    expect(cover).toContain("border-left: 3px solid #3d5a63");
    expect(cover).toContain("border-right: 3px solid #a33a2b");
    expect(cover).toContain("border-bottom: 3px solid #a33a2b");
    // 不再用 position 定位角标（公众号会删，导致退回流内变两个点）
    expect(out).not.toMatch(/position: absolute/);
  });

  it("pullquote：共享左边框被主题双色边框覆盖（无 5px 残留）+ 角标标记下不注入共享引号", () => {
    const out = renderWithEasternNotes(
      `::: pullquote
落笔时不必慌张。
:::`,
    );
    const sec =
      out.match(
        /<section class="wemd-component wemd-pullquote[^>]*"[^>]*>/,
      )?.[0] ?? "";
    // 主题双色边框覆盖共享 border-left:5px（无残留）
    expect(sec).not.toMatch(/border-left:\s*5px/);
    expect(sec).toContain("border-left: 3px solid #3d5a63");
    // 双角线装饰（wemd-pq-cornered 标记）下不再插入多余的引号 span（装饰不重复）
    expect(out).not.toContain("\u201C");
  });

  it("faq：挂角标题角标物化为 inline-block 小色块（宽度收缩，负 margin 贴左上，无 position）", () => {
    const out = renderWithDefaultTheme(
      '::: faq{title="新手指南"}\n**问题一**\n\n回答内容\n:::',
    );
    expect(out).toContain("wemd-faq");
    // 角标物化为 wemd-mat span：inline-block（宽度收缩成挂角小色块）+ 负 margin 贴左上角
    const mat = out.slice(out.indexOf('class="wemd-mat"'));
    expect(mat).toContain("新手指南");
    expect(mat).toContain("background: #07c160");
    expect(mat).toContain("display: inline-block");
    expect(mat).toContain("margin: -17px 0 14px -18px");
    expect(mat).not.toContain("position: absolute");
  });

  it("steps：序号圆标朱砂色、带完整盒尺寸（物化内联不丢 width/height）", () => {
    const out = renderWithEasternNotes(
      "::: steps\n新手三连击\n1. **新建文章** — 粘贴草稿\n2. **选择主题** — 挑选样式\n:::",
    );
    expect(out).toContain("wemd-steps");
    // 序号由物化器内联为 li 首个子元素 wemd-mat，朱砂圆底 + 白字 + 完整盒尺寸居中
    const mat = out.slice(out.indexOf('class="wemd-mat"'));
    expect(mat).toContain("background: #a33a2b");
    expect(mat).toContain("border-radius: 50%");
    expect(mat).toContain("width: 26px");
    expect(mat).toContain("height: 26px");
    expect(mat).toContain("line-height: 26px");
    expect(mat).toContain("color: #ffffff");
  });

  it("cta-card：朱砂渐变 + 印章圆标（真实元素）", () => {
    const out = renderWithEasternNotes(
      `::: cta-card
主标题

正文内容

按钮
:::`,
    );
    expect(out).toContain("wemd-cta-seal");
    expect(out).toContain("笺");
    expect(out).toContain("linear-gradient(160deg, #a33a2b 0%, #7e2d21 100%)");
  });

  it("magazine-cover：信笺页头（印章 + 标题 + 双色线）", () => {
    const out = renderWithEasternNotes(
      `::: magazine-cover
东方笺谱

MODERN LETTERHEAD

一行描述
:::`,
    );
    expect(out).toContain("wemd-mc-seal");
    expect(out).toContain("wemd-mc-line-a");
    expect(out).toContain("wemd-mc-line-b");
    expect(out).toContain("东方笺谱");
  });

  it("follow-bar：末段关注去按钮化（无背景/边框/圆角，纯文字提醒）", () => {
    const out = renderWithEasternNotes(
      `::: follow-bar
点击上方蓝字关注我们

关注
:::`,
    );
    // 末段"关注"导出为纯文字：透明底、无边框、无圆角（不再伪装可点）
    const btn = out.match(/<p[^>]*style="[^"]*"[^>]*>关注<\/p>/)?.[0] ?? "";
    expect(btn).toContain("background: transparent");
    expect(btn).not.toContain("background: #a33a2b");
    expect(btn).toContain("border: none");
  });
});

// ============================================================
// 数据蓝图：正文类组件去整块深蓝底色
// ============================================================

describe("数据蓝图：text-card 去整块深蓝底色", () => {
  it("text-card：不再使用深蓝 bg-card，改透明 + 细边框线", () => {
    const out = renderWithDataBlueprint(
      "::: text-card\n组件系统把内容拆解成独立的语义单元。\n:::",
    );
    const sec =
      out.match(/<section class="wemd-component wemd-text-card"[^>]*>/)?.[0] ??
      "";
    // 不再命中主题 bgCard 深蓝 #0c4a6e
    expect(sec).not.toContain("#0c4a6e");
    expect(sec).not.toContain("background: #0c4a6e");
    // 透明底 + 细边框 + 左侧科技蓝条
    expect(sec).toContain("background: transparent");
    expect(sec).toContain("border: 1px solid #bae6fd");
    expect(sec).toContain("border-left: 3px solid #0ea5e9");
  });

  it("full-quote：去整块深蓝底，改上下科技蓝细线", () => {
    const out = renderWithDataBlueprint(
      "::: full-quote\n技术的意义，是让每一个普通人的真实表达，都有机会被世界看见。\n:::",
    );
    const sec =
      out.match(/<section class="wemd-component wemd-full-quote"[^>]*>/)?.[0] ??
      "";
    expect(sec).not.toContain("#0c4a6e");
    expect(sec).toContain("background: transparent");
    expect(sec).toContain("border-top: 2px solid #0ea5e9");
    expect(sec).toContain("border-bottom: 2px solid #0ea5e9");
  });

  it("其它命中 bg-card 的组件：无深蓝底，白/浅底 + 细边框（含 steps/timeline/qr-card/stats-block）", () => {
    const out = renderWithDataBlueprint(
      [
        "::: steps",
        "1. 第一步",
        "2. 第二步",
        ":::",
        "",
        "::: timeline",
        "标题",
        "- **2020** 里程碑",
        ":::",
        "",
        "::: qr-card",
        "![qr](https://a.com/qr.png)",
        "",
        "公众号名称",
        ":::",
        "",
        "::: stats-block",
        "- **500**",
        "  客户",
        ":::",
      ].join("\n"),
    );
    // 全篇无深蓝 bg-card 残留
    expect(out).not.toContain("#0c4a6e");
    expect(out).not.toContain("background: #0c4a6e");
    // 各组件容器白/浅底（非深蓝）
    for (const [name, expectBg] of [
      ["steps", "#f0f9ff"],
      ["timeline", "#ffffff"],
      ["qr-card", "#ffffff"],
      ["stats-block", "#ffffff"],
    ] as const) {
      const sec =
        out.match(
          new RegExp(`<section class="wemd-component wemd-${name}"[^>]*>`),
        )?.[0] ?? "";
      expect(sec).toContain(`background: ${expectBg}`);
    }
    // steps li 白底
    expect(out).toMatch(/<li[^>]*background: #ffffff/);
    // stats item 浅蓝底
    expect(out).toMatch(/class="wemd-sb-items-item"[^>]*background: #f0f9ff/);
  });

  it("callout-pro：左侧色条用 border-left 跟随主题科技蓝（不再被物化器强制 type 语义色）", () => {
    const out = renderWithDataBlueprint(
      `::: callout-pro{type="tip"}
**使用建议**

- signature 组适合放在文章开头和结尾
:::`,
    );
    // 色条用容器 border-left（原生边框，微信保留），跟随主题科技蓝 #0ea5e9（非 type 紫）
    const sec =
      out.match(
        /<section class="wemd-component wemd-callout-pro"[^>]*>/,
      )?.[0] ?? "";
    expect(sec).toContain("border-left: 4px solid #0ea5e9");
    expect(out).not.toContain("#8b5cf6");
  });
});

// ============================================================
// 清晰指南：学习手册风（暖纸 + 荧光 + 橙红签名）
// ============================================================

function renderWithClearGuide(md: string): string {
  const theme = getBuiltInThemeDefinition("clear-guide")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const parser = createMarkdownParser({
    getTemplate: (id) => templates.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

describe("清晰指南：学习手册 · 独立骨架 + 皮肤", () => {
  it("magazine-cover：定制骨架胶带 + 虚线印章（真实元素，float 布局，无对位残留）", () => {
    const out = renderWithClearGuide(
      `::: magazine-cover
从零搭好第一条流程

CLEAR GUIDE · 上手手册

一行描述
:::`,
    );
    expect(out).toContain("wemd-cg-tape");
    expect(out).toContain("wemd-cg-stamp");
    expect(out).toContain("wemd-cg-kicker");
    expect(out).toContain("wemd-cg-title");
    // 胶带挂顶：容器去掉 overflow:hidden（露出上边界），胶带用负 margin 上移（公众号兼容）
    const cover =
      out.match(
        /<section class="wemd-component wemd-magazine-cover"[^>]*>/,
      )?.[0] ?? "";
    expect(cover).not.toContain("overflow: hidden");
    // 印章 float 靠右 + clear 防标题重叠（无 position:absolute 残留）
    const stamp = out.match(/<span class="wemd-cg-stamp"[^>]*>/)?.[0] ?? "";
    expect(stamp).toContain("float: right");
    // 隐形装饰元素带 &nbsp; + 隐形样式（防公众号删空 span）
    const tape = out.slice(out.indexOf("wemd-cg-tape"));
    expect(tape).toContain("overflow: hidden");
    expect(tape).toContain("&nbsp;");
    expect(out).not.toContain("position: absolute");
  });

  it("section-divider：定制骨架手写编号 + 荧光下划线", () => {
    const out = renderWithClearGuide(
      `::: section-divider
01

这一章学什么
:::`,
    );
    expect(out).toContain("wemd-cg-no");
    expect(out).toContain("wemd-cg-title");
    // 荧光下划线（linear-gradient 覆盖字底）
    expect(out).toContain("#ffe14d");
  });

  it("divider：定制骨架手写虚线 + ✦", () => {
    const out = renderWithClearGuide("---");
    expect(out).toContain("wemd-cg-dvline-l");
    expect(out).toContain("wemd-cg-dvline-r");
    expect(out).toContain("wemd-cg-glyph");
    expect(out).toContain("\u2726 \u2726 \u2726");
  });

  it("tag-label：行内 #标签 语法渲染为独立胶囊（跟随主题主色）", () => {
    const out = renderWithClearGuide(
      "::: tag-label #设计系统 #公众号排版 #组件化 #WeMD\n:::",
    );
    expect(out).toContain('data-component="tag-label"');
    // 每个标签一个 <p> 胶囊（内联样式会插在 <p> 与文本之间，用正则匹配）
    expect(out).toMatch(/<p[^>]*>#设计系统<\/p>/);
    expect(out).toMatch(/<p[^>]*>#公众号排版<\/p>/);
    // 胶囊样式内联且跟随主题主色（橙红 #e8590c，而非微信绿）
    const chip = out.match(/<p[^>]*>#设计系统<\/p>/)?.[0] ?? "";
    expect(chip).toContain("#e8590c");
    expect(chip).toContain("border-radius: 12px");
  });

  it("callout-pro：便利贴风（荧光黄底 + 橙红签名左条）", () => {
    const out = renderWithClearGuide(
      `::: callout-pro
**提示**

- 内容
:::`,
    );
    const sec =
      out.match(
        /<section class="wemd-component wemd-callout-pro"[^>]*>/,
      )?.[0] ?? "";
    expect(sec).toContain("background: #fff3ad");
    expect(sec).toContain("border-left: 5px solid #e8590c");
    // 只保留 border-left 一条竖线：不应再有物化的 4px 色条 span（双竖线回归防护）
    expect(out).not.toMatch(/wemd-mat[^>]*width: 4px/);
    // 无伪元素残留（导出物化后）
    expect(out).not.toMatch(/::/);
  });

  it("quote-card：整段荧光重点 + 橙红左条", () => {
    const out = renderWithClearGuide(
      `::: quote-card
先把最小流程跑通。

署名：**手册**
:::`,
    );
    const sec =
      out.match(/<section class="wemd-component wemd-quote-card"[^>]*>/)?.[0] ??
      "";
    expect(sec).toContain("border-left: 5px solid #e8590c");
    expect(sec).toContain("#ffe14d");
  });

  it("code-frame：保持默认骨架，无学习手册污染", () => {
    const out = renderWithClearGuide(
      ["::: code-frame", "```js", "const a = 1;", "```", ":::"].join("\n"),
    );
    expect(out).toContain("wemd-cf-code");
    expect(out).toMatch(/wemd-cf-code[\s\S]{0,200}<pre/);
    expect(out).not.toContain("wemd-cb-window");
    expect(out).not.toContain("wemd-cg-");
  });

  it("导出无伪元素 / 结构伪类残留，且 #wemd 无整篇背景", () => {
    const out = renderWithClearGuide("正文内容\n\n---\n\n段落");
    expect(out).not.toMatch(/::/);
    expect(out).not.toMatch(/:nth-child|:first-child|:last-child|:not\(/);
    const wemd = out.match(/<section id="wemd"[^>]*>/)?.[0] ?? "";
    expect(wemd).not.toMatch(/background-color/);
  });
});

// ============================================================

function renderWithWhitespaceGallery(md: string): string {
  const theme = getBuiltInThemeDefinition("whitespace-gallery")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const parser = createMarkdownParser({
    getTemplate: (id) => templates.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

describe("留白画册：极简画廊 · 独立骨架 + 皮肤", () => {
  it("magazine-cover：定制骨架内衬画框 + 英文小标 + 发丝线（真实元素，outline 承载无 position）", () => {
    const out = renderWithWhitespaceGallery(
      `::: magazine-cover
WHITESPACE GALLERY
盛夏时光

一段关于留白与秩序的描述
:::`,
    );
    expect(out).toContain("wemd-wg-frame");
    expect(out).toContain("wemd-wg-kicker");
    expect(out).toContain("wemd-wg-title");
    expect(out).toContain("wemd-wg-rule");
    expect(out).toContain("wemd-wg-desc");
    // 内衬画框由容器 outline 承载（不依赖 position，公众号删 position 不丢）
    const cover =
      out.match(
        /<section class="wemd-component wemd-magazine-cover"[^>]*>/,
      )?.[0] ?? "";
    expect(cover).toContain("outline: 1px solid #e3dfd6");
    expect(cover).toContain("outline-offset: -14px");
    // frame span 不再用 position:absolute（公众号会删导致画框丢失）
    expect(out).not.toMatch(/wemd-wg-frame[^>]*position: absolute/);
  });

  it("section-divider：定制骨架 PART 编号 + 标题 + 发丝线", () => {
    const out = renderWithWhitespaceGallery(
      `::: section-divider
01
第一章 · 品牌
:::`,
    );
    expect(out).toContain("wemd-wg-part");
    expect(out).toContain("wemd-wg-title");
    expect(out).toContain("wemd-wg-rule");
  });

  it("divider：定制骨架发丝线 + 鎏金 ◆，无双线（共享 ::before/::after 已中和）", () => {
    const out = renderWithWhitespaceGallery("---");
    expect(out).toContain("wemd-wg-line-l");
    expect(out).toContain("wemd-wg-line-r");
    expect(out).toContain("wemd-wg-glyph");
    expect(out).toContain("\u25C6");
    // 不应再有物化的 1px 实线 span（发丝线 + 共享 ::before 双线回归防护）
    expect(out).not.toMatch(/wemd-mat[^>]*height: 1px/);
  });

  it("divider-fancy：定制骨架有标签时也始终带左右发丝线", () => {
    const out = renderWithWhitespaceGallery("::: divider-fancy\n画廊\n:::");
    expect(out).toContain("wemd-df-line-left");
    expect(out).toContain("wemd-df-line-right");
    expect(out).toContain("wemd-df-text");
  });

  it("quote-card：发丝细框 + 居中衬线金句（墨字，非粗条）", () => {
    const out = renderWithWhitespaceGallery(
      `::: quote-card
留白不是空缺，而是呼吸。

署名：**画廊**
:::`,
    );
    const sec =
      out.match(/<section class="wemd-component wemd-quote-card"[^>]*>/)?.[0] ??
      "";
    expect(sec).toContain("border: 1px solid #e3dfd6");
    // 不应有粗的左条（共享 border-left 5px 被覆盖）
    expect(sec).not.toContain("border-left: 5px");
  });

  it("full-quote：暖纸底 + 墨字可读（深底不配深字）", () => {
    const out = renderWithWhitespaceGallery(
      `::: full-quote
愿每一次创作，都既有结构的力量，也有想象的自由。
:::`,
    );
    const sec =
      out.match(/<section class="wemd-component wemd-full-quote"[^>]*>/)?.[0] ??
      "";
    expect(sec).toContain("background: #f7f5f1");
    // 正文文字为墨色（深底不配深字，落在 .wemd-fq-text 上）
    const text = out.match(/<section class="wemd-fq-text"[^>]*>/)?.[0] ?? "";
    expect(text).toContain("color: #1a1a1a");
  });

  it("code-frame：保持默认骨架与皮肤，无留白画册定制污染", () => {
    const out = renderWithWhitespaceGallery(
      ["::: code-frame", "```js", "const a = 1;", "```", ":::"].join("\n"),
    );
    expect(out).toContain("wemd-cf-code");
    expect(out).not.toContain("wemd-wg-");
  });

  it("follow-bar：浅底深字内容可见（共享白色文本被同特异性覆盖）", () => {
    const out = renderWithWhitespaceGallery(
      `::: follow-bar
点击上方蓝字关注我们

关注
:::`,
    );
    const firstP =
      out.match(/<p[^>]*style="[^"]*"[^>]*>点击上方蓝字关注我们<\/p>/)?.[0] ??
      "";
    expect(firstP).toContain("color: #3a3a3a");
    expect(firstP).not.toContain("color: #ffffff");
  });

  it("导出无伪元素 / 结构伪类残留，且 #wemd 无整篇背景", () => {
    const out = renderWithWhitespaceGallery("正文内容\n\n---\n\n段落");
    expect(out).not.toMatch(/::/);
    expect(out).not.toMatch(/:nth-child|:first-child|:last-child|:not\(/);
    const wemd = out.match(/<section id="wemd"[^>]*>/)?.[0] ?? "";
    expect(wemd).not.toMatch(/background-color/);
  });
});

// ============================================================

function renderWithAcademicPaper(md: string): string {
  const theme = getBuiltInThemeDefinition("academic-paper")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const parser = createMarkdownParser({
    getTemplate: (id) => templates.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

describe("学术论文：学术期刊 · 独立骨架 + 皮肤", () => {
  it("magazine-cover：定制骨架内衬细框 + 朱批小标 + 双横线（真实元素）", () => {
    const out = renderWithAcademicPaper(
      `::: magazine-cover
ACADEMIC JOURNAL
关于留白与秩序的研究
摘要：本文探讨极简设计在学术传播中的应用。
:::`,
    );
    expect(out).toContain("wemd-ap-frame");
    expect(out).toContain("wemd-ap-kicker");
    expect(out).toContain("wemd-ap-title");
    expect(out).toContain("wemd-ap-rule");
    expect(out).toContain("wemd-ap-desc");
  });

  it("section-divider：定制骨架编号 + 标题 + 双横线", () => {
    const out = renderWithAcademicPaper(
      `::: section-divider
01
第一章 · 引言
:::`,
    );
    expect(out).toContain("wemd-ap-part");
    expect(out).toContain("wemd-ap-title");
    expect(out).toContain("wemd-ap-rule");
  });

  it("divider：定制骨架细线 + § + 细线，无双线（共享 ::before/::after 已中和）", () => {
    const out = renderWithAcademicPaper("---");
    expect(out).toContain("wemd-ap-line-l");
    expect(out).toContain("wemd-ap-line-r");
    expect(out).toContain("wemd-ap-glyph");
    expect(out).toContain("\u00A7");
    // 不应再有物化的 1px 实线 span（细线 + 共享 ::before 双线回归防护）
    expect(out).not.toMatch(/wemd-mat[^>]*height: 1px/);
  });

  it("divider-fancy：定制骨架有标签时也始终带左右细线", () => {
    const out = renderWithAcademicPaper("::: divider-fancy\n文献\n:::");
    expect(out).toContain("wemd-df-line-left");
    expect(out).toContain("wemd-df-line-right");
    expect(out).toContain("wemd-df-text");
  });

  it("quote-card：深蓝定理框 + 白字 + 朱批左条（深底必配浅字）", () => {
    const out = renderWithAcademicPaper(
      `::: quote-card
留白不是空缺，而是呼吸。

署名：**期刊**
:::`,
    );
    const sec =
      out.match(/<section class="wemd-component wemd-quote-card"[^>]*>/)?.[0] ??
      "";
    expect(sec).toContain("background: #0f2540");
    expect(sec).toContain("border-left: 4px solid #8b0000");
    const quote = out.match(/<section class="wemd-qc-quote"[^>]*>/)?.[0] ?? "";
    expect(quote).toContain("color: #ffffff");
  });

  it("text-card：米白浅底 + 墨字可读（不用深蓝 bgCard 深底深字）", () => {
    const out = renderWithAcademicPaper(
      `::: text-card
正文内容用浅底承载，避免深底深字不可读。
:::`,
    );
    const sec =
      out.match(/<section class="wemd-component wemd-text-card"[^>]*>/)?.[0] ??
      "";
    expect(sec).toContain("background: #f4f2ec");
    expect(sec).toContain("color: #2c3e50");
  });

  it("end-card：深蓝结论卡 + 白字可读", () => {
    const out = renderWithAcademicPaper(
      `::: end-card
结论
感谢阅读 · 期待交流
:::`,
    );
    const sec =
      out.match(/<section class="wemd-component wemd-end-card"[^>]*>/)?.[0] ??
      "";
    expect(sec).toContain("background: #0f2540");
    expect(sec).toContain("color: #ffffff");
  });

  it("code-frame：保持默认骨架与皮肤，无学术论文定制污染", () => {
    const out = renderWithAcademicPaper(
      ["::: code-frame", "```js", "const a = 1;", "```", ":::"].join("\n"),
    );
    expect(out).toContain("wemd-cf-code");
    expect(out).not.toContain("wemd-ap-");
  });

  it("follow-bar：浅底深字内容可见（共享白色文本被同特异性覆盖）", () => {
    const out = renderWithAcademicPaper(
      `::: follow-bar
点击上方蓝字关注我们

关注
:::`,
    );
    const firstP =
      out.match(/<p[^>]*style="[^"]*"[^>]*>点击上方蓝字关注我们<\/p>/)?.[0] ??
      "";
    expect(firstP).toContain("color: #2c3e50");
    expect(firstP).not.toContain("color: #ffffff");
  });

  it("qr-card：共享 bgCard 组件为浅底深字可读（token 不设深蓝，深蓝只给定理框）", () => {
    const out = renderWithAcademicPaper(
      `::: qr-card
![qr](https://a.com/qr.png)

学术公众号

扫码关注获取更多论文资料
:::`,
    );
    const sec =
      out.match(/<section class="wemd-component wemd-qr-card"[^>]*>/)?.[0] ??
      "";
    // 浅底（米白），非深蓝 → 深字可读
    expect(sec).toContain("background: #fbfaf7");
    expect(sec).not.toContain("background: #0f2540");
  });

  it("导出无伪元素 / 结构伪类残留，且 #wemd 无整篇背景", () => {
    const out = renderWithAcademicPaper("正文内容\n\n---\n\n段落");
    expect(out).not.toMatch(/::/);
    expect(out).not.toMatch(/:nth-child|:first-child|:last-child|:not\(/);
    const wemd = out.match(/<section id="wemd"[^>]*>/)?.[0] ?? "";
    expect(wemd).not.toMatch(/background-color/);
  });
});

// ============================================================

function renderWithLuxuryGold(md: string): string {
  const theme = getBuiltInThemeDefinition("luxury-gold")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const parser = createMarkdownParser({
    getTemplate: (id) => templates.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

describe("黑金奢华：黑金荣誉证书 · 独立骨架 + 皮肤", () => {
  it("magazine-cover：定制骨架徽章 + kicker + 标题 + 副题 + 双线 + 底部纹样（黑金底金字可读）", () => {
    const out = renderWithLuxuryGold(
      `::: magazine-cover
LUXURY COLLECTION
黑金时刻
一份关于奢华与秩序的品牌手册
:::`,
    );
    // 徽章（圆形「臻」金印）+ kicker + 标题 + 副题 + 金线 + 底部纹样（真实元素）
    expect(out).toMatch(/<div class="wemd-lg-badge"[^>]*>/);
    expect(out).toContain("wemd-lg-badge-ch");
    expect(out).toContain("臻");
    expect(out).toContain("wemd-lg-kicker");
    expect(out).toContain("wemd-lg-title");
    expect(out).toContain("wemd-lg-desc");
    expect(out).toContain("wemd-lg-rule");
    // 底部纹样：菱块 + ✦ + 细线（真实元素）
    expect(out).toContain("wemd-lg-flourish");
    expect(out).toContain("wemd-lg-sw");
    expect(out).toContain("wemd-lg-d");
    expect(out).toContain("wemd-lg-line");
    // 不再使用 old frame / absolute corner 装饰（公众号会删 position）
    expect(out).not.toContain("wemd-lg-frame");
    expect(out).not.toContain("wemd-lg-corner");
    const sec =
      out.match(
        /<section class="wemd-component wemd-magazine-cover"[^>]*>/,
      )?.[0] ?? "";
    expect(sec).toContain("linear-gradient(165deg, #241b12");
    // 标题金属渐变 + 兜底金（deep 底必配浅字）
    const title = out.match(/<section class="wemd-lg-title"[^>]*>/)?.[0] ?? "";
    expect(title).toContain("-webkit-background-clip: text");
    expect(title).toContain("color: #f8ecc4");
  });

  it("section-divider：定制骨架编号 + 标题 + 金色渐变线", () => {
    const out = renderWithLuxuryGold(
      `::: section-divider
01
第一章 · 品牌
:::`,
    );
    expect(out).toContain("wemd-lg-part");
    expect(out).toContain("wemd-lg-title");
    expect(out).toContain("wemd-lg-rule");
  });

  it("divider：定制骨架金线 + ◆ + 金线，无双线（共享 ::before/::after 已中和）", () => {
    const out = renderWithLuxuryGold("---");
    expect(out).toContain("wemd-lg-line-l");
    expect(out).toContain("wemd-lg-line-r");
    expect(out).toContain("wemd-lg-glyph");
    expect(out).toContain("\u25C6");
    expect(out).not.toMatch(/wemd-mat[^>]*height: 1px/);
  });

  it("divider-fancy：定制骨架有标签时也始终带左右金线", () => {
    const out = renderWithLuxuryGold("::: divider-fancy\n臻选\n:::");
    expect(out).toContain("wemd-df-line-left");
    expect(out).toContain("wemd-df-line-right");
    expect(out).toContain("wemd-df-text");
  });

  it("quote-card：黑金荣誉卡（深棕黑底 + 金字 + 金框 + 顶部镀金饰带）", () => {
    const out = renderWithLuxuryGold(
      `::: quote-card
黑金不是张扬，而是分寸。

署名：**臻选**
:::`,
    );
    expect(out).toContain("wemd-lg-qband");
    const sec =
      out.match(/<section class="wemd-component wemd-quote-card"[^>]*>/)?.[0] ??
      "";
    expect(sec).toContain("linear-gradient(165deg, #241b12");
    expect(sec).toContain("border-left: 4px solid #d4af37");
    const quote = out.match(/<section class="wemd-qc-quote"[^>]*>/)?.[0] ?? "";
    expect(quote).toContain("color: #faf3e0");
  });

  it("text-card：暖米浅底 + 深棕字可读（不用深棕 bgCard 深底深字）", () => {
    const out = renderWithLuxuryGold(
      `::: text-card
正文内容用暖米浅底承载，避免深底深字不可读。
:::`,
    );
    const sec =
      out.match(/<section class="wemd-component wemd-text-card"[^>]*>/)?.[0] ??
      "";
    expect(sec).toContain("background: #fbf6ea");
    expect(sec).toContain("color: #3d2818");
  });

  it("follow-bar：黑金关注条（同特异性覆盖共享白色文本，金字可见）", () => {
    const out = renderWithLuxuryGold(
      `::: follow-bar
点击上方蓝字关注我们

关注
:::`,
    );
    const firstP =
      out.match(/<p[^>]*style="[^"]*"[^>]*>点击上方蓝字关注我们<\/p>/)?.[0] ??
      "";
    expect(firstP).toContain("color: #faf3e0");
    expect(firstP).not.toContain("color: #ffffff");
  });

  it("code-frame：保持默认骨架与皮肤，无黑金奢华定制污染", () => {
    const out = renderWithLuxuryGold(
      ["::: code-frame", "```js", "const a = 1;", "```", ":::"].join("\n"),
    );
    expect(out).toContain("wemd-cf-code");
    expect(out).not.toContain("wemd-lg-");
  });

  it("导出无伪元素 / 结构伪类残留，且 #wemd 无整篇背景", () => {
    const out = renderWithLuxuryGold("正文内容\n\n---\n\n段落");
    expect(out).not.toMatch(/::/);
    expect(out).not.toMatch(/:nth-child|:first-child|:last-child|:not\(/);
    const wemd = out.match(/<section id="wemd"[^>]*>/)?.[0] ?? "";
    expect(wemd).not.toMatch(/background-color/);
  });
});

// ============================================================

function renderWithMorandiForest(md: string): string {
  const theme = getBuiltInThemeDefinition("morandi-forest")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const parser = createMarkdownParser({
    getTemplate: (id) => templates.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

describe("莫兰迪森林：层林 · 独立骨架 + 皮肤", () => {
  it("magazine-cover：定制骨架林冠叶片垂饰 + 大标题 + 山形雾线（真实元素）", () => {
    const out = renderWithMorandiForest(
      `::: magazine-cover
MIST FOREST · JOURNAL
层 林
从深松到雾气，是森林的呼吸。
:::`,
    );
    expect(out).toContain("wemd-mf-canopy");
    expect(out).toContain("wemd-mf-vine");
    expect(out).toContain("wemd-mf-leaf");
    expect(out).toContain("wemd-mf-kicker");
    expect(out).toContain("wemd-mf-title");
    expect(out).toContain("wemd-mf-mistline");
    expect(out).toContain("wemd-mf-desc");
    expect(out).toContain("wemd-mf-ridge");
  });

  it("section-divider：定制骨架超大数字 + 标题 + 细线 + 叶片", () => {
    const out = renderWithMorandiForest(
      `::: section-divider
01
第一章 · 归林
:::`,
    );
    expect(out).toContain("wemd-mf-big");
    expect(out).toContain("wemd-mf-title");
    expect(out).toContain("wemd-mf-line");
    expect(out).toContain("wemd-mf-leaf");
  });

  it("divider：定制骨架林冠垂坠叶片，无双线（共享 ::before/::after 已中和）", () => {
    const out = renderWithMorandiForest("---");
    expect(out).toContain("wemd-mf-dline");
    expect(out).toContain("wemd-mf-drip");
    expect(out).toContain("wemd-mf-leaf");
    expect(out).not.toMatch(/wemd-mat[^>]*height: 1px/);
  });

  it("quote-card：定制骨架悬挂果实（藤蔓 + 陶土叶片）", () => {
    const out = renderWithMorandiForest(
      `::: quote-card
真正的温柔，往往不动声色。

署名：**林间**
:::`,
    );
    expect(out).toContain("wemd-mf-hang");
    expect(out).toContain("wemd-mf-stem");
    expect(out).toContain("wemd-mf-leaf-clay");
    const sec =
      out.match(/<section class="wemd-component wemd-quote-card"[^>]*>/)?.[0] ??
      "";
    expect(sec).toContain("background: #fbf9f2");
    const quote = out.match(/<section class="wemd-qc-quote"[^>]*>/)?.[0] ?? "";
    expect(quote).toContain("color: #33382e");
  });

  it("end-card：定制骨架深松收束（林冠 + 雾线，深底白字可读）", () => {
    const out = renderWithMorandiForest(
      `::: end-card
归 林
感谢阅读 · 山高水长
:::`,
    );
    expect(out).toContain("wemd-mf-canopy");
    expect(out).toContain("wemd-mf-mistline");
    const sec =
      out.match(/<section class="wemd-component wemd-end-card"[^>]*>/)?.[0] ??
      "";
    expect(sec).toContain("background: linear-gradient(180deg, #52644a");
    const title = out.match(/<section class="wemd-ec-title"[^>]*>/)?.[0] ?? "";
    expect(title).toContain("color: #f6f4ec");
  });

  it("timeline：叶节点（圆点改叶形，真实元素）", () => {
    const out = renderWithMorandiForest(
      `::: timeline
一棵树的生长

- 2019 · 播下第一颗种子
- 2022 · 长出第一片叶
:::`,
    );
    expect(out).toContain("wemd-tl-dot");
    // 叶形（非圆形）：border-radius 为 0 50% 50% 50%
    expect(out).toMatch(/wemd-tl-dot[^>]*border-radius: 0 50% 50% 50%/);
    // 事件容器已去掉共享 padding-left:20px，圆点/叶节点能落在竖线上
    expect(out).not.toMatch(/wemd-tl-events[^>]*padding-left: 20px/);
  });

  it("code-frame：保持默认骨架与皮肤，无莫兰迪森林定制污染", () => {
    const out = renderWithMorandiForest(
      ["::: code-frame", "```js", "const a = 1;", "```", ":::"].join("\n"),
    );
    expect(out).toContain("wemd-cf-code");
    expect(out).not.toContain("wemd-mf-");
  });

  it("导出无伪元素 / 结构伪类残留，且 #wemd 无整篇背景", () => {
    const out = renderWithMorandiForest("正文内容\n\n---\n\n段落");
    expect(out).not.toMatch(/::/);
    expect(out).not.toMatch(/:nth-child|:first-child|:last-child|:not\(/);
    const wemd = out.match(/<section id="wemd"[^>]*>/)?.[0] ?? "";
    expect(wemd).not.toMatch(/background-color/);
  });
});

// ============================================================

function renderWithModernEditorial(md: string): string {
  const theme = getBuiltInThemeDefinition("modern-editorial")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const parser = createMarkdownParser({
    getTemplate: (id) => templates.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

describe("编辑部手记：纸媒编辑部 · 主题私有骨架 + 皮肤", () => {
  it("magazine-cover：定制骨架刊头顶栏 + 大标题 + 粗细栏线（真实元素）", () => {
    const out = renderWithModernEditorial(
      `::: magazine-cover
编辑部手记 · NEWSROOM
让好的内容，找到它的读者
深度 · 长文 · 编辑精选
:::`,
    );
    expect(out).toContain("wemd-me-topline");
    expect(out).toContain("wemd-me-brand");
    expect(out).toContain("wemd-me-tag");
    expect(out).toContain("wemd-me-title");
    expect(out).toContain("wemd-me-rules");
    expect(out).toContain("wemd-me-thick");
    expect(out).toContain("wemd-me-thin");
    expect(out).toContain("wemd-me-desc");
  });

  it("section-divider：定制骨架编辑号 + 标题 + 栏线", () => {
    const out = renderWithModernEditorial(
      `::: section-divider
NO. 01
从选题到见刊
:::`,
    );
    expect(out).toContain("wemd-me-no");
    expect(out).toContain("wemd-me-title");
    expect(out).toContain("wemd-me-rule");
  });

  it("divider：定制骨架粗线 + ◆ + 细线，无双线（共享 ::before/::after 已中和）", () => {
    const out = renderWithModernEditorial("---");
    expect(out).toContain("wemd-me-thick");
    expect(out).toContain("wemd-me-glyph");
    expect(out).toContain("wemd-me-thin");
    expect(out).not.toMatch(/wemd-mat[^>]*height: 1px/);
  });

  it("quote-card：定制骨架无引号（仅编辑红左条 + 引文）", () => {
    const out = renderWithModernEditorial(
      `::: quote-card
编辑不是删减，而是收敛。

署名：**编辑部**
:::`,
    );
    expect(out).not.toContain("wemd-me-qmark");
    expect(out).toContain("wemd-qc-quote");
    const sec =
      out.match(/<section class="wemd-component wemd-quote-card"[^>]*>/)?.[0] ??
      "";
    expect(sec).toContain("border-left: 3px solid #d0342c");
  });

  it("full-quote：定制骨架无引号（仅左侧竖条 + 引文）", () => {
    const out = renderWithModernEditorial(
      `::: full-quote
编辑，是内容的守门人。
:::`,
    );
    expect(out).not.toContain("wemd-me-qmark");
    expect(out).toContain("wemd-fq-text");
  });

  it("end-card：定制骨架版权页（墨黑底 + 白字可读 + 编辑名单）", () => {
    const out = renderWithModernEditorial(
      `::: end-card
编辑部 · 手记

NEWSROOM · VOL.04

编辑 · 山风
:::`,
    );
    expect(out).toContain("wemd-me-line");
    expect(out).toContain("wemd-me-editors");
    const sec =
      out.match(/<section class="wemd-component wemd-end-card"[^>]*>/)?.[0] ??
      "";
    expect(sec).toContain("background: #1c1a17");
    const title = out.match(/<section class="wemd-ec-title"[^>]*>/)?.[0] ?? "";
    expect(title).toContain("color: #faf8f2");
  });

  it("code-frame：保持默认骨架与皮肤，无编辑部手记定制污染", () => {
    const out = renderWithModernEditorial(
      ["::: code-frame", "```js", "const a = 1;", "```", ":::"].join("\n"),
    );
    expect(out).toContain("wemd-cf-code");
    expect(out).not.toContain("wemd-me-");
  });

  it("导出无伪元素 / 结构伪类残留，且 #wemd 无整篇背景", () => {
    const out = renderWithModernEditorial("正文内容\n\n---\n\n段落");
    expect(out).not.toMatch(/::/);
    expect(out).not.toMatch(/:nth-child|:first-child|:last-child|:not\(/);
    const wemd = out.match(/<section id="wemd"[^>]*>/)?.[0] ?? "";
    expect(wemd).not.toMatch(/background-color/);
  });
});

function renderWithReceipt(md: string): string {
  const theme = getBuiltInThemeDefinition("receipt")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const parser = createMarkdownParser({
    getTemplate: (id) => templates.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

describe("购物小票：热敏小票 · 主题私有骨架 + 皮肤", () => {
  it("magazine-cover：定制票头骨架（店名 + 副标 + 虚线 + 小字）", () => {
    const out = renderWithReceipt(
      `::: magazine-cover
森野杂货铺
SENYE GENERAL STORE · 018
NO. 20260819-0088
:::`,
    );
    expect(out).toContain("wemd-rc-store");
    expect(out).toContain("wemd-rc-sub");
    expect(out).toContain("wemd-rc-dash");
    expect(out).toContain("wemd-rc-desc");
    // 店名墨黑字，非浅色
    expect(out).toMatch(/wemd-rc-store[^>]*color: ?#1f1d1a/);
  });

  it("section-divider：定制单号骨架（NO 编号 + 标题 + 底虚线）", () => {
    const out = renderWithReceipt(
      `::: section-divider
单号 · 01
今日份清单
:::`,
    );
    expect(out).toContain("wemd-rc-no");
    expect(out).toContain("wemd-rc-title");
    expect(out).toContain("wemd-rc-line");
    // 编号小票红
    expect(out).toMatch(/wemd-rc-no[^>]*color: ?#cf2323/);
  });

  it("divider：定制虚线分隔（★ 星星），无共享双线", () => {
    const out = renderWithReceipt("::: divider\n- - -\n:::");
    expect(out).toContain("wemd-rc-stars");
    expect(out).toContain("★ ★ ★ ★ ★");
    expect(out).not.toContain("wemd-mat"); // ::before/::after 被 content:none 中和
  });

  it("end-card：定制集章卡骨架（小标签 + 品牌 + 分隔 + 编号）", () => {
    const out = renderWithReceipt(
      `::: end-card
SENYE 会员
森野 · 集章卡
累计消费 ¥1,286 · 再集 2 章升金卡
:::`,
    );
    expect(out).toContain("wemd-rc-label");
    expect(out).toContain("wemd-rc-brand");
    expect(out).toContain("wemd-rc-line");
    expect(out).toContain("wemd-rc-meta");
    // 浅底墨字（非深底深字）
    expect(out).toMatch(/wemd-rc-brand[^>]*color: ?#1f1d1a/);
  });

  it("stats-block：数值为小票红并右对齐（row-reverse）", () => {
    const out = renderWithReceipt(
      `::: stats-block
核心数据

- 组件总数
  **44**
- 原型分组
  **7**
:::`,
    );
    expect(out).toContain("核心数据");
    // value = 数字（红色），label = 文字
    expect(out).toMatch(/wemd-sb-items-value[^>]*#cf2323/);
    expect(out).toMatch(/wemd-sb-items-value[^>]*>44</);
    expect(out).toMatch(/wemd-sb-items-label[^>]*>组件总数</);
  });

  it("timeline：小票点线行（红色方块点，事件容器无共享左 padding）", () => {
    const out = renderWithReceipt(
      `::: timeline
积分明细

- +3.5 购买 莫兰迪马克杯
- +4.8 购买 手工藤编篮
:::`,
    );
    expect(out).toContain("wemd-tl-dot");
    expect(out).toMatch(/wemd-tl-dot[^>]*background: ?#cf2323/);
    expect(out).not.toMatch(/wemd-tl-events[^>]*padding-left: 20px/);
  });

  it("follow-bar：首段为墨黑字（同路径同特异性，非共享白字）", () => {
    const out = renderWithReceipt(
      `::: follow-bar
长按识别关注「森野杂货铺」

关注
:::`,
    );
    expect(out).toContain("wemd-follow-bar");
    expect(out).toMatch(/wemd-follow-bar[^>]*border-left: 3px solid #cf2323/);
    // 首段不是共享的白色
    expect(out).not.toMatch(/wemd-follow-bar[\s\S]{0,400}color: ?#ffffff/);
  });

  it("code-frame 保持默认：无小票主题污染类名", () => {
    const out = renderWithReceipt(
      "::: code-frame\n语言\n```js\nconst a = 1;\n```\n:::",
    );
    expect(out).toContain("wemd-code-frame");
    expect(out).not.toMatch(/wemd-rc-/);
  });

  it("导出无伪元素 / 结构伪类残留，且 #wemd 无整篇背景", () => {
    const out = renderWithReceipt("正文内容\n\n---\n\n段落");
    expect(out).not.toMatch(/::/);
    expect(out).not.toMatch(/:nth-child|:first-child|:last-child|:not\(/);
    const wemd = out.match(/<section id="wemd"[^>]*>/)?.[0] ?? "";
    expect(wemd).not.toMatch(/background-color/);
  });
});

function renderWithKnowledgeBase(md: string): string {
  const theme = getBuiltInThemeDefinition("knowledge-base")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const parser = createMarkdownParser({
    getTemplate: (id) => templates.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

describe("知识库：知识档案库 · 主题私有骨架 + 皮肤", () => {
  it("magazine-cover：定制条目头骨架（标签 + 衬线标题 + 索书号元信息）", () => {
    const out = renderWithKnowledgeBase(
      `::: magazine-cover
条目 · ENTRY
知识库写作的七个原则
索书号 KD.0001 · 归档 2026-08-19 · 修订 v2.3
:::`,
    );
    expect(out).toContain("wemd-kb-label");
    expect(out).toContain("wemd-kb-title");
    expect(out).toContain("wemd-kb-meta");
    // 标题墨黑（非浅色）
    expect(out).toMatch(/wemd-kb-title[^>]*color: ?#2a2622/);
  });

  it("section-divider：定制档案章节头（PART 编号 + 标题 + 细线）", () => {
    const out = renderWithKnowledgeBase(
      `::: section-divider
概念 · CONCEPT
概念定义与边界
:::`,
    );
    expect(out).toContain("wemd-kb-part");
    expect(out).toContain("wemd-kb-sec-title");
    expect(out).toContain("wemd-kb-sec-line");
    // 编号墨蓝
    expect(out).toMatch(/wemd-kb-part[^>]*color: ?#31517f/);
  });

  it("end-card：定制档案袋骨架（深墨蓝底 + 浅字）", () => {
    const out = renderWithKnowledgeBase(
      `::: end-card
知识常新，条目常青
ARCHIVAL BOX · 档案袋
KD.0001 · 归档 2026-08-19
:::`,
    );
    expect(out).toContain("wemd-kb-bag-lbl");
    expect(out).toContain("wemd-kb-bag-title");
    expect(out).toContain("wemd-kb-bag-meta");
    // 深底必浅字：标题为浅色
    expect(out).toMatch(/wemd-kb-bag-title[^>]*color: ?#f2f5fa/);
  });

  it("code-frame：定制档案查询终端（mac 圆点 + 标题）", () => {
    const out = renderWithKnowledgeBase(
      "::: code-frame\narchive.query\n```sql\nSELECT * FROM kb;\n```\n:::",
    );
    expect(out).toContain("wemd-cf-header");
    expect(out).toContain("wemd-kb-dot-r");
    expect(out).toContain("wemd-kb-dot-y");
    expect(out).toContain("wemd-kb-dot-g");
    expect(out).toContain("wemd-cf-title");
    expect(out).toContain("wemd-cf-code");
  });

  it("quote-card：档案摘录（赭黄左条）", () => {
    const out = renderWithKnowledgeBase(
      `::: quote-card
知识库的价值不在存量，而在能否被再次找到。

— 《知识库写作的七个原则》
:::`,
    );
    expect(out).toContain("wemd-quote-card");
    expect(out).toMatch(/wemd-quote-card[^>]*border-left: 4px solid #c9a24b/);
  });

  it("stats-block：数值为墨蓝（档案卡）", () => {
    const out = renderWithKnowledgeBase(
      `::: stats-block
在库条目

- 组件总数
  **44**
- 大类归档
  **7**
:::`,
    );
    expect(out).toContain("在库条目");
    expect(out).toMatch(/wemd-sb-items-value[^>]*#31517f/);
    expect(out).toMatch(/wemd-sb-items-value[^>]*>44</);
    expect(out).toMatch(/wemd-sb-items-label[^>]*>组件总数</);
  });

  it("timeline：修订记录（陶土点 + 事件容器无共享左 padding）", () => {
    const out = renderWithKnowledgeBase(
      `::: timeline
修订记录

- 2026-08-19 修订 v2.3
- 2026-07-02 修订 v2.2
:::`,
    );
    expect(out).toContain("wemd-tl-dot");
    expect(out).toMatch(/wemd-tl-dot[^>]*background: ?#b8724e/);
    expect(out).not.toMatch(/wemd-tl-events[^>]*padding-left: 20px/);
  });

  it("导出无伪元素 / 结构伪类残留，且 #wemd 无整篇背景", () => {
    const out = renderWithKnowledgeBase("正文内容\n\n---\n\n段落");
    expect(out).not.toMatch(/::/);
    expect(out).not.toMatch(/:nth-child|:first-child|:last-child|:not\(/);
    const wemd = out.match(/<section id="wemd"[^>]*>/)?.[0] ?? "";
    expect(wemd).not.toMatch(/background-color/);
  });
});

function renderWithSunsetFilm(md: string): string {
  const theme = getBuiltInThemeDefinition("sunset-film")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const parser = createMarkdownParser({
    getTemplate: (id) => templates.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

describe("落日胶片：胶片黄昏 · 主题私有骨架 + 皮肤", () => {
  it("magazine-cover：定制封面静帧（kicker + 衬线标题 + sub + 颗粒 + 光边）", () => {
    const out = renderWithSunsetFilm(
      `::: magazine-cover
REEL ONE · 第一卷
把黄昏装进胶片里
SUNSET / GRAIN / LIGHT LEAK
:::`,
    );
    expect(out).toContain("wemd-sf-frame");
    expect(out).toContain("wemd-sf-grain");
    expect(out).toContain("wemd-sf-kicker");
    expect(out).toContain("wemd-sf-title");
    expect(out).toContain("wemd-sf-sub");
    expect(out).toContain("wemd-sf-edge");
    // 深黄昏渐变底 → 标题为浅字
    expect(out).toMatch(/wemd-sf-title[^>]*color: ?#fff6ea/);
  });

  it("end-card：定制胶卷盘骨架（深紫黑底 + 浅字）", () => {
    const out = renderWithSunsetFilm(
      `::: end-card
愿你有光，留得住黄昏
END OF REEL · 收卷
REEL 019 · 35MM · DEVELOPED WITH LOVE
:::`,
    );
    expect(out).toContain("wemd-sf-grain");
    expect(out).toContain("wemd-sf-lbl");
    expect(out).toContain("wemd-sf-reel-title");
    expect(out).toContain("wemd-sf-meta");
    // 深底必浅字：标题为浅色
    expect(out).toMatch(/wemd-sf-reel-title[^>]*color: ?#f7ead8/);
  });

  it("code-frame：定制暗房终端（mac 圆点 + 标题）", () => {
    const out = renderWithSunsetFilm(
      "::: code-frame\ndarkroom.cmd\n```bash\nDEVELOP 'reel_019'\n```\n:::",
    );
    expect(out).toContain("wemd-cf-header");
    expect(out).toContain("wemd-sf-dot-r");
    expect(out).toContain("wemd-sf-dot-y");
    expect(out).toContain("wemd-sf-dot-g");
    expect(out).toContain("wemd-cf-code");
  });

  it("divider：定制齿孔片边，无共享双线", () => {
    const out = renderWithSunsetFilm("::: divider\n- - -\n:::");
    expect(out).toContain("wemd-sf-sprocket");
    expect(out).not.toContain("wemd-mat");
  });

  it("quote-card：漏光引语（落日橙左条）", () => {
    const out = renderWithSunsetFilm(
      `::: quote-card
最好的光，总在日落前十四分钟。

— 摄影师手记
:::`,
    );
    expect(out).toContain("wemd-quote-card");
    expect(out).toMatch(/wemd-quote-card[^>]*border-left: 4px solid #f2762e/);
  });

  it("timeline：冲印记录（落日橙点 + 事件容器无共享左 padding）", () => {
    const out = renderWithSunsetFilm(
      `::: timeline
冲印记录

- 18:38 第一卷 · 金辉显影
- 18:46 第二卷 · 绯霞定影
:::`,
    );
    expect(out).toContain("wemd-tl-dot");
    expect(out).toMatch(/wemd-tl-dot[^>]*background: ?#f2762e/);
    expect(out).not.toMatch(/wemd-tl-events[^>]*padding-left: 20px/);
  });

  it("导出无伪元素 / 结构伪类残留，且 #wemd 无整篇背景", () => {
    const out = renderWithSunsetFilm("正文内容\n\n---\n\n段落");
    expect(out).not.toMatch(/::/);
    expect(out).not.toMatch(/:nth-child|:first-child|:last-child|:not\(/);
    const wemd = out.match(/<section id="wemd"[^>]*>/)?.[0] ?? "";
    expect(wemd).not.toMatch(/background-color/);
  });
});

// ============================================================
// 故事集 · Storybook
// ============================================================
function renderWithStorybook(md: string): string {
  const theme = getBuiltInThemeDefinition("storybook")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const slotDefs = getThemeSlotDefs(theme);
  const parser = createMarkdownParser({
    mathRenderer: "katex",
    getTemplate: (id) => templates.get(id),
    getSlotDefs: (id) => slotDefs.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

describe("故事集：纯图封面 + 沉浸阅读 · 主题私有骨架 + 皮肤", () => {
  it("magazine-cover：纯图封面（background-image 图床 URL + 底部渐变，文字正常流锚底部）", () => {
    const out = renderWithStorybook(
      `::: magazine-cover
**雾中来信**

致所有在时间里走失的人

雾从海上漫上来的时候，灯塔刚刚亮起。

![](https://picsum.photos/seed/sb/1200/630)
:::`,
    );
    expect(out).toContain("wemd-sk-heading");
    expect(out).toContain("wemd-sk-subtitle");
    expect(out).toContain("wemd-sk-opening");
    // 图片进 background-image（图床 URL），无绝对定位叠字（公众号兼容）
    const cover = out.slice(
      out.indexOf("wemd-sk-cover"),
      out.indexOf("wemd-sk-cover") + 600,
    );
    expect(cover).toMatch(
      /background-image:.*url\(https:\/\/picsum\.photos\/seed\/sb\/1200\/630\)/,
    );
    expect(cover).not.toMatch(/position:\s*absolute/);
    // 图区用 padding-top 百分比压出（非固定 height clamp）
    expect(cover).toMatch(/padding:\s*46%/);
    expect(cover).not.toMatch(/height:\s*clamp/);
    // 封面浅字（图底叠层，非共享深字）
    expect(out).toMatch(/wemd-sk-heading[^>]*color: ?#f3ecdf/);
    // 封面根元素无共享卡片边框（1px solid）残留
    expect(out).not.toMatch(/wemd-magazine-cover[^>]*border: 1px solid/);
  });

  it("text-card：引子卡（kicker「第一段 · 引子」+ 首字下沉 + 大字衬线正文）", () => {
    const out = renderWithStorybook(
      `::: text-card
第一段 · 引子

雾从海上漫上来的时候，灯塔刚刚亮起。
:::`,
    );
    expect(out).toContain("wemd-sk-lead-kicker");
    const lead = out.slice(out.indexOf("wemd-sk-lead"));
    expect(lead.match(/第一段 · 引子/g)?.length ?? 0).toBe(1);
    // 首字下沉槽存在且承载「雾」（截取到 </span> 结束，避开内联 style）
    expect(lead).toContain("wemd-sk-dropcap");
    const dropStart = lead.indexOf("wemd-sk-dropcap");
    const dropEnd = lead.indexOf("</span>", dropStart);
    expect(lead.slice(dropStart, dropEnd)).toContain("雾");
    // 首字从正文剥除后，正文以「从海上…」继续
    expect(lead).toContain("从海上");
  });

  it("section-divider：章节分隔（上下结构：章标小字在上 + 章名大字带底线）", () => {
    const out = renderWithStorybook("::: section-divider\n壹\n灯芯\n:::");
    expect(out).toContain("wemd-sk-chapter-part");
    expect(out).toContain("wemd-sk-chapter-title");
    expect(out).toMatch(/wemd-sk-chapter-part[^>]*color: ?#b5533a/);
    // 章名大字（clamp 自适应）、章标在上（part 在 title 之前）
    expect(out).toMatch(/wemd-sk-chapter-title[^>]*font-size: ?clamp/);
    expect(out.indexOf("wemd-sk-chapter-part")).toBeLessThan(
      out.indexOf("wemd-sk-chapter-title"),
    );
  });

  it("quote-card：金句（居中双线 + 加粗署名）", () => {
    const out = renderWithStorybook(
      `::: quote-card
「雾可以遮住方向，却遮不住一盏灯的去意。」

**—— 老周**
:::`,
    );
    expect(out).toContain("wemd-sk-quote-text");
    expect(out).toContain("wemd-sk-quote-author");
    expect(out).toContain("老周");
    expect(out).toMatch(/wemd-sk-quote-text[^>]*text-align: ?center/);
  });

  it("end-card：结尾（完 + 后记标题 + 正文居中）", () => {
    const out = renderWithStorybook(
      `::: end-card
完

后记

第二年春天，灯塔换了新人。
:::`,
    );
    expect(out).toContain("wemd-sk-end-mark");
    expect(out).toContain("wemd-sk-end-heading");
    expect(out).toContain("wemd-sk-end-text");
    // 顺序：完 → 后记标题 → 正文
    const mark = out.indexOf("wemd-sk-end-mark");
    const heading = out.indexOf("wemd-sk-end-heading");
    const text = out.indexOf("wemd-sk-end-text");
    expect(mark).toBeGreaterThan(-1);
    expect(heading).toBeGreaterThan(mark);
    expect(text).toBeGreaterThan(heading);
    expect(out).toMatch(/wemd-sk-end-text[^>]*text-align: ?center/);
  });

  it("end-card：无后记标题时正文直接落 subtitle（不被 heading 吞成大标题）", () => {
    const out = renderWithStorybook(
      `::: end-card
完

第二年春天，灯塔换了新人。
:::`,
    );
    expect(out).toContain("wemd-sk-end-mark");
    // 长正文不匹配 maxChars=6 的 heading，故不渲染大标题槽
    expect(out).not.toContain("wemd-sk-end-heading");
    expect(out).toContain("第二年春天");
  });

  it("callout 无双竖条（纸面块无红竖线，strong 为说话人小标）", () => {
    const out = renderWithStorybook(
      "::: callout\n**孩子**\n「这封信，是写给谁的？」\n\n**老周**\n「写给所有在雾里赶路的人。」\n:::",
    );
    expect(out).not.toMatch(/wemd-mat[^>]*width:\s*4px/);
    expect(out).not.toMatch(/wemd-callout[^>]*border-left: ?4px/);
    // 说话人 strong 小标：红色小字（内联样式）
    const strong = out.slice(out.indexOf("<strong"), out.indexOf("</strong>"));
    expect(strong).toContain("#b5533a");
  });

  it("导出无伪元素 / 结构伪类残留，且 #wemd 无整篇背景", () => {
    const out = renderWithStorybook("正文内容\n\n---\n\n段落");
    expect(out).not.toMatch(/::/);
    expect(out).not.toMatch(/:nth-child|:first-child|:last-child|:not\(/);
    const wemd = out.match(/<section id="wemd"[^>]*>/)?.[0] ?? "";
    expect(wemd).not.toMatch(/background-color/);
  });
});

// ============================================================
// 好物种草 · Shopping Guide
// ============================================================
function renderWithShoppingGuide(md: string): string {
  const theme = getBuiltInThemeDefinition("shopping-guide")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const slotDefs = getThemeSlotDefs(theme);
  const parser = createMarkdownParser({
    mathRenderer: "katex",
    getTemplate: (id) => templates.get(id),
    getSlotDefs: (id) => slotDefs.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

describe("好物种草：实物摄影 + 编号价格签 · 主题私有骨架 + 皮肤", () => {
  it("magazine-cover：封面（background-image 图床 URL + kicker/大标题/副题叠层）", () => {
    const out = renderWithShoppingGuide(
      `::: magazine-cover
买手清单 · SHOPPING LIST

让桌面变好的四件小东西

不追新款，只留用过三个月还想继续用的。

![](https://example.com/hero.jpg)
:::`,
    );
    expect(out).toContain("wemd-sg-cover-kicker");
    expect(out).toContain("wemd-sg-cover-title");
    // 封面图进 background-image（图床 URL），无绝对定位叠字（公众号兼容）
    const cover = out.slice(
      out.indexOf("wemd-sg-cover"),
      out.indexOf("wemd-sg-cover") + 600,
    );
    expect(cover).toMatch(
      /background-image:.*url\(https:\/\/example\.com\/hero\.jpg\)/,
    );
    expect(cover).not.toMatch(/position:\s*absolute/);
    // 图区用 padding-top 百分比压出（非固定 height clamp）
    expect(cover).toMatch(/padding:\s*52%/);
    expect(cover).not.toMatch(/height:\s*clamp/);
    // 封面根元素无共享卡片边框残留
    expect(out).not.toMatch(/wemd-magazine-cover[^>]*border: 1px solid/);
  });

  it("text-card：引言（kicker 小标 + 大字引言）", () => {
    const out = renderWithShoppingGuide(
      `::: text-card
筛选标准 · STANDARD

这期只收四件。
:::`,
    );
    expect(out).toContain("wemd-sg-intro-tag");
    expect(out).toContain("wemd-sg-intro-text");
    expect(out).toContain("筛选标准");
  });

  it("image-caption：好物卡（编号标签 + 价格签 + 名称 + 理由）", () => {
    const out = renderWithShoppingGuide(
      `::: image-caption
![](https://example.com/lamp.jpg)

01 · 光线

黄铜台灯

¥299

暖光调到最暗，正好照到键盘。
:::`,
    );
    expect(out).toContain("wemd-sg-item-fig");
    expect(out).toContain("wemd-sg-item-no");
    expect(out).toContain("wemd-sg-item-price");
    expect(out).toContain("wemd-sg-item-title");
    expect(out).toContain("wemd-sg-item-desc");
    // 编号 / 价格各就各位（截取到 </span> 结束，避开内联 style）
    const noStart = out.indexOf("wemd-sg-item-no");
    const noEnd = out.indexOf("</span>", noStart);
    expect(out.slice(noStart, noEnd)).toContain("01 · 光线");
    const priceStart = out.indexOf("wemd-sg-item-price");
    const priceEnd = out.indexOf("</span>", priceStart);
    expect(out.slice(priceStart, priceEnd)).toContain("¥299");
    // 推荐理由仍在（未被编号/价格吞掉）
    expect(out).toContain("暖光调到最暗");
    // 图片进 background-image（图床 URL），无绝对定位叠字（公众号兼容）
    const fig = out.slice(
      out.indexOf("wemd-sg-item-fig"),
      out.indexOf("wemd-sg-item-fig") + 400,
    );
    expect(fig).toMatch(
      /background-image:.*url\(https:\/\/example\.com\/lamp\.jpg\)/,
    );
    expect(fig).not.toMatch(/position:\s*absolute/);
    // 组件根清掉共享 text-align:center，编号标签挂左上角
    const root = out.slice(
      out.indexOf("wemd-image-caption"),
      out.indexOf("wemd-image-caption") + 200,
    );
    expect(root).toMatch(/text-align:\s*left/);
    expect(root).not.toMatch(/text-align:\s*center/);
  });

  it("end-card：落款（短线 + 署名 + 日期）", () => {
    const out = renderWithShoppingGuide(
      `::: end-card
买手清单 · 编辑部

SHOPPING LIST · 2026.08.20
:::`,
    );
    expect(out).toContain("wemd-sg-signoff-rule");
    expect(out).toContain("wemd-sg-signoff-name");
    expect(out).toContain("wemd-sg-signoff-date");
  });

  it("导出无伪元素 / 结构伪类残留，且 #wemd 无整篇背景", () => {
    const out = renderWithShoppingGuide("正文内容\n\n---\n\n段落");
    expect(out).not.toMatch(/::/);
    expect(out).not.toMatch(/:nth-child|:first-child|:last-child|:not\(/);
    const wemd = out.match(/<section id="wemd"[^>]*>/)?.[0] ?? "";
    expect(wemd).not.toMatch(/background-color/);
  });
});

// 美食图谱 · Food Atlas
// ============================================================
function renderWithFoodAtlas(md: string): string {
  const theme = getBuiltInThemeDefinition("food-atlas")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const slotDefs = getThemeSlotDefs(theme);
  const parser = createMarkdownParser({
    mathRenderer: "katex",
    getTemplate: (id) => templates.get(id),
    getSlotDefs: (id) => slotDefs.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

describe("美食图谱：暖橙美食卡 + TOP 徽章 + 标签 · 主题私有骨架 + 皮肤", () => {
  it("magazine-cover：封面（background-image 图床 URL + 眼标/大标题/描述叠层）", () => {
    const out = renderWithFoodAtlas(
      `::: magazine-cover
✦ 发现美味
本周美食推荐
精选本周值得一试的美味餐厅。
![](https://example.com/hero.jpg)
:::`,
    );
    expect(out).toContain("wemd-fa-cover");
    expect(out).toContain("wemd-fa-hero-eyebrow");
    expect(out).toContain("wemd-fa-hero-title");
    expect(out).toContain("wemd-fa-hero-desc");
    const cover = out.slice(
      out.indexOf("wemd-fa-cover"),
      out.indexOf("wemd-fa-cover") + 400,
    );
    expect(cover).toMatch(
      /background-image:.*url\(https:\/\/example\.com\/hero\.jpg\)/,
    );
    // 无绝对定位叠字、无 fixed height clamp（padding-top 压图区）
    expect(cover).not.toMatch(/position:\s*absolute/);
    expect(cover).not.toMatch(/height:\s*clamp/);
    // 封面根元素清掉共享卡片边框 / 卡片底色
    expect(out).not.toMatch(/wemd-magazine-cover[^>]*border: 1px solid/);
  });

  it("text-card：引言（kicker 小标 + 大字引言）", () => {
    const out = renderWithFoodAtlas(
      `::: text-card
本周精选 · PICKS
这三道招牌值得专程跑一趟。
:::`,
    );
    expect(out).toContain("wemd-fa-intro-tag");
    expect(out).toContain("wemd-fa-intro-text");
    expect(out).toContain("本周精选");
  });

  it("image-caption：美食卡（图 + TOP 徽章 + 菜名 + 门店 + 标签 + 描述）", () => {
    const out = renderWithFoodAtlas(
      `::: image-caption
![](https://example.com/ramen.jpg)
TOP 1
浓汤叉烧拉面
面屋武藏（国贸店）
#日式拉面 #浓郁汤底
汤头醇厚，叉烧软嫩，面条劲道。
:::`,
    );
    expect(out).toContain("wemd-fa-dish-fig");
    expect(out).toContain("wemd-fa-dish-rank");
    expect(out).toContain("wemd-fa-dish-name");
    expect(out).toContain("wemd-fa-dish-location");
    expect(out).toContain("wemd-fa-dish-tags");
    expect(out).toContain("wemd-fa-dish-desc");
    // 各字段各就各位（截取到 </span>/</h3> 结束，避开内联 style）
    const rankStart = out.indexOf("wemd-fa-dish-rank");
    const rankEnd = out.indexOf("</span>", rankStart);
    expect(out.slice(rankStart, rankEnd)).toContain("TOP 1");
    const nameStart = out.indexOf("wemd-fa-dish-name");
    const nameEnd = out.indexOf("</h3>", nameStart);
    expect(out.slice(nameStart, nameEnd)).toContain("浓汤叉烧拉面");
    // 描述仍在（未被 number/title/location/tags 吞掉）
    expect(out).toContain("汤头醇厚，叉烧软嫩");
    // 图片进 background-image（图床 URL），无绝对定位叠字（公众号兼容）
    const fig = out.slice(
      out.indexOf("wemd-fa-dish-fig"),
      out.indexOf("wemd-fa-dish-fig") + 300,
    );
    expect(fig).toMatch(
      /background-image:.*url\(https:\/\/example\.com\/ramen\.jpg\)/,
    );
    expect(fig).not.toMatch(/position:\s*absolute/);
    // 组件根清掉共享 text-align:center，TOP 徽章挂左上角
    const root = out.slice(
      out.indexOf("wemd-image-caption"),
      out.indexOf("wemd-image-caption") + 200,
    );
    expect(root).toMatch(/text-align:\s*left/);
    expect(root).not.toMatch(/text-align:\s*center/);
  });

  it("end-card：落款（短线 + 署名 + 日期）", () => {
    const out = renderWithFoodAtlas(
      `::: end-card
味蕾编辑部
FOOD ATLAS · 2026.08.20
:::`,
    );
    expect(out).toContain("wemd-fa-signoff-rule");
    expect(out).toContain("wemd-fa-signoff-name");
    expect(out).toContain("wemd-fa-signoff-date");
  });

  it("导出无伪元素 / 结构伪类残留，且 #wemd 无整篇背景", () => {
    const out = renderWithFoodAtlas("正文内容\n\n---\n\n段落");
    expect(out).not.toMatch(/::/);
    expect(out).not.toMatch(/:nth-child|:first-child|:last-child|:not\(/);
    const wemd = out.match(/<section id="wemd"[^>]*>/)?.[0] ?? "";
    expect(wemd).not.toMatch(/background-color/);
  });
});

// 民宿纪 · Stay Notes
// ============================================================
function renderWithStayNotes(md: string): string {
  const theme = getBuiltInThemeDefinition("stay-notes")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const slotDefs = getThemeSlotDefs(theme);
  const parser = createMarkdownParser({
    mathRenderer: "katex",
    getTemplate: (id) => templates.get(id),
    getSlotDefs: (id) => slotDefs.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

describe("民宿纪：原木奶油大地暖调 · 主题私有骨架 + 皮肤", () => {
  it("magazine-cover：封面（background-image 图床 URL + 腰牌小标 + 大标题叠层）", () => {
    const out = renderWithStayNotes(
      `::: magazine-cover
民宿纪 · 本期慢住
把周末，住进一间暖房
原木的温、亚麻的柔。
![cover](https://example.com/cabin.jpg)
:::`,
    );
    expect(out).toContain("wemd-st-cover");
    expect(out).toContain("wemd-st-sign");
    expect(out).toContain("wemd-st-title");
    expect(out).toContain("wemd-st-caption");
    const cover = out.slice(
      out.indexOf("wemd-st-cover"),
      out.indexOf("wemd-st-cover") + 420,
    );
    expect(cover).toMatch(
      /background-image:.*url\(https:\/\/example\.com\/cabin\.jpg\)/,
    );
    // 无绝对定位叠字、无 fixed height clamp（padding-top 压图区）
    expect(cover).not.toMatch(/position:\s*absolute/);
    expect(cover).not.toMatch(/height:\s*clamp/);
    // 封面根元素清掉共享卡片边框 / 卡片底色
    expect(out).not.toMatch(/wemd-magazine-cover[^>]*border: 1px solid/);
  });

  it("text-card：导语（顶线 + 小标 + 大字引言）", () => {
    const out = renderWithStayNotes(
      `::: text-card
这一期挑房的标准
好民宿不是看得见风景，而是睡得好、坐得舒服。
:::`,
    );
    expect(out).toContain("wemd-st-intro-rule");
    expect(out).toContain("wemd-st-intro-tag");
    expect(out).toContain("wemd-st-intro-text");
    expect(out).toContain("这一期挑房的标准");
  });

  it("image-caption：民宿卡（木牌编号 + 价格签 + 店名 + 一句推荐 + 位置 + 理由）", () => {
    const out = renderWithStayNotes(
      `::: image-caption
![](https://example.com/cabin.jpg)
01
自木·山居
¥428
睡到自然醒
云顶镇 半山腰 · 含双早
#山景 #独立院子
整栋原木小屋，窗朝杉树林。
:::`,
    );
    expect(out).toContain("wemd-st-fig");
    expect(out).toContain("wemd-st-no");
    expect(out).toContain("wemd-st-price");
    expect(out).toContain("wemd-st-name");
    expect(out).toContain("wemd-st-slogan");
    expect(out).toContain("wemd-st-meta");
    expect(out).toContain("wemd-st-tags");
    expect(out).toContain("wemd-st-desc");
    // 各字段各就各位（截取到 </span>/</h3> 结束，避开内联 style）
    const noStart = out.indexOf("wemd-st-no");
    const noEnd = out.indexOf("</span>", noStart);
    expect(out.slice(noStart, noEnd)).toContain("01");
    const priceStart = out.indexOf("wemd-st-price");
    const priceEnd = out.indexOf("</span>", priceStart);
    expect(out.slice(priceStart, priceEnd)).toContain("¥428");
    // 推荐理由仍在（未被前面字段吞掉）
    expect(out).toContain("整栋原木小屋");
    // 图片进 background-image（图床 URL），无绝对定位叠字（公众号兼容）
    const fig = out.slice(
      out.indexOf("wemd-st-fig"),
      out.indexOf("wemd-st-fig") + 300,
    );
    expect(fig).toMatch(
      /background-image:.*url\(https:\/\/example\.com\/cabin\.jpg\)/,
    );
    expect(fig).not.toMatch(/position:\s*absolute/);
    // 组件根清掉共享 text-align:center，编号挂左上角
    const root = out.slice(
      out.indexOf("wemd-image-caption"),
      out.indexOf("wemd-image-caption") + 200,
    );
    expect(root).toMatch(/text-align:\s*left/);
    expect(root).not.toMatch(/text-align:\s*center/);
  });

  it("end-card：落款（短线 + 署名 + 日期）", () => {
    const out = renderWithStayNotes(
      `::: end-card
民宿纪 · 慢住
SLOW STAY · 2026.08.20
:::`,
    );
    expect(out).toContain("wemd-st-signoff-rule");
    expect(out).toContain("wemd-st-signoff-name");
    expect(out).toContain("wemd-st-signoff-date");
  });

  it("导出无伪元素 / 结构伪类残留，且 #wemd 无整篇背景", () => {
    const out = renderWithStayNotes("正文内容\n\n---\n\n段落");
    expect(out).not.toMatch(/::/);
    expect(out).not.toMatch(/:nth-child|:first-child|:last-child|:not\(/);
    const wemd = out.match(/<section id="wemd"[^>]*>/)?.[0] ?? "";
    expect(wemd).not.toMatch(/background-color/);
  });
});

describe("brand-sign：body 首段 logo 图片", () => {
  it("!`url` 语法：logo 进 .wemd-bs-logo，品牌名/slogan/style/版权正确", () => {
    const out = renderWithDefaultTheme(
      '::: brand-sign{variant="inline"}\n!`https://via.placeholder.com/64x64`\n\n**WeMD**\n\n优雅排版，不止所见\n\nstyle=inline divider=true\n\n*© 2026 WeMD Team*\n:::',
    );
    expect(out).toContain('class="wemd-bs-logo"');
    expect(out).toContain('src="https://via.placeholder.com/64x64"');
    expect(out).toContain("WeMD");
    expect(out).toContain("优雅排版，不止所见");
    expect(out).toContain('data-style="inline"');
    expect(out).toContain("© 2026 WeMD Team");
  });

  it("骨架含 .wemd-bs-text 文字列，logo 在文字列之前（inline 左图右文）", () => {
    const out = renderWithDefaultTheme(
      '::: brand-sign{variant="inline"}\n!`https://via.placeholder.com/64x64`\n\n**WeMD**\n\n优雅排版，不止所见\n\n*© 2026 WeMD Team*\n:::',
    );
    expect(out).toContain('class="wemd-bs-text"');
    // logo 在 .wemd-bs-text 之前
    const logoIdx = out.indexOf('class="wemd-bs-logo"');
    const textIdx = out.indexOf('class="wemd-bs-text"');
    expect(logoIdx).toBeGreaterThan(-1);
    expect(textIdx).toBeGreaterThan(logoIdx);
    // inline 变体的 CSS 规则注入（左图右文布局）
    const css = renderTheme(getBuiltInThemeDefinition("default")!);
    expect(css).toContain('[data-variant="inline"] .wemd-bs-text');
  });

  it("无 logo 时仍渲染空容器（主题资源 --wemd-asset-logo 回退）", () => {
    const out = renderWithDefaultTheme(
      "::: brand-sign\n**WeMD** · 让排版更优雅\n\n激发创造，丰富生活\n:::",
    );
    expect(out).toContain('class="wemd-bs-logo"');
    expect(out).toContain("WeMD");
    expect(out).toContain("让排版更优雅");
  });
});

// ============================================================
// 晚晴 · Wanqing
// ============================================================
function renderWithWanqing(md: string): string {
  const theme = getBuiltInThemeDefinition("wanqing")!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const slotDefs = getThemeSlotDefs(theme);
  const parser = createMarkdownParser({
    mathRenderer: "katex",
    getTemplate: (id) => templates.get(id),
    getSlotDefs: (id) => slotDefs.get(id),
  });
  const raw = parser.render(md);
  return processHtml(raw, css, true, true);
}

describe("晚晴：写给岁月 · 米纸楷宋 + 大字高对比 + 无盖章 · 主题私有骨架 + 皮肤", () => {
  it("magazine-cover：开卷封面（background-image 图床 URL + 底部渐变，文字正常流锚底部）", () => {
    const out = renderWithWanqing(
      `::: magazine-cover
写给岁月，也写给你

**晚晴**

有些话，在心里存了很久

![](https://picsum.photos/seed/wq/1200/630)
:::`,
    );
    expect(out).toContain("wemd-wq-eyebrow");
    expect(out).toContain("wemd-wq-title");
    expect(out).toContain("wemd-wq-opening");
    // 图片进 background-image（图床 URL），无绝对定位叠字（公众号兼容）
    const cover = out.slice(
      out.indexOf("wemd-wq-cover"),
      out.indexOf("wemd-wq-cover") + 700,
    );
    expect(cover).toMatch(
      /background-image:.*url\(https:\/\/picsum\.photos\/seed\/wq\/1200\/630\)/,
    );
    expect(cover).not.toMatch(/position:\s*absolute/);
    // 图区用 padding-top 百分比压出（非固定 height clamp）
    expect(cover).toMatch(/padding:\s*50%/);
    // 封面浅字（图底叠层，非共享深字）
    expect(out).toMatch(/wemd-wq-title[^>]*color: ?#fff8ea/);
    // 封面根元素无共享卡片边框（1px solid）残留
    expect(out).not.toMatch(/wemd-magazine-cover[^>]*border: 1px solid/);
  });

  it("text-card：引子卡（小标「第一段」+ 首字下沉 + 大字衬线正文）", () => {
    const out = renderWithWanqing(
      `::: text-card
第一段

晚风拂过院里的藤椅，天色将晚。
:::`,
    );
    expect(out).toContain("wemd-wq-lead-kicker");
    const lead = out.slice(out.indexOf("wemd-wq-lead"));
    // 首字下沉槽存在且承载「晚」（截取到 </span> 结束，避开内联 style）
    expect(lead).toContain("wemd-wq-dropcap");
    const dropStart = lead.indexOf("wemd-wq-dropcap");
    const dropEnd = lead.indexOf("</span>", dropStart);
    expect(lead.slice(dropStart, dropEnd)).toContain("晚");
    // 首字从正文剥除后，正文以「风拂过…」继续
    expect(lead).toContain("风拂过");
  });

  it("divider：螺纹分隔（发丝线 + 中央 ❖，中和共享双线）", () => {
    const out = renderWithWanqing("正文\n\n---\n\n段落");
    expect(out).toContain("wemd-wq-thread");
    expect(out).toContain("wemd-wq-mark");
    expect(out).toContain("❖");
    // 共享 divider 的 ::before/::after 已被中和（导出后无残留）
    expect(out).not.toMatch(/::/);
  });

  it("quote-card：引语（上下赭橘双线 + 居中大字 + 署名，不盖章）", () => {
    const out = renderWithWanqing(
      `::: quote-card
「有人问你粥可温，有人与你立黄昏。」

**—— 老周**
:::`,
    );
    expect(out).toContain("wemd-wq-quote-text");
    expect(out).toContain("wemd-wq-quote-author");
    expect(out).toContain("老周");
    expect(out).toMatch(/wemd-wq-quote-text[^>]*text-align: ?center/);
    // 引语块无印章元素（纯文字，不盖章）
    expect(out).not.toMatch(/wemd-wq-[a-z-]*seal/);
  });

  it("end-card：落款", () => {
    const out = renderWithWanqing(
      `::: end-card
晚晴

愿你往后的日子，日日花开，岁岁心安。
:::`,
    );
    expect(out).toContain("wemd-wq-end-rule");
    expect(out).toContain("wemd-wq-end-mark");
    expect(out).toContain("wemd-wq-end-text");
    expect(out).toContain("晚晴");
    expect(out).toContain("岁岁心安");
    // 收束句居中
    expect(out).toMatch(/wemd-wq-end-text[^>]*text-align: ?center/);
  });

  it("可读性：正文为暖棕深字压米纸、赭橘主色、无灰糊浅字；深色封面配浅字", () => {
    const theme = getBuiltInThemeDefinition("wanqing")!;
    const css = renderTheme(theme);
    // 正文深字（高对比）
    expect(css).toContain("#wemd p {\n  margin: 0 0 1.6em;\n  color: #3d3128;");
    // 主色赭橘在强调元素上
    expect(css).toContain("#a8613a");
    // #wemd 无整篇背景（交给公众号编辑器）：只查 #wemd { ... } 首个块
    const wemdHead = css.slice(
      css.indexOf("#wemd {"),
      css.indexOf("#wemd {") + 400,
    );
    expect(wemdHead).not.toMatch(/background/);
  });

  it("导出无伪元素 / 结构伪类残留，且 #wemd 无整篇背景", () => {
    const out = renderWithWanqing("正文内容\n\n---\n\n段落");
    expect(out).not.toMatch(/::/);
    expect(out).not.toMatch(/:nth-child|:first-child|:last-child|:not\(/);
    const wemd = out.match(/<section id="wemd"[^>]*>/)?.[0] ?? "";
    expect(wemd).not.toMatch(/background-color/);
  });
});

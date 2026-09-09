import { describe, expect, it } from "vitest";
import { createMarkdownParser } from "../MarkdownParser";
import { getDefaultTemplate } from "../plugins/component/defaultTemplates";
import { parseComponentSlots } from "../plugins/component/slotParsers";
import { fillTemplate } from "../plugins/component/templateFiller";
import { LEGAL_COMPONENTS } from "../theme-registry/componentRegistry";

function parser() {
  return createMarkdownParser();
}

describe("defaultTemplates 覆盖", () => {
  it("所有合法组件都有默认模板", () => {
    for (const id of LEGAL_COMPONENTS) {
      const tpl = getDefaultTemplate(id);
      expect(tpl, `组件 ${id} 应有默认模板`).toBeTruthy();
      // 必须包含外层容器与 data-component
      expect(tpl).toContain(`data-component="${id}"`);
      expect(tpl).toContain(`wemd-component`);
    }
  });

  it("精编模板覆盖 11 个专用渲染器组件", () => {
    const ids = [
      "magazine-cover",
      "section-divider",
      "two-column-cards",
      "full-quote",
      "image-card",
      "end-card",
      "product-card",
      "brand-sign",
      "resource-list",
      "testimonial-card",
      "series-nav",
    ];
    for (const id of ids) {
      const tpl = getDefaultTemplate(id);
      // 精编模板包含占位符（{{slot:}} 或 {{#each}}），非纯静态
      expect(tpl, `组件 ${id} 应为精编骨架`).toMatch(/\{\{slot:|\{\{#each/);
    }
  });
});

describe("defaultTemplates 渲染", () => {
  it("magazine-cover：title/subtitle/divider/desc 填充", () => {
    const data = parseComponentSlots(
      parser(),
      "magazine-cover",
      "主标题\n英文副标题\n---\n描述第一段\n\n描述第二段",
    );
    const html = fillTemplate(getDefaultTemplate("magazine-cover"), data);
    expect(html).toContain("wemd-mc-title");
    expect(html).toContain(">主标题</section>");
    expect(html).toContain(">英文副标题</section>");
    expect(html).toContain("描述第一段");
    expect(html).toContain("描述第二段");
  });

  it("two-column-cards：each 遍历条目（单列 vc）", () => {
    const data = parseComponentSlots(
      parser(),
      "two-column-cards",
      "- **标题A**\n  描述A\n- **标题B**\n  描述B",
    );
    const html = fillTemplate(getDefaultTemplate("two-column-cards"), data);
    expect((html.match(/wemd-vc-item">/g) ?? []).length).toBe(2);
    expect(html).toContain("标题A");
    expect(html).toContain("描述B");
  });

  it("stats-block：普通组件生成骨架 each 遍历 value/label", () => {
    const data = parseComponentSlots(
      parser(),
      "stats-block",
      "- 98%\n  用户满意度\n- 1200\n  日活用户",
    );
    const tpl = getDefaultTemplate("stats-block");
    expect(tpl).toContain("{{#each items}}");
    const html = fillTemplate(tpl, data);
    expect(html).toContain("98%");
    expect(html).toContain("日活用户");
    expect(html).toContain("wemd-sb-items-item");
  });

  it("quote-card：普通组件生成骨架渲染 quote/author", () => {
    const data = parseComponentSlots(
      parser(),
      "quote-card",
      "这是金句内容\n\n署名：**鲁迅**",
    );
    const html = fillTemplate(getDefaultTemplate("quote-card"), data);
    expect(html).toContain("wemd-qc-quote");
    expect(html).toContain("这是金句内容");
    expect(html).toContain("wemd-qc-author");
    expect(html).toContain("<strong>鲁迅</strong>");
  });

  it("product-card：七段式字段填充", () => {
    const data = parseComponentSlots(
      parser(),
      "product-card",
      [
        "【超值优惠】**商品标题** 副标题",
        "商品描述文字",
        "~~原价99~~ ￥59",
        "⭐ 4.8 📦 已售1200 🔥 库存50",
        "【立即抢购】",
        "#顺丰包邮 #七天无理由",
      ].join("\n\n"),
    );
    const html = fillTemplate(getDefaultTemplate("product-card"), data);
    expect(html).toContain("wemd-pc-badge");
    expect(html).toContain("商品标题");
    expect(html).toContain("￥59");
    expect(html).toContain("立即抢购");
    expect(html).toContain("wemd-pc-tag");
    expect(html).toContain("#顺丰包邮");
  });

  it("series-nav：头部 + 列表填充", () => {
    const data = parseComponentSlots(
      parser(),
      "series-nav",
      [
        "📚 **Vue3 从 0 到 1** （第 3 / 10 篇）",
        "本系列带你系统掌握 Vue3",
        "⬅️ 上一篇：**第2篇** — 响应式原理",
        "➡️ 下一篇：**第4篇** — 组件通信",
        "- [1] 开篇 |U=https://a.com",
        "- [CURRENT] 响应式原理",
      ].join("\n"),
    );
    const html = fillTemplate(getDefaultTemplate("series-nav"), data);
    expect(html).toContain("Vue3 从 0 到 1");
    expect(html).toContain("wemd-sn-item current");
    expect(html).toContain("← 上一篇");
  });

  it("code-frame：无 slot 定义之外用 block 提取 code", () => {
    const data = parseComponentSlots(
      parser(),
      "code-frame",
      "配置示例\n```js\nconst x = 1;\n```",
    );
    const html = fillTemplate(getDefaultTemplate("code-frame"), data);
    expect(html).toContain('class="hljs language-js"');
    expect(html).toContain("const");
  });

  it("divider-fancy：有 label 渲染左右线 + 文字，无 label 走 {{else}} 渲染默认装饰点", () => {
    // 有 label：左右横线 + 文字
    const withLabel = fillTemplate(getDefaultTemplate("divider-fancy"), {
      label: "分隔",
    });
    expect(withLabel).toContain("wemd-df-line-left");
    expect(withLabel).toContain("wemd-df-line-right");
    expect(withLabel).toContain("wemd-df-text");
    expect(withLabel).toContain("分隔");
    // 无 label：必须走 {{else}} 分支，输出装饰点而不是空 label
    const withoutLabel = fillTemplate(getDefaultTemplate("divider-fancy"), {});
    expect(withoutLabel).toContain("wemd-df-dots");
    expect(withoutLabel).toContain("· · ·");
    expect(withoutLabel).not.toContain("wemd-df-text");
  });

  it("无法识别组件回退到单一 body 槽，不丢内容", () => {
    const data = parseComponentSlots(
      parser(),
      "some-unknown",
      "第一段\n\n第二段",
    );
    const html = fillTemplate(getDefaultTemplate("some-unknown"), data);
    expect(html).toContain("第一段");
    expect(html).toContain("第二段");
  });
});

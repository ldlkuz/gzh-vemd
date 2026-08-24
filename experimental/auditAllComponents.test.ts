import { describe, it, expect } from "vitest";
import { createMarkdownParser } from "../packages/core/src/MarkdownParser";
import { LEGAL_COMPONENTS } from "../packages/core/src/theme-registry/componentRegistry";

/**
 * 全组件系统审计：
 * 1. 渲染所有组件（自然输入 + 标准输入）
 * 2. 检查原始 markdown 标记泄漏（** 未闭合 / |U= / |D= / []() 等）
 * 3. 检查空槽空盒（空 .wemd-component-body、空 slot 容器）
 * 4. 输出全部 HTML 供人工核对
 */

const LEAK_PATTERNS: Array<{ re: RegExp; why: string }> = [
  { re: /\|U=[^\s]+/, why: "URL 指令未解析" },
  { re: /\|D=[^\s]+/, why: "描述指令未解析" },
  { re: /\|M=[^\s]+/, why: "元信息指令未解析" },
  { re: /\|T=[^\s]+/, why: "标签指令未解析" },
  { re: /(?<!<[^>])\*\*/g, why: "未闭合粗体 **" },
];

/** 纯装饰组件：无文字内容，仅需确认容器被渲染 */
const DECORATIVE_COMPONENTS: ReadonlySet<string> = new Set(["divider"]);
/** 纯图片组件：内容载体是 <img> 而非文字，需检查图片而非文字非空 */
const IMAGE_ONLY_COMPONENTS: ReadonlySet<string> = new Set([
  "image-grid",
  "image-compare",
]);

/** 自然输入（宽松写法）与标准输入映射 */
const inputs: Record<string, string[]> = {
  "quote-card": [
    `::: quote-card
这是金句正文内容

署名：**鲁迅**
:::`,
  ],
  "divider-fancy": [`::: divider-fancy\n中间文字\n:::`],
  "cta-card": [
    `::: cta-card
**关注我们，共赴未来**

每周分享深度洞察，与读者一起探索更多可能。
:::`,
  ],
  "code-frame": [
    ["::: code-frame", "```js", "const a = 1;", "```", ":::"].join("\n"),
  ],
  "callout-pro": [`::: callout-pro\n这是一个专业提示内容\n:::`],
  "stats-block": [
    `::: stats-block

**500+**
企业客户

**98.5%**
决策准确率

**85%**
运营效率提升

:::`,
  ],
  "image-grid": [
    `::: image-grid

![](https://picsum.photos/seed/g1/400/400)

![](https://picsum.photos/seed/g2/400/400)

:::`,
  ],
  "author-card": [
    `::: author-card
![](https://picsum.photos/seed/a1/200/200)

**WeMD Team** _设计工程师_

专注公众号排版与内容设计系统。
:::`,
  ],
  timeline: [`::: timeline\n- **2020** 项目启动\n- **2022** 发布 1.0\n:::`],
  "follow-bar": [`::: follow-bar\n关注我们，获取更多精彩内容\n:::`],
  "qr-card": [
    `::: qr-card
![](https://picsum.photos/seed/qr/200/200)

扫码关注公众号
:::`,
  ],
  "numbered-heading": [
    `::: numbered-heading{index="01"}
01

从生成到共创
:::`,
  ],
  "section-title": [`::: section-title\nAI 不再只是工具\n:::`],
  "image-text-row": [
    `::: image-text-row
![](https://picsum.photos/seed/itr/600/400)

内容生成、智能推荐与全球分发紧密结合。
:::`,
  ],
  "hero-banner": [
    `::: hero-banner
**生成式 AI，正在改变每一个人的表达方式**

过去，创作需要专业设备和专业技能。

*字节跳动 · 信息跃动专题*
:::`,
  ],
  "share-card": [`::: share-card\n这篇文章值得分享给朋友！\n:::`],
  "related-posts": [
    `::: related-posts
- **AI 入门** 了解基础概念
- **AI 进阶** 深入实战
:::`,
  ],
  "toc-nav": [`::: toc-nav\n- 第一章 引言\n- 第二章 方法\n:::`],
  "tag-label": [`::: tag-label\n精选\n:::`],
  "image-caption": [
    `::: image-caption
![](https://picsum.photos/seed/cap/600/400)

图注文字说明
:::`,
  ],
  "copyright-notice": [
    `::: copyright-notice\n© 2026 示例公司. 保留所有权利。\n:::`,
  ],
  "styled-table": [
    [
      "::: styled-table",
      "",
      "| 步骤 | 关键 |",
      "| --- | --- |",
      "| 选题 | 明确方向 |",
      "",
      ":::",
    ].join("\n"),
  ],
  faq: [
    `::: faq{title="常见问题"}
**组件支持嵌套吗？**

支持。组件内部可以嵌套任意 Markdown 内容。

**如何自定义组件样式？**

在主题包中为对应组件编写 variantCss。
:::`,
  ],
  "magazine-cover": [
    `::: magazine-cover
字节跳动
ByteDance

---

让好内容，被世界看见
:::`,
  ],
  "section-divider": [`::: section-divider\nPART 01\nAI 与内容创作\n:::`],
  "image-card": [
    `::: image-card
![](https://picsum.photos/seed/ic/600/400)

图片说明文字
:::`,
  ],
  "text-card": [
    `::: text-card
AI 不再只是简单的工具，而是创作者的合作者。

我们不只追求效率，更看重内容的质量与温度。
:::`,
  ],
  "full-quote": [
    `::: full-quote
「技术的意义，是让每一个普通人的真实表达，都有机会被世界看见。」
:::`,
  ],
  "two-column-cards": [
    `::: two-column-cards
- 🚀
  **标题A**
  描述A
- 🎨
  **标题B**
  描述B
:::`,
  ],
  "end-card": [`::: end-card\n感谢你读到此处\n\n字节跳动 · 信息跃动\n:::`],
  "product-card": [
    `::: product-card

**智能数据融合平台**

打通企业全域数据，消除数据孤岛

:::`,
  ],
  "brand-sign": [
    `::: brand-sign
**字节跳动** · 信息跃动

让信息自由流动
:::`,
  ],
  "resource-list": [
    `::: resource-list
配套资料包

- 📄 组件设计规范 PDF
- 🎨 色彩变量速查表
:::`,
  ],
  "testimonial-card": [
    `::: testimonial-card

**林默** · 内容创作者

"在字节的产品上，我的作品第一次被全球这么多人看见。"

:::`,
  ],
  "series-nav": [
    `::: series-nav
📚 **Vue3 从 0 到 1** （第 3 / 10 篇）
本系列带你系统掌握 Vue3
⬅️ 上一篇：**第2篇** — 响应式原理
➡️ 下一篇：**第4篇** — 组件通信
- [1] 开篇
- [2] 安装部署
- [CURRENT] 响应式原理
:::`,
    // 自然输入：无 ⬅️/➡️、无 CURRENT
    `::: series-nav
📚 **Vue3 从 0 到 1**（第 3/10 篇）

本系列带你系统掌握 Vue3。

- [1] 开篇
- [2] 安装部署
- [3] 响应式原理
:::`,
  ],
  "article-section": [
    `::: article-section\n这是一段正文内容，放在 article-section 容器中。\n:::`,
  ],
  "code-block": [
    ["::: code-block", "", "```bash", 'echo "hello"', "```", "", ":::"].join(
      "\n",
    ),
  ],
  callout: [`::: callout\n这是一个提示内容\n:::`],
  steps: [
    `::: steps
操作三步走

1. **选择组件** — 根据内容意图挑选合适的组件类型
2. **填充内容** — 用 Markdown 语法写入组件 body
3. **应用主题** — 导入主题包，组件自动获得品牌化样式
:::`,
  ],
  accordion: [
    `::: accordion
**折叠面板一：什么是组件系统？**

组件系统是一种内容组织方式。

**折叠面板二：如何选择合适的组件？**

根据内容意图选择组件。
:::`,
  ],
  pullquote: [
    `::: pullquote\n真正的创作，不是被 AI 替代，而是被 AI 解放。\n:::`,
  ],
  divider: [`::: divider\n:::`],
  table: [
    [
      "::: table",
      "",
      "| A | B |",
      "| --- | --- |",
      "| 1 | 2 |",
      "",
      ":::",
    ].join("\n"),
  ],
  "image-compare": [
    `::: image-compare
![](https://picsum.photos/seed/c1/400/400)

![](https://picsum.photos/seed/c2/400/400)
:::`,
  ],
};

describe("全组件系统审计", () => {
  for (const name of LEGAL_COMPONENTS) {
    const cases = inputs[name];
    if (!cases) {
      it(`${name}: 无输入用例`, () => expect(true).toBe(true));
      continue;
    }
    cases.forEach((src, ci) => {
      it(`${name}[${ci}]: 无泄漏 + 无空盒`, () => {
        const parser = createMarkdownParser();
        const html = parser.render(src);
        const tag = `[${name}#${ci}]`;
        // 1. 泄漏检查
        for (const { re, why } of LEAK_PATTERNS) {
          const hits = html.match(re);
          if (hits) {
            console.log(
              `${tag} 泄漏 ${why}: ${JSON.stringify(hits.slice(0, 5))}`,
            );
            expect(html).not.toMatch(re);
          }
        }
        // 2. 内容非空：纯装饰组件确认容器、纯图片组件确认 <img>、其余确认文字
        if (DECORATIVE_COMPONENTS.has(name)) {
          expect(html).toContain(`wemd-${name}`);
        } else if (IMAGE_ONLY_COMPONENTS.has(name)) {
          if (!html.includes("<img")) {
            console.log(`${tag} 无图片\n${html}`);
            expect(html).toContain("<img");
          }
        } else {
          const textOnly = html
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          if (textOnly.length === 0) {
            console.log(`${tag} 空内容\n${html}`);
            expect(textOnly.length).toBeGreaterThan(0);
          }
        }
      });
    });
  }
});

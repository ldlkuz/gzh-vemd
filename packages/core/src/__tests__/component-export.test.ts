// @vitest-environment happy-dom
/**
 * 组件说明书导出器测试：
 * - 生成内容含主题信息与组件清单
 * - 组件语法、插槽表、示例齐全，且示例用高阶围栏包裹（含代码块时不会提前闭合）
 * - 主题扩展槽被合并并标注"（主题扩展）"
 * - only 过滤、includeFormat 追加排版规格
 */
import { describe, expect, it } from "vitest";
import { exportThemeComponentGuide } from "../plugins/component/component-export";
import { getBuiltInThemeDefinition } from "../builtin-themes";
import { getComponentSampleMarkdown } from "../plugins/component/slotSamples";

const wanqing = getBuiltInThemeDefinition("wanqing")!;

describe("exportThemeComponentGuide", () => {
  it("输出主题标题 + 组件清单 + 每个组件区块", () => {
    const md = exportThemeComponentGuide(wanqing);
    expect(md.startsWith("# 晚晴 · 组件排版参考")).toBe(true);
    expect(md).toContain("## 组件清单");
    for (const id of ["magazine-cover", "section-divider", "quote-card", "end-card"]) {
      expect(md).toContain(`## ${id}`);
    }
  });

  it("包含基础 Markdown 语法区块", () => {
    const md = exportThemeComponentGuide(wanqing);
    expect(md).toContain("## 基础语法");
    for (const kw of ["标题", "加粗", "列表", "图片", "引用", "分隔线"]) {
      expect(md).toContain(kw);
    }
    expect(md.indexOf("## 基础语法")).toBeLessThan(md.indexOf("## 组件清单"));
  });

  it("每个组件都有插槽表与可复制示例", () => {
    const md = exportThemeComponentGuide(wanqing);
    const block = md.split("## magazine-cover")[1] ?? "";
    expect(block).toContain("| 插槽");
    expect(block).toContain("**示例：**");
    // 示例块以围栏包裹（至少 3 个反引号）
    expect(block).toMatch(/`{3,}\n::: magazine-cover/);
  });

  it("代码类组件示例被更高阶围栏包裹，不会提前闭合", () => {
    const sample = getComponentSampleMarkdown(wanqing, "code-block");
    expect(sample).toContain("```js");
    const md = exportThemeComponentGuide(wanqing, { only: ["code-block"] });
    // 生成的高阶围栏反引号数 > 内容中的 ```js
    expect(md).toMatch(/`{4,}\n::: code-block/);
    // 高阶围栏内部不会出现提前闭合（内容里的 ``` 不紧跟高阶围栏闭合）
    const fenceCount = (md.match(/````/g) ?? []).length;
    expect(fenceCount).toBeGreaterThanOrEqual(2);
  });

  it("主题扩展槽被合并并标注（主题扩展）", () => {
    const md = exportThemeComponentGuide(wanqing, { only: ["magazine-cover"] });
    const hasThemeOverrides =
      (wanqing.slotDefs?.["magazine-cover"]?.length ?? 0) > 0;
    if (hasThemeOverrides) {
      expect(md).toContain("（主题扩展）");
    }
  });

  it("only 过滤只输出指定组件", () => {
    const md = exportThemeComponentGuide(wanqing, { only: ["quote-card"] });
    expect(md).toContain("## quote-card");
    expect(md).not.toContain("## magazine-cover");
  });

  it("includeFormat 追加排版规格区块", () => {
    const md = exportThemeComponentGuide(wanqing, { includeFormat: true });
    expect(md).toContain("## 排版规格");
  });
});
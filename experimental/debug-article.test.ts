import { describe, it } from "vitest";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createMarkdownParser } from "../packages/core/src/MarkdownParser";

/** 内置骨架校验：不用任何主题模板，让所有组件走内置 defaultTemplates */
const themeTemplate = () => undefined;

describe("debug default article render", () => {
  it("render default-article.md and dump html", () => {
    const md = readFileSync(
      resolve(__dirname, "../apps/web/public/samples/default.md"),
      "utf-8",
    );
    const parser = createMarkdownParser({ getTemplate: themeTemplate });
    const html = parser.render(md);
    writeFileSync(
      resolve(__dirname, "debug-article-output.html"),
      html,
      "utf-8",
    );
    // 统计
    const comps = html.match(/wemd-component wemd-[a-z-]+/g) ?? [];
    const h2 = html.match(/<h2/g) ?? [];
    const tables = html.match(/<table/g) ?? [];
    const wemdBodyDouble = html.match(/wemd-component-body[\s\S]{0,200}?wemd-component wemd-/g) ?? [];
    console.log("组件容器数:", comps.length, "h2数:", h2.length, "table数:", tables.length);
    console.log("wemd-component 唯一:", [...new Set(comps)].join(", "));
  });
});
// @vitest-environment happy-dom
import { describe, it } from "vitest";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getBuiltInThemeDefinition, renderTheme, getThemeTemplates } from "../packages/core/src/index";
import { createMarkdownParser } from "../packages/core/src/MarkdownParser";
import { processHtml } from "../packages/core/src/ThemeProcessor";

const MD = `::: callout-pro{type="tip"}
**使用建议**

- 内容
:::`;

function render(themeId: string): string {
  const theme = getBuiltInThemeDefinition(themeId)!;
  const css = renderTheme(theme);
  const templates = getThemeTemplates(theme);
  const parser = createMarkdownParser({ getTemplate: (id) => templates.get(id) });
  return processHtml(parser.render(MD), css, true, true);
}

describe("dbg callout final2", () => {
  it("dump", () => {
    const lines: string[] = [];
    for (const id of ["default", "data-blueprint", "eastern-notes"]) {
      const out = render(id);
      const bar = (out.match(/wemd-mat" style="[^"]*background: (#[0-9a-f]+)/i) || ["", "none"])[1];
      const pseudo = /::/.test(out);
      lines.push(`[${id}] bar=${bar} pseudo=${pseudo}`);
    }
    writeFileSync(resolve(__dirname, "_dbg_cf2.txt"), lines.join("\n"), "utf-8");
  });
});
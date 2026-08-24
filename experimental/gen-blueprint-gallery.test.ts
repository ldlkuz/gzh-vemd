// @vitest-environment happy-dom
/**
 * 数据蓝图 · 全组件图鉴生成
 *
 * 作用：为「数据蓝图」主题批量渲染出全部组件的真实 DOM，输出一份综合参考页
 * docs/data-blueprint-gallery.html，供实现 templates-data-blueprint.ts（骨架）与
 * components-data-blueprint.ts（皮肤）时对照。
 *
 * 复用：换主题只改 THEME_ID 即可为其它主题生成同样图鉴（语料来自 component-samples）。
 */
import { describe, it, expect } from "vitest";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createMarkdownParser } from "../packages/core/src/MarkdownParser";
import { COMPONENT_SAMPLES } from "../packages/core/src/component-samples";
import { LEGAL_COMPONENTS } from "../packages/core/src/theme-registry/componentRegistry";
import { getBuiltInThemeDefinition, renderTheme, getThemeTemplates } from "../packages/core/src/index";

const THEME_ID = "data-blueprint";
const OUT_FILE = resolve(__dirname, "docs/data-blueprint-gallery.html");

// ============================================================
// 数据蓝图皮肤（内联；既作图鉴呈现，也是 components-data-blueprint.ts 的雏形）
// ============================================================
const SKIN_CSS = `
:root{
  --blue-900:#082f49; --blue-800:#0c4a6e; --blue-700:#173f7a;
  --blue-600:#0369a1; --blue-500:#0ea5e9; --blue-400:#38bdf8;
  --sky-100:#e0f2fe; --sky-50:#f0f9ff; --line:#bae6fd; --line-soft:#e0f2fe;
  --ink:#1e293b; --muted:#475569; --amber:#f59e0b; --radius:6px;
  --mono:"SF Mono","Cascadia Code",Consolas,Menlo,monospace;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:linear-gradient(160deg,#eef6fd,#fbfdff 40%,#eaf3fb);font-family:"PingFang SC","Microsoft YaHei",sans-serif;color:var(--ink);padding:30px 12px;}
#wemd{max-width:680px;margin:0 auto;background:#fff;border:1px solid var(--line-soft);border-radius:8px;overflow:hidden;}
.gal-head{padding:24px;background:linear-gradient(135deg,var(--blue-800),var(--blue-600));color:#fff;}
.gal-head h1{font-size:22px;font-weight:800;letter-spacing:.02em;}
.gal-head p{margin-top:6px;font-family:var(--mono);font-size:12px;color:#bae6fd;}

/* 图鉴分块 & 组件边界（未装修组件用虚线框看清结构） */
.gi{padding:0 20px;}
.gi-head{position:relative;z-index:1;display:inline-flex;align-items:center;gap:8px;
  margin:20px 0 -14px 10px;padding:3px 10px;font-family:var(--mono);font-size:11px;
  color:var(--blue-600);background:#fff;border:1px solid var(--line);border-radius:999px;}
.gi-body{margin:10px 0 8px;}
.gi-body > .wemd-component{outline:1px dashed #c5d7e8;outline-offset:4px;}
.gi-note{font-family:var(--mono);font-size:10px;color:#94a3b8;text-align:right;margin:2px 4px 18px;}

/* ===== 全局排版 ===== */
#wemd h1{font-size:26px;line-height:1.5;color:var(--blue-900);font-weight:800;}
#wemd p{margin:14px 0 0;color:var(--muted);font-size:14px;line-height:1.9;text-align:left;}

/* ===== section-divider ===== */
#wemd .wemd-section-divider{margin:30px 0 16px;}
#wemd .wemd-sd-part{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--blue-500);text-transform:uppercase;margin-bottom:6px;}
#wemd .wemd-sd-title{font-size:20px;font-weight:750;color:var(--blue-800);padding-left:11px;border-left:4px solid var(--blue-500);}

/* ===== stats-block ===== */
#wemd .wemd-stats-block{margin:18px 0;display:flex;gap:12px;flex-wrap:wrap;}
#wemd .wemd-sb-items{display:flex;gap:12px;width:100%;flex-wrap:wrap;}
#wemd .wemd-sb-items-item{flex:1;min-width:46%;position:relative;background:linear-gradient(180deg,#fff,#f1f9fe);
  border:1px solid var(--line);border-radius:var(--radius);padding:14px 14px 12px;}
#wemd .wemd-sb-top{position:absolute;left:0;top:0;right:0;height:3px;background:var(--blue-500);border-radius:var(--radius) var(--radius) 0 0;}
#wemd .wemd-sb-items-value{font-family:var(--mono);font-size:25px;font-weight:800;color:var(--blue-900);letter-spacing:-.02em;font-variant-numeric:tabular-nums;}
#wemd .wemd-sb-items-label{margin-top:6px;font-size:12px;color:var(--muted);}

/* ===== styled-table ===== */
#wemd .wemd-styled-table{margin:20px 0;}
#wemd .wemd-sbt-table{border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;}
#wemd .wemd-sbt-table table{width:100%;border-collapse:collapse;font-size:13px;}
#wemd .wemd-sbt-table th{background:var(--blue-800);color:#fff;font-weight:700;text-align:left;padding:10px 12px;font-size:12px;}
#wemd .wemd-sbt-table td{padding:10px 12px;border-top:1px solid var(--line-soft);font-family:var(--mono);font-size:12.5px;}
#wemd .wemd-sbt-table tbody tr:nth-of-type(even){background:var(--sky-50);}

/* ===== code-frame ===== */
#wemd .wemd-code-frame{margin:22px 0;}
#wemd .wemd-cf-code{background:#0a1622;border-radius:var(--radius);overflow:hidden;}
#wemd .wemd-cb-bar{display:flex;align-items:center;gap:8px;padding:9px 12px;background:#122233;border-bottom:1px solid #1d3a52;}
#wemd .wemd-cb-dots{display:flex;gap:5px;}
#wemd .wemd-cb-dot{display:block;width:9px;height:9px;border-radius:50%;}
#wemd .wemd-cb-dot-r{background:#ff5f57;}#wemd .wemd-cb-dot-y{background:#febc2e;}#wemd .wemd-cb-dot-g{background:#28c840;}
#wemd .wemd-cb-lang{font-family:var(--mono);font-size:11px;color:#7fa8c9;margin-left:4px;}
#wemd .wemd-cf-code pre{margin:0;padding:14px 15px;overflow-x:auto;font-family:var(--mono);font-size:12.5px;line-height:1.75;color:#cde3f5;text-align:left;}

/* ===== quote-card ===== */
#wemd .wemd-quote-card{margin:26px 0;padding:18px 20px;background:linear-gradient(90deg,var(--sky-50),#fff);
  border-left:4px solid var(--blue-500);border-radius:0 var(--radius) var(--radius) 0;}
#wemd .wemd-qc-quote{font-size:15px;line-height:1.9;color:var(--blue-900);font-weight:600;}
#wemd .wemd-qc-author{margin-top:10px;font-family:var(--mono);font-size:11px;letter-spacing:.12em;color:var(--blue-600);}

/* ===== callout / callout-pro ===== */
#wemd .wemd-callout-pro,#wemd .wemd-callout{margin:24px 0;padding:16px 18px;background:#fff;border:1px solid var(--line);
  border-left:4px solid var(--blue-500);border-radius:var(--radius);}
#wemd .wemd-callout-pro .wemd-component-body > p,#wemd .wemd-callout .wemd-component-body > p{font-size:14px;line-height:1.85;color:var(--ink);}

/* ===== end-card ===== */
#wemd .wemd-end-card{margin-top:36px;padding:26px 20px;text-align:center;background:linear-gradient(180deg,var(--blue-800),var(--blue-700));
  border-radius:var(--radius);color:#fff;}
#wemd .wemd-end-card .wemd-ec-title{font-size:20px;font-weight:750;letter-spacing:.04em;}
#wemd .wemd-end-card .wemd-ec-subtitle{margin-top:8px;font-family:var(--mono);font-size:12px;color:#bae6fd;letter-spacing:.1em;}
`;

function buildGallery(themeId: string): string {
  const theme = getBuiltInThemeDefinition(themeId)!;
  const templates = getThemeTemplates(theme);
  const parser = createMarkdownParser({ getTemplate: (id) => templates.get(id) });

  const seenCount: Record<string, number> = {};
  const blocks: string[] = [];
  for (const name of LEGAL_COMPONENTS) {
    const cases = COMPONENT_SAMPLES[name];
    if (!cases) {
      blocks.push(gi(name, 0, `<div class="gi-note">无示例输入</div>`));
      continue;
    }
    cases.forEach((src, i) => {
      seenCount[name] = (seenCount[name] ?? 0) + 1;
      const html = parser.render(src);
      blocks.push(
        giPart(name, i, html, seenCount[name] > 1),
      );
      blocks.push(`<div class="gi-note">示例 #${i + 1}</div>`);
    });
  }

  return `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>数据蓝图 · 全组件图鉴</title>
<style>${SKIN_CSS}</style></head>
<body><div id="wemd">
  <div class="gal-head"><h1>数据蓝图 · 全组件图鉴</h1>
  <p>THEME: ${themeId} · 真实 DOM 渲染 · ${LEGAL_COMPONENTS.length} 个组件</p></div>
  ${blocks.join("\n")}
</div></body></html>`;
}

function gi(name: string, _idx: number, inner: string): string {
  return `<section class="gi"><div class="gi-head"><span>${name}</span></div><div class="gi-body">${inner}</div></section>`;
}
function giPart(name: string, _i: number, html: string, _multi: boolean): string {
  return `<section class="gi"><div class="gi-head"><span>${name}</span></div><div class="gi-body">${html}</div></section>`;
}

describe("data-blueprint gallery", () => {
  it(`生成 ${THEME_ID} 全组件图鉴`, () => {
    const out = buildGallery(THEME_ID);
    writeFileSync(OUT_FILE, out, "utf-8");
    // 冒烟校验：图鉴含全部组件外层 class
    for (const name of LEGAL_COMPONENTS) {
      expect(out).toContain(`data-component="${name}"`);
    }
  });
});
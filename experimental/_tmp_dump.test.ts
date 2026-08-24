// 临时：生成晚晴说明书到本目录，检查实际文本效果（用完即删）
import { describe, it } from "vitest";
import fs from "node:fs";
import { resolve } from "node:path";
import { exportThemeComponentGuide } from "../packages/core/src/plugins/component/component-export";

describe("dump", () => {
  it("write", () => {
    const md = exportThemeComponentGuide("wanqing");
    fs.writeFileSync(resolve(__dirname, "_tmp-wanqing-guide.md"), md, "utf8");
  });
});
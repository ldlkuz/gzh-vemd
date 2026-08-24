/**
 * markdownComponentFade
 *
 * 将 ::: 组件块的「控制标记行」弱化显示，让"排版指令"从正文中退到背景。
 * 只对 `::: 组件名{...}`（开始行）与 `:::`（结束行）这两个标记片段加灰底，
 * 紧贴标记文字本身，不占整行；组件块内的真实内容保持正常正文。
 * 不改动文档内容，仅渲染层装饰。
 */
import { RangeSetBuilder } from "@codemirror/state";
import {
  Decoration,
  ViewPlugin,
  type DecorationSet,
  type ViewUpdate,
} from "@codemirror/view";

// 标记片段弱化装饰（mark 类型：只包裹文字本身）
const componentMarkDecoration = Decoration.mark({
  attributes: {
    class: "cm-comp-fade-mark",
  },
});

// 开始标记：`::: 组件名` 或 `::: 组件名{...}`（精确三个冒号 + 组件名）
const componentOpenRe = /(:::[ \t]*)([A-Za-z0-9_-]+)([ \t]*\{[^{}]*\})?/;
// 结束标记：`:::`
const componentCloseRe = /^\s*(:{3,})\s*$/;

const componentFadePlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: import("@codemirror/view").EditorView) {
      this.decorations = this.build(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.build(update.view);
      }
    }

    build(view: import("@codemirror/view").EditorView) {
      const builder = new RangeSetBuilder<Decoration>();
      const doc = view.state.doc;

      for (let lineNum = 1; lineNum <= doc.lines; lineNum++) {
        const line = doc.line(lineNum);
        const text = line.text;

        const isClose = componentCloseRe.test(text);
        const openMatch = text.match(componentOpenRe);

        // 结束行：整个 `:::` 标记
        if (isClose) {
          const lead = text.match(/^\s*/)?.[0]?.length ?? 0;
          const marker = text.trim();
          builder.add(
            line.from + lead,
            line.from + lead + marker.length,
            componentMarkDecoration,
          );
          continue;
        }

        // 开始行：`::: 组件名`（可带 {属性}）
        if (openMatch && openMatch.index !== undefined) {
          const start = line.from + openMatch.index;
          const matchText = openMatch[0];
          // 去除匹配片段首部的 `{` 前缀外 — 实际 openMatch 已是 `::: 组件名{...}`
          // 计算结束位置（到组件名或右花括号）
          const end = start + matchText.length;
          builder.add(start, end, componentMarkDecoration);
        }
      }

      return builder.finish();
    }
  },
  { decorations: (plugin) => plugin.decorations },
);

export const markdownComponentFade = () => componentFadePlugin;
import { useEffect, useMemo, useRef, useState, memo } from "react";
import mermaid from "mermaid";
import {
  createMarkdownParser,
  getThemeTemplates,
  getThemeSlotDefs,
  processHtml,
  convertCssToWeChatDarkMode,
  type ThemeDefinition,
} from "@wemd/core";
import { useUITheme } from "../../hooks/useUITheme";
import { useEditorStore } from "../../store/editorStore";
import { resolveAppAssetPath } from "../../utils/assetPath";
import type { DesignerVariables } from "./ThemeDesigner/types";
import {
  getMermaidConfig,
  getThemedMermaidDiagram,
  mermaidTokensFromTheme,
} from "../../utils/mermaidConfig";

/**
 * 主题示例内容缓存（模块级，避免切换主题时重复 fetch）。
 * 每个主题一个独立示例：public/samples/<themeId>.md，未提供时回退 samples/default.md。
 */
const sampleCache = new Map<string, string>();

interface ThemeLivePreviewProps {
  /** 要预览的 CSS 样式代码 */
  css: string;
  designerVariables?: DesignerVariables;
  /** 是否使用当前文章内容，true=订阅 store 获取当前文章，false=使用内置示例 */
  useCurrentArticle?: boolean;
  /** Phase 7：当前预览主题的 definition，用于注入组件骨架模板；缺省用内置默认 */
  themeDefinition?: ThemeDefinition;
}

// 主题实时预览组件（使用 iframe 隔离样式）
export const ThemeLivePreview = memo(function ThemeLivePreview({
  css,
  designerVariables,
  useCurrentArticle = false,
  themeDefinition,
}: ThemeLivePreviewProps) {
  // 只有当 useCurrentArticle=true 时才订阅 store，避免不必要的重渲染
  const currentMarkdown = useEditorStore((state) =>
    useCurrentArticle ? state.markdown : "",
  );
  // 主题示例内容：按主题 id 加载 public/samples/<themeId>.md，未提供时回退 default.md
  const [sampleMarkdown, setSampleMarkdown] = useState("");
  useEffect(() => {
    const themeId = themeDefinition?.meta.id;
    if (!themeId) return;
    const cached = sampleCache.get(themeId);
    if (cached !== undefined) {
      setSampleMarkdown(cached);
      return;
    }
    const loadSample = async () => {
      const paths = [`samples/${themeId}.md`, "samples/default.md"];
      for (const path of paths) {
        try {
          const response = await fetch(resolveAppAssetPath(path));
          if (response.ok) {
            const markdown = await response.text();
            sampleCache.set(themeId, markdown);
            setSampleMarkdown(markdown);
            return;
          }
        } catch (error) {
          console.error(`Failed to load sample "${path}":`, error);
        }
      }
      sampleCache.set(themeId, "");
      setSampleMarkdown("");
    };
    loadSample();
  }, [themeDefinition?.meta.id]);
  const showMacBar = designerVariables?.showMacBar ?? false;
  const parser = useMemo(() => {
    const templates = getThemeTemplates(themeDefinition);
    const slotDefs = getThemeSlotDefs(themeDefinition);
    return createMarkdownParser({
      showMacBar,
      mathRenderer: "katex",
      getTemplate: (componentId) => templates.get(componentId),
      getSlotDefs: (componentId) => slotDefs.get(componentId),
    });
  }, [showMacBar, themeDefinition]);
  const uiTheme = useUITheme((state) => state.theme);
  const isDarkMode = uiTheme === "dark";
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mermaidRenderIdRef = useRef(0);
  const lastHtmlRef = useRef<string>("");

  const mermaidTheme = designerVariables?.mermaidTheme || "base";
  const mermaidConfigKey = useMemo(() => mermaidTheme, [mermaidTheme]);

  const shellDoc = useMemo(
    () => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style id="base-style">
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 0;
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          transition: background 0.2s, color 0.2s;
        }
        body:empty { display: none; }
      </style>
      <style id="theme-style"></style>
    </head>
    <body><div id="preview-root"></div></body>
    </html>
  `,
    [],
  );

  const finalCss = useMemo(
    () => (isDarkMode ? convertCssToWeChatDarkMode(css) : css),
    [css, isDarkMode],
  );
  const previewContent =
    useCurrentArticle && currentMarkdown !== undefined
      ? currentMarkdown
      : sampleMarkdown;
  const html = useMemo(() => {
    const rawHtml = parser.render(previewContent);
    // 与 MarkdownPreview 保持一致，使用 inlineStyles=false
    // 避免内联化导致 CSS 变量丢失、伪元素跳过、双重样式应用等问题
    return processHtml(rawHtml, finalCss, false);
  }, [parser, finalCss, previewContent]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const renderMermaid = async (doc: Document) => {
      const blocks = Array.from(
        doc.querySelectorAll<HTMLElement>("pre.mermaid"),
      );
      if (blocks.length === 0) return;

      try {
        mermaid.initialize({ startOnLoad: false });
      } catch (e) {
        console.error("Mermaid initialization failed in preview:", e);
        return;
      }

      const initConfig = getMermaidConfig(designerVariables, {
        themeTokens: mermaidTokensFromTheme(themeDefinition),
      });

      const renderToken = ++mermaidRenderIdRef.current;
      for (const [index, block] of blocks.entries()) {
        if (!block.dataset.mermaidRaw) {
          block.dataset.mermaidRaw = block.textContent ?? "";
        }
        const diagram = block.dataset.mermaidRaw ?? "";
        if (!diagram.trim()) continue;

        const themedDiagram = getThemedMermaidDiagram(diagram, initConfig);
        try {
          const { svg } = await mermaid.render(
            `theme-preview-${renderToken}-${index}`,
            themedDiagram,
          );
          if (mermaidRenderIdRef.current !== renderToken) {
            return;
          }
          block.innerHTML = svg;
        } catch (e) {
          console.error("Mermaid render error:", e);
        }
      }
    };

    const updateContent = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      const themeStyle = doc.getElementById("theme-style");
      const root = doc.getElementById("preview-root");

      if (themeStyle && root) {
        const scrollY = iframe.contentWindow?.scrollY || 0;

        doc.body.style.background = isDarkMode ? "#252526" : "#fff";
        doc.body.style.color = isDarkMode ? "#d4d4d4" : "#000";

        themeStyle.textContent = finalCss;
        if (lastHtmlRef.current !== html) {
          root.innerHTML = html;
          lastHtmlRef.current = html;
        }

        iframe.contentWindow?.scrollTo(0, scrollY);
        void renderMermaid(doc);
      }
    };

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (
      doc &&
      doc.readyState === "complete" &&
      doc.getElementById("preview-root")
    ) {
      updateContent();
    } else {
      iframe.onload = updateContent;
    }
  }, [html, finalCss, isDarkMode, mermaidConfigKey]);

  return (
    <div className="theme-live-preview">
      <div className="preview-header-mini">
        <span>实时预览</span>
      </div>
      <iframe
        ref={iframeRef}
        className="preview-iframe"
        srcDoc={shellDoc}
        title="主题预览"
        sandbox="allow-same-origin"
      />
    </div>
  );
});

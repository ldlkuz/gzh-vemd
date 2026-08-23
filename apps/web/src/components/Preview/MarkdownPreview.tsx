import { useEffect, useState, useRef, useMemo } from "react";
import mermaid from "mermaid";
import {
  createMarkdownParser,
  getThemeTemplates,
  getThemeSlotDefs,
  processHtml,
  type ComponentStyleOverride,
  type ThemeDefinition,
} from "@wemd/core";
import { useEditorStore } from "../../store/editorStore";
import { useThemeStore } from "../../store/themeStore";
import { hasMathFormula, renderMathInElement } from "../../utils/katexRenderer";
import { convertLinksToFootnotes } from "../../utils/linkFootnote";
import {
  getPublishingPreference,
  subscribePublishingPreference,
} from "../../store/publishingPreferences";
import {
  getMermaidConfig,
  getThemedMermaidDiagram,
  mermaidTokensFromTheme,
} from "../../utils/mermaidConfig";
import { renderTableBlocksForPreview } from "../../services/wechatTableRenderer";
import {
  subscribeScrollIntent,
  type ScrollSyncAdapter,
} from "../Workspace/editorPreviewScrollSync";
import {
  mapScrollTopToSourceLine,
  mapSourceLineToScrollTop,
  type ScrollAnchor,
} from "../Workspace/scrollAnchorMapping";
import "./MarkdownPreview.css";

interface MarkdownPreviewProps {
  onScrollSyncReady?: (adapter: ScrollSyncAdapter | null) => void;
}

const collectAnchors = (
  root: HTMLElement,
  container: HTMLElement,
): ScrollAnchor[] => {
  const containerRect = container.getBoundingClientRect();
  return Array.from(
    root.querySelectorAll<HTMLElement>("[data-wemd-source-start]"),
  ).flatMap((element) => {
    const startLine = Number(element.dataset.wemdSourceStart);
    const endLine = Number(element.dataset.wemdSourceEnd);
    if (!Number.isFinite(startLine) || !Number.isFinite(endLine)) return [];
    const rect = element.getBoundingClientRect();
    const top = container.scrollTop + rect.top - containerRect.top;
    return [
      {
        startLine,
        endLine,
        top,
        bottom: top + rect.height,
      },
    ];
  });
};

/**
 * 根据主题的 components 定义或 Markdown 的 {variant="xxx"} 语法，
 * 给 HTML 中每个组件元素注入 data-variant 属性，
 * 使 AI 生成的 variantCss（使用 [data-variant] 选择器）能正确匹配。
 *
 * 数据来源优先级：
 *   1. Markdown 中的 {variant="xxx"}（已由 markdown-it-component 解析为 data-variant 属性）
 *   2. 主题的 component 定义中的 variant 配置
 *
 * 如果 HTML 已经包含 data-variant（来自 Markdown），则保留它，不覆盖。
 * 如果 HTML 没有 data-variant，则从主题的组件定义中注入。
 */
/**
 * 从 AI variantCss 中解析选择器使用的类名。
 * 例如：从 `.wemd-hero[data-variant="bytewave"] { ... }` 中提取 `wemd-hero`
 */
function extractVariantCssClassName(variantCss: string): string | null {
  // 匹配第一个选择器中的类名，如 .wemd-hero[data-variant="bytewave"]
  // 注意：data-variant 属性可能有值（如 "bytewave"），所以用 [^\]]* 匹配属性内容
  const match = variantCss.match(
    /\.([a-zA-Z0-9_-]+)(?=\[data-variant[^\]]*\])/,
  );
  return match ? match[1] : null;
}

function injectComponentVariants(
  html: string,
  components?: Record<string, ComponentStyleOverride>,
): string {
  if (!components) {
    console.log("[injectComponentVariants] components is undefined");
    return html;
  }

  let result = html;
  let totalInjections = 0;
  for (const [compType, override] of Object.entries(components)) {
    if (!override.enabled || !override.variant) continue;

    const tagName = `wemd-${compType}`;
    const regex = new RegExp(
      `(<[a-zA-Z][^>]*?\\b${tagName}\\b[^>]*?)(\\s*/?\\s*>)`,
      "g",
    );

    // 解析 AI variant CSS 的选择器类名，添加简写类名使 CSS 选择器能匹配
    // 例如：AI 生成 `.wemd-hero[data-variant="bytewave"]`，但 HTML 类名是 `wemd-hero-banner`
    // 需要额外添加 `wemd-hero` 类到 HTML 元素上
    let extraClasses = "";
    if (override.variantCss) {
      const cssClassName = extractVariantCssClassName(override.variantCss);
      const defaultClassName = `wemd-${compType}`;
      if (cssClassName && cssClassName !== defaultClassName) {
        extraClasses = ` ${cssClassName}`;
        console.log(
          `[injectComponentVariants] extra class "${cssClassName}" for ${tagName} (default: "${defaultClassName}")`,
        );
      }
    }

    const before = result;
    result = result.replace(regex, (match, attrs, closing) => {
      let modified = attrs;

      // 检查 HTML 是否已有 data-variant（来自 Markdown 的 {variant="xxx"}）
      // 如果已有，保留 Markdown 指定的 variant，不覆盖
      if (!modified.includes("data-variant=")) {
        modified += ` data-variant="${override.variant}"`;
      }

      // 如果 variant CSS 使用不同的类名，将其添加到 class 属性中
      if (extraClasses) {
        const classAttrRegex = /class="([^"]*)"/;
        const classMatch = modified.match(classAttrRegex);
        if (classMatch) {
          const classes = classMatch[1].split(/\s+/);
          const extraClass = extraClasses.trim();
          if (!classes.includes(extraClass)) {
            classes.push(extraClass);
            modified = modified.replace(
              classAttrRegex,
              `class="${classes.join(" ")}"`,
            );
          }
        }
      }

      return modified + closing;
    });
    if (result !== before) {
      totalInjections++;
    }
  }

  console.log(`[injectComponentVariants] total injections: ${totalInjections}`);
  return result;
}

export function MarkdownPreview({ onScrollSyncReady }: MarkdownPreviewProps) {
  const { markdown } = useEditorStore();
  const { themeId: theme, customCSS, getThemeCSS } = useThemeStore();
  const [html, setHtml] = useState("");
  const [linkToFootnoteEnabled, setLinkToFootnoteEnabledState] = useState(() =>
    getPublishingPreference("linkToFootnote"),
  );
  const [tableWrapEnabled, setTableWrapEnabledState] = useState(() =>
    getPublishingPreference("tableWrap"),
  );
  const previewRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mermaidRenderIdRef = useRef(0);

  // 获取当前主题对象（注意与 line 25 的 themeId 区分）
  const currentTheme = useThemeStore(
    (state) =>
      state.customThemes.find((t) => t.id === state.themeId) ||
      state.getAllThemes().find((t) => t.id === state.themeId),
  );
  const designerVars = currentTheme?.designerVariables;
  const showMacBar = designerVars?.showMacBar ?? false;

  // 当前主题的组件骨架模板 Map（Phase 5：骨架随主题）
  const themeDefinition = currentTheme?.definition as
    | ThemeDefinition
    | undefined;
  const parser = useMemo(() => {
    const templates = getThemeTemplates(themeDefinition);
    const slotDefs = getThemeSlotDefs(themeDefinition);
    return createMarkdownParser({
      showMacBar,
      mathRenderer: "katex",
      includeSourcePosition: true,
      getTemplate: (componentId) => templates.get(componentId),
      getSlotDefs: (componentId) => slotDefs.get(componentId),
    });
  }, [showMacBar, themeDefinition]);

  // 预览 CSS：始终亮色模式（微信/公众号只支持亮色，暗色切换不应影响内容预览）
  const previewCss = useMemo(() => {
    return getThemeCSS(theme, false);
  }, [theme, getThemeCSS]);

  useEffect(() => {
    const rawHtml = parser.render(markdown);

    // 调试：检查 components 数据
    console.log(
      "[MarkdownPreview] components from definition:",
      currentTheme?.definition?.components
        ? Object.keys(currentTheme.definition.components)
        : "undefined",
    );
    console.log(
      "[MarkdownPreview] hero-banner variantCss:",
      currentTheme?.definition?.components?.[
        "hero-banner"
      ]?.variantCss?.substring(0, 100),
    );

    // 注入 data-variant 属性，使 AI variantCss 选择器能匹配
    const themedHtml = injectComponentVariants(
      rawHtml,
      currentTheme?.definition?.components,
    );

    const previewHtml = linkToFootnoteEnabled
      ? convertLinksToFootnotes(themedHtml)
      : themedHtml;

    // 预览模式不使用内联样式，直接注入 style 标签，大幅降低内存占用
    const styledHtml = processHtml(previewHtml, previewCss, false);

    setHtml(styledHtml);
  }, [
    markdown,
    theme,
    customCSS,
    previewCss,
    parser,
    linkToFootnoteEnabled,
    currentTheme,
  ]);

  // KaTeX 渲染：轻量级、快速，解决内存问题
  // MathJax 仅在复制到微信时使用
  useEffect(() => {
    if (!previewRef.current || !html) {
      return;
    }

    // 检测是否包含数学公式
    if (!hasMathFormula(markdown)) {
      return; // 无公式，跳过渲染
    }

    // 延迟渲染，避免频繁触发
    const timer = setTimeout(() => {
      if (previewRef.current) {
        renderMathInElement(previewRef.current);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [html, markdown]);

  const mermaidTheme = designerVars?.mermaidTheme || "base";
  const mermaidConfigKey = useMemo(() => mermaidTheme, [mermaidTheme]);

  useEffect(() => {
    try {
      mermaid.initialize({ startOnLoad: false });
    } catch (e) {
      console.error("Mermaid initialization failed:", e);
    }
  }, []);

  useEffect(() => {
    const root = previewRef.current;
    if (!root || !html) return;

    const mermaidBlocks = Array.from(
      root.querySelectorAll<HTMLElement>("pre.mermaid"),
    );
    if (mermaidBlocks.length === 0) return;

    // 渲染前重新初始化，确保 mermaid 处于可用状态（与主题预览一致）
    try {
      mermaid.initialize({ startOnLoad: false });
    } catch (e) {
      console.error("Mermaid initialization failed (preview):", e);
      return;
    }

    const initConfig = getMermaidConfig(designerVars, {
      themeTokens: mermaidTokensFromTheme(themeDefinition),
    });
    const renderToken = ++mermaidRenderIdRef.current;

    mermaidBlocks.forEach((block, index) => {
      if (!block.dataset.mermaidRaw) {
        block.dataset.mermaidRaw = block.textContent ?? "";
      }
      const diagram = block.dataset.mermaidRaw ?? "";
      if (!diagram.trim()) return;

      const themedDiagram = getThemedMermaidDiagram(diagram, initConfig);

      mermaid
        .render(`preview-${renderToken}-${index}`, themedDiagram)
        .then(({ svg }) => {
          // 已在更新的渲染或节点已被替换则不写入，避免旧结果覆盖新内容
          if (mermaidRenderIdRef.current !== renderToken) return;
          if (root.contains(block)) block.innerHTML = svg;
        })
        .catch((e) => {
          console.error("Mermaid render error (preview):", e);
        });
    });
  }, [html, mermaidConfigKey, designerVars]);

  // 表格布局与发布偏好保持一致，开关变化时直接重排现有 DOM。
  useEffect(() => {
    if (!previewRef.current || !html) return;

    const tables = previewRef.current.querySelectorAll(".table-container");
    if (tables.length === 0) return;

    renderTableBlocksForPreview(previewRef.current, tableWrapEnabled);
  }, [html, tableWrapEnabled]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const root = previewRef.current;
    if (!container || !root) return;
    let scrollSubscriber: () => void = () => undefined;
    let anchorCache: ScrollAnchor[] | null = null;
    const getAnchors = () => {
      anchorCache ??= collectAnchors(root, container);
      return anchorCache;
    };
    const getPosition: ScrollSyncAdapter["getPosition"] = () => {
      const max = Math.max(0, container.scrollHeight - container.clientHeight);
      const ratio = max > 0 ? container.scrollTop / max : 0;
      return {
        sourceLine: mapScrollTopToSourceLine(getAnchors(), container.scrollTop),
        ratio,
      };
    };
    const scrollToPosition: ScrollSyncAdapter["scrollToPosition"] = (
      position,
    ) => {
      const max = Math.max(0, container.scrollHeight - container.clientHeight);
      let target: number;
      if (position.sourceLine === null || position.ratio >= 0.999) {
        target = Math.min(Math.max(position.ratio, 0), 1) * max;
      } else {
        target = mapSourceLineToScrollTop(
          getAnchors(),
          position.sourceLine,
          max,
          position.ratio,
        );
      }
      // 停止校准：用平滑滚动滑到目标位置，避免瞬跳的机械感
      if (typeof container.scrollTo === "function") {
        container.scrollTo({ top: target, behavior: "smooth" });
      } else {
        container.scrollTop = target;
      }
    };
    const handleScroll = () => scrollSubscriber();
    container.addEventListener("scroll", handleScroll, { passive: true });
    onScrollSyncReady?.({
      getPosition,
      scrollToPosition,
      subscribeScroll: (listener) => {
        scrollSubscriber = listener;
        return () => {
          if (scrollSubscriber === listener) scrollSubscriber = () => undefined;
        };
      },
      subscribeUserIntent: (listener) =>
        subscribeScrollIntent(container, listener),
      subscribeLayoutChange: (listener) => {
        if (typeof ResizeObserver === "undefined") return () => undefined;
        const observer = new ResizeObserver(() => {
          anchorCache = null;
          listener();
        });
        observer.observe(root);
        return () => observer.disconnect();
      },
    });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      onScrollSyncReady?.(null);
    };
  }, [html, onScrollSyncReady]);

  useEffect(() => {
    return subscribePublishingPreference(
      "linkToFootnote",
      setLinkToFootnoteEnabledState,
    );
  }, []);

  useEffect(() => {
    return subscribePublishingPreference("tableWrap", setTableWrapEnabledState);
  }, []);

  return (
    <div className="markdown-preview">
      <div className="preview-header">
        <span className="preview-title">实时预览</span>
        <span className="preview-subtitle">微信排版效果</span>
      </div>
      <div
        className="preview-container"
        ref={scrollContainerRef}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const link = target.closest("a");
          if (link && link.href && window.electron?.shell?.openExternal) {
            e.preventDefault();
            window.electron.shell.openExternal(link.href);
          }
        }}
      >
        <div className="preview-content">
          <style
            dangerouslySetInnerHTML={{
              __html: previewCss,
            }}
          />
          <div ref={previewRef} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}
// MathJax 类型已在 mathJaxLoader.ts 中声明

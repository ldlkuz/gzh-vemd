/**
 * 微信复制 Mermaid 图表渲染
 * 将 Mermaid 代码块渲染为 PNG 图片，确保微信公众号兼容
 */

import mermaid from "mermaid";
import { useThemeStore } from "../store/themeStore";
import {
  getMermaidConfig,
  getThemedMermaidDiagram,
  mermaidTokensFromTheme,
} from "../utils/mermaidConfig";
import {
  applyNativeSubgraphTitleStyles,
  getSubgraphTitleOverlays,
  replaceForeignObjectWithSvgText,
} from "./wechatMermaidSvgText";

const stripUndefined = <T extends Record<string, unknown>>(
  obj: T,
): Partial<T> => {
  const result: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) (result as Record<string, unknown>)[k] = v;
  }
  return result;
};

const clonePlainConfig = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => clonePlainConfig(item)) as T;
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, childValue] of Object.entries(value)) {
      result[key] = clonePlainConfig(childValue);
    }
    return result as T;
  }

  return value;
};

const applyMermaidInitialize = (
  initConfig: ReturnType<typeof getMermaidConfig>,
) => {
  try {
    // 直接 initialize 而非依赖 %%{init}%% 指令：flowchart.htmlLabels 经 init
    // 指令注入时 mermaid v11 不一定会覆盖默认（默认 true），只有 initialize
    // 全局设置能真正关闭 foreignObject 渲染
    //
    // themeVariables 内 undefined 字段必须剔除：JSON.stringify 会自动丢掉
    // undefined，但直接传给 initialize 会让 mermaid 主题函数读 undefined.h 报错
    const sanitizedConfig = {
      startOnLoad: false,
      ...initConfig,
      themeVariables: stripUndefined(initConfig.themeVariables),
    } as Parameters<typeof mermaid.initialize>[0];

    mermaid.initialize(sanitizedConfig);
  } catch (e) {
    console.error("Mermaid initialization failed in copy service:", e);
  }
};

const getThemeInfo = () => {
  const state = useThemeStore.getState();
  const themeId = state.themeId;
  const currentTheme =
    state.customThemes.find((t) => t.id === themeId) ||
    state.getAllThemes().find((t) => t.id === themeId);
  return {
    designerVariables: currentTheme?.designerVariables,
    // 内置主题无 designerVariables，用 tokens 兜底让导出图表跟随主题主色
    themeTokens: mermaidTokensFromTheme(currentTheme?.definition),
  };
};

const getSvgDimensions = (svgElement: SVGElement) => {
  const parseSize = (value: string | null): number | null => {
    if (!value) return null;
    const trimmed = value.trim();
    if (trimmed.endsWith("%")) return null;
    const parsed = Number.parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const width = parseSize(svgElement.getAttribute("width"));
  const height = parseSize(svgElement.getAttribute("height"));

  if (width && height) {
    return { width, height };
  }

  const viewBox = svgElement.getAttribute("viewBox");
  if (viewBox) {
    const parts = viewBox
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    if (parts.length === 4 && parts.every(Number.isFinite)) {
      return { width: parts[2], height: parts[3] };
    }
  }

  return { width: 400, height: 300 };
};

const getSvgViewBoxOrigin = (svgElement: SVGElement) => {
  const viewBox = svgElement.getAttribute("viewBox");
  if (!viewBox) return { x: 0, y: 0 };

  const parts = viewBox
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  return parts.length === 4 && parts.every(Number.isFinite)
    ? { x: parts[0], y: parts[1] }
    : { x: 0, y: 0 };
};

/**
 * 清洗 SVG 内的跨源引用，避免 canvas 被标记 tainted
 */
const sanitizeSvgCrossOrigin = (svg: SVGElement): void => {
  svg.querySelectorAll("image").forEach((el) => el.remove());
  svg.querySelectorAll("style").forEach((styleEl) => {
    const css = styleEl.textContent ?? "";
    const cleaned = css
      .replace(/@import[^;]*;?/g, "")
      .replace(/url\(\s*['"]?https?:[^)'"]*['"]?\s*\)/g, "none");
    if (cleaned !== css) styleEl.textContent = cleaned;
  });
};

const createHiddenRenderHost = (): HTMLDivElement => {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "0";
  host.style.top = "0";
  host.style.width = "760px";
  host.style.opacity = "0";
  host.style.pointerEvents = "none";
  host.style.zIndex = "-1";
  host.style.contain = "layout style paint";
  return host;
};

const svgMarkupToPng = async (
  svgMarkup: string,
  diagram: string,
): Promise<string> => {
  // 用 HTML 解析器拿 SVG 节点：mermaid 输出的 SVG <style> 内含 CSS 选择符
  // （">"、"&" 等），严格 XML 解析会报 parsererror。HTML 解析器更宽容，
  // 解析成 DOM 节点后再 XMLSerializer 序列化即为合法 XML。
  const holder = document.createElement("div");
  // 必须挂到 body 才有 layout，否则 getBBox 返回 0
  holder.style.position = "fixed";
  holder.style.left = "0";
  holder.style.top = "0";
  holder.style.width = "760px";
  holder.style.opacity = "0";
  holder.style.pointerEvents = "none";
  holder.style.zIndex = "-1";
  holder.style.contain = "layout style paint";
  holder.innerHTML = svgMarkup;
  document.body.appendChild(holder);
  const svgElement = holder.querySelector("svg") as SVGElement | null;
  if (!svgElement) {
    holder.remove();
    throw new Error("mermaid 未产出 <svg> 节点");
  }
  const titleOverlays = getSubgraphTitleOverlays(svgElement, diagram);
  applyNativeSubgraphTitleStyles(svgElement, diagram);
  replaceForeignObjectWithSvgText(svgElement);
  const viewBoxOrigin = getSvgViewBoxOrigin(svgElement);
  sanitizeSvgCrossOrigin(svgElement);
  const { width, height } = getSvgDimensions(svgElement);
  holder.remove();

  svgElement.setAttribute("width", String(width));
  svgElement.setAttribute("height", String(height));
  if (!svgElement.getAttribute("xmlns")) {
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }
  if (!svgElement.getAttribute("xmlns:xlink")) {
    svgElement.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  }

  // 序列化 SVG，走 Blob URL 规避 data URL 的 encoding 陷阱
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const blobUrl = URL.createObjectURL(blob);

  try {
    const img = new Image();
    // 关键：防止浏览器把 SVG 当作跨源资源 → canvas 污染 → toDataURL 失败
    img.crossOrigin = "anonymous";
    img.src = blobUrl;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => {
        console.error(
          "[WeMD] Mermaid SVG failed to load as Image. SVG head (500):\n",
          svgData.slice(0, 500),
        );
        reject(new Error("Mermaid SVG 无法作为 Image 加载"));
      };
    });

    // 使用 3x 分辨率渲染到 Canvas（高清）
    const scale = 3;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(scale, scale);

    // 1. 填充白色背景（防止深色模式下透明背景看不清文字）
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // 2. 绘制 SVG 图片
    ctx.drawImage(img, 0, 0);

    // 3. subgraph 标题再直接画到 canvas，规避 SVG-as-image 丢 text 的兼容问题
    titleOverlays.forEach((overlay) => {
      ctx.save();
      ctx.font =
        '600 16px -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif';
      ctx.fillStyle = overlay.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(
        overlay.title,
        overlay.x - viewBoxOrigin.x,
        overlay.y - viewBoxOrigin.y,
      );
      ctx.restore();
    });

    // 导出为 PNG
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
};

export const renderMermaidBlocks = async (
  container: HTMLElement,
): Promise<void> => {
  const mermaidBlocks = Array.from(container.querySelectorAll("pre.mermaid"));
  if (mermaidBlocks.length === 0) return;

  const { designerVariables, themeTokens } = getThemeInfo();
  const renderIdBase = `wemd-mermaid-${Date.now()}`;

  // 构建 Mermaid 配置并全局应用（关闭 htmlLabels 避免 foreignObject）
  const initConfig = getMermaidConfig(designerVariables, {
    htmlLabels: false,
    themeTokens,
  });
  const previousMermaidConfig = clonePlainConfig(
    mermaid.mermaidAPI.getSiteConfig(),
  );
  applyMermaidInitialize(initConfig);
  const renderHost = createHiddenRenderHost();
  document.body.appendChild(renderHost);

  try {
    for (const [index, block] of mermaidBlocks.entries()) {
      const diagram = block.textContent ?? "";
      if (!diagram.trim()) continue;

      let svg: string | null = null;
      try {
        const themedDiagram = getThemedMermaidDiagram(diagram, initConfig);
        const rendered = await mermaid.render(
          `${renderIdBase}-${index}`,
          themedDiagram,
          renderHost,
        );
        svg = rendered.svg;
      } catch (error) {
        console.error("[WeMD] Mermaid render failed:", error);
        continue;
      }

      const figure = document.createElement("div");
      figure.style.margin = "1em 0";
      figure.style.textAlign = "center";

      try {
        const pngDataUrl = await svgMarkupToPng(svg, diagram);
        const img = document.createElement("img");
        img.src = pngDataUrl;
        img.style.width = "100%";
        img.style.display = "block";
        img.style.margin = "0 auto";
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        figure.appendChild(img);
      } catch (error) {
        // PNG 转换失败时降级为内联 SVG，至少比裸露源码强
        console.error(
          "[WeMD] Mermaid SVG→PNG failed, fallback to inline SVG:",
          error,
        );
        figure.innerHTML = svg;
        const svgEl = figure.querySelector("svg");
        if (svgEl) {
          svgEl.setAttribute("style", "max-width:100%;height:auto;");
        }
      }

      block.parentNode?.replaceChild(figure, block);
    }
  } finally {
    renderHost.remove();
    mermaid.initialize(previousMermaidConfig);
  }
};

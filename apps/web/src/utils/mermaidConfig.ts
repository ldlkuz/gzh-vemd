import type { DesignerVariables } from "../components/Theme/ThemeDesigner/types";
import type { ThemeDefinition } from "@wemd/core";

export interface MermaidConfig {
  theme: string;
  themeVariables: {
    primaryColor?: string;
    primaryTextColor?: string;
    primaryBorderColor?: string;
    lineColor?: string;
    secondaryColor?: string;
    tertiaryColor?: string;
    [key: string]: string | number | object | undefined;
  };
  flowchart?: {
    htmlLabels?: boolean;
    padding?: number;
    nodeSpacing?: number;
    rankSpacing?: number;
    [key: string]: any;
  };
  /** XY 柱状图/折线图专用配置（mermaid v11 图表坐标默认字号偏小，公众号内更显小） */
  xychart?: {
    titleFontSize?: number;
    xAxis?: { labelFontSize?: number; titleFontSize?: number };
    yAxis?: { labelFontSize?: number; titleFontSize?: number };
    [key: string]: any;
  };
}

/**
 * 从主题定义（ThemeDefinition.tokens）提取 Mermaid 配色兜底。
 * 内置主题没有 designerVariables，但 tokens 里有真正的主题色板，
 * 用它让 mermaid 图表跟随主题主色。
 */
export interface MermaidThemeTokens {
  primaryColor?: string;
  textColor?: string;
  fontFamily?: string;
}

export const mermaidTokensFromTheme = (
  theme?: ThemeDefinition,
): MermaidThemeTokens | undefined => {
  if (!theme?.tokens) return undefined;
  return {
    primaryColor: theme.tokens.color.primary,
    textColor: theme.tokens.color.textNormal,
    fontFamily: theme.tokens.typography.fontFamily,
  };
};

/**
 * 根据背景色亮度挑选与之对比明显的文字颜色。
 *
 * 背景：Mermaid 节点填充用的是主题主色（可能较深，如深蓝/黛蓝/墨绿），
 * 节点文字若直接用 textNormal（普通深色文字）会与深色主色撞色、难以辨认。
 * 这里按主色感知亮度自动挑选浅色（白）或深色文字。
 *
 * @param bgColor 背景色（hex）
 * @param options.lightText 亮背景时用的深色文字
 * @param options.darkText 暗背景时用的浅色文字
 */
export const pickContrastText = (
  bgColor?: string,
  options?: { lightText?: string; darkText?: string },
): string => {
  const lightOnDark = options?.lightText ?? "#ffffff";
  const darkOnLight = options?.darkText ?? "#1f2937";
  if (!bgColor) return darkOnLight;

  const hex = bgColor.trim().replace(/^#/, "");
  let r: number;
  let g: number;
  let b: number;
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    // 非 hex（rgb/变量等）无法计算，保守返回深色文字
    return darkOnLight;
  }

  // WCAG 简化相对亮度
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? darkOnLight : lightOnDark;
};

export interface MermaidConfigOptions {
  /** 微信导出时关闭 htmlLabels 避免 foreignObject 兼容问题 */
  htmlLabels?: boolean;
  /** 主题 tokens 兜底配色（内置主题无 designerVariables 时使用） */
  themeTokens?: MermaidThemeTokens;
}

/**
 * 根据设计器变量 + 主题 tokens 生成 Mermaid 初始化配置
 * 优先级：designerVariables 优先，缺失时回退 themeTokens（内置主题用）
 */
export const getMermaidConfig = (
  designerVariables?: DesignerVariables,
  options?: MermaidConfigOptions,
): MermaidConfig => {
  const themeTokens = options?.themeTokens;
  const mermaidTheme = (designerVariables?.mermaidTheme as string) || "base";
  const mermaidFontFamily =
    designerVariables?.fontFamily ||
    themeTokens?.fontFamily ||
    '-apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif';
  const htmlLabels = options?.htmlLabels ?? true;

  const primaryColor =
    designerVariables?.primaryColor || themeTokens?.primaryColor;
  // 节点填充背景是主色（可能偏深），节点内文字必须与主色对比清晰，
  // 不能用 textNormal（普通深色文字）硬套，否则深色主色上会撞字。
  const primaryTextColor = pickContrastText(primaryColor, {
    darkText: designerVariables?.paragraphColor || themeTokens?.textColor,
  });
  // 图表正文色：坐标刻度/轴标题底色是浅色（响应式图表是白底），
  // 必须用主题深色正文字，不能沿用上面按主色反出的文字色，
  // 否则深主色主题下坐标字被反成白色、叠浅底上就看不见（撞色）。
  const chartTextColor =
    designerVariables?.paragraphColor || themeTokens?.textColor || "#333";
  // 柱内数据标签底色是主色，用主色反色保证柱上清晰
  const dataLabelColor = pickContrastText(primaryColor, { darkText: chartTextColor });

  return {
    theme: mermaidTheme,
    flowchart: {
      htmlLabels,
      padding: 20,
      nodeSpacing: 50,
      rankSpacing: 50,
    },
    themeVariables: {
      primaryColor,
      primaryTextColor,
      // 节点文字色：与节点背景(主色)保持同对比度，覆盖 class/state/er 等直接
      // 消费 nodeTextColor 的图类型，避免它们回退默认深色而撞主色。
      nodeTextColor: primaryTextColor,
      primaryBorderColor: primaryColor,
      lineColor: primaryColor,
      secondaryColor: primaryColor
        ? `${primaryColor}20`
        : undefined,
      tertiaryColor: "#ffffff00",
      fontFamily: mermaidFontFamily,
      // xychart 柱状/折线：默认系列色不来自主色，显式将首两个系列设为主题主色；
      // 同时固定坐标刻度和柱内数据标签文字色，阻断它们默认回退到 primaryTextColor
      //（主色反色）→ 深主色主题下坐标字变白、叠浅底上看不见的撞色问题。
      ...(primaryColor
        ? {
            xyChart: {
              plotColorPalette: `${primaryColor}, ${primaryColor}`,
              xAxisLabelColor: chartTextColor,
              xAxisTickColor: chartTextColor,
              yAxisLabelColor: chartTextColor,
              yAxisTickColor: chartTextColor,
              dataLabelColor,
            },
          }
        : {}),
    },
    // XY 柱状图/折线图字号：mermaid 默认坐标刻度 14/轴标题 16/图表标题 20，
    // 在公众号里被等比缩小后过小。统一放大以利于移动端阅读。
    xychart: {
      titleFontSize: 22,
      xAxis: { labelFontSize: 16, titleFontSize: 18 },
      yAxis: { labelFontSize: 16, titleFontSize: 18 },
    },
  };
};

/**
 * 生成带有样式的 Mermaid 图表源码
 * @param diagram 原始 Mermaid 代码
 * @param config Mermaid 配置对象
 * @returns 注入了配置的 Mermaid 代码
 */
export const getThemedMermaidDiagram = (
  diagram: string,
  config: MermaidConfig,
): string => {
  if (!diagram.trim()) return "";

  // 如果用户已经手动指定了 init 指令，则不覆盖
  if (diagram.trimStart().startsWith("%%{")) {
    return diagram;
  }

  return `%%{init: ${JSON.stringify(config)} }%%\n${diagram}`;
};

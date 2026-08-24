import { useRef, useState, useEffect } from "react";
import {
  Heading,
  List,
  Image,
  Loader2,
  Workflow,
  ListEnd,
  WrapText,
  LayoutTemplate,
  FileText,
  Sigma,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  WECHAT_IMAGE_MAX_SIZE_BYTES,
  formatImageSize,
} from "../../services/image/autoCompressImage";
import { uploadEditorImage } from "../../services/image/imageUploadFlow";
import { useEditorStore } from "../../store/editorStore";
import { useThemeStore } from "../../store/themeStore";
import { resolveAppAssetPath } from "../../utils/assetPath";
import { getBuiltInThemeDefinition, getComponentSampleMarkdown } from "@wemd/core";
import { CurrentThemeBadge } from "./CurrentThemeBadge";
import {
  blockTools,
  componentGroups,
  componentGroupOrder,
  componentTemplates,
  headingOptions,
  listOptions,
  mermaidPrimaryTemplates,
  syntaxTools,
  textFormatTools,
  type ComponentTemplate,
} from "./toolbarConfigs";
import {
  getPublishingPreference,
  setPublishingPreference,
} from "../../store/publishingPreferences";
import { SyntaxHelpPopover } from "./SyntaxHelpPopover";
import "./Toolbar.css";

interface ToolbarProps {
  onInsert: (
    prefix: string,
    suffix: string,
    placeholder: string,
    opts?: { selectFirstLine?: boolean },
  ) => void;
  onOpenAi?: () => void;
  aiLoading?: boolean;
  /** 打开 AI 杂志排版面板 */
  onOpenAiDesign?: () => void;
  /** AI 排版加载中 */
  aiDesignLoading?: boolean;
}

export function Toolbar({
  onInsert,
  onOpenAi,
  aiLoading,
  onOpenAiDesign,
  aiDesignLoading,
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const themeId = useThemeStore((s) => s.themeId);
  const customThemes = useThemeStore((s) => s.customThemes);
  const [showMermaidMenu, setShowMermaidMenu] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);
  const [showComponentMenu, setShowComponentMenu] = useState(false);
  const [showSyntaxMenu, setShowSyntaxMenu] = useState(false);
  const mermaidMenuRef = useRef<HTMLDivElement>(null);
  const headingMenuRef = useRef<HTMLDivElement>(null);
  const listMenuRef = useRef<HTMLDivElement>(null);
  const componentMenuRef = useRef<HTMLDivElement>(null);
  const syntaxMenuRef = useRef<HTMLDivElement>(null);
  const [linkToFootnote, setLinkToFootnote] = useState(() =>
    getPublishingPreference("linkToFootnote"),
  );
  const [tableWrap, setTableWrap] = useState(() =>
    getPublishingPreference("tableWrap"),
  );

  useEffect(() => {
    setPublishingPreference("linkToFootnote", linkToFootnote);
  }, [linkToFootnote]);

  // 点击外部关闭所有菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // 关闭标题菜单
      if (headingMenuRef.current && !headingMenuRef.current.contains(target)) {
        setShowHeadingMenu(false);
      }
      // 关闭列表菜单
      if (listMenuRef.current && !listMenuRef.current.contains(target)) {
        setShowListMenu(false);
      }
      // 关闭组件菜单
      if (
        componentMenuRef.current &&
        !componentMenuRef.current.contains(target)
      ) {
        setShowComponentMenu(false);
      }
      // 关闭语法菜单
      if (syntaxMenuRef.current && !syntaxMenuRef.current.contains(target)) {
        setShowSyntaxMenu(false);
      }
      // 关闭 Mermaid 菜单
      if (mermaidMenuRef.current && !mermaidMenuRef.current.contains(target)) {
        setShowMermaidMenu(false);
      }
    };

    const anyMenuOpen =
      showHeadingMenu ||
      showListMenu ||
      showMermaidMenu ||
      showComponentMenu ||
      showSyntaxMenu;
    if (anyMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    showHeadingMenu,
    showListMenu,
    showMermaidMenu,
    showComponentMenu,
    showSyntaxMenu,
  ]);

  const handleMermaidInsert = (code: string) => {
    onInsert("```mermaid\n", "\n```", code);
    setShowMermaidMenu(false);
  };

  const toggleMermaidMenu = () => {
    setShowMermaidMenu((prev) => {
      const next = !prev;
      if (next) {
        // 打开 Mermaid 菜单时同时关闭其他菜单
        setShowHeadingMenu(false);
        setShowListMenu(false);
        setShowComponentMenu(false);
        setShowSyntaxMenu(false);
      }
      return next;
    });
  };

  const handleComponentInsert = (template: ComponentTemplate) => {
    // 按当前主题的槽位结构生成组件 body（主题感知插入）：
    // 内置主题按 id 解析，自定义主题取其 definition；无法解析时回退静态模板。
    const currentTheme =
      getBuiltInThemeDefinition(themeId) ??
      customThemes.find((t) => t.id === themeId)?.definition;
    const generated = getComponentSampleMarkdown(currentTheme, template.name);
    const body = generated || template.body;
    const propsSeg = template.props ? `{${template.props}}` : "";
    const prefix = `::: ${template.name}${propsSeg}\n`;
    const suffix = `\n:::`;
    // 插入后自动选中首个占位符，用户可直接打字覆盖
    onInsert(prefix, suffix, body, { selectFirstLine: true });
    setShowComponentMenu(false);
  };

  const toggleComponentMenu = () => {
    setShowComponentMenu((prev) => {
      const next = !prev;
      if (next) {
        // 关闭其他菜单
        setShowHeadingMenu(false);
        setShowListMenu(false);
        setShowMermaidMenu(false);
        setShowSyntaxMenu(false);
      }
      return next;
    });
  };

  const toggleSyntaxMenu = () => {
    setShowSyntaxMenu((prev) => {
      const next = !prev;
      if (next) {
        // 关闭其他菜单
        setShowHeadingMenu(false);
        setShowListMenu(false);
        setShowMermaidMenu(false);
        setShowComponentMenu(false);
      }
      return next;
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件");
      return;
    }

    setUploading(true);
    const needAutoCompress = file.size > WECHAT_IMAGE_MAX_SIZE_BYTES;
    const loadingMessage = needAutoCompress
      ? "正在压缩并上传图片..."
      : "正在上传图片...";
    const loadingToastId = toast.loading(loadingMessage);

    try {
      const result = await uploadEditorImage(file, {
        compressionOptions: { maxSizeBytes: WECHAT_IMAGE_MAX_SIZE_BYTES },
      });

      // 插入 Markdown
      onInsert("![", `](${result.url})`, file.name.replace(/\.[^/.]+$/, ""));

      const successMessage = result.compressed
        ? `图片上传成功（已自动压缩 ${formatImageSize(
            result.originalSize,
          )} -> ${formatImageSize(result.finalSize)}）`
        : "图片上传成功";
      toast.success(successMessage);
    } catch (error) {
      console.error("图片上传失败:", error);
      toast.error(error instanceof Error ? error.message : "图片上传失败");
    } finally {
      toast.dismiss(loadingToastId);
      setUploading(false);
      // 清空 input，允许重复上传同一文件
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const toggleLinkToFootnote = () => {
    const next = !linkToFootnote;
    setLinkToFootnote(next);
    toast.success(next ? "已开启：外链转脚注" : "已关闭：外链转脚注", {
      duration: 2000,
    });
  };

  const toggleTableWrap = () => {
    const next = !tableWrap;
    setTableWrap(next);
    setPublishingPreference("tableWrap", next);
    toast.success(next ? "已开启：表格自动换行" : "已关闭：表格自动换行", {
      duration: 2000,
    });
  };

  const handleLoadSampleArticle = async () => {
    const loadingToastId = toast.loading("正在加载全组件范文...");
    try {
      // 使用相对路径，兼容 dev(http) 与打包后(file://)环境
      const response = await fetch(resolveAppAssetPath("samples/default.md"));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const markdown = await response.text();
      useEditorStore.getState().setMarkdown(markdown);
      toast.success("已加载全组件范文", { duration: 2000 });
    } catch (error) {
      console.error("加载范文失败:", error);
      toast.error("加载范文失败，请检查文件是否存在");
    } finally {
      toast.dismiss(loadingToastId);
    }
  };

  return (
    <div className="md-toolbar">
      {/* 文本格式工具 */}
      {textFormatTools.map((tool, index) => (
        <button
          key={index}
          className="md-toolbar-btn"
          onClick={() => onInsert(tool.prefix, tool.suffix, tool.placeholder)}
          data-tooltip={tool.label}
        >
          <tool.icon size={16} />
        </button>
      ))}

      {/* 标题下拉菜单 */}
      <div className="md-toolbar-dropdown-container" ref={headingMenuRef}>
        <button
          className={`md-toolbar-btn ${showHeadingMenu ? "active" : ""}`}
          onClick={() => {
            setShowHeadingMenu((prev) => !prev);
            setShowListMenu(false);
            setShowMermaidMenu(false);
            setShowComponentMenu(false);
            setShowSyntaxMenu(false);
          }}
          data-tooltip="标题"
        >
          <Heading size={16} />
        </button>
        {showHeadingMenu && (
          <div className="md-toolbar-dropdown-menu">
            {headingOptions.map((option, idx) => (
              <button
                key={idx}
                className="md-toolbar-dropdown-item"
                onClick={() => {
                  onInsert(option.prefix, option.suffix, option.placeholder);
                  setShowHeadingMenu(false);
                }}
              >
                <option.icon size={14} className="mr-2" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 列表下拉菜单 */}
      <div className="md-toolbar-dropdown-container" ref={listMenuRef}>
        <button
          className={`md-toolbar-btn ${showListMenu ? "active" : ""}`}
          onClick={() => {
            setShowListMenu((prev) => !prev);
            setShowHeadingMenu(false);
            setShowMermaidMenu(false);
            setShowComponentMenu(false);
            setShowSyntaxMenu(false);
          }}
          data-tooltip="列表"
        >
          <List size={16} />
        </button>
        {showListMenu && (
          <div className="md-toolbar-dropdown-menu">
            {listOptions.map((option, idx) => (
              <button
                key={idx}
                className="md-toolbar-dropdown-item"
                onClick={() => {
                  onInsert(option.prefix, option.suffix, option.placeholder);
                  setShowListMenu(false);
                }}
              >
                <option.icon size={14} className="mr-2" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 块级工具 */}
      {blockTools.map((tool, index) => (
        <button
          key={index}
          className="md-toolbar-btn"
          onClick={() => onInsert(tool.prefix, tool.suffix, tool.placeholder)}
          data-tooltip={tool.label}
        >
          <tool.icon size={16} />
        </button>
      ))}

      {/* Mermaid 下拉菜单 */}
      <div className="md-toolbar-dropdown-container" ref={mermaidMenuRef}>
        <button
          className={`md-toolbar-btn ${showMermaidMenu ? "active" : ""}`}
          onClick={toggleMermaidMenu}
          data-tooltip="插入图表"
        >
          <Workflow size={16} />
        </button>

        {showMermaidMenu && (
          <div className="md-toolbar-dropdown-menu">
            {mermaidPrimaryTemplates.map((template, idx) => (
              <button
                key={idx}
                className="md-toolbar-dropdown-item"
                onClick={() => handleMermaidInsert(template.code)}
              >
                <template.icon size={14} className="mr-2" />
                <span>{template.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 语法下拉菜单（core 支持的扩展 Markdown 语法） */}
      <div className="md-toolbar-dropdown-container" ref={syntaxMenuRef}>
        <button
          className={`md-toolbar-btn ${showSyntaxMenu ? "active" : ""}`}
          onClick={toggleSyntaxMenu}
          data-tooltip="插入语法"
        >
          <Sigma size={16} />
        </button>
        {showSyntaxMenu && (
          <div className="md-toolbar-dropdown-menu">
            {syntaxTools.map((tool, idx) => (
              <button
                key={idx}
                className="md-toolbar-dropdown-item"
                onClick={() => {
                  onInsert(tool.prefix, tool.suffix, tool.placeholder);
                  setShowSyntaxMenu(false);
                }}
              >
                <tool.icon size={14} className="mr-2" />
                <span>{tool.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 组件下拉菜单（公众号富文本组件） */}
      <div className="md-toolbar-dropdown-container" ref={componentMenuRef}>
        <button
          className={`md-toolbar-btn ${showComponentMenu ? "active" : ""}`}
          onClick={toggleComponentMenu}
          data-tooltip="插入组件"
        >
          <LayoutTemplate size={16} />
        </button>
        {showComponentMenu && (
          <div className="md-toolbar-dropdown-menu md-toolbar-component-menu">
            {componentGroupOrder.map((group) => {
              const items = componentTemplates.filter(
                (t) => (componentGroups[t.name] ?? "常用") === group,
              );
              if (!items.length) return null;
              return (
                <div key={group} className="md-toolbar-component-group">
                  <div className="md-toolbar-component-group-title">
                    {group}
                  </div>
                  {items.map((template, idx) => (
                    <button
                      key={idx}
                      className="md-toolbar-dropdown-item md-toolbar-component-item"
                      onClick={() => handleComponentInsert(template)}
                      title={template.description}
                    >
                      <template.icon size={14} className="mr-2" />
                      <span className="md-toolbar-component-label">
                        {template.label}
                      </span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 图片上传按钮 */}
      <button
        className="md-toolbar-btn"
        onClick={handleImageClick}
        disabled={uploading}
        data-tooltip="上传图片"
      >
        {uploading ? (
          <Loader2 size={16} className="spinning" />
        ) : (
          <Image size={16} />
        )}
      </button>

      {/* 加载全组件范文（主题渲染测试用） */}
      <button
        className="md-toolbar-btn"
        onClick={handleLoadSampleArticle}
        data-tooltip="加载全组件范文（主题渲染测试）"
      >
        <FileText size={16} />
      </button>

      {/* AI 转 Markdown */}
      {onOpenAi && (
        <button
          className="md-toolbar-btn md-toolbar-ai-btn"
          onClick={onOpenAi}
          disabled={aiLoading}
          data-tooltip={
            aiLoading
              ? "AI 正在处理..."
              : "AI 转 Markdown（选区有内容转选区，否则转整篇）"
          }
        >
          {aiLoading ? (
            <Loader2 size={14} className="spinning" />
          ) : (
            <span className="md-toolbar-ai-text">AI-MD</span>
          )}
        </button>
      )}

      {/* AI 杂志排版 */}
      {onOpenAiDesign && (
        <button
          className="md-toolbar-btn md-toolbar-ai-btn md-toolbar-ai-layout-btn"
          onClick={onOpenAiDesign}
          disabled={aiDesignLoading}
          data-tooltip={aiDesignLoading ? "AI 正在设计..." : "AI 杂志排版"}
        >
          {aiDesignLoading ? (
            <Loader2 size={14} className="spinning" />
          ) : (
            <>
              <Workflow size={14} />
              <span className="md-toolbar-ai-text">AI 排版</span>
            </>
          )}
        </button>
      )}

      {/* 主题徽章：只读展示当前文章主题，点击跳转到文章主题面板 */}
      <CurrentThemeBadge />

      {/* 分隔符 */}
      <div className="md-toolbar-divider" />

      {/* 外链转脚注开关 */}
      <button
        className={`md-toolbar-btn md-toolbar-toggle ${linkToFootnote ? "active" : ""}`}
        onClick={toggleLinkToFootnote}
        aria-label={linkToFootnote ? "外链转脚注：开启" : "外链转脚注：关闭"}
        data-tooltip={linkToFootnote ? "外链转脚注：开启" : "外链转脚注：关闭"}
      >
        <ListEnd size={16} />
      </button>

      {/* 表格自动换行开关 */}
      <button
        className={`md-toolbar-btn md-toolbar-toggle ${tableWrap ? "active" : ""}`}
        onClick={toggleTableWrap}
        aria-label={tableWrap ? "表格自动换行：开启" : "表格自动换行：关闭"}
        data-tooltip={tableWrap ? "表格自动换行：开启" : "表格自动换行：关闭"}
      >
        <WrapText size={16} />
      </button>

      {/* 语法帮助 */}
      <SyntaxHelpPopover />

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}

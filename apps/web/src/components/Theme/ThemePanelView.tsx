import {
  AlertTriangle,
  ChevronDown,
  Copy,
  Download,
  Eye,
  FileText,
  Palette,
  Plus,
  Trash2,
  Upload,
  X,
  Clipboard,
  Terminal,
} from "lucide-react";
import type { MutableRefObject } from "react";
import { useState } from "react";
import { Modal } from "../common";
import type {
  CustomTheme,
  ThemeDefinition,
} from "../../store/themes/builtInThemes";
import type { ValidationError } from "@wemd/core";
import { exportThemeComponentGuide } from "@wemd/core";
import toast from "react-hot-toast";
import { getElectron } from "../../hooks/useFileSystemHelpers";
import { ThemeDesigner, type DesignerVariables } from "./ThemeDesigner";
import { ThemeLivePreview } from "./ThemeLivePreview";
import { resolveAppAssetPath } from "../../utils/assetPath";

interface ThemePanelViewProps {
  open: boolean;
  onClose: () => void;
  fileInputRef: MutableRefObject<HTMLInputElement | null>;
  builtInThemes: CustomTheme[];
  customThemes: CustomTheme[];
  selectedTheme: CustomTheme | undefined;
  selectedThemeId: string;
  isCustomTheme: boolean;
  isCreating: boolean;
  creationStep: "select-mode" | "editing";
  editorMode: "visual" | "css";
  isVisualEditing: boolean;
  showDeleteConfirm: boolean;
  useCurrentArticle: boolean;
  previewCss: string;
  designerVariables: DesignerVariables | undefined;
  /** Phase 7：当前所选主题的 definition，用于注入组件骨架模板 */
  themeDefinition?: ThemeDefinition;
  nameInput: string;
  cssInput: string;
  canSave: boolean;
  hasChanges: boolean;
  exportMenuOpen: boolean;
  exportMenuRef: MutableRefObject<HTMLDivElement | null>;
  onSelectTheme: (themeId: string) => void;
  onCreateNew: () => void;
  onImportThemeFile: (file: File) => Promise<void>;
  onSelectCreationMode: (mode: "visual" | "css") => void;
  onSetUseCurrentArticle: (value: boolean) => void;
  onVisualCssChange: (nextCss: string) => void;
  onVariablesChange: (vars: DesignerVariables) => void;
  onNameInputChange: (value: string) => void;
  onCssInputChange: (value: string) => void;
  onCloseDeleteConfirm: () => void;
  onConfirmDelete: () => void;
  onCancelCreate: () => void;
  onDuplicate: () => void;
  onToggleExportMenu: () => void;
  onExportJson: () => void;
  onExportCss: () => void;
  onExportZip: () => void;
  onDeleteClick: () => void;
  onSave: () => void;
  onApply: () => void;
  importMenuOpen: boolean;
  importMenuRef: MutableRefObject<HTMLDivElement | null>;
  onToggleImportMenu: () => void;
  showPasteModal: boolean;
  pasteJsonText: string;
  onOpenPasteModal: () => void;
  onPasteJsonTextChange: (value: string) => void;
  onPasteJsonImport: () => void;
  onClosePasteModal: () => void;
  showImportErrors: boolean;
  importErrors: ValidationError[];
  onCloseImportErrors: () => void;
  showOverrideModal: boolean;
  overrideInfo: {
    existingName: string;
    existingVersion: string;
    newVersion: string;
  } | null;
  onOverrideReplace: () => void;
  onOverrideCopy: () => void;
  onCloseOverrideModal: () => void;
}

export function ThemePanelView({
  open,
  onClose,
  fileInputRef,
  builtInThemes,
  customThemes,
  selectedTheme,
  selectedThemeId,
  isCustomTheme,
  isCreating,
  creationStep,
  editorMode,
  isVisualEditing,
  showDeleteConfirm,
  useCurrentArticle,
  previewCss,
  designerVariables,
  themeDefinition,
  nameInput,
  cssInput,
  canSave,
  hasChanges,
  exportMenuOpen,
  exportMenuRef,
  onSelectTheme,
  onCreateNew,
  onImportThemeFile,
  onSelectCreationMode,
  onSetUseCurrentArticle,
  onVisualCssChange,
  onVariablesChange,
  onNameInputChange,
  onCssInputChange,
  onCloseDeleteConfirm,
  onConfirmDelete,
  onCancelCreate,
  onDuplicate,
  onToggleExportMenu,
  onExportJson,
  onExportCss,
  onExportZip,
  onDeleteClick,
  onSave,
  onApply,
  // Phase 7
  importMenuOpen,
  importMenuRef,
  onToggleImportMenu,
  showPasteModal,
  pasteJsonText,
  onOpenPasteModal,
  onPasteJsonTextChange,
  onPasteJsonImport,
  onClosePasteModal,
  showImportErrors,
  importErrors,
  onCloseImportErrors,
  showOverrideModal,
  overrideInfo,
  onOverrideReplace,
  onOverrideCopy,
  onCloseOverrideModal,
}: ThemePanelViewProps) {
  // 复制示例文章到剪贴板：优先当前主题的 samples/<themeId>.md，缺失回退 default.md
  const [sampleCopied, setSampleCopied] = useState(false);
  const handleCopySample = async () => {
    const themeId = themeDefinition?.meta.id;
    const paths = themeId
      ? [`samples/${themeId}.md`, "samples/default.md"]
      : ["samples/default.md"];
    for (const path of paths) {
      try {
        const response = await fetch(resolveAppAssetPath(path));
        if (response.ok) {
          const markdown = await response.text();
          await navigator.clipboard.writeText(markdown);
          setSampleCopied(true);
          window.setTimeout(() => setSampleCopied(false), 1500);
          return;
        }
      } catch {
        /* 网络失败则尝试下一个候选路径 */
      }
    }
  };

  // 导出当前主题的组件语法文档（基础语法 + 全部组件 + 排版规格）为 .md 文件
  // - Electron：弹出系统保存对话框，用户自选文件夹与文件名
  // - 浏览器：下载到默认下载目录（浏览器无法弹出选夹框），toast 提示位置
  const [guideCopied, setGuideCopied] = useState(false);
  const flashExported = () => {
    setGuideCopied(true);
    window.setTimeout(() => setGuideCopied(false), 1500);
  };
  // 必须在所有 hooks 声明之后才可提前返回，否则违反 React Hooks 调用顺序
  if (!open) return null;
  const handleExportComponentGuide = async () => {
    if (!themeDefinition) return;
    const guide = exportThemeComponentGuide(themeDefinition, {
      includeFormat: true,
    });
    const themeName = themeDefinition.meta.name || "theme";
    const fileName = `${themeDefinition.meta.id || themeName}-component-guide.md`;

    const electron = getElectron();
    if (electron?.fs.saveFileWithDialog) {
      const res = await electron.fs.saveFileWithDialog({
        title: `导出「${themeName}」组件语法`,
        defaultName: fileName,
        content: guide,
      });
      if (res.success && res.filePath) {
        toast.success(`已导出到 ${res.filePath}`);
      } else if (!res.canceled) {
        toast.error(res.error || "导出失败");
      }
      flashExported();
      return;
    }

    // 浏览器回退：下载到默认下载目录
    const blob = new Blob([guide], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`已开始下载 ${fileName}（保存到浏览器下载目录）`);
    flashExported();
  };

  return (
    <div className="theme-overlay" onClick={onClose}>
      <div
        className="theme-modal theme-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="theme-header">
          <h3>主题管理</h3>
          <button className="close-btn" onClick={onClose} aria-label="关闭">
            <X size={20} />
          </button>
        </div>

        <div className="theme-body">
          <div className="theme-sidebar">
            <button className="btn-new-theme" onClick={onCreateNew}>
              <Plus size={16} /> 新建自定义主题
            </button>
            <div className="theme-import-menu" ref={importMenuRef}>
              <button
                className="btn-import-theme"
                onClick={onToggleImportMenu}
                aria-haspopup="menu"
                aria-expanded={importMenuOpen}
              >
                <Upload size={16} /> 导入主题 <ChevronDown size={14} />
              </button>
              {importMenuOpen && (
                <div className="theme-import-dropdown" role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onToggleImportMenu();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Upload size={16} /> 从文件导入 (.json / .wemd-theme / .zip)
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onToggleImportMenu();
                      onOpenPasteModal();
                    }}
                  >
                    <Clipboard size={16} /> 粘贴 JSON 文本
                  </button>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,.wemd-theme,.zip"
              style={{ display: "none" }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  await onImportThemeFile(file);
                  e.target.value = "";
                }
              }}
            />

            <div className="theme-list-scroll">
              {customThemes.length > 0 && (
                <div className="theme-group">
                  <div className="theme-group-title">自定义主题</div>
                  {customThemes.map((item) => (
                    <button
                      key={item.id}
                      className={`theme-item ${item.id === selectedThemeId ? "active" : ""}`}
                      onClick={() => onSelectTheme(item.id)}
                    >
                      {item.preview && (
                        <img
                          className="theme-item-preview"
                          src={item.preview}
                          alt=""
                          width={40}
                          height={40}
                        />
                      )}
                      <span className="theme-item-name">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="theme-group">
                <div className="theme-group-title">内置主题</div>
                {builtInThemes.map((item) => (
                  <button
                    key={item.id}
                    className={`theme-item ${item.id === selectedThemeId ? "active" : ""}`}
                    onClick={() => onSelectTheme(item.id)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="theme-editor" style={{ position: "relative" }}>
            {showDeleteConfirm && (
              <div className="delete-confirm-overlay">
                <div className="delete-confirm-box">
                  <div className="confirm-icon-wrapper">
                    <AlertTriangle size={24} color="#ef4444" />
                  </div>
                  <h4>确认删除</h4>
                  <p>
                    确定要删除主题 "{selectedTheme?.name}" 吗？此操作无法撤销。
                  </p>
                  <div className="delete-confirm-actions">
                    <button
                      className="btn-secondary"
                      onClick={onCloseDeleteConfirm}
                    >
                      取消
                    </button>
                    <button
                      className="btn-primary"
                      style={{ background: "#ef4444", boxShadow: "none" }}
                      onClick={onConfirmDelete}
                    >
                      确认删除
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="theme-form">
              {/* 粘贴 JSON 导入 Modal */}
              {showPasteModal && (
                <div className="tpm-paste-json-modal">
                  <div className="tpm-paste-json-modal-content">
                    <div className="tpm-paste-json-modal-header">
                      <h3>粘贴 JSON 文本</h3>
                      <button onClick={onClosePasteModal} aria-label="关闭">
                        <X size={20} />
                      </button>
                    </div>
                    <p className="tpm-paste-json-modal-hint">
                      粘贴主题 manifest.json 内容，支持纯 JSON
                      文本。校验通过后即可导入。
                    </p>
                    <textarea
                      className="tpm-paste-json-textarea"
                      value={pasteJsonText}
                      onChange={(e) => onPasteJsonTextChange(e.target.value)}
                      placeholder='{"sdkVersion": "1.0.0", "meta": {...}, ...}'
                      spellCheck={false}
                      rows={12}
                    />
                    <div className="tpm-paste-json-modal-actions">
                      <button
                        className="btn-secondary"
                        onClick={onClosePasteModal}
                      >
                        取消
                      </button>
                      <button
                        className="btn-primary"
                        onClick={onPasteJsonImport}
                        disabled={!pasteJsonText.trim()}
                      >
                        校验并导入
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 导入错误详情 Modal */}
              {showImportErrors && (
                <div className="tpm-error-modal">
                  <div className="tpm-error-modal-content">
                    <div className="tpm-error-modal-header">
                      <h3>导入失败</h3>
                      <button onClick={onCloseImportErrors} aria-label="关闭">
                        <X size={20} />
                      </button>
                    </div>
                    <p className="tpm-error-modal-hint">
                      主题包校验未通过，以下问题需要修复：
                    </p>
                    <div className="tpm-error-list">
                      {importErrors.map((err, idx) => (
                        <div key={idx} className="tpm-error-item">
                          <span className="tpm-error-path">{err.path}</span>
                          <span className="tpm-error-msg">{err.message}</span>
                        </div>
                      ))}
                    </div>
                    <div className="tpm-error-modal-actions">
                      <button
                        className="btn-secondary"
                        onClick={() => {
                          const text = importErrors
                            .map((e) => `${e.path}: ${e.message}`)
                            .join("\n");
                          navigator.clipboard.writeText(text);
                        }}
                      >
                        <Copy size={14} /> 复制全部错误信息
                      </button>
                      <button
                        className="btn-primary"
                        onClick={onCloseImportErrors}
                      >
                        知道了
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 同名覆盖确认 Modal */}
              {showOverrideModal && overrideInfo && (
                <div className="tpm-override-modal">
                  <div className="tpm-override-modal-content">
                    <div className="tpm-override-modal-header">
                      <h3>主题已存在</h3>
                      <button onClick={onCloseOverrideModal} aria-label="关闭">
                        <X size={20} />
                      </button>
                    </div>
                    <p className="tpm-override-modal-hint">
                      已存在主题 <strong>{overrideInfo.existingName}</strong>
                      （版本 {
                        overrideInfo.existingVersion
                      }），导入的主题版本为 {overrideInfo.newVersion}
                      ，是否覆盖？
                    </p>
                    <div className="tpm-override-modal-actions">
                      <button
                        className="btn-secondary"
                        onClick={onCloseOverrideModal}
                      >
                        取消
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={onOverrideCopy}
                      >
                        导入为副本
                      </button>
                      <button
                        className="btn-primary"
                        onClick={onOverrideReplace}
                      >
                        覆盖
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isCreating && creationStep === "select-mode" && (
                <div className="mode-selection">
                  <h3>选择创建方式</h3>
                  <div className="mode-cards">
                    <button
                      className="mode-card"
                      onClick={() => onSelectCreationMode("visual")}
                    >
                      <span className="mode-icon">
                        <Palette size={32} />
                      </span>
                      <span className="mode-title">可视化设计</span>
                      <span className="mode-desc">
                        通过可视化控件快速定制主题样式
                      </span>
                      <span className="mode-tag">适合快速上手</span>
                    </button>
                  </div>
                </div>
              )}

              {(!isCreating || creationStep === "editing") && (
                <>
                  <div className="theme-form-preview">
                    <div className="preview-source-toggle">
                      <button
                        className={`toggle-btn ${useCurrentArticle ? "active" : ""}`}
                        onClick={() => onSetUseCurrentArticle(true)}
                        title="预览当前正在编辑的文章"
                      >
                        <FileText size={14} />
                        当前文章
                      </button>
                      <button
                        className={`toggle-btn ${!useCurrentArticle ? "active" : ""}`}
                        onClick={() => onSetUseCurrentArticle(false)}
                        title="预览内置示例内容"
                      >
                        <Eye size={14} />
                        示例内容
                      </button>
                      <div className="preview-actions">
                        <button
                          type="button"
                          className="toggle-btn sample-copy-btn"
                          onClick={handleCopySample}
                          title="复制示例文章到剪贴板"
                        >
                          <Copy size={14} />
                          {sampleCopied ? "已复制" : "复制示例"}
                        </button>
                        <button
                          type="button"
                          className="toggle-btn sample-copy-btn"
                          onClick={handleExportComponentGuide}
                          title="导出当前主题的组件语法文档（基础语法 + 全部组件 + 排版规格），可选择保存位置"
                        >
                          <Download size={14} />
                          {guideCopied ? "已导出" : "导出组件语法"}
                        </button>
                      </div>
                    </div>
                    <ThemeLivePreview
                      css={previewCss}
                      designerVariables={
                        isVisualEditing ? designerVariables : undefined
                      }
                      useCurrentArticle={useCurrentArticle}
                      themeDefinition={themeDefinition}
                    />
                  </div>

                  <div className="theme-form-fields">
                    <label>主题名称</label>
                    <input
                      value={nameInput}
                      onChange={(e) => onNameInputChange(e.target.value)}
                      placeholder="输入主题名称..."
                      disabled={!isCreating && !isCustomTheme}
                    />

                    {((isCreating && editorMode === "visual") ||
                      (!isCreating &&
                        isCustomTheme &&
                        selectedTheme?.editorMode === "visual")) && (
                      <div className="visual-designer-container">
                        <ThemeDesigner
                          onCSSChange={onVisualCssChange}
                          onVariablesChange={onVariablesChange}
                          initialVariables={
                            isCreating
                              ? undefined
                              : selectedTheme?.designerVariables
                          }
                        />
                      </div>
                    )}

                    {((isCreating && editorMode === "css") ||
                      (!isCreating &&
                        selectedTheme?.editorMode !== "visual")) && (
                      <>
                        <label>CSS 样式</label>
                        <textarea
                          value={cssInput}
                          onChange={(e) => onCssInputChange(e.target.value)}
                          placeholder="输入 CSS 样式代码..."
                          spellCheck={false}
                          disabled={!isCreating && !isCustomTheme}
                        />
                      </>
                    )}

                    {!isCreating && !isCustomTheme && (
                      <p className="info-hint">
                        💡内置主题不可编辑，点击"复制"按钮可以基于此主题创建自定义主题
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="theme-actions">
              {isCreating ? (
                <>
                  <button className="btn-secondary" onClick={onCancelCreate}>
                    取消
                  </button>
                  <button
                    className="btn-primary"
                    onClick={onSave}
                    disabled={!canSave}
                  >
                    保存为新主题
                  </button>
                </>
              ) : isCustomTheme ? (
                <>
                  <button className="btn-icon-text" onClick={onDuplicate}>
                    <Copy size={16} /> 复制
                  </button>
                  <div className="theme-export-menu" ref={exportMenuRef}>
                    <button
                      className="btn-icon-text"
                      onClick={onToggleExportMenu}
                      aria-haspopup="menu"
                      aria-expanded={exportMenuOpen}
                    >
                      <Download size={16} /> 导出 <ChevronDown size={14} />
                    </button>
                    {exportMenuOpen && (
                      <div className="theme-export-dropdown" role="menu">
                        {selectedTheme?.editorMode === "visual" && (
                          <button
                            type="button"
                            role="menuitem"
                            onClick={onExportJson}
                          >
                            <Download size={16} /> JSON（支持可视化编辑）
                          </button>
                        )}
                        <button
                          type="button"
                          role="menuitem"
                          onClick={onExportCss}
                        >
                          <Download size={16} /> CSS（不支持可视化编辑）
                        </button>
                        {selectedTheme?.readOnly && (
                          <button
                            type="button"
                            role="menuitem"
                            onClick={onExportZip}
                          >
                            <Download size={16} /> 主题包 (.wemd-theme)
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    className="btn-icon-text btn-danger"
                    onClick={onDeleteClick}
                  >
                    <Trash2 size={16} /> 删除
                  </button>
                  <div className="flex-spacer"></div>
                  <button className="btn-secondary" onClick={onClose}>
                    取消
                  </button>
                  <button
                    className="btn-primary"
                    onClick={onSave}
                    disabled={!hasChanges}
                  >
                    保存修改
                  </button>
                  <button className="btn-primary" onClick={onApply}>
                    应用主题
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-icon-text" onClick={onDuplicate}>
                    <Copy size={16} /> 复制
                  </button>
                  <div className="flex-spacer"></div>
                  <button className="btn-secondary" onClick={onClose}>
                    取消
                  </button>
                  <button className="btn-primary" onClick={onApply}>
                    应用主题
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * AI 排版 —— 自动模式
 *
 * 由 AI 依据当前主题组件手册（含骨架槽位映射）自行挑选并重排整篇文章。
 * 用户零配置：点「生成排版」→ 预览 → 应用。AI 输出经校验（越界剔除/截断检测）。
 */
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Modal } from "../common/Modal";
import "./AiLayoutPanel.css";

interface AiLayoutPanelProps {
  /** 是否打开 */
  open: boolean;
  /** 是否正在生成 */
  loading: boolean;
  /** 重排后的整篇 Markdown（未生成时为 null） */
  rewritten: string | null;
  /** 校验结果 */
  validation?: { invalid: string[]; truncated: boolean } | null;
  /** 关闭面板 */
  onClose: () => void;
  /** 生成排版（AI 自动决定组件） */
  onGenerate: () => void;
  /** 整篇预览：替换进编辑器 */
  onPreviewAll: () => void;
  /** 撤销预览：恢复原文 */
  onUndoPreview: () => void;
  /** 一键应用 */
  onApplyAll: () => void;
  /** 是否正在预览 */
  isPreviewing: boolean;
}

export function AiLayoutPanel({
  open,
  loading,
  rewritten,
  validation,
  onClose,
  onGenerate,
  onPreviewAll,
  onUndoPreview,
  onApplyAll,
  isPreviewing,
}: AiLayoutPanelProps) {
  const handleClose = () => {
    if (isPreviewing) onUndoPreview();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="AI 排版"
      className="ai-layout-panel"
    >
      {loading ? (
        <div className="ai-layout-loading">
          <Loader2 size={32} className="spinning" />
          <p>AI 正在按当前主题重排整篇文章...</p>
          <p className="ai-layout-loading-hint">通常需要 10-30 秒</p>
        </div>
      ) : rewritten == null ? (
        <div className="ai-layout-empty">
          <Sparkles size={32} />
          <p>AI 会按当前主题自动挑选组件，把整篇文章排成 ::: 组件语法</p>
          <p className="ai-layout-empty-hint">
            可重组结构、轻微润色；不编造事实、不缺省要点。生成后先预览再应用，可一键撤销。
          </p>
          <div className="ai-layout-empty-actions">
            <button
              className="ai-layout-refresh-btn ai-layout-refresh-btn-primary"
              onClick={onGenerate}
            >
              <Sparkles size={14} />
              生成排版
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="ai-layout-summary">
            <p>
              AI
              已根据当前主题组件手册重排整篇文章。点击「预览效果」在右侧预览框查看，
              满意后「应用到文章」。
            </p>
            {validation?.truncated && (
              <p className="ai-layout-warn">
                <TriangleAlert size={13} /> 输出可能被截断，预览确认后再应用。
              </p>
            )}
            {validation && validation.invalid.length > 0 && (
              <p className="ai-layout-warn">
                <TriangleAlert size={13} /> 已剔除 AI 误用的组件：
                {validation.invalid.join("、")}
              </p>
            )}
          </div>

          <div className="ai-layout-footer">
            <div className="ai-layout-footer-buttons">
              <button
                className="ai-layout-footer-btn ai-layout-footer-regenerate"
                onClick={onGenerate}
                disabled={loading}
              >
                <RefreshCw size={14} />
                重新生成
              </button>
            </div>
            <div className="ai-layout-footer-buttons">
              <button
                className={`ai-layout-footer-btn ${isPreviewing ? "ai-layout-footer-preview-active" : "ai-layout-footer-preview"}`}
                onClick={() =>
                  isPreviewing ? onUndoPreview() : onPreviewAll()
                }
              >
                {isPreviewing ? (
                  <>
                    <EyeOff size={14} />
                    撤销预览
                  </>
                ) : (
                  <>
                    <Eye size={14} />
                    预览效果
                  </>
                )}
              </button>
              <button
                className="ai-layout-footer-btn ai-layout-footer-apply"
                onClick={onApplyAll}
              >
                <Check size={14} />
                应用到文章
              </button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}

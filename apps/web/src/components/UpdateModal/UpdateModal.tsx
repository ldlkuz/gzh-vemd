import {
  X,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { resolveAppAssetPath } from "../../utils/assetPath";
import "./UpdateModal.css";

interface UpdateModalProps {
  latestVersion: string;
  currentVersion: string;
  releaseNotes?: string;
  /** 状态机：available=待下载 / downloading=下载中 / downloaded=可重启安装 / error=下载失败 */
  status: "available" | "downloading" | "downloaded" | "error";
  progress?: number;
  errorMessage?: string;
  onClose: () => void;
  /** 触发下载或重试（available / error 状态） */
  onDownload: () => void;
  /** 重启并安装（downloaded 状态） */
  onRestart: () => void;
  onSkipVersion: () => void;
}

export function UpdateModal({
  latestVersion,
  releaseNotes,
  status,
  progress = 0,
  errorMessage,
  onClose,
  onDownload,
  onRestart,
  onSkipVersion,
}: UpdateModalProps) {
  const [showNotes, setShowNotes] = useState(false);
  const iconSrc = resolveAppAssetPath("favicon-dark.svg");
  const downloading = status === "downloading";
  const downloaded = status === "downloaded";
  const isError = status === "error";

  // GitHub release body 可能是 HTML（自动生成 changelog）或 Markdown。
  // 先剥离 HTML：把 <p>/<br> 还原为换行、去掉所有标签、去掉美术编号，
  // 再套用原有 Markdown 规则，最终输出可读的纯文本更新日志。
  const formatReleaseNotes = (notes: string) => {
    return notes
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(?:p|li|h[1-6]|ul|ol)>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      // GitHub 自动生成的“完整变更日志”链接是噪音，直接去掉
      .replace(/^Full Changelog:\s*.*$/gim, "")
      .replace(/^完整变更日志:\s*.*$/gim, "")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/^### /gm, "◆ ")
      .replace(/^## /gm, "▸ ")
      .replace(/^# /gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/^- /gm, "• ")
      .replace(/\s+$/gm, "")
      .trim();
  };

  const title = downloaded
    ? "更新已就绪"
    : isError
      ? "下载失败"
      : downloading
        ? "正在下载更新"
        : "发现新版本";

  const versionText = downloaded
    ? "WeMD 已下载，点击重启即可安装"
    : isError
      ? `WeMD ${latestVersion} 下载失败`
      : downloading
        ? `WeMD ${latestVersion} 下载中 ${Math.round(progress)}%`
        : `WeMD ${latestVersion} 已发布`;

  return (
    <div className="update-modal-overlay" onClick={isError ? undefined : onClose}>
      <div className="update-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="update-modal-close"
          onClick={onClose}
          aria-label="关闭"
        >
          <X size={18} />
        </button>

        <div className="update-modal-icon">
          <img src={iconSrc} alt="WeMD" width={64} height={64} />
        </div>

        <h2 className="update-modal-title">{title}</h2>
        <p className="update-modal-version">{versionText}</p>

        {downloading && (
          <div className="update-modal-progress">
            <div className="update-modal-progress-bar">
              <div
                className="update-modal-progress-fill"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <span className="update-modal-progress-text">
              {Math.round(progress)}%
            </span>
          </div>
        )}

        {isError && errorMessage && (
          <div className="update-modal-error">
            <AlertCircle size={14} />
            <span>{errorMessage}</span>
          </div>
        )}

        {releaseNotes && !downloading && (
          <button
            className="update-modal-notes-toggle"
            onClick={() => setShowNotes(!showNotes)}
          >
            {showNotes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showNotes ? "收起更新日志" : "查看更新日志"}
          </button>
        )}

        {showNotes && releaseNotes && (
          <div className="update-modal-notes">
            <pre>{formatReleaseNotes(releaseNotes)}</pre>
          </div>
        )}

        <div className="update-modal-actions">
          {!downloaded && !downloading && (
            <button className="update-modal-btn secondary" onClick={onClose}>
              稍后提醒
            </button>
          )}
          {downloading ? (
            <button className="update-modal-btn primary" disabled>
              <Download size={16} />
              下载中...
            </button>
          ) : downloaded ? (
            <button className="update-modal-btn primary" onClick={onRestart}>
              <Download size={16} />
              重启并安装
            </button>
          ) : (
            <button className="update-modal-btn primary" onClick={onDownload}>
              {isError ? <RefreshCw size={16} /> : <Download size={16} />}
              {isError ? "重试下载" : "前往下载"}
            </button>
          )}
        </div>

        {!downloaded && !downloading && (
          <button className="update-modal-skip" onClick={onSkipVersion}>
            {isError ? "暂时跳过" : "跳过此版本"}
          </button>
        )}
      </div>
    </div>
  );
}
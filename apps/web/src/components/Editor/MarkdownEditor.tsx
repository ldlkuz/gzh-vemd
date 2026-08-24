import { useEffect, useMemo, useRef, useState } from "react";
import { EditorView, minimalSetup } from "codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";
import { githubLight } from "@uiw/codemirror-theme-github";
import { RefreshCw, PanelLeft, PanelLeftClose } from "lucide-react";
import {
  wechatMarkdownHighlighting,
  wechatMarkdownHighlightingDark,
} from "./markdownTheme";
import { underlineExtension } from "./markdownUnderline";
import { useUITheme } from "../../hooks/useUITheme";
import { useEditorStore } from "../../store/editorStore";
import { useThemeStore } from "../../store/themeStore";
import { getBuiltInThemeDefinition } from "@wemd/core";
import { countWords, countLines } from "../../utils/wordCount";
import { Toolbar } from "./Toolbar";
import { SearchPanel } from "./SearchPanel";
import { SaveIndicator } from "./SaveIndicator";
import { openAiSettings, isAiConfigured } from "../../services/ai/aiConfig";
import { convertTextToMarkdown } from "../../services/ai/markdownPipeline";
import { AiLayoutPanel } from "./AiLayoutPanel";
import {
  analyzeArticle,
  type Insertion,
} from "../../services/ai/analysisAgent";
import { applyInsertions } from "../../services/ai/applyInsertions";
import toast from "react-hot-toast";
import "./MarkdownEditor.css";
import { customKeymap } from "./editorShortcuts";
import { paragraphSelectionStyle } from "./mouseSelectionStyle";
import { markdownComponentFade } from "./markdownComponentFade";
import {
  WECHAT_IMAGE_MAX_SIZE_BYTES,
  formatImageSize,
} from "../../services/image/autoCompressImage";
import { uploadEditorImage } from "../../services/image/imageUploadFlow";
import {
  subscribeScrollIntent,
  type ScrollSyncAdapter,
} from "../Workspace/editorPreviewScrollSync";
import { WECHAT_TITLE_MAX_LENGTH } from "../../utils/publishMeta";

interface MarkdownEditorProps {
  onScrollSyncReady?: (adapter: ScrollSyncAdapter | null) => void;
  showHistory?: boolean;
  onToggleHistory?: () => void;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export function MarkdownEditor({
  onScrollSyncReady,
  showHistory,
  onToggleHistory,
}: MarkdownEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const authorFieldRef = useRef<HTMLDivElement>(null);
  const {
    markdown: content,
    setMarkdown,
    publishTitle,
    publishAuthor,
    recentAuthors,
    usePublishTitle,
    usePublishAuthor,
    setPublishTitle,
    setPublishAuthor,
    selectRecentAuthor,
    setUsePublishTitle,
    setUsePublishAuthor,
    applyHeadingTitle,
  } = useEditorStore();
  const uiTheme = useUITheme((state) => state.theme);
  const [showSearch, setShowSearch] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAuthorSuggestions, setShowAuthorSuggestions] = useState(false);
  // AI 排版（插入式）状态
  const [showAiLayout, setShowAiLayout] = useState(false);
  const [aiLayoutLoading, setAiLayoutLoading] = useState(false);
  const [aiInsertions, setAiInsertions] = useState<Insertion[]>([]);
  const [aiArticleType, setAiArticleType] = useState<string | undefined>();
  const [aiTypeReason, setAiTypeReason] = useState<string | undefined>();
  const [aiLayoutPreviewing, setAiLayoutPreviewing] = useState(false);
  // 预览撤销：记录插入预览前的原文
  const aiLayoutOriginalRef = useRef<string | null>(null);
  // store 同步防抖：编辑器输入即时，但通过防抖批量写 store，避免每次按键
  // 都触发全局 markdown 更新 → 预览整体重渲，大幅降低大文档输入卡顿。
  const markdownSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const markdownSyncRef = useRef<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        authorFieldRef.current &&
        !authorFieldRef.current.contains(event.target as Node)
      ) {
        setShowAuthorSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;

    const currentContent = viewRef.current
      ? viewRef.current.state.doc.toString()
      : content;

    const startState = EditorState.create({
      doc: currentContent,
      extensions: [
        minimalSetup,
        customKeymap,
        markdown({ base: markdownLanguage, extensions: [underlineExtension] }),
        uiTheme === "dark"
          ? wechatMarkdownHighlightingDark
          : wechatMarkdownHighlighting,
        githubLight,
        EditorView.lineWrapping,
        markdownComponentFade(),
        paragraphSelectionStyle,
        EditorView.domEventHandlers({
          paste: (event, view) => {
            const items = event.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
              if (item.type.startsWith("image/")) {
                event.preventDefault();
                const file = item.getAsFile();
                if (!file) continue;

                const needAutoCompress =
                  file.size > WECHAT_IMAGE_MAX_SIZE_BYTES;

                // 使用统一流程自动压缩并上传
                const uploadPromise = (async () => {
                  const result = await uploadEditorImage(file, {
                    compressionOptions: {
                      maxSizeBytes: WECHAT_IMAGE_MAX_SIZE_BYTES,
                    },
                  });
                  return result;
                })();

                const loadingToken = `wemd-upload-${Date.now()}-${Math.random()
                  .toString(36)
                  .slice(2, 8)}`;
                const loadingText = `![上传中... ${file.name}](${loadingToken})`;
                const range = view.state.selection.main;
                view.dispatch({
                  changes: {
                    from: range.from,
                    to: range.to,
                    insert: loadingText,
                  },
                });

                toast.promise(uploadPromise, {
                  loading: needAutoCompress
                    ? "正在压缩并上传图片..."
                    : "正在上传图片...",
                  success: (result) => {
                    const imageText = `![](${result.url})`;
                    const currentDoc = view.state.doc.toString();
                    const index = currentDoc.indexOf(loadingText);

                    if (index !== -1) {
                      view.dispatch({
                        changes: {
                          from: index,
                          to: index + loadingText.length,
                          insert: imageText,
                        },
                      });
                    }
                    return result.compressed
                      ? `图片上传成功（已自动压缩 ${formatImageSize(
                          result.originalSize,
                        )} -> ${formatImageSize(result.finalSize)}）`
                      : "图片上传成功";
                  },
                  error: (err) => {
                    const currentDoc = view.state.doc.toString();
                    const index = currentDoc.indexOf(loadingText);
                    if (index !== -1) {
                      view.dispatch({
                        changes: {
                          from: index,
                          to: index + loadingText.length,
                          insert: "",
                        },
                      });
                    }
                    return `上传失败: ${err.message}`;
                  },
                });
              }
            }
          },
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newContent = update.state.doc.toString();
            // 防抖写 store：编辑器始终拥有最新真实内容，仅把 store 同步降频，
            // 缓解大文档输入时预览/订阅者每次都全量重渲导致的卡顿。
            markdownSyncRef.current = newContent;
            if (markdownSyncTimerRef.current) {
              clearTimeout(markdownSyncTimerRef.current);
            }
            markdownSyncTimerRef.current = setTimeout(() => {
              const value = markdownSyncRef.current;
              if (value != null) setMarkdown(value);
            }, 120);
          }
        }),
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "15px",
          },
          ".cm-scroller": {
            fontFamily:
              "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace",
            lineHeight: "1.6",
          },
          ".cm-content": {
            padding: "16px",
          },
          ".cm-gutters": {
            backgroundColor: "#f8f9fa",
            border: "none",
          },
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    const scrollDOM = view.scrollDOM;
    let scrollSubscriber: () => void = () => undefined;
    const getPosition = () => {
      const max = scrollDOM.scrollHeight - scrollDOM.clientHeight;
      const ratio = max > 0 ? scrollDOM.scrollTop / max : 0;
      const block = view.lineBlockAtHeight(scrollDOM.scrollTop);
      const line = view.state.doc.lineAt(block.from).number - 1;
      const progress =
        block.height > 0
          ? clamp((scrollDOM.scrollTop - block.top) / block.height, 0, 1)
          : 0;
      return { sourceLine: line + progress, ratio };
    };

    const scrollToPosition: ScrollSyncAdapter["scrollToPosition"] = (
      position,
    ) => {
      const max = scrollDOM.scrollHeight - scrollDOM.clientHeight;
      if (max <= 0) return;
      let target: number;
      if (position.ratio >= 0.999 || position.sourceLine === null) {
        target = clamp(position.ratio, 0, 1) * max;
      } else {
        const sourceLine = clamp(
          position.sourceLine,
          0,
          Math.max(0, view.state.doc.lines - 1),
        );
        const lineNumber = Math.floor(sourceLine) + 1;
        const block = view.lineBlockAt(view.state.doc.line(lineNumber).from);
        target = clamp(block.top + (sourceLine % 1) * block.height, 0, max);
      }
      // 跟随：平滑滚动到目标位置，避免瞬跳的机械感。由外部 rAF 节流控制频率，
      // 滚动跟手的同时保留过渡，停止时不至于突然一跳到头。
      scrollDOM.scrollTo({ top: target, behavior: "smooth" });
    };

    const handleEditorScroll = () => scrollSubscriber();
    scrollDOM.addEventListener("scroll", handleEditorScroll, { passive: true });
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
        subscribeScrollIntent(scrollDOM, listener),
    });

    viewRef.current = view;

    return () => {
      // 卸载前 flush 未同步的防抖内容，避免最后一次输入丢失
      if (markdownSyncTimerRef.current) {
        clearTimeout(markdownSyncTimerRef.current);
        const value = markdownSyncRef.current;
        if (value != null) setMarkdown(value);
      }
      scrollDOM.removeEventListener("scroll", handleEditorScroll);
      onScrollSyncReady?.(null);
      view.destroy();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMarkdown, uiTheme, onScrollSyncReady]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentDoc = view.state.doc.toString();
    if (currentDoc === content) return;
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: content },
    });
  }, [content]);

  const wordCount = countWords(content);
  const lineCount = countLines(content);

  const handleInsert = (
    prefix: string,
    suffix: string,
    placeholder: string,
    opts?: { selectFirstLine?: boolean },
  ) => {
    const view = viewRef.current;
    if (!view) return;

    const selection = view.state.selection.main;
    const selectedText = view.state.doc.sliceString(
      selection.from,
      selection.to,
    );
    const textToInsert = selectedText || placeholder;
    const fullText = prefix + textToInsert + suffix;

    let anchor = selection.from + prefix.length;
    let head = anchor + textToInsert.length;
    // 组件插入：自动选中首个占位符（插入正文的第一行），用户可直接打字覆盖
    if (opts?.selectFirstLine) {
      const firstLineEnd = textToInsert.indexOf("\n");
      head = firstLineEnd === -1 ? head : anchor + firstLineEnd;
    }

    view.dispatch({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: fullText,
      },
      selection: {
        anchor,
        head,
      },
    });

    view.focus();
  };

  const handleOpenAi = async () => {
    if (aiLoading) return;
    const view = viewRef.current;
    if (!view) return;

    // 未配置则提示并打开设置
    if (!isAiConfigured()) {
      toast.error("请先在 AI 设置中完成服务配置");
      openAiSettings();
      return;
    }

    const sel = view.state.selection.main;
    const selected = view.state.doc.sliceString(sel.from, sel.to).trim();
    const isSelection = selected.length > 0;
    const inputText = isSelection ? selected : view.state.doc.toString();
    const mode: "selection" | "full" = isSelection ? "selection" : "full";

    if (!inputText.trim()) {
      toast.error("编辑器没有内容可转换");
      return;
    }

    setAiLoading(true);
    const toastId = toast.loading(
      mode === "selection" ? "AI 正在转换选区..." : "AI 正在转换整篇...",
    );
    try {
      const markdown = await convertTextToMarkdown({ text: inputText, mode });
      if (isSelection) {
        view.dispatch({
          changes: { from: sel.from, to: sel.to, insert: markdown },
          selection: { anchor: sel.from, head: sel.from + markdown.length },
        });
      } else {
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: markdown },
        });
        setMarkdown(markdown);
      }
      toast.success(
        mode === "selection"
          ? "选区已转换为 Markdown"
          : "整篇已转换为 Markdown",
        { id: toastId },
      );
      view.focus();
    } catch (e) {
      toast.error((e as Error).message || "AI 生成失败", { id: toastId });
    } finally {
      setAiLoading(false);
    }
  };

  // AI 排版（插入式）：打开面板，由用户在面板内勾选组件后生成
  const handleOpenAiDesign = () => {
    if (aiLayoutLoading) return;
    const view = viewRef.current;
    if (!view) return;

    if (!isAiConfigured()) {
      toast.error("请先在 AI 设置中完成服务配置");
      openAiSettings();
      return;
    }

    const text = view.state.doc.toString().trim();
    if (!text) {
      toast.error("编辑器没有内容可分析");
      return;
    }

    setShowAiLayout(true);
  };

  // 运行 AI 版式分析：在用户勾选的组件范围内生成
  const runAiLayoutAnalysis = async (selectedComponents?: string[]) => {
    const view = viewRef.current;
    if (!view) return;
    // 基于真原文分析（预览中时编辑器内容被替换，需回退）
    const source = aiLayoutOriginalRef.current ?? view.state.doc.toString();
    setAiLayoutLoading(true);
    try {
      // 获取当前主题的 layout 偏好，传递给 AI
      const themeId = useThemeStore.getState().themeId;
      const builtInDef = getBuiltInThemeDefinition(themeId);
      const customThemes = useThemeStore.getState().customThemes;
      const customTheme = customThemes.find((t) => t.id === themeId);
      // 优先使用导入主题自身的 layout，其次回退到内置主题
      const themeLayout = customTheme?.definition?.layout || builtInDef?.layout;
      const result = await analyzeArticle(
        source,
        undefined,
        undefined,
        themeLayout,
        selectedComponents,
      );
      setAiInsertions(result.insertions);
      setAiArticleType(result.articleType);
      setAiTypeReason(result.typeReason);
    } catch (e) {
      toast.error((e as Error).message || "AI 分析失败");
      setAiInsertions([]);
    } finally {
      setAiLayoutLoading(false);
    }
  };

  // 整体预览：应用全部建议到编辑器（基于真原文，可撤销）
  const handlePreviewAllLayout = () => {
    const view = viewRef.current;
    if (!view || aiInsertions.length === 0) return;
    if (aiLayoutOriginalRef.current === null) {
      aiLayoutOriginalRef.current = view.state.doc.toString();
    }
    const base = aiLayoutOriginalRef.current;
    const next = applyInsertions(base, aiInsertions);
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: next },
    });
    setMarkdown(next);
    setAiLayoutPreviewing(true);
  };

  // 撤销预览：恢复原文
  const handleUndoLayoutPreview = () => {
    const view = viewRef.current;
    if (!view || aiLayoutOriginalRef.current === null) return;
    const original = aiLayoutOriginalRef.current;
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: original },
    });
    setMarkdown(original);
    aiLayoutOriginalRef.current = null;
    setAiLayoutPreviewing(false);
  };

  // 一键应用全部建议
  const handleApplyAllLayout = () => {
    const view = viewRef.current;
    if (!view || aiInsertions.length === 0) return;
    const base = aiLayoutOriginalRef.current ?? view.state.doc.toString();
    const next = applyInsertions(base, aiInsertions);
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: next },
    });
    setMarkdown(next);
    aiLayoutOriginalRef.current = null;
    setAiLayoutPreviewing(false);
    setShowAiLayout(false);
    toast.success(`已应用 ${aiInsertions.length} 个组件`);
    view.focus();
  };

  const handleUseHeadingTitle = () => {
    const result = applyHeadingTitle();
    if (!result.title) {
      toast.error("正文里还没有可用的标题");
      return;
    }
    toast.success(
      result.truncated
        ? `已使用正文标题，已按 ${WECHAT_TITLE_MAX_LENGTH} 字截断`
        : "已使用正文标题",
    );
  };

  const titleLength = Array.from(publishTitle).length;
  const filteredRecentAuthors = useMemo(() => {
    const keyword = publishAuthor.trim().toLowerCase();
    if (!keyword) return recentAuthors;
    return recentAuthors.filter((author) =>
      author.toLowerCase().includes(keyword),
    );
  }, [publishAuthor, recentAuthors]);

  return (
    <div className="markdown-editor">
      <div className="editor-header">
        <button
          className="btn-icon-only sidebar-toggle"
          onClick={onToggleHistory}
          aria-label={showHistory ? "隐藏列表" : "显示列表"}
          title={showHistory ? "隐藏列表" : "显示列表"}
        >
          {showHistory ? (
            <PanelLeftClose size={18} strokeWidth={2} />
          ) : (
            <PanelLeft size={18} strokeWidth={2} />
          )}
        </button>
        <span className="editor-title">Markdown 编辑器</span>
      </div>
      <Toolbar
        onInsert={handleInsert}
        onOpenAi={handleOpenAi}
        aiLoading={aiLoading}
        onOpenAiDesign={handleOpenAiDesign}
        aiDesignLoading={aiLayoutLoading}
      />
      <div className="editor-meta-bar">
        <div className="editor-meta-field editor-meta-field-title">
          <label
            className="editor-meta-toggle"
            htmlFor="editor-use-publish-title"
          >
            <input
              id="editor-use-publish-title"
              type="checkbox"
              checked={usePublishTitle}
              onChange={(e) => setUsePublishTitle(e.target.checked)}
              aria-label="使用标题"
              title="使用标题"
            />
          </label>
          <div className="editor-meta-input-wrap">
            <input
              id="editor-publish-title"
              className="editor-meta-input"
              type="text"
              placeholder={
                usePublishTitle
                  ? "公众号标题，留空时插件会优先取正文 H1"
                  : "未启用标题同步"
              }
              maxLength={WECHAT_TITLE_MAX_LENGTH}
              value={publishTitle}
              onChange={(e) => setPublishTitle(e.target.value)}
              disabled={!usePublishTitle}
            />
            <button
              type="button"
              className="editor-meta-icon-button"
              onClick={handleUseHeadingTitle}
              disabled={!usePublishTitle}
              aria-label="使用正文标题"
              title="使用正文标题"
            >
              <RefreshCw size={14} strokeWidth={2} />
            </button>
            <span className="editor-meta-counter">
              {titleLength}/{WECHAT_TITLE_MAX_LENGTH}
            </span>
          </div>
        </div>
        <div
          ref={authorFieldRef}
          className="editor-meta-field editor-meta-field-author"
        >
          <label
            className="editor-meta-toggle"
            htmlFor="editor-use-publish-author"
          >
            <input
              id="editor-use-publish-author"
              type="checkbox"
              checked={usePublishAuthor}
              onChange={(e) => setUsePublishAuthor(e.target.checked)}
              aria-label="使用作者"
              title="使用作者"
            />
          </label>
          <input
            id="editor-publish-author"
            className="editor-meta-input"
            type="text"
            placeholder={usePublishAuthor ? "作者名称" : "未启用作者同步"}
            title={
              usePublishAuthor
                ? "作者名称，复制 HTML 后插件会优先填这个值"
                : "未启用作者同步"
            }
            value={publishAuthor}
            onFocus={() => setShowAuthorSuggestions(usePublishAuthor)}
            onChange={(e) => {
              setPublishAuthor(e.target.value);
              setShowAuthorSuggestions(usePublishAuthor);
            }}
            disabled={!usePublishAuthor}
          />
          {usePublishAuthor && showAuthorSuggestions && (
            <div className="editor-meta-suggestions" role="listbox">
              {filteredRecentAuthors.length > 0 ? (
                filteredRecentAuthors.map((author) => (
                  <button
                    key={author}
                    type="button"
                    className="editor-meta-suggestion"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      selectRecentAuthor(author);
                      setShowAuthorSuggestions(false);
                    }}
                  >
                    {author}
                  </button>
                ))
              ) : (
                <div className="editor-meta-suggestion-empty">
                  暂无最近作者，复制成功后会出现在这里
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showSearch && viewRef.current && (
        <SearchPanel
          view={viewRef.current}
          onClose={() => setShowSearch(false)}
        />
      )}
      <div className="editor-body-wrapper">
        <div ref={editorRef} className="editor-container" />
      </div>
      <div className="editor-footer">
        <div className="editor-stats">
          <span className="editor-stat">行数: {lineCount}</span>
          <span className="editor-stat">字数: {wordCount}</span>
        </div>
        <SaveIndicator />
      </div>
      <AiLayoutPanel
        open={showAiLayout}
        loading={aiLayoutLoading}
        insertions={aiInsertions}
        onClose={() => setShowAiLayout(false)}
        onGenerate={runAiLayoutAnalysis}
        onPreviewAll={handlePreviewAllLayout}
        onUndoPreview={handleUndoLayoutPreview}
        onApplyAll={handleApplyAllLayout}
        isPreviewing={aiLayoutPreviewing}
        articleType={aiArticleType}
        typeReason={aiTypeReason}
      />
    </div>
  );
}

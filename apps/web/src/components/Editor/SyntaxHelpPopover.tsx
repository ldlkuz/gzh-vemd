import { useRef, useState, useEffect } from "react";
import { HelpCircle, BookOpen, Copy, Check, ArrowUpRight } from "lucide-react";
import "./SyntaxHelpPopover.css";

// 行内语法速查
const syntaxItems = [
  { syntax: "**文字**", desc: "粗体" },
  { syntax: "*文字*", desc: "斜体" },
  { syntax: "++文字++", desc: "下划线" },
  { syntax: "~~文字~~", desc: "删除线" },
  { syntax: "==文字==", desc: "高亮" },
  { syntax: "$公式$", desc: "行内公式" },
  { syntax: "`代码`", desc: "行内代码" },
  { syntax: "H~2~O", desc: "下标" },
  { syntax: "X^2^", desc: "上标" },
  { syntax: "> [!NOTE]", desc: "提示块" },
  { syntax: "- [ ] 任务", desc: "任务列表" },
  { syntax: "{.class #id}", desc: "块级属性" },
  { syntax: "**文字**{.class}", desc: "行内/图片属性" },
];

// 基础层结构（原生 Markdown，由主题皮肤自动美化，不使用 :::）
const baseLayerItems = [
  {
    syntax: "| 列1 | 列2 |\n|---|---|\n| 值1 | 值2 |",
    desc: "表格 · 列宽自适应 + 皮肤",
  },
  {
    syntax: "**里程碑**\n- **2024-01** 立项\n- **2024-03** 上线",
    desc: "时间线",
  },
  {
    syntax: "**产品图集**\n- ![](url1)\n- ![](url2)",
    desc: "图片网格",
  },
  {
    syntax: "**关键指标**\n- 团队规模 **15人**\n- 日均浪费 **2.5h**",
    desc: "数据块 · 键 + 加粗数值",
  },
  {
    syntax: "**示例** `js`\n```js\nconst a = 1\n```",
    desc: "代码块 · 可带标题/语言标签",
  },
];

// 组件语法速查（仅杂志层，能自动生成的视觉组件）
const componentItems = [
  {
    syntax: '::: quote-card{author="作者"}\n金句内容\n:::',
    desc: "金句卡片",
  },
  { syntax: "::: divider-fancy\n:::", desc: "装饰分割线" },
  { syntax: "::: cta-card\n引导文案\n:::", desc: "关注引导卡片" },
  {
    syntax: '::: callout-pro{type="info"}\n**标题**\n正文\n:::',
    desc: "强化提示框 info/success/warning/danger/tip",
  },
  {
    syntax: "::: author-card\n![](头像)\n**姓名** *角色*\n简介\n:::",
    desc: "作者卡片",
  },
  {
    syntax: '::: faq{title="常见问题"}\n**问题一**\n回答内容\n:::',
    desc: "FAQ 问答卡片",
  },
];

interface Section {
  key: string;
  no: string;
  eyebrow: string;
  title: string;
  hint: string;
  items: { syntax: string; desc: string }[];
}

const sections: Section[] = [
  {
    key: "inline",
    no: "01",
    eyebrow: "Inline",
    title: "行内与公式",
    hint: "用于段落中单点加粗、公式、代码",
    items: syntaxItems,
  },
  {
    key: "base",
    no: "02",
    eyebrow: "Native",
    title: "基础层结构",
    hint: "原生 Markdown，靠主题皮肤自动美化",
    items: baseLayerItems,
  },
  {
    key: "component",
    no: "03",
    eyebrow: "Component",
    title: "公众号组件",
    hint: "::: 标记生成的视觉化组件，插入即可用",
    items: componentItems,
  },
];

export function SyntaxHelpPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Esc 关闭
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  // 关闭时清除复制状态与定时器
  useEffect(() => {
    if (!isOpen && copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = null;
      setCopiedKey(null);
    }
  }, [isOpen]);

  const copySyntax = async (sectionKey: string, index: number, text: string) => {
    const key = `${sectionKey}-${index}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopiedKey(null), 1600);
    } catch {
      // 剪贴板受限时静默失败，保持可用
    }
  };

  const openDocs = () => {
    window.open(
      "https://wemd.app/docs/reference/markdown-syntax",
      "_blank",
      "noopener,noreferrer",
    );
    setIsOpen(false);
  };

  return (
    <div className="md-toolbar-dropdown-container" ref={containerRef}>
      <button
        className={`md-toolbar-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="语法帮助"
        data-tooltip="语法帮助"
      >
        <HelpCircle size={16} />
      </button>

      {isOpen && (
        <div className="syn-help" ref={popoverRef}>
          {/* 卡头：英文字幕 + 中文主标题 */}
          <header className="syn-help__hero">
            <span className="syn-help__eyebrow">MARKDOWN SNIPPETS</span>
            <h2 className="syn-help__title">语法速查</h2>
            <p className="syn-help__sub">点击任意语法即可复制到文章</p>
          </header>

          <div className="syn-help__body">
            {sections.map((section) => (
              <section className="syn-help__group" key={section.key}>
                <div className="syn-help__group-head">
                  <span className="syn-help__group-no">{section.no}</span>
                  <div className="syn-help__group-titles">
                    <span className="syn-help__group-eyebrow">
                      {section.eyebrow}
                    </span>
                    <h3 className="syn-help__group-title">{section.title}</h3>
                  </div>
                  <span className="syn-help__group-hint">{section.hint}</span>
                </div>

                <ul className="syn-help__list">
                  {section.items.map((item, index) => {
                    const key = `${section.key}-${index}`;
                    const isCopied = copiedKey === key;
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          className="syn-help__row"
                          onClick={() =>
                            copySyntax(section.key, index, item.syntax)
                          }
                          title="点击复制语法"
                        >
                          <code className="syn-help__code">
                            {item.syntax}
                          </code>
                          <span className="syn-help__desc">{item.desc}</span>
                          <span
                            className={`syn-help__copy ${
                              isCopied ? "is-copied" : ""
                            }`}
                          >
                            {isCopied ? (
                              <Check size={13} />
                            ) : (
                              <Copy size={13} />
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>

          <footer className="syn-help__footer">
            <button
              className="syn-help__docs"
              onClick={openDocs}
              aria-label="查看完整 Markdown 语法文档"
            >
              <BookOpen size={14} className="syn-help__docs-icon" />
              <span>查看完整文档</span>
              <ArrowUpRight size={14} className="syn-help__docs-arrow" />
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}
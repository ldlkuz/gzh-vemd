/**
 * 基础重置样式
 *
 * 所有主题共享的底层样式重置，定义 HTML 元素的基础行为。
 * 微信兼容：不使用 background-color on #wemd。
 */
export function renderBaseCss(): string {
  return `/* === 基础重置（所有主题共享） === */

#wemd {
  padding: 0 8px;
  word-spacing: 0px;
  word-break: break-word;
  word-wrap: break-word;
  text-align: left;
}

/* 段落 */
#wemd p {
  margin: 0;
}

/* 标题基础 */
#wemd h1, #wemd h2, #wemd h3, #wemd h4, #wemd h5, #wemd h6 {
  padding: 0;
  font-weight: bold;
}
#wemd h5 { font-size: 16px; }
#wemd h6 { font-size: 16px; }

#wemd h1 .prefix, #wemd h2 .prefix, #wemd h3 .prefix,
#wemd h4 .prefix, #wemd h5 .prefix, #wemd h6 .prefix,
#wemd h1 .suffix, #wemd h2 .suffix, #wemd h3 .suffix,
#wemd h4 .suffix, #wemd h5 .suffix, #wemd h6 .suffix {
  display: none;
}

/* 列表 */
#wemd ul, #wemd ol {
  margin-top: 8px;
  margin-bottom: 8px;
  padding-left: 25px;
}
#wemd ul { list-style-type: disc; }
#wemd ul ul { list-style-type: square; }
#wemd ol { list-style-type: decimal; }

/* 列表项内容 */
#wemd li section {
  margin-top: 5px;
  margin-bottom: 5px;
  line-height: 26px;
  text-align: left;
  color: #010101;
  font-weight: 500;
}

/* 引用基础 */
#wemd blockquote { border: none; }

/* 嵌套引用 */
#wemd .multiquote-1 {
  display: block;
  font-size: 0.9em;
  /* 纯文本引用块无需滚动。用 hidden 而非 auto：auto 在单行引用时
     因 padding-right 产生亚像素纵向溢出，会误触发一条右侧滚动条。 */
  overflow: hidden;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 10px;
  margin-bottom: 20px;
  margin-top: 20px;
}
#wemd .multiquote-1 p { margin: 0; line-height: 26px; }

#wemd .multiquote-2, #wemd .multiquote-3 {
  padding: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
}
#wemd .multiquote-3 p, #wemd .multiquote-3 h3 { text-align: center; }

/* 目录链接 */
#wemd .table-of-contents a {
  border: none;
  font-weight: normal;
}

/* 代码块 */
#wemd pre {
  margin-top: 10px;
  margin-bottom: 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
#wemd pre.custom {
  padding: 0;
  border-radius: 6px;
  overflow: hidden;
  overflow-x: auto;
}
#wemd pre code {
  display: block;
  font-family: Operator Mono, Consolas, Monaco, Menlo, monospace;
  border-radius: 0;
  font-size: 12px;
  white-space: pre;
  min-width: max-content;
  -webkit-overflow-scrolling: touch;
}
#wemd pre code span { line-height: 26px; }

/* 图片 */
#wemd img { display: block; margin: 0 auto; max-width: 100%; }
#wemd figure { margin: 0; margin-top: 10px; margin-bottom: 10px; }
#wemd figure { display: flex; flex-direction: column; justify-content: center; align-items: center; }
#wemd figure a { border: none; display: flex; justify-content: center; align-items: center; }
#wemd figure a img { margin: 0; }

/* 表格容器 */
#wemd .table-container { overflow-x: auto; }
#wemd table { display: table; text-align: left; }
#wemd tbody { border: 0; }
#wemd table tr { border: 0; border-top: 1px solid #ccc; background-color: #fff; }
#wemd table tr th, #wemd table tr td {
  font-size: 16px;
  padding: 5px 10px;
  text-align: left;
}
#wemd table tr th { font-weight: bold; }
#wemd table tr th:nth-of-type(n), #wemd table tr td:nth-of-type(n) { min-width: 85px; }

/* 脚注 */
#wemd .footnote-item { display: flex; }
#wemd .footnote-num {
  display: inline;
  width: 10%;
  background: none;
  font-size: 80%;
  opacity: 0.6;
  line-height: 26px;
}
#wemd .footnote-item p {
  display: inline;
  font-size: 14px;
  width: 90%;
  padding: 0;
  margin: 0;
  line-height: 26px;
  word-break: break-all;
}
#wemd .footnotes-sep:before {
  content: "参考资料";
  display: block;
}

/* 公式 */
#wemd .block-equation {
  display: block;
  text-align: center;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
#wemd .block-equation > svg {
  max-width: 300% !important;
  -webkit-overflow-scrolling: touch;
}

/* Imageflow */
#wemd .imageflow-layer1 { margin-top: 1em; margin-bottom: 0.5em; border: 0; padding: 0; overflow: hidden; }
#wemd .imageflow-layer2 { white-space: nowrap; width: 100%; overflow-x: scroll; }
#wemd .imageflow-layer3 {
  display: inline-block; word-wrap: break-word; white-space: normal;
  vertical-align: top; width: 80%; margin-right: 10px; flex-shrink: 0;
}
#wemd .imageflow-img { display: block; width: 100%; height: auto; max-height: 300px; object-fit: contain; border-radius: 4px; }
#wemd .imageflow-caption { text-align: center; margin-top: 0; padding-top: 0; }

/* 图片链接嵌套 + 图注悬浮 */
#wemd figure a + figcaption {
  display: flex; justify-content: center; align-items: center;
  width: 100%; margin-top: -35px;
  background: rgba(0,0,0,0.7); color: #fff;
  line-height: 35px; z-index: 20;
}

/* 任务列表 */
#wemd .task-list-item { list-style: none; margin-left: -1.2em; margin-bottom: 6px; display: flex; gap: 0; align-items: flex-start; }
#wemd .task-list-item input[type='checkbox'] { margin-top: 4px; pointer-events: none; }

#wemd sub, sup { line-height: 0; }
#wemd .nice-suffix-juejin-container { margin-top: 20px !important; }
`;
}

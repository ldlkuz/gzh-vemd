# 主题改造方法论（Theme Craftsmanship Playbook）

> 依据「数据蓝天」「数据蓝图」两套主题的实际改造流程沉淀。
> 目的：给下一套主题提供一个可照做的流程、规则与陷阱清单，
> 避免重复踩坑（特异性覆盖失败、深底黑字、整篇底色、伪元素、竖条颜色脱离主题等）。

---

## 一、整体流程（五步走）

1. **定场景 → 出视觉稿（HTML）**
   - 先明确主题的应用场景（如数据周报 / 文艺书信 / 教程指南），据此选组件。
   - 直接产出独立 HTML 视觉稿（`docs/<id>-preview.html`），**以视觉设计为主**，不强约束骨架。
   - 视觉稿中所有装饰必须是真实 DOM / CSS 渐变 / 边框，**不写伪元素**（与微信约束一致）。
2. **定骨架（templates-<id>.ts）**
   - 只给「真正需要结构差异」的组件写骨架；其余组件复用内置默认骨架（defaultTemplates.ts）。
   - 骨架里新增的装饰用真实元素（如 `wemd-sd-badge` / `wemd-sb-glow`），不要伪元素。
3. **定皮肤（components-<id>.ts）**
   - 全局皮肤（`#wemd`）+ 组件级差异化，覆盖共享组件样式。
   - 在 `theme-renderer/index.ts` 的 `BUILTIN_THEME_COMPONENT_STYLES` 注册。
4. **注册主题（builtin-themes/index.ts）**
   - 新增 `theme<Id>`：meta / tokens / layout / `templates: <id>Templates` / codeTheme。
   - 加入 `builtInThemeDefinitions` 数组。
5. **验证 + 回归测试**
   - 用真实渲染管线（`renderTheme` + `processHtml`）断言组件样式落到 DOM 上。
   - 在 `defaultThemeDomMatch.test.ts` 追加主题专属测试块。

---

## 二、规则与检查点

> 本套主题改造沉淀的条目分两类：
>
> - **硬约束（必须遵守）**：技术/微信层面的硬性限制，违反会坏（特异性、无伪元素、
>   不设整篇背景、两链路一致）。
> - **检查点（设计自由，仅验收时核查）**：配色、装饰色等属于组件/主题的设计决策，
>   方法论不规定做法，只要求验收时检查可读性与一致性。

### 1. 皮肤覆盖共享组件时，选择器必须「同路径 · 同特异性」（硬约束）

- 共享规则常写 `#wemd .wemd-magazine-cover .wemd-mc-title`（1 ID + 2 class，特异性 0,1,2,0）。
- 主题皮肤若写 `#wemd .wemd-mc-title`（0,1,1,0），**特异性更低** → 内联导出时被共享覆盖，皮肤不生效。
- ✅ 正确：写完整路径 `#wemd .wemd-magazine-cover .wemd-mc-title`（同特异性、源码在后 → 覆盖）。
- ⚠️ 排查信号：改了皮肤但导出样式没变化，先查选择器是否少写了一层容器 class。

### 2. 底色 / 深色配色的检查点（颜色冲撞）（检查点）

- 是否用整块底色、用浅底还是深底、深底上配什么字色，**都是组件 / 主题自己的设计决策**，
  不在此写死做法。
- 只需在验收时检查一个关注点：**前景与背景是否可读、颜色是否冲突**。
  - 若某元素用了深色背景，确认其文字不是同色系深色（如深蓝底配深墨字不可读）。
  - 若某元素用了浅色 / 白色背景，确认文字不是浅色。
- 典型风险：正文承载类用 `var(--wemd-bg-card)` 整块底色（当 token 把 bgCard 设为深色时
  会深底深字）；深色强调卡沿用共享 `var(--wemd-text-normal)` 深色字。
  **是去底色、还是强制浅字、还是保留深底，由组件设计决定**，方法论只提示检查。

### 3. #wemd 不设整篇背景（硬约束）

- 项目约束：`#wemd` 不写 `background-color` / 整篇背景图（微信编辑器会设底色）。
- 背景交给公众号编辑器，结构靠组件边框线表达。
- ⚠️ 排查信号：整篇蓝底 / 浅色底 → 检查 `#wemd` 的 `background-image` / `background-color`。

### 4. 装饰一律真实 DOM，无伪元素（硬约束）

- 皮肤 / 骨架里**不要写 `::before` / `::after`** 做装饰。
- 结构伪类（`:nth-child` / `:first-child` / `:last-child` / `:not()`）同样禁用。
- 需要装饰（竖条、光边、序号、图标）时：**在骨架里放真实 `<span>`**
  （如 `wemd-sb-glow`、`wemd-sd-badge`）。
- 共享默认组件里已有 `::before` 装饰（如 callout 竖条、图标）是**既有机制**：
  导出时由物化器 `pseudoElementInline` 自动转成真实 `<span class="wemd-mat">`，
  **主题皮肤不需要、也不应该自己再写 `::before`** —— 重复定义会造成
  预览/导出不一致或双条叠加。

### 5. 装饰色是组件设计的一部分，是否跟随主题由组件决定（检查点）

- 组件装饰色（如 callout 竖条用 type 语义色 info/success/warning/danger/tip，
  或跟随主题主色 `var(--wemd-primary)`）**属于组件自身设计**，不在此一刀切。
- 选「跟随主题」还是「固定语义色」，取决于组件想表达什么：
  - 想保持语义一致、跨主题可辨识 → 固定语义色（如警示红 / 成功绿）。
  - 想融入主题 → 用 `var(--wemd-primary)` 或主题 token。
- 方法论只要求：**预览与导出两条链路表现一致**，且颜色不与背景冲突（见第 2 条）。

### 6. 注意「预览」与「导出」两条链路的差异（硬约束）

- **预览**走浏览器 CSS 级联（`<style>` + 特异性），**导出**走内联（`inlineAllStylesManually`
  按特异性排序）+ 伪元素物化（`pseudoElementInline`）。
- 同一问题可能在预览正常、导出异常（或反之）。验证时**两条链路都要测**：
  - 预览：浏览器直接看。
  - 导出：`processHtml(html, css, true, true)` 断言内联结果。
- 典型例子：callout 竖条 —— 预览靠 `[data-type]::before` 级联，
  导出靠物化器。只修一条链路会「预览正常导出紫 / 导出正常预览紫」。

### 7. 明确哪些组件「保持默认」（硬约束）

- 不是每个组件都要定制。明确清单（如 code-frame 保持默认骨架 + 默认皮肤），
  皮肤里**不要**覆盖它，避免引入意外样式。
- 测试里加一条「未定制组件无主题污染」断言（如 `not.toContain("wemd-db-")`）。

### 8. 主题级扩展槽（slotDefs）—— 让骨架消费共享槽位之外的额外内容（硬约束）

- **背景**：共享 `slotDefs.ts` 决定了组件能"看到"什么内容（骨架里 `{{slot:key}}`
  只能取到共享解析产出的槽）。主题想要额外内容（封面图、作者、日期、编号拆分）时，
  改全局 slotDefs 会影响所有主题。
- **机制**：`ThemeDefinition` 新增可选 `slotDefs?: Record<组件id, ComponentSlotDef[]>`。
  解析时 `mergeSlotOverrides` 合并：**扩展槽排在共享槽之前解析**（否则会被 desc/body
  的 paragraph/many 先吞掉内容），**key 冲突以主题扩展为准**。
- **渲染链**：`getThemeSlotDefs(theme)` → `createMarkdownParser({ getSlotDefs })`
  → `markdown-it-component` → `parseComponentSlots(…, slotOverrides)`。
  所有预览/导出调用点都要注入（`wechatPublishHtml` / `MarkdownPreview` /
  `DebugPreviewPanel` / `ThemeLivePreview`）。
- **降级不丢内容**：其他主题不声明扩展槽时，对应内容掉进共享 desc/body 兜底，
  以正文渲染，不报错不丢数据。
- **样例**：无声发布给 `magazine-cover` 加 `image` 槽（带图封面）、给
  `numbered-heading`/`section-title` 加 `part`+覆盖 `body`（编号拆分）。
  扩展槽写在独立文件 `themes/slotDefs-<id>.ts`。

### 9. 编号拆分（source:"number-prefix"）—— 行首编号单独着色（检查点）

- 共享 `slotParsers.ts` 新增 `number-prefix` source：从 h2 行首提取编号（如
  `## 01 引言` → `01`），**剥离 `##` 标记**并把剩余文本替换回原行供
  `body(paragraph)` 渲染；不标记 consumed（避免 `takeParagraphs` 因行已消费而跳过）。
- 骨架：`{{#if part}}<span class="wemd-…-num">{{slot:part}}</span>{{/if}}`
  - `<span class="wemd-…-body">{{slot:body}}</span>`，编号单独着色。
- 无编号标题自动降级：`part` 为空 → 只渲染 body。
- 只有声明该 source 的扩展槽才生效，共享行为不变。

### 10. SVG / base64 装饰素材（检查点）

- **背景**：项目默认"装饰优先 CSS 代码表达"。**绝大多数视觉（波形、引号、图标、
  环形、纹理）都能用 CSS 渐变 / 边框 / conic-gradient 表达，优先用 CSS**；
  仅当图形复杂度确实超出 CSS 表达力时，才引入 SVG / base64 素材（需接受微信兼容不确定性）。
- **合法用法（微信兼容优先）**：
  - `background-image: url("data:image/svg+xml;base64,...")` / `url("data:image/png;base64,...")`
    —— 皮肤里引用（**必须 base64 或完整百分号编码**，内联导出才不会被 `;` 截断），
    base64/SVG 渲染验证见 silentKeynoteBase64Svg.test.ts
  - 真实 `<svg>` 元素 —— 编辑器预览正常，公众号渲染**不确定**，用于预览链路；
    SVG 颜色**直接写 SVG 属性**（`stroke="#xxx"` / `fill="#xxx"`），CSS 的
    `stroke`/`fill`/`color` 内联导出不生效
- **约束**：
  - SVG 不写脚本、不引外部资源、不嵌 `<image>` 位图伪装矢量（ThemeValidator 会查）
  - base64 图注意体积（单图 ≤ 2MB，总量 ≤ 15MB）
  - 装饰 SVG **不依赖数据驱动**（骨架是静态模板），数据本身用文字 / CSS 呈现
    （如 stats-block 的环形用 CSS `conic-gradient`，数值仍是文字）
- **经验**：数据主题的"数据可视化"不必上 SVG 图表，CSS（conic 环形 / 渐变柱 /
  边框时间线）已能覆盖大部分表达，且微信导出更稳（曾尝试 SVG 大面积主题后放弃）。

---

## 三、需要新建/修改的文件（清单）

| 文件                                                       | 作用                                                                             |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `packages/core/src/themes/templates-<id>.ts`               | 主题独立骨架（仅差异组件）                                                       |
| `packages/core/src/themes/slotDefs-<id>.ts`                | 主题级扩展槽（需额外内容时，如封面图 / 编号拆分）                                |
| `packages/core/src/themes/components-<id>.ts`              | 主题皮肤（全局 + 组件级）                                                        |
| `packages/core/src/theme-renderer/index.ts`                | `BUILTIN_THEME_COMPONENT_STYLES` 注册皮肤；`getThemeSlotDefs` 已由渲染链统一注入 |
| `packages/core/src/builtin-themes/index.ts`                | 新增 `theme<Id>` 定义（含 `slotDefs`）+ 加入数组                                 |
| `packages/core/src/__tests__/defaultThemeDomMatch.test.ts` | 追加主题专属回归测试块                                                           |

> 若骨架结构被多主题复用，可抽到 `themes/template-library.ts`（本次按需，未强制）。

---

## 四、回归测试要点（每套主题必须覆盖）

在 `defaultThemeDomMatch.test.ts` 追加：

1. **骨架装饰存在**：每个定制骨架组件的装饰元素（badge / glow / line / dot）出现。
2. **颜色冲撞 / 可读性**：对每个深色背景元素，断言其文字为浅色（不被共享 `var()`
   覆盖成同色系深色）；对浅色背景元素，断言文字非浅色。**具体配色由组件设计决定，测试只锁可读性**。
3. **未定制组件保持默认**：如 code-frame 用默认骨架、无主题污染类名。
4. **无伪元素 / 结构伪类残留**（导出后）：
   `expect(out).not.toMatch(/::/)` 且 `not.toMatch(/:nth-child|:first-child|:last-child|:not\(/)`。
5. **装饰色两链路一致**：若组件装饰色（如 callout 竖条）用了固定语义色或主题色，
   断言预览级联与导出内联表现一致（不因物化器/特异性产生漂移）。
6. **整篇无背景**：`#wemd` 无 `background-color` / 整篇背景图。
7. **扩展槽渲染（如有）**：断言扩展槽内容落到骨架正确槽位（如 `magazine-cover`
   首图进封面图槽）；槽位映射反转时（eyebrow←title、大标题←subtitle）用精确断言
   锁住（`/wemd-sk-eyebrow[\s\S]{0,500}PRODUCT KEYNOTE/`）。
8. **降级不丢内容**：切换到一个不声明扩展槽的主题渲染同篇带图封面，
   内容进 desc/body 兜底不报错（slotOverrides.test.ts 已覆盖机制）。

---

## 五、本次踩坑速查表（下次直接对照）

| 症状                                                                               | 根因                                                                                            | 修法                                                                                                                                  |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 改了皮肤但导出不变                                                                 | 选择器少一层容器 class，特异性低于共享                                                          | 写完整路径 `#wemd .<容器> .<子元素>`                                                                                                  |
| 深色背景 + 深色字不可读                                                            | 深色卡沿用了共享 `var(--wemd-text-normal)` 深色字                                               | 按组件设计决定：深色卡改浅字，或改浅底；具体案例见 theme-development-guide #14（深底正文需连 `.X p` 覆盖，避免被全局 `#wemd p` 染深） |
| 整篇浅蓝/浅色底                                                                    | `#wemd` 写了 background-image/color                                                             | 改为 `background-image: none`，交给编辑器                                                                                             |
| 正文卡片有整块底色且不可读                                                         | 共享默认给正文类用 `var(--wemd-bg-card)`（token 为深色时深底深字）                              | 按设计决定：去底色 or 浅底 or 配浅字                                                                                                  |
| callout 竖条颜色与主题/背景冲突                                                    | 竖条用 type 固定色（或主题色）与卡片配色打架                                                    | 由组件设计定色；验收检查前景/背景可读                                                                                                 |
| 预览正常导出异常（或反之）                                                         | 预览走级联、导出走内联+物化，两条链路                                                           | 两链路都验证                                                                                                                          |
| 主题代码改了但页面不变                                                             | `@wemd/core` 走 dist 而非 src                                                                   | 确认 vite alias 指向 src，或重启 dev                                                                                                  |
| 封面/收场槽位颠倒（eyebrow 变大标题、大标题变小字）                                | 共享解析 title=首行 / subtitle=次行，用户范文按"eyebrow 第一行（斜体）+ 大标题第二行（粗体）"写 | 骨架反转使用槽位：eyebrow←`{{slot:title}}`、大标题←`{{slot:subtitle}}`（无声发布已踩）                                                |
| 封面/收场内 strong/em 变主题橙                                                     | 全局 `#wemd em` / `p strong` 规则内联染色                                                       | 封面内 `strong, em { color: inherit }` 继承封面色                                                                                     |
| styled-table 皮肤不生效（走了默认橙底表头）                                        | 导出结构是 `.wemd-sbt-table`，非 `.wemd-component-body`                                         | 皮肤用通用选择器 `.wemd-styled-table th/td`（后代选择，两种结构都命中）                                                               |
| 扩展槽内容被共享槽吞掉（如封面图提取不到）                                         | 扩展槽排在共享 `desc`(paragraph many) 之后解析，图片行已被消费                                  | `mergeSlotOverrides` 让扩展槽**排在共享槽之前**解析（机制已内置，勿回退）                                                             |
| CSS `background` 内联 data URL 被拆散（`url("data:...;base64,...")` 里的分号截断） | `inlineAllStylesManually` 用 `split(";")` 简单切分声明，data URL 内 `;` 被当分隔符              | 已修：`ThemeProcessor.splitCssDeclarations` 跳过 `url(...)` 内分号（数据主题纸纹背景曾依赖）                                          |
| SVG 元素 CSS 颜色（`stroke`/`fill` via CSS）内联导出不生效                         | SVG 元素 `color`/`stroke` 的 CSS 规则未被内联                                                   | 骨架里 SVG 装饰直接写 SVG 属性颜色（`stroke="#xxx"`），不依赖 CSS（曾踩）                                                             |

---

## 六、验收动作

1. `pnpm --filter @wemd/core exec vitest run` 全绿。
2. web 端（`localhost:5175`）切到新主题，预览正文、卡片、深色卡、竖条颜色协调。
3. 用「复制到公众号」导出，粘贴到公众号模拟器（rich-html-editor 调试面板），
   确认预览 = 导出（无伪元素残留、颜色一致）。

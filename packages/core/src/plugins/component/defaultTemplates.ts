/**
 * 内置默认骨架 —— 组件的默认实现（主题未定制某组件时继承使用）
 *
 * 设计：
 * - 11 个专用渲染器组件（magazineRenderers 覆盖）：DOM 结构从 magazineRenderers
 *   固化，动态内容替换为 Mustache 占位符（{{slot:key}} / {{#each}} / {{this.field}}）。
 * - 其余普通组件：从 slotDefs 的 Input Contract 生成通用骨架（每个 slot 一个
 *   `wemd-{abbr}-{key}` 元素），保证任意组件都有可用默认形态、不丢内容。
 *
 * 模板即完整组件输出（含外层 `wemd-component wemd-{id}` 容器），
 * data-props / data-* 属性由渲染期注入（见 Phase 4），此处只承载结构。
 */
import type { ComponentSlotDef } from "./slotTypes";
import { getBuiltinSlotDef } from "./slotDefs";

/* ============================================================
 * 专用渲染器组件精编模板（取自 magazineRenderers.ts 的 DOM）
 * ============================================================ */

const CURATED: Record<string, string> = {
  "magazine-cover": [
    '<section class="wemd-component wemd-magazine-cover" data-component="magazine-cover">',
    '<section class="wemd-mc-title">{{slot:title}}</section>',
    '<section class="wemd-mc-subtitle">{{slot:subtitle}}</section>',
    '<section class="wemd-mc-divider">{{slot:divider}}</section>',
    '<section class="wemd-mc-desc">{{slot:desc}}</section>',
    "</section>",
  ].join("\n"),

  "section-divider": [
    '<section class="wemd-component wemd-section-divider" data-component="section-divider">',
    '<section class="wemd-sd-part">{{slot:part}}</section>',
    '<section class="wemd-sd-title">{{slot:title}}</section>',
    "</section>",
  ].join("\n"),

  "two-column-cards": [
    '<section class="wemd-component wemd-two-column-cards" data-component="two-column-cards">',
    '<section class="wemd-vc-list">',
    "{{#each items}}",
    '<section class="wemd-vc-item">',
    '<span class="wemd-vc-stripe">&nbsp;</span>',
    '<section class="wemd-vc-body">',
    '<section class="wemd-vc-title">{{this.title}}</section>',
    '<section class="wemd-vc-desc">{{this.desc}}</section>',
    "</section>",
    "</section>",
    "{{/each}}",
    "</section>",
    "</section>",
  ].join("\n"),

  "full-quote": [
    '<section class="wemd-component wemd-full-quote" data-component="full-quote">',
    '<section class="wemd-fq-text">{{slot:text}}</section>',
    "</section>",
  ].join("\n"),

  "image-card": [
    '<section class="wemd-component wemd-image-card" data-component="image-card">',
    '<section class="wemd-ic-image">{{slot:image}}</section>',
    '<section class="wemd-ic-caption">{{slot:caption}}</section>',
    "</section>",
  ].join("\n"),

  "end-card": [
    '<section class="wemd-component wemd-end-card" data-component="end-card">',
    '{{#if title}}<section class="wemd-ec-title">{{slot:title}}</section>{{/if}}',
    '{{#if subtitle}}<section class="wemd-ec-subtitle">{{slot:subtitle}}</section>{{/if}}',
    '{{#if body}}<section class="wemd-ec-body">{{slot:body}}</section>{{/if}}',
    '{{#if deco}}<section class="wemd-ec-deco">{{slot:deco}}</section>{{/if}}',
    "</section>",
  ].join("\n"),

  "hero-banner": [
    '<section class="wemd-component wemd-hero-banner" data-component="hero-banner">',
    '<div class="wemd-component-body">',
    '{{#if image}}<p class="wemd-hb-image">{{slot:image}}</p>{{/if}}',
    '{{#if title}}<p class="wemd-hb-title">{{slot:title}}</p>{{/if}}',
    '{{#if subtitle}}<p class="wemd-hb-subtitle">{{slot:subtitle}}</p>{{/if}}',
    "</div>",
    "</section>",
  ].join("\n"),

  "product-card": [
    '<section class="wemd-component wemd-product-card" data-component="product-card">',
    '{{#if image}}<section class="wemd-pc-image">{{slot:image}}</section>{{/if}}',
    '<section class="wemd-pc-header">',
    '{{#if badge}}<section class="wemd-pc-badge">{{slot:badge}}</section>{{/if}}',
    '{{#if title}}<section class="wemd-pc-title">{{slot:title}}</section>{{/if}}',
    '{{#if subtitle}}<section class="wemd-pc-subtitle">{{slot:subtitle}}</section>{{/if}}',
    "</section>",
    '{{#if description}}<section class="wemd-pc-description">{{slot:description}}</section>{{/if}}',
    '{{#if price}}<section class="wemd-pc-price-row">',
    '<section class="wemd-pc-price">{{slot:price}}</section>',
    '<section class="wemd-pc-original">{{slot:originalPrice}}</section>',
    "</section>{{/if}}",
    '{{#if rating}}<section class="wemd-pc-meta-row">',
    '<section class="wemd-pc-rating">{{slot:rating}}</section>',
    '<section class="wemd-pc-sales">{{slot:sales}}</section>',
    '<section class="wemd-pc-stock">{{slot:stock}}</section>',
    "</section>{{/if}}",
    '{{#if button}}<section class="wemd-pc-button">{{slot:button}}</section>{{/if}}',
    '{{#if tags}}<section class="wemd-pc-tags">',
    "{{#each tags}}",
    '<span class="wemd-pc-tag">{{this.tag}}</span>',
    "{{/each}}",
    "</section>{{/if}}",
    "</section>",
  ].join("\n"),

  "brand-sign": [
    '<section class="wemd-component wemd-brand-sign" data-component="brand-sign">',
    '<section class="wemd-bs-wrapper" data-style="{{slot:style}}" data-divider="{{slot:divider}}">',
    '{{#if logo}}<section class="wemd-bs-logo">{{slot:logo}}</section>{{else}}<section class="wemd-bs-logo"></section>{{/if}}',
    '<section class="wemd-bs-text">',
    '<section class="wemd-bs-brand-line">',
    '<section class="wemd-bs-brand-name">{{slot:brandName}}</section>',
    '{{#if tagline}}<section class="wemd-bs-divider-dot">·</section><section class="wemd-bs-tagline">{{slot:tagline}}</section>{{/if}}',
    "</section>",
    '<section class="wemd-bs-slogan">{{slot:slogan}}</section>',
    '{{#if subText}}<section class="wemd-bs-subtext">{{slot:subText}}</section>{{/if}}',
    "</section>",
    "</section>",
    "</section>",
  ].join("\n"),

  "resource-list": [
    '<section class="wemd-component wemd-resource-list" data-component="resource-list">',
    '<section class="wemd-rl-title">{{slot:title}}</section>',
    '<section class="wemd-rl-subtitle">{{slot:subtitle}}</section>',
    '<section class="wemd-rl-items" data-numbered="{{slot:numbered}}" data-layout="{{slot:layout}}">',
    "{{#each items}}",
    '<section class="wemd-rl-item">',
    '<section class="wemd-rl-label">{{this.label}}</section>',
    '<section class="wemd-rl-main">',
    '<section class="wemd-rl-item-title">{{this.title}}</section>',
    '<section class="wemd-rl-item-desc">{{this.desc}}</section>',
    "</section>",
    '<section class="wemd-rl-meta">{{this.meta}}</section>',
    '<section class="wemd-rl-tag">{{this.tag}}</section>',
    "</section>",
    "{{/each}}",
    "</section>",
    "</section>",
  ].join("\n"),

  "testimonial-card": [
    '<section class="wemd-component wemd-testimonial-card" data-component="testimonial-card">',
    '<span class="wemd-tc-mark">\u201C</span>',
    '{{#if quote}}<section class="wemd-tc-quote">{{slot:quote}}</section>{{/if}}',
    '{{#if source}}<section class="wemd-tc-source">{{slot:source}}</section>{{/if}}',
    '<section class="wemd-tc-person">',
    '{{#if avatar}}<section class="wemd-tc-avatar">{{slot:avatar}}</section>{{/if}}',
    '<section class="wemd-tc-person-meta">',
    '{{#if name}}<section class="wemd-tc-name">{{slot:name}}</section>{{/if}}',
    '{{#if title}}<section class="wemd-tc-title">{{slot:title}}</section>{{/if}}',
    '{{#if company}}<section class="wemd-tc-company">{{slot:company}}</section>{{/if}}',
    "</section>",
    "</section>",
    '{{#if companyLogo}}<section class="wemd-tc-company-logo">{{slot:companyLogo}}</section>{{/if}}',
    "</section>",
  ].join("\n"),

  "series-nav": [
    '<section class="wemd-component wemd-series-nav" data-component="series-nav">',
    '<section class="wemd-sn-header">',
    '{{#if seriesName}}<section class="wemd-sn-name">{{slot:seriesName}}</section>{{/if}}',
    '{{#if description}}<section class="wemd-sn-desc">{{slot:description}}</section>{{/if}}',
    '<section class="wemd-sn-progress-bar" style="--sn-progress: {{slot:progress}}"><span class="wemd-sn-progress-fill">&nbsp;</span></section>',
    "</section>",
    '{{#if items}}<section class="wemd-sn-articles">',
    "{{#each items}}",
    '<section class="{{this.cls}}"><span class="wemd-sn-item-idx">{{this.idx}}</span><span class="wemd-sn-item-title">{{this.title}}</span>{{this.check}}{{this.tag}}</section>',
    "{{/each}}",
    "</section>{{/if}}",
    '<section class="wemd-sn-nav">',
    '<section class="wemd-sn-prev{{#if prevEmpty}} wemd-sn-prev-empty{{/if}}"><section class="wemd-sn-prev-label">{{slot:prevLabel}}</section>{{#if prevTitle}}<section class="wemd-sn-prev-title">{{slot:prevTitle}}</section>{{/if}}</section>',
    '<section class="wemd-sn-next{{#if nextEmpty}} wemd-sn-next-empty{{/if}}"><section class="wemd-sn-next-label">{{slot:nextLabel}}</section>{{#if nextTitle}}<section class="wemd-sn-next-title">{{slot:nextTitle}}</section>{{/if}}</section>',
    "</section>",
    "</section>",
  ].join("\n"),

  "cta-card": [
    '<section class="wemd-component wemd-cta-card" data-component="cta-card">',
    '{{#if title}}<section class="wemd-cta-title">{{slot:title}}</section>{{/if}}',
    '{{#if body}}<section class="wemd-cta-body">{{slot:body}}</section>{{/if}}',
    '{{#if action}}<section class="wemd-cta-action">{{slot:action}}</section>{{/if}}',
    "</section>",
  ].join("\n"),

  timeline: [
    '<section class="wemd-component wemd-timeline" data-component="timeline">',
    '{{#if title}}<section class="wemd-tl-title">{{slot:title}}</section>{{/if}}',
    '{{#if items}}<section class="wemd-tl-events">',
    "{{#each items}}",
    '<section class="wemd-tl-item"><span class="wemd-tl-dot">&nbsp;</span><span class="wemd-tl-text">{{this.body}}</span></section>',
    "{{/each}}",
    "</section>{{/if}}",
    "</section>",
  ].join("\n"),

  "code-frame": [
    '<section class="wemd-component wemd-code-frame" data-component="code-frame">',
    '{{#if title}}<div class="wemd-cf-title">{{slot:title}}</div>{{/if}}',
    '{{#if code}}<div class="wemd-cf-code">{{slot:code}}</div>{{/if}}',
    "</section>",
  ].join("\n"),

  "divider-fancy": [
    '<section class="wemd-component wemd-divider-fancy" data-component="divider-fancy">',
    '<section class="wemd-df-label">',
    "{{#if label}}",
    '<span class="wemd-df-line wemd-df-line-left">&nbsp;</span>',
    '<span class="wemd-df-text">{{slot:label}}</span>',
    '<span class="wemd-df-line wemd-df-line-right">&nbsp;</span>',
    "{{else}}",
    '<span class="wemd-df-dots">\u00B7 \u00B7 \u00B7</span>',
    "{{/if}}",
    "</section>",
    "</section>",
  ].join("\n"),

  "quote-card": [
    '<section class="wemd-component wemd-quote-card" data-component="quote-card">',
    '<section class="wemd-qc-quote">{{slot:quote}}</section>',
    '{{#if author}}<section class="wemd-qc-author">{{slot:author}}</section>{{/if}}',
    "</section>",
  ].join("\n"),

  "author-card": [
    '<section class="wemd-component wemd-author-card" data-component="author-card">',
    '<div class="wemd-component-body">{{slot:body}}</div>',
    "</section>",
  ].join("\n"),

  faq: [
    '<section class="wemd-component wemd-faq" data-component="faq">',
    // 挂角标题：预览走 ::before 伪元素，导出由物化器生成块级 span（两链路一致）
    '<div class="wemd-component-body">{{slot:body}}</div>',
    "</section>",
  ].join("\n"),

  steps: [
    '<section class="wemd-component wemd-steps" data-component="steps">',
    '<div class="wemd-component-body">{{slot:body}}</div>',
    "</section>",
  ].join("\n"),

  accordion: [
    '<section class="wemd-component wemd-accordion" data-component="accordion">',
    '<div class="wemd-component-body">{{slot:body}}</div>',
    "</section>",
  ].join("\n"),

  // table：通用骨架会生成未样式化的 `.wemd-tbl-table`，但基础 CSS 契约是
  // `.wemd-table .wemd-component-body .table-container table`（components-extended.ts）。
  // 这里补精编骨架套 `.wemd-component-body` 包裹层，内容经 slot:table 渲染出 `.table-container`。
  table: [
    '<section class="wemd-component wemd-table" data-component="table">',
    '<div class="wemd-component-body">{{slot:table}}</div>',
    "</section>",
  ].join("\n"),
};

/* ============================================================
 * 普通组件：从 slotDefs 生成通用骨架
 * ============================================================ */

/**
 * 按组件 Slot 定义生成默认骨架：
 * - 标量/list 槽位 → `wemd-{abbr}-{key}` 容器 + 占位符
 * - list 槽位 → {{#each}} 遍历，条目容器 `wemd-{abbr}-{key}-item`，
 *   无 item_slots 时条目用单一 body 字段
 */
function buildSkeletonTemplate(def: ComponentSlotDef): string {
  const { id, abbr } = def;
  const inner = def.slots
    .map((slot) => {
      const cls = `wemd-${abbr}-${slot.key}`;
      // 统一 CSS 契约：body 槽一律输出 .wemd-component-body，
      // 与组件 CSS（.wemd-component-body > p / ul / pre / table）对齐。
      if (slot.key === "body") {
        return `<div class="wemd-component-body">{{slot:${slot.key}}}</div>`;
      }
      if (slot.type === "list") {
        const fields = slot.item_slots?.length
          ? slot.item_slots.map((f) => f.key)
          : ["body"];
        const itemInner = fields
          .map((f) => `<div class="${cls}-${f}">{{this.${f}}}</div>`)
          .join("\n");
        return [
          `<div class="${cls}">`,
          `{{#each ${slot.key}}}`,
          `<div class="${cls}-item">`,
          itemInner,
          "</div>",
          "{{/each}}",
          "</div>",
        ].join("\n");
      }
      return `<div class="${cls}">{{slot:${slot.key}}}</div>`;
    })
    .join("\n");
  return [
    `<section class="wemd-component wemd-${id}" data-component="${id}">`,
    inner,
    "</section>",
  ].join("\n");
}

/** 无 slot 定义时的兜底骨架（单一 body 槽） */
function buildFallbackTemplate(id: string): string {
  return [
    `<section class="wemd-component wemd-${id}" data-component="${id}">`,
    `<div class="wemd-component-body">{{slot:body}}</div>`,
    "</section>",
  ].join("\n");
}

/**
 * 取组件默认骨架：精编模板优先，否则从 slotDefs 生成，最后兜底。
 */
export function getDefaultTemplate(id: string): string {
  if (CURATED[id]) return CURATED[id];
  const def = getBuiltinSlotDef(id);
  if (def) return buildSkeletonTemplate(def);
  return buildFallbackTemplate(id);
}

/** 已精编模板的组件 id 集合（专用于测试 / 工具） */
export const CURATED_COMPONENT_IDS: ReadonlySet<string> = new Set(
  Object.keys(CURATED),
);

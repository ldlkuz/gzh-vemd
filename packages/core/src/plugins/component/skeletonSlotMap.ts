/**
 * 骨架槽位映射解析器 —— 从骨架模板提取"本主题到底渲染了哪些槽位、什么顺序、是否可选"
 *
 * 背景：slotDefs（Input Contract）描述"怎么写"，而骨架（defaultTemplates.ts 精编模板 /
 * 主题 templates-*.ts 覆盖）决定"这些槽位实际落进哪个容器、按什么顺序渲染、是否条件显示"。
 * 二者可能不一致（如 silent-keynote 的 magazine-cover：eyebrow 取 title 槽、大标题取 subtitle 槽）。
 *
 * 本模块解析骨架里 Mustache 子集的 4 个语法（与 templateFiller.ts 同步）：
 * - `{{slot:key}}`        标量槽
 * - `{{#each key}}...{{/each}}`  列表槽（配 {{this.field}}）
 * - `{{#if key}}...{{/if}}`      条件渲染 → 该槽为"可选"
 *
 * 输出：按渲染顺序排列的槽位清单 + 每槽的容器 class + 是否可选 + 列表子字段。
 * 用于把某主题的有效骨架翻译成 AI 能读懂的组件用法，弥补 slotDefs 未覆盖的骨架差异。
 */

/** 单个骨架槽位的解析结果 */
export interface SkeletonSlotInfo {
  /** 槽位 key */
  key: string;
  /** 标量槽 / 列表槽 */
  kind: "scalar" | "list";
  /** 是否仅在某些条件下渲染（位于 {{#if}} 块内 → 提供非空才显示） */
  optional: boolean;
  /** 在骨架中的渲染顺序（全局序号，越大越靠后） */
  order: number;
  /** 列表槽的条目子字段（{{this.field}} 收集） */
  itemFields: string[];
  /** 该槽内容落进的容器 class（供 AI 感知视觉层级） */
  elementClass: string;
}

/** 匹配骨架中的所有 Mustache 子集操作符 */
const TOKEN_RE =
  /\{\{(?:#if\s+([\w-]+)|#each\s+([\w-]+)|\/if|\/each|else|slot:([\w-]+)|this\.([\w-]+))\}\}/g;

/** 从栈顶自下找最后一个满足谓词的索引（兼容旧运行时，避免 findLastIndex） */
function lastIndexWhere(arr: string[], pred: (s: string) => boolean): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (pred(arr[i])) return i;
  }
  return -1;
}

/** 提取某 token 前方同行的最近 class="..."（作为该槽的容器） */
function extractClassBefore(template: string, index: number): string {
  const lineStart = template.lastIndexOf("\n", index) + 1;
  const chunk = template.slice(lineStart, index);
  const m = chunk.match(/class="([\w\s-]+)"/);
  return m ? m[1].trim() : "";
}

/**
 * 解析骨架模板，返回按渲染顺序排列的槽位映射。
 * 仅收集骨架真正消费的槽；不存在槽定义也不报错（与渲染兜底行为一致）。
 */
export function parseSkeletonSlots(template: string): SkeletonSlotInfo[] {
  if (!template) return [];
  // 栈：'if' 或 'each:<key>'，用于跟踪可选性与列表归属
  const stack: string[] = [];
  const map = new Map<string, SkeletonSlotInfo>();
  const order: string[] = [];

  TOKEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TOKEN_RE.exec(template))) {
    const ifKey = m[1];
    const eachKey = m[2];
    const slotKey = m[3];
    const fieldKey = m[4];
    const token = m[0];

    if (ifKey) {
      stack.push("if");
      continue;
    }
    if (eachKey) {
      stack.push(`each:${eachKey}`);
      // 提前登记列表槽（保证即使无 this.field 也出现在清单中）
      if (!map.has(eachKey)) {
        map.set(eachKey, {
          key: eachKey,
          kind: "list",
          optional: stack.includes("if"),
          order: order.length,
          itemFields: [],
          elementClass: extractClassBefore(template, m.index),
        });
        order.push(eachKey);
      }
      continue;
    }
    if (token === "{{else}}" || token === "{{/if}}" || token === "{{/each}}") {
      if (token === "{{/if}}" || token === "{{else}}") {
        const idx = stack.lastIndexOf("if");
        if (idx >= 0) stack.splice(idx, 1);
      } else {
        const idx = lastIndexWhere(stack, (s) => s.startsWith("each:"));
        if (idx >= 0) stack.splice(idx, 1);
      }
      continue;
    }
    if (fieldKey) {
      const idx = lastIndexWhere(stack, (s) => s.startsWith("each:"));
      if (idx >= 0) {
        const eachKey2 = stack[idx].slice(5);
        map.get(eachKey2)?.itemFields.push(fieldKey);
      }
      continue;
    }
    if (slotKey) {
      if (!map.has(slotKey)) {
        map.set(slotKey, {
          key: slotKey,
          kind: "scalar",
          optional: stack.includes("if"),
          order: order.length,
          itemFields: [],
          elementClass: extractClassBefore(template, m.index),
        });
        order.push(slotKey);
      }
      continue;
    }
  }

  return order.map((k) => map.get(k)!);
}

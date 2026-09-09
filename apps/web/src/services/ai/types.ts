/**
 * AI 排版服务共享类型
 *
 * 集中定义 Audience / DesignConstraints 等跨模块复用的类型，
 * templatePrompt / templateAgent 等跨目录引用此模块。
 */

/** 读者画像（用户输入，AI 不推断） */
export interface Audience {
  /** 读者阅读行为类型 */
  type:
    | "auto"
    | "general"
    | "quick"
    | "deep"
    | "learning"
    | "decision"
    | "brand";
}

/** 设计约束 */
export interface DesignConstraints {
  /** 安全上限，防止异常生成（不作为目标数量） */
  safetyLimit: number;
  /** 设计目标（用户可调） */
  designGoal: "auto" | "reading" | "balanced" | "visual" | "infoDensity";
}

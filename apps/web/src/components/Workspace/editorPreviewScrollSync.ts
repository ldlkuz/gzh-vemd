export type ScrollSyncSource = "editor" | "preview";

export interface ScrollSyncPosition {
  sourceLine: number | null;
  ratio: number;
}

export interface ScrollSyncAdapter {
  getPosition: () => ScrollSyncPosition;
  scrollToPosition: (position: ScrollSyncPosition) => void;
  subscribeScroll: (listener: () => void) => () => void;
  subscribeUserIntent?: (listener: () => void) => () => void;
  subscribeLayoutChange?: (listener: () => void) => () => void;
}

interface FrameScheduler {
  request: (callback: FrameRequestCallback) => number;
  cancel: (handle: number) => void;
}

interface TimerScheduler {
  setTimeout: (callback: () => void, ms: number) => number;
  clearTimeout: (handle: number) => void;
}

const browserFrameScheduler: FrameScheduler = {
  request: (callback) => window.requestAnimationFrame(callback),
  cancel: (handle) => window.cancelAnimationFrame(handle),
};

const browserTimerScheduler: TimerScheduler = {
  setTimeout: (callback, ms) => window.setTimeout(callback, ms),
  clearTimeout: (handle) => window.clearTimeout(handle),
};

const SCROLL_INTENT_EVENTS = [
  "wheel",
  "pointerdown",
  "touchstart",
  "keydown",
] as const;

export const subscribeScrollIntent = (
  element: HTMLElement,
  listener: () => void,
): (() => void) => {
  SCROLL_INTENT_EVENTS.forEach((eventName) =>
    element.addEventListener(eventName, listener),
  );
  return () => {
    SCROLL_INTENT_EVENTS.forEach((eventName) =>
      element.removeEventListener(eventName, listener),
    );
  };
};

// 滚动停止后延迟该时长，才做一次精确校准（弱同步 + 停止校准）
const SETTLE_DELAY_MS = 150;
// 程序化平滑滚动期间静默另一侧，避免平滑滚动产生的 scroll 事件反向触发同步
const PROGRAMMATIC_MUTE_MS = 350;

export const createEditorPreviewScrollSync = (
  frames: FrameScheduler = browserFrameScheduler,
  timers: TimerScheduler = browserTimerScheduler,
) => {
  const adapters: Partial<Record<ScrollSyncSource, ScrollSyncAdapter>> = {};
  const cleanups: Partial<Record<ScrollSyncSource, () => void>> = {};
  // 程序化滚动静默截止时间戳（毫秒）
  const mutedUntil = new Map<ScrollSyncSource, number>();
  let pendingSyncFrame: number | null = null;
  let pendingSyncSource: ScrollSyncSource | null = null;
  let pendingRestoreFrame: number | null = null;
  let lastPosition: ScrollSyncPosition | null = null;
  let lastSource: ScrollSyncSource | null = null;

  const now = () => Date.now();

  const opposite = (source: ScrollSyncSource): ScrollSyncSource =>
    source === "editor" ? "preview" : "editor";

  /** source 当前是否处于程序化滚动静默期 */
  const isMuted = (source: ScrollSyncSource): boolean => {
    const until = mutedUntil.get(source);
    if (until === undefined) return false;
    if (now() < until) return true;
    mutedUntil.delete(source);
    return false;
  };

  /** 静默 source 一段时间（覆盖平滑滚动动画） */
  const muteFor = (source: ScrollSyncSource, durationMs: number) => {
    mutedUntil.set(source, now() + durationMs);
  };

  const syncFrom = (source: ScrollSyncSource) => {
    const sourceAdapter = adapters[source];
    const targetSource = opposite(source);
    const targetAdapter = adapters[targetSource];
    if (!sourceAdapter || !targetAdapter) return;

    const position = sourceAdapter.getPosition();
    lastPosition = position;
    lastSource = source;
    // 程序化滚动目标侧：静默窗口内忽略目标自身的 scroll 事件，避免反馈循环
    muteFor(targetSource, PROGRAMMATIC_MUTE_MS);
    targetAdapter.scrollToPosition(position);
  };

  // 滚动中持续跟随：rAF 节流，每帧只取一次最新滚动位置同步到对侧。
  // scroll 事件可能比 rAF 更频繁，通过独占的 pendingSyncFrame 保证一帧最多同步一次，
  // 避免快速滚动时过量 syncFrom 导致的卡顿。同时解决原“停止后才校准”方案里
  // 快速滚动后预览被瞬间拉到后段、体验割裂的问题。
  const scheduleSync = (source: ScrollSyncSource) => {
    pendingSyncSource = source;
    if (pendingSyncFrame !== null) return; // 本帧已有待同步任务
    pendingSyncFrame = frames.request(() => {
      pendingSyncFrame = null;
      const sourceToSync = pendingSyncSource;
      pendingSyncSource = null;
      if (sourceToSync) syncFrom(sourceToSync);
    });
  };

  const restoreAfterLayoutChange = () => {
    const position =
      lastSource === "editor"
        ? (adapters.editor?.getPosition() ?? lastPosition)
        : lastPosition;
    if (!position || pendingSyncFrame !== null || pendingRestoreFrame !== null)
      return;
    pendingRestoreFrame = frames.request(() => {
      pendingRestoreFrame = null;
      (["editor", "preview"] as const).forEach((source) => {
        const adapter = adapters[source];
        if (!adapter) return;
        muteFor(source, PROGRAMMATIC_MUTE_MS);
        adapter.scrollToPosition(position);
      });
    });
  };

  const setAdapter = (
    source: ScrollSyncSource,
    adapter: ScrollSyncAdapter | null,
  ) => {
    cleanups[source]?.();
    delete cleanups[source];
    delete adapters[source];
    if (!adapter) return;

    adapters[source] = adapter;
    const unsubscribeScroll = adapter.subscribeScroll(() => {
      if (isMuted(source)) return;
      scheduleSync(source);
    });
    const unsubscribeUserIntent = adapter.subscribeUserIntent?.(() => {
      // 用户主动接管滚动：解除程序化静默
      mutedUntil.delete(source);
    });
    const unsubscribeLayout = adapter.subscribeLayoutChange?.(
      restoreAfterLayoutChange,
    );
    cleanups[source] = () => {
      unsubscribeScroll();
      unsubscribeUserIntent?.();
      unsubscribeLayout?.();
    };
    if (source === "preview") restoreAfterLayoutChange();
  };

  const destroy = () => {
    cleanups.editor?.();
    cleanups.preview?.();
    if (pendingSyncFrame !== null) frames.cancel(pendingSyncFrame);
    if (pendingRestoreFrame !== null) frames.cancel(pendingRestoreFrame);
    pendingSyncFrame = null;
    pendingSyncSource = null;
    pendingRestoreFrame = null;
  };

  return { setAdapter, destroy };
};

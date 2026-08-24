import { app, shell, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';

const GITHUB_REPO = 'ldlkuz/gzh-wemd';
const RELEASES_URL = `https://github.com/${GITHUB_REPO}/releases`;

/**
 * 初始化自动更新（electron-updater，基于 GitHub Releases）。
 * 状态机：检查 → (update-available) → 用户点下载 → 下载进度 → 下载完成 → 重启安装
 * 设计要点：
 * - 下载受控：检测到新版本不自动下载，等用户点“下载”才触发，避免下载未完成就
 *   点击“重启”导致 electron-updater 的 quitAndInstall 报错。
 * - 进度回传：download-progress 实时推送，渲染端显示下载百分比。
 * - 错误分级：检查阶段 / 下载阶段错误分别带 stage 与 message 回传，渲染端精准提示。
 */
let lastForce = false; // 最近一次检查是否为手动强制（忽略跳过版本）
let downloadNotified = false; // 同一版本只提示一次"已下载可重启"
let updateAvailable = false; // 本次会话是否已检测到新版本（用于区分检查失败 / 下载失败）
let currentVersionCache = ''; // 缓存版本号，避免重复读 app.getVersion()

function send(mainWindow: BrowserWindow | null, channel: string, payload?: unknown): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
}

// electron-updater 的 DownloadProgress 类型：{ percent, transferred, total, bytesPerSecond }
export function initAutoUpdate(getWindow: () => BrowserWindow | null): void {
  // 用函数而非固定窗口引用，保证窗口重建后仍能取到当前窗口
  const mainWindow = () => getWindow();
  autoUpdater.logger = console;
  autoUpdater.autoDownload = false; // 检测到新版本不自动下载，等待用户点击

  autoUpdater.on('update-available', (info) => {
    const currentVersion = app.getVersion();
    const latestVersion = info.version?.replace(/^v/, '') || currentVersion;
    updateAvailable = true; // 后续 error 属于下载阶段，而非检查阶段
    currentVersionCache = currentVersion;
    send(mainWindow(), 'update:available', {
      latestVersion,
      currentVersion,
      releaseUrl: RELEASES_URL,
      releaseNotes: info.releaseNotes || '',
      force: lastForce,
    });
  });

  autoUpdater.on('update-not-available', () => {
    // 仅手动强制检查（菜单"检查更新"）时提示"已是最新版本"，
    // 启动时的自动检查保持静默，避免每次打开都弹窗打扰用户。
    if (lastForce) {
      send(mainWindow(), 'update:upToDate', { currentVersion: app.getVersion() });
    }
  });

  autoUpdater.on('download-progress', (progress) => {
    send(mainWindow(), 'update:downloading', {
      percent: Math.round(progress.percent || 0),
      transferred: progress.transferred,
      total: progress.total,
      bytesPerSecond: progress.bytesPerSecond,
    });
  });

  autoUpdater.on('error', (err) => {
    console.error('[autoUpdater] error:', err);
    const message = err?.message || String(err);
    if (updateAvailable) {
      // 下载过程中的 error（差异更新/分块请求的临时失败）由 electron-updater
      // 内部自动重试或回退整包，这里只记日志，不弹"网络错误"，避免打扰用户。
      // 只有在下载真正彻底失败时（downloadUpdate 的 Promise reject）才提示。
      return;
    }
    // 检查阶段失败：仅手动强制检查时提示
    if (lastForce) {
      send(mainWindow(), 'update:error', { stage: 'check', message });
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    if (downloadNotified) return;
    downloadNotified = true;
    send(mainWindow(), 'update:downloaded', {
      latestVersion: (info.version || '').replace(/^v/, ''),
      currentVersion: currentVersionCache || app.getVersion(),
      releaseNotes: info.releaseNotes || '',
    });
  });
}

/**
 * 检查是否有新版本
 * @param force 是否手动强制检查（强制时忽略用户"跳过此版本"的记录）
 */
export async function checkForUpdates(
  getWindow: () => BrowserWindow | null,
  force: boolean = false,
): Promise<void> {
  // 未打包运行（开发态）不检查更新
  if (!app.isPackaged) {
    if (force) console.warn('[updater] skip check in dev (app not packaged)');
    return;
  }
  try {
    lastForce = force;
    await autoUpdater.checkForUpdates();
  } catch (error) {
    console.error('Update check failed:', error);
    const message = error instanceof Error ? error.message : String(error);
    if (force) {
      send(getWindow(), 'update:error', { stage: 'check', message });
    }
  }
}

/** 手动触发下载（在检测到新版本、用户点击“下载”后调用） */
export async function downloadUpdate(
  getWindow: () => BrowserWindow | null,
): Promise<void> {
  try {
    await autoUpdater.downloadUpdate();
  } catch (error) {
    console.error('Update download failed:', error);
    const message = error instanceof Error ? error.message : String(error);
    send(getWindow(), 'update:error', { stage: 'download', message });
    updateAvailable = false;
  }
}

/**
 * 立即重启并安装已下载的更新。
 * 注意：electron-updater 在下载未完成时调用会抛错，因此仅应在收到 update-downloaded 后调用。
 */
export function restartToInstall(): void {
  try {
    autoUpdater.quitAndInstall();
  } catch (error) {
    console.error('[updater] quitAndInstall failed:', error);
  }
}

/** 打开 Releases 页面（供渲染进程调用） */
export function openReleasesPage(): void {
  shell.openExternal(RELEASES_URL);
}
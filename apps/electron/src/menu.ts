import { BrowserWindow, Menu, shell } from "electron";
import * as path from "path";
import { app } from "electron";
import { checkForUpdates } from "./updater";

function getPluginRootPath(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "wechat-plugin");
  }
  return path.resolve(__dirname, "../../../wechat-plugin");
}

export function createMenu(getWindow: () => BrowserWindow | null): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: "WeMD",
      submenu: [
        { role: "about", label: "关于 WeMD" },
        { type: "separator" },
        { role: "hide", label: "隐藏 WeMD" },
        { role: "hideOthers", label: "隐藏其他" },
        { role: "unhide", label: "显示全部" },
        { type: "separator" },
        { role: "quit", label: "退出 WeMD" },
      ],
    },
    {
      label: "文件",
      submenu: [
        {
          label: "新建文章",
          accelerator: "CmdOrCtrl+N",
          click: () => getWindow()?.webContents.send("menu:new-file"),
        },
        { type: "separator" },
        {
          label: "保存",
          accelerator: "CmdOrCtrl+S",
          click: () => getWindow()?.webContents.send("menu:save"),
        },
        { type: "separator" },
        {
          label: "切换工作区...",
          click: async () => {
            getWindow()?.webContents.send("menu:switch-workspace");
          },
        },
      ],
    },
    {
      label: "编辑",
      submenu: [
        { role: "undo", label: "撤销" },
        { role: "redo", label: "重做" },
        { type: "separator" },
        { role: "cut", label: "剪切" },
        { role: "copy", label: "复制" },
        { role: "paste", label: "粘贴" },
        { role: "selectAll", label: "全选" },
      ],
    },
    {
      label: "查看",
      submenu: [
        { role: "reload", label: "重新加载" },
        { role: "forceReload", label: "强制重新加载" },
        { role: "toggleDevTools", label: "开发者工具" },
        { type: "separator" },
        { role: "resetZoom", label: "实际大小" },
        { role: "zoomIn", label: "放大" },
        { role: "zoomOut", label: "缩小" },
        { type: "separator" },
        { role: "togglefullscreen", label: "全屏" },
      ],
    },
    {
      label: "窗口",
      submenu: [
        { role: "minimize", label: "最小化" },
        { role: "zoom", label: "缩放" },
        { type: "separator" },
        { role: "front", label: "前置全部窗口" },
      ],
    },
    {
      label: "帮助",
      submenu: [
        {
          label: "检查更新...",
          click: () => checkForUpdates(getWindow, true),
        },
        { type: "separator" },
        {
          label: "打开浏览器插件目录",
          click: () =>
            shell.showItemInFolder(path.join(getPluginRootPath(), "manifest.json")),
        },
        {
          label: "查看插件安装说明",
          click: () =>
            shell.openPath(path.join(getPluginRootPath(), "使用说明.md")),
        },
        { type: "separator" },
        {
          label: "访问官网",
          click: () => shell.openExternal("https://wemd.app"),
        },
        {
          label: "GitHub 仓库",
          click: () => shell.openExternal("https://github.com/tenngoxars/WeMD"),
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

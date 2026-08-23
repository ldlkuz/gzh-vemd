import type { IpcMainInvokeEvent } from "electron";
import { ipcMain, shell, dialog } from "electron";
import * as fs from "fs";
import * as path from "path";
import { getUniqueFilePath, scanWorkspace } from "../workspace/fileEntries";
import { getWorkspaceDir, isPathInsideWorkspace } from "../workspace/state";

export function registerFileHandlers(): void {
  ipcMain.handle(
    "file:list",
    async (_event: IpcMainInvokeEvent, dir?: string) => {
      const targetDir = dir || getWorkspaceDir();
      if (!targetDir) return { success: false, error: "No workspace selected" };
      if (!isPathInsideWorkspace(targetDir)) {
        return { success: false, error: "非法路径" };
      }
      const files = scanWorkspace(targetDir);
      return { success: true, files };
    },
  );

  ipcMain.handle(
    "file:read",
    async (_event: IpcMainInvokeEvent, filePath: string) => {
      try {
        if (!isPathInsideWorkspace(filePath)) {
          return { success: false, error: "非法路径" };
        }
        if (!fs.existsSync(filePath)) {
          return { success: false, error: "File not found" };
        }
        const content = fs.readFileSync(filePath, "utf-8");
        return { success: true, content, filePath };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
  );

  ipcMain.handle(
    "file:create",
    async (
      _event: IpcMainInvokeEvent,
      payload: { filename?: string; content?: string },
    ) => {
      const workspaceDir = getWorkspaceDir();
      if (!workspaceDir) return { success: false, error: "No workspace" };
      const { filename, content } = payload || {};

      let targetPath = "";
      if (filename) {
        if (path.isAbsolute(filename)) {
          targetPath = filename;
        } else {
          targetPath = path.join(workspaceDir, filename);
        }
      } else {
        targetPath = path.join(workspaceDir, "未命名文章.md");
      }

      if (!isPathInsideWorkspace(targetPath)) {
        return { success: false, error: "非法路径" };
      }

      targetPath = getUniqueFilePath(targetPath);

      try {
        const dir = path.dirname(targetPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(targetPath, content || "", "utf-8");
        return {
          success: true,
          filePath: targetPath,
          filename: path.basename(targetPath),
        };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
  );

  ipcMain.handle(
    "file:save",
    async (
      _event: IpcMainInvokeEvent,
      payload: { filePath: string; content: string },
    ) => {
      const { filePath, content } = payload;
      if (!filePath) return { success: false, error: "File path required" };

      try {
        if (!isPathInsideWorkspace(filePath)) {
          return { success: false, error: "非法路径" };
        }
        let existingContent = "";
        if (fs.existsSync(filePath)) {
          existingContent = fs.readFileSync(filePath, "utf-8");
        }

        if (existingContent !== content) {
          fs.writeFileSync(filePath, content, "utf-8");
        }

        return { success: true, filePath };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
  );

  ipcMain.handle(
    "file:rename",
    async (
      _event: IpcMainInvokeEvent,
      payload: { oldPath: string; newName: string },
    ) => {
      const { oldPath, newName } = payload;
      if (!oldPath || !newName)
        return { success: false, error: "Invalid arguments" };

      if (!isPathInsideWorkspace(oldPath)) {
        return { success: false, error: "非法路径" };
      }

      const dir = path.dirname(oldPath);
      const trimmedName = newName.trim();
      const safeName = trimmedName.endsWith(".md")
        ? trimmedName
        : `${trimmedName}.md`;
      const safeBaseName = path.basename(safeName);
      const newPath = path.join(dir, safeName);

      if (oldPath === newPath) return { success: true, filePath: newPath };

      if (
        fs.existsSync(newPath) &&
        oldPath.toLowerCase() !== newPath.toLowerCase()
      ) {
        return { success: false, error: "文件名已存在" };
      }

      try {
        const finalPath = path.join(dir, safeBaseName);
        if (!isPathInsideWorkspace(finalPath)) {
          return { success: false, error: "非法路径" };
        }
        if (
          fs.existsSync(finalPath) &&
          oldPath.toLowerCase() !== finalPath.toLowerCase()
        ) {
          return { success: false, error: "文件名已存在" };
        }
        fs.renameSync(oldPath, finalPath);
        return { success: true, filePath: finalPath };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
  );

  ipcMain.handle(
    "file:delete",
    async (_event: IpcMainInvokeEvent, filePath: string) => {
      if (!filePath) return { success: false, error: "Path required" };
      try {
        if (!isPathInsideWorkspace(filePath)) {
          return { success: false, error: "非法路径" };
        }
        if (fs.existsSync(filePath)) {
          await shell.trashItem(filePath);
        }
        return { success: true };
      } catch (error) {
        try {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          return { success: true };
        } catch (e: any) {
          return { success: false, error: e.message };
        }
      }
    },
  );

  ipcMain.handle(
    "file:reveal",
    async (_event: IpcMainInvokeEvent, filePath: string) => {
      if (filePath) {
        if (!isPathInsideWorkspace(filePath)) return;
        shell.showItemInFolder(filePath);
      }
    },
  );

  // 导出（选保存位置）：弹出系统保存对话框，让用户自选文件夹与文件名
  ipcMain.handle(
    "file:saveDialog",
    async (
      _event: IpcMainInvokeEvent,
      payload: { title?: string; defaultName?: string; content: string },
    ) => {
      const { title, defaultName, content } = payload || {};
      const result = await dialog.showSaveDialog({
        title: title || "导出文件",
        defaultPath: defaultName || "export.md",
        filters: [{ name: "Markdown", extensions: ["md"] }],
      });
      if (result.canceled || !result.filePath) {
        return { success: false, canceled: true };
      }
      try {
        fs.writeFileSync(result.filePath, content ?? "", "utf-8");
        return { success: true, filePath: result.filePath };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
  );
}

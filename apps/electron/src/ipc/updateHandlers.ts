import { ipcMain, type BrowserWindow } from "electron";
import { downloadUpdate, openReleasesPage, restartToInstall } from "../updater";

export function registerUpdateHandlers(
  getWindow: () => BrowserWindow | null,
): void {
  ipcMain.handle("update:openReleases", () => {
    openReleasesPage();
  });
  ipcMain.handle("update:download", () => {
    return downloadUpdate(getWindow);
  });
  ipcMain.handle("update:restartAndInstall", () => {
    restartToInstall();
  });
}
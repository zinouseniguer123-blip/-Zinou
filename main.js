const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");

let mainWindow;
let dataFile;
let backupDir;

function paths() {
  const userData = app.getPath("userData");
  dataFile = path.join(userData, "data.json");
  backupDir = path.join(userData, "backups");
  fs.mkdirSync(backupDir, { recursive: true });
}

function readJson(file) {
  try {
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (_) {
    return null;
  }
}

function isValidData(obj) {
  return obj && Array.isArray(obj.people) && Array.isArray(obj.acts);
}

function listBackups() {
  try {
    return fs.readdirSync(backupDir)
      .filter(n => /^data-\d{4}-\d{2}-\d{2}(?:-\d+)?\.json$/.test(n))
      .sort()
      .reverse();
  } catch (_) {
    return [];
  }
}

function cleanupBackups() {
  const files = listBackups();
  for (const name of files.slice(30)) {
    try { fs.unlinkSync(path.join(backupDir, name)); } catch (_) {}
  }
}

function saveData(json) {
  const parsed = JSON.parse(json);
  if (!isValidData(parsed)) throw new Error("Invalid data");

  // Keep the previous valid version.
  if (fs.existsSync(dataFile)) {
    try {
      fs.copyFileSync(dataFile, dataFile + ".bak");
    } catch (_) {}
  }

  const tmp = dataFile + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(parsed, null, 2), "utf8");
  fs.renameSync(tmp, dataFile);

  const date = new Date().toISOString().slice(0, 10);
  const backup = path.join(backupDir, `data-${date}.json`);
  if (!fs.existsSync(backup)) {
    fs.copyFileSync(dataFile, backup);
  }
  cleanupBackups();

  return true;
}

function loadData() {
  const candidates = [
    dataFile,
    dataFile + ".bak",
    ...listBackups().map(n => path.join(backupDir, n))
  ];

  for (const file of candidates) {
    const obj = readJson(file);
    if (isValidData(obj)) return JSON.stringify(obj);
  }
  return null;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 650,
    title: "خلية العمليات",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    },
    autoHideMenuBar: true
  });

  mainWindow.loadFile(path.join(__dirname, "src", "index.html"));
}

app.whenReady().then(() => {
  paths();

  ipcMain.handle("disk:load", () => loadData());
  ipcMain.handle("disk:save", (_, json) => {
    try {
      return saveData(json);
    } catch (e) {
      return false;
    }
  });

  ipcMain.handle("disk:paths", () => ({
    dataFile,
    backupDir
  }));

  ipcMain.handle("disk:export", async (_, json) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: "حفظ نسخة احتياطية",
      defaultPath: path.join(app.getPath("documents"), "خلية-العمليات-نسخة-احتياطية.json"),
      filters: [{ name: "JSON", extensions: ["json"] }]
    });
    if (result.canceled || !result.filePath) return false;
    fs.writeFileSync(result.filePath, json, "utf8");
    return true;
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

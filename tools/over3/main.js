const { app, BrowserWindow, screen, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let win = null;
let currentConfig = null;

function findConfigPath() {
  const firstPath = path.join(__dirname, '..', '..', 'config.json');
  if (fs.existsSync(firstPath)) {
    return firstPath;
  }
  const secondPath = path.join(__dirname, '..', '..', '..', 'config.json');
  if (fs.existsSync(secondPath)) {
    return secondPath;
  }
  return firstPath;
}
const configPath = findConfigPath();

// 📄 Чтение конфигурации
function readConfig() {
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[CONFIG] Ошибка чтения config.json:', err);
    return {
      window2_width: 800,
      window2_height: 450
    };
  }
}

// 📦 Применение конфигурации к уже открытому окну
function applyConfig(config) {
  if (!win) return;
  currentConfig = readConfig();

  const screenSize = screen.getPrimaryDisplay().workAreaSize;
  const width = config.window2_width || 900;
  const height = config.window2_height || 500;
  const x = Math.round((screenSize.width - width) / 2);
  const y = 0;

  win.setBounds({ x, y, width, height });
  win.webContents.setZoomFactor(zoom);

  if (config.chat_ovd2) {
    win.loadURL(config.chat_ovd2);
    console.log('[CONFIG] Загружен URL из конфигурации:', config.chat_ovd2);
  }

  console.log('[CONFIG] Применены параметры окна:', { x, y, width, height, zoom });
}

// 👁️ Слежение за config.json
function watchConfigFile() {
  fs.watchFile(configPath, { interval: 500 }, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
      try {
        const newConfig = readConfig();
        currentConfig = newConfig;
        applyConfig(currentConfig);
      } catch (err) {
        console.error('[CONFIG] Ошибка при обновлении:', err);
      }
    }
  });
}

// 🪟 Создание окна
function createWindow() {
  currentConfig = readConfig();

  const screenSize = screen.getPrimaryDisplay().workAreaSize;
  const width = currentConfig.window2_width || 900;
  const height = currentConfig.window2_height || 500;
  const x = Math.round((screenSize.width - width) / 2);
  const y = 0;

  const zoom = (currentConfig.chat_zoomov || 10) / 10;

  win = new BrowserWindow({
    width,
    height,
    x,
    y,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    focusable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
	  devTools: false // отключи devtools для финального вида
    }
  });

  win.setHasShadow(false); // 👈 Добавь это обязательно
  win.setIgnoreMouseEvents(true);
  win.setOpacity(0.9);

  const urlToLoad = currentConfig.chat_ovd2 || 'http://localhost:8888';
  win.loadURL(urlToLoad);
  win.webContents.on('did-finish-load', () => {
    win.webContents.setZoomFactor(zoom);
  });
  watchConfigFile();
}
// 🚀 Запуск
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

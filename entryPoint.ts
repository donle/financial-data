import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import * as path from 'path';
import * as url from 'url';

app.setPath('userData', __dirname);

import { LoginDataStore, FinanceDataStore } from './src/preinstall/db_install';
(global as any).db = { LoginDataStore, FinanceDataStore };

class AppWindow {
  public static onReady(callbackFn: () => void) {
    app.on('ready', callbackFn);
  }

  public static onWindowAllClosed(callbackFn: () => void) {
    app.on('window-all-closed', callbackFn);
  }

  public static onActivate(callbackFn: () => void) {
    app.on('activate', callbackFn);
  }

  private windowInstance: BrowserWindow | undefined;
  constructor(windowOptions?: BrowserWindowConstructorOptions) {
    this.windowInstance = new BrowserWindow(windowOptions);
  }

  public getInstance() {
    return this.windowInstance;
  }

  public releaseInstance() {
    this.windowInstance = undefined;
  }

  public onClose(callbackFn: () => void) {
    if (this.windowInstance === undefined) {
      return;
    }

    this.windowInstance.on('closed', callbackFn);
  }
}

export function main(env = 'dev') {
  const winApp = new AppWindow({ width: 800, height: 600, webPreferences: {
    nodeIntegration: false,
    preload: path.join(__dirname, './src/preinstall/preload.js'),
  } });
  const winAppInstance = winApp.getInstance();

  if (!winAppInstance) {
    return;
  }

  winAppInstance.webContents.openDevTools();
  winAppInstance.setMenu(null);
  // load the dist folder from Angular
  winAppInstance.loadURL(
    url.format({
      pathname: path.join(__dirname, `./index.html`),
      protocol: 'file:',
      slashes: true,
    }),
  );
  winApp.onClose(() => winApp.releaseInstance());
  return winAppInstance;
}

let appInstance: BrowserWindow | undefined;
AppWindow.onReady(() => {
  appInstance = main();
});
AppWindow.onWindowAllClosed(() => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
AppWindow.onActivate(() => {
  if (!appInstance) {
    appInstance = main();
  }
});

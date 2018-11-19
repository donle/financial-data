import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { DataLoader } from '../services/data-loader';

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

  private windowInstance: BrowserWindow;
  constructor(windowOptions?: BrowserWindowConstructorOptions) {
    this.windowInstance = new BrowserWindow(windowOptions);
  }

  public getInstance() {
    return this.windowInstance;
  }

  public releaseInstance() {
    this.windowInstance = null;
  }

  public onClose(callbackFn: () => void) {
    this.windowInstance.on('closed', callbackFn);
  }
}

export function main(env = 'dev') {
  const winApp = new AppWindow({ width: 800, height: 600 });
  const winAppInstance = winApp.getInstance();

  winAppInstance.setMenu(null);
  // load the dist folder from Angular
  winAppInstance.loadURL(
    env === 'dev'
      ? 'http://localhost:8888'
      : url.format({
          pathname: path.join(__dirname, `../web/index.html`),
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

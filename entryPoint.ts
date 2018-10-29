import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import * as path from 'path';
import * as url from 'url';

class AppWindow {

	constructor(windowOptions?: BrowserWindowConstructorOptions) {
		this.windowInstance = new BrowserWindow(windowOptions);
	}
	private windowInstance: BrowserWindow;

	public static onReady(callbackFn: () => void) {
		app.on('ready', callbackFn);
	}

	public static onWindowAllClosed(callbackFn: () => void) {
		app.on('window-all-closed', callbackFn);
	}

	public static onActivate(callbackFn: () => void) {
		app.on('activate', callbackFn);
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

function mainEntryPoint(env = 'dev') {
	const winApp = new AppWindow({ width: 800, height: 600 });
	const winAppInstance = winApp.getInstance();

	winAppInstance.setMenu(null);
	// load the dist folder from Angular
	winAppInstance.loadURL(
		env === 'dev' ? 'http://localhost:4200' :
			url.format({
				pathname: path.join(__dirname, `/dist/index.html`),
				protocol: 'file:',
				slashes: true
			})
	);
	winApp.onClose(() => winApp.releaseInstance());
	return winAppInstance;
}

let appInstance: BrowserWindow | undefined;
AppWindow.onReady(() => appInstance = mainEntryPoint());
AppWindow.onWindowAllClosed(() => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
AppWindow.onActivate(() => {
	if (!appInstance) {
		appInstance = mainEntryPoint();
	}
});

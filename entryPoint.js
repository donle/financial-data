"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var AppWindow = /** @class */ (function () {
    function AppWindow(windowOptions) {
        this.windowInstance = new electron_1.BrowserWindow(windowOptions);
    }
    AppWindow.onReady = function (callbackFn) {
        electron_1.app.on('ready', callbackFn);
    };
    AppWindow.onWindowAllClosed = function (callbackFn) {
        electron_1.app.on('window-all-closed', callbackFn);
    };
    AppWindow.onActivate = function (callbackFn) {
        electron_1.app.on('activate', callbackFn);
    };
    AppWindow.prototype.getInstance = function () {
        return this.windowInstance;
    };
    AppWindow.prototype.releaseInstance = function () {
        this.windowInstance = null;
    };
    AppWindow.prototype.onClose = function (callbackFn) {
        this.windowInstance.on('closed', callbackFn);
    };
    return AppWindow;
}());
function mainEntryPoint(env) {
    if (env === void 0) { env = 'dev'; }
    var winApp = new AppWindow({ width: 800, height: 600 });
    var winAppInstance = winApp.getInstance();
    winAppInstance.setMenu(null);
    // load the dist folder from Angular
    winAppInstance.loadURL(env === 'dev' ? 'http://localhost:4200' :
        url.format({
            pathname: path.join(__dirname, "/dist/index.html"),
            protocol: 'file:',
            slashes: true
        }));
    winApp.onClose(function () { return winApp.releaseInstance(); });
    return winAppInstance;
}
var appInstance;
AppWindow.onReady(function () { return appInstance = mainEntryPoint(); });
AppWindow.onWindowAllClosed(function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
AppWindow.onActivate(function () {
    if (!appInstance) {
        appInstance = mainEntryPoint();
    }
});

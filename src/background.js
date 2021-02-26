'use strict';

import { app, protocol, BrowserWindow } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import IpcMainUtil from '@/utils/ipc-main.util';
import textToVoice from './utils/tts.util';
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } },
]);

let settingWin, musicWin, drawGameWin, snakeWin;

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 360,
        height: 380,
        alwaysOnTop: true,
        transparent: true, // process.platform !== 'win32',
        frame: false,
        opacity: 0.8,
        hasShadow: false,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            webSecurity: false,
        },
    });
    win.on('closed', () => {
        app.quit();
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        // if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html');
    }
}

async function createSettingWindow() {
    // Create the browser window.
    settingWin = new BrowserWindow({
        width: 360,
        height: 280,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            webSecurity: false,
        },
    });
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await settingWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'setting');
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        await settingWin.loadURL('app://./setting.html');
    }
    settingWin.on('close', () => {
        settingWin = null;
    });
}

async function createMusicWindow() {
    // Create the browser window.
    musicWin = new BrowserWindow({
        width: 360,
        height: 280,
        transparent: true, // process.platform !== 'win32',
        frame: false,
        opacity: 0.8,
        alwaysOnTop: true,
        hasShadow: false,
        webPreferences: {
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            webSecurity: false,
        },
    });
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await musicWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'music');
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        await musicWin.loadURL('app://./music.html');
    }
    musicWin.on('close', () => {
        musicWin = null;
    });
}

async function createDrawGameWindow() {
    // Create the browser window.
    drawGameWin = new BrowserWindow({
        width: 360,
        height: 280,
        transparent: true, // process.platform !== 'win32',
        frame: false,
        backgroundColor: '#00ffffff',
        alwaysOnTop: true,
        hasShadow: false,
        webPreferences: {
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            webSecurity: false,
        },
    });
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await drawGameWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'draw-game');
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        await drawGameWin.loadURL('app://./draw-game.html');
    }
    drawGameWin.on('close', () => {
        drawGameWin = null;
    });
}

async function createSnakeWindow() {
    // Create the browser window.
    snakeWin = new BrowserWindow({
        width: 360,
        height: 280,
        transparent: true, // process.platform !== 'win32',
        frame: false,
        backgroundColor: '#00ffffff',
        alwaysOnTop: true,
        hasShadow: false,
        webPreferences: {
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            webSecurity: false,
        },
    });
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await snakeWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'snake');
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        await snakeWin.loadURL('app://./snake.html');
    }
    snakeWin.on('close', () => {
        snakeWin = null;
    });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        // Devtools extensions are broken in Electron  6/7/<8.25 on Windows
        // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
        // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
        // If you are not using Windows 10 dark mode, you may uncomment the following lines (and the import at the top of the file)
        // In addition, if you upgrade to Electron ^8.2.5 or ^9.0.0 then devtools should work fine

        // try {
        //   await installExtension(VUEJS_DEVTOOLS)
        // } catch (e) {
        //   console.error('Vue Devtools failed to install:', e.toString())
        // }

    }
    await createWindow();
    IpcMainUtil.initial();
    IpcMainUtil.on('TTS', (params) => {
        return textToVoice(params);
    });
    IpcMainUtil.on('OPEN_SETTING', () => {
        if (!settingWin) {
            createSettingWindow();
        }
        settingWin.focus();
    });
    IpcMainUtil.on('OPEN_MUSIC', () => {
        if (!musicWin) {
            createMusicWindow();
        }
        musicWin.focus();
    });
    IpcMainUtil.on('OPEN_DRAW_GAME', () => {
        if (!drawGameWin) {
            createDrawGameWindow();
        }
        drawGameWin.focus();
    });
    IpcMainUtil.on('DRAW_POINT', (message) => {
        if (drawGameWin) {
            drawGameWin.webContents.send('DRAW_POINT', message);
        }
    });
    IpcMainUtil.on('OPEN_SNAKE_GAME', () => {
        if (!snakeWin) {
            createSnakeWindow();
        }
        snakeWin.focus();
    });
    IpcMainUtil.on('SNAKE_ACTION', (body) => {
        console.log(body);
        if (snakeWin) {
            snakeWin.webContents.send('SNAKE_ACTION', body);
        }
    });
    IpcMainUtil.on('NEXT_SONG', (uname) => {
        if (musicWin) {
            musicWin.webContents.send('NEXT_SONG', uname);
        }
    });
    // IpcMainUtil.on('GET_SONG', (keywords) => {
    //     return NeteaseCloudUtil.search(keywords);
    // });
});

app.on('browser-window-created', (e, win) => {
    win.webContents.session.webRequest.onBeforeSendHeaders((detail, cb) => {
        // console.log(detail);
        let { url, requestHeaders } = detail;
        requestHeaders = Object.assign(requestHeaders, {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 9; PCT-AL10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.64 HuaweiBrowser/10.0.3.311 Mobile Safari/537.36',
            Referer: /^https:\/\/music\.163\.com/.test(url) ? 'https://music.163.com/' : undefined,
            'Cookie': '',
            // Origin: /^https:\/\/music\.163\.com/.test(url) ? 'https://music.163.com/' : undefined,
        });
        cb({ requestHeaders });
    });
    // {
    //     urls: ['<all_urls>'],
    //         types: ['xmlhttprequest']
    // }
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}

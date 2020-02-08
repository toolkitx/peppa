const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu, dialog, ipcMain} = require('electron');
const autoUpdater = require('electron-updater').autoUpdater;
const MockServer = require('./native/mockServer').MockServer;
const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let mockServerInstance;

function createMenuTemplate() {
    const menuTemplate = [];
    menuTemplate.push({
        label: 'File',
        submenu: [
            {
                label: 'About',
                click() {
                    dialog.showMessageBox({
                        type: 'info',
                        title: 'About Peppa Studio',
                        message: 'Current version ' + app.getVersion()
                    });
                }
            },
            {
                label: 'Mock Server',
                click() {
                    sendStatusToRender({action: 'open'}, 'mock-server');
                }
            },
            {
                label: 'Check for updates',
                click() {
                    sendStatusToRender({action: 'checking-for-update', data: 'Checking for update...'});
                    autoUpdater.checkForUpdatesAndNotify();
                }
            },
            {
                label: 'Quit',
                click() {
                    app.quit();
                }
            },
        ]
    });

    menuTemplate.push({
        label: 'View',
        role: 'viewMenu'
    });

    return menuTemplate;
}

const createWindow = async () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.join(__dirname, 'logo', 'favicon.png')
    });

    // and load the index.html of the app.
    if (serve) {
        // require('electron-reload')(__dirname, {
        //   electron: require(`${__dirname}/node_modules/electron`)
        // });
        mainWindow.loadURL('http://localhost:4200');
        // Open the DevTools.
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/peppa-studio/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

};

ipcMain.on('message-from-render', async (event, msg) => {
    if (!msg) {
        return;
    }
    if (msg.channel === 'auto-update' && msg.payload) {
        if (msg.payload.action === 'auto-check-update') {
            autoUpdater.checkForUpdatesAndNotify();
        } else if (msg.payload.action === 'quit-and-install-update') {
            autoUpdater.quitAndInstall();
        }
    } else if (msg.channel === 'mock-server') {
        if (msg.payload.action === 'start') {
            mockServerInstance = new MockServer(msg.payload.data.directory, msg.payload.data.port);
            await mockServerInstance.start();
            mockServerInstance.on('request', (data) => {
                sendStatusToRender({action: 'request', data}, 'mock-server');
            });
            reportMockServerStatus();
        } else if (msg.payload.action === 'stop' && mockServerInstance) {
            mockServerInstance.stop(() => {
                mockServerInstance = null;
                reportMockServerStatus();
            });
        }
        if (msg.payload.action === 'report-status') {
            reportMockServerStatus();
        }
    } else if (msg.channel === 'peppa-settings') {

    } else if (msg.channel === 'test') {
        dialog.showMessageBox({
            type: 'info',
            title: 'Test',
            message: msg.payload
        });
    }
});

const reportMockServerStatus = () => {
    sendStatusToRender({
        action: 'status',
        data: mockServerInstance ? {directory: mockServerInstance.directory, port: mockServerInstance.port} : null
    }, 'mock-server');
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    const appMenu = Menu.buildFromTemplate(createMenuTemplate());
    Menu.setApplicationMenu(appMenu);
    await createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('before-quit', () => {
    if (mockServerInstance) {
        mockServerInstance.stop();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const sendStatusToRender = (payload, channel = 'auto-update') => {
    mainWindow.webContents.send('message-from-main', {channel, payload: payload});
};

autoUpdater.on('checking-for-update', () => {
    // sendStatusToRender({action: 'checking-for-update', data: 'Checking for update...'});
});
autoUpdater.on('update-available', (info) => {
    sendStatusToRender({action: 'update-available', data: 'Update available.'});
});
autoUpdater.on('update-not-available', (info) => {
    sendStatusToRender({action: 'update-not-available', data: 'Update not available.'});
});
autoUpdater.on('error', (err) => {
    sendStatusToRender({action: 'error', data: 'Error in auto-updater. ' + err});
});
autoUpdater.on('download-progress', (progressObj) => {
    // let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
    // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    // log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
    // sendStatusToWindow(log_message);
});
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToRender({action: 'update-downloaded', data: JSON.stringify(info)});
});

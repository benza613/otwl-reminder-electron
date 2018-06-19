const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  nativeImage
} = require('electron');
const path = require('path');
const url = require('url');

const isDev = require('electron-is-dev'); // this is required to check if the app is running in development mode. 
const autoUpdater = require('./auto-updater')

const shell = require('electron').shell;
var _settings = require('electron-settings');
//process call handler
const {
  ipcMain
} = require('electron');

/* Handling squirrel.windows events on windows 
only required if you have build the windows with target squirrel. For NSIS target you don't need it. */
if (require('electron-squirrel-startup')) {
  app.quit();
}

app.setAppUserModelId('com.electron.benappid');

app.setLoginItemSettings({
  openAtLogin: true,
});
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null;

// Funtion to check the current OS. As of now there is no proper method to add auto-updates to linux platform.
function isWindowsOrmacOS() {
  return process.platform === 'darwin' || process.platform === 'win32';
}

let tray = null
const {
  setup: setupPushReceiver
} = require('electron-push-receiver');

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  console.log('Dont create more instance')
  // Someone tried to run a second instance, we should focus our window.
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
})

if (isSecondInstance) {
  app.quit()
}

function createWindow() {

  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    frame: false,
    height: 600
  });

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Initialize electron-push-receiver component. Should be called before 'did-finish-load'

  setupPushReceiver(win.webContents);

  // Open the DevTools.
  win.webContents.openDevTools();

  // Emitted when the window is minimizd.
  win.on('minimize', function (event) {
    event.preventDefault()
    win.hide();
  });

  win.on('close', function (event) {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.

    //onclose window is not quiting yet so just hide
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();

    }
  });

  win.webContents.on('did-finish-load', () => {
     //autoUpdater.init(win)

  })


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  //prod path 
  tray = new Tray(nativeImage.createFromPath('resources/app.asar/ologo_Tyn_2.ico'));

  //dev path 
  //tray = new Tray(nativeImage.createFromPath('./ologo_Tyn_2.ico'));

  const contextMenu = Menu.buildFromTemplate([{
      label: 'ADMIN',
      type: 'radio',
    },
    {
      label: 'Logout',
      click: function () {
        win.webContents.send('reminder-main-logout', {});
      }

    },
    {
      label: 'Quit',
      click: function () {
        app.exit();
      }
    },

  ])
  tray.setToolTip('OTWL DESKTOP APP')
  tray.setContextMenu(contextMenu)

  //set the timer once key 
  _settings.set('timer_init_otwl', 1);

  createWindow();
  tray.on('double-click', () => {

    win.show();
    //    createWindow();
  });


});

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
  if (win === null) {
    createWindow();
  }
});
//ok
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


//menu bar actions
ipcMain.on('close-window-main', function (e) {
  win.hide();
});

ipcMain.on('snooze-specific-rem', function (e, arg) {
  win.webContents.send('snooze-postpone', arg);
  win.show();
  //win.unmaximize();
});

ipcMain.on('refresh-reminder-table-1', function (e, arg) {
  win.webContents.send('refresh-reminder-table', arg);
});

ipcMain.on('refresh-reminder-resync-data-1', function (e, arg) {
  win.webContents.send('refresh-reminder-resync-data', arg);
});


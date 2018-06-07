const {
  app,
  BrowserWindow,
  Menu,
  Tray
} = require('electron');
const path = require('path');
const url = require('url');

const shell = require('electron').shell;
var _settings = require('electron-settings');
//process call handler
const {
  ipcMain
} = require('electron');


app.setAppUserModelId('com.electron.benappid');

app.setLoginItemSettings({
  openAtLogin: true,
});
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null;
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
  //win.webContents.openDevTools();

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


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  tray = new Tray('./Ologo.PNG');
  const contextMenu = Menu.buildFromTemplate([{
      label: 'ADMIN',
      type: 'radio',
    },
    {
      label: 'Actions',
      submenu: [{
          label: 'Sync'
        },
        {
          label: 'Check DB'
        }
      ]
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

    createWindow();
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

//not used 
ipcMain.on('req-dirname', function (e, a) {
  e.returnValue = __dirname;
});
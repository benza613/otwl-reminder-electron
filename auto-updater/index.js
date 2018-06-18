const electron = require('electron')
const os = require('os')
const {
  app,
  dialog
} = require('electron');
const autoUpdater = electron.autoUpdater
const appVersion = require('../package.json').version

let updateFeed = ''
let initialized = false
const platform = `${os.platform()}_${os.arch()}`
const nutsURL = 'http://192.168.4.189:1337'

if (os.platform() === 'darwin') {
  updateFeed = `${nutsURL}/update/${platform}/${appVersion}`
} else if (os.platform() === 'win32') {
  updateFeed = `${nutsURL}/update/${platform}/${appVersion}`
}

function init(mainWindow) {
 

  if (initialized || !updateFeed || process.env.NODE_ENV === 'development') {
    return
  }

  initialized = true

  autoUpdater.setFeedURL(updateFeed)

  autoUpdater.on('error', (ev, err) => {
    dialog.showErrorBox({
      title: 'Error Occured',
      content: 'AutoUpdater'
    }, response => {
     
    });
  })

  autoUpdater.once('checking-for-update', (ev, err) => {
  
  })

  autoUpdater.once('update-available', (ev, err) => {
    dialog.showMessageBox({
      type: 'info',
      defaultId: 0,
      message: 'UPDATE AVAILABLE',
      detail: 'A New Update is available. Downloading will occur in the background',
    }, response => {
     
    });

  })

  autoUpdater.once('update-not-available', (ev, err) => {
    mainWindow.webContents.send('message', {
      msg: '👎 Update not available'
    })
  })

  autoUpdater.once('update-downloaded', (ev, err) => {
    dialog.showMessageBox({
      type: 'question',
      buttons: ['Install and Relaunch'],
      defaultId: 0,
      message: 'A new version of ' + app.getName() + ' has been downloaded & is ready to run',
      detail: 'Please Update Immediately'
    }, response => {
      if (response === 0) {
       // setTimeout(() => autoUpdater.quitAndInstall(), 1);
      }
    });
  })

  autoUpdater.checkForUpdates()
}

module.exports = {
  init
}
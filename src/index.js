const electron= require('electron');
const path= require('path');
const BrowserWindow= electron.remote.BrowserWindow;

const notifyBtn = document.getElementById('notifyBtn');

const notification1 = {
    appName: "com.electron.benappid",
    body: 'Btc body'
}

function getAlert(){
const mynotif = new window.Notification('Title', notification1)
console.log('mynotif_changed');
//store In DB 
}

setInterval(getAlert, 5000);


notifyBtn.addEventListener('click', function(e){
    const modalPath = path.join('file://',__dirname,'add.html')
    let win = new BrowserWindow({width: 400, height:200, frame:false, modal: true, transparent:true, alwaysOnTop:true,})

    win.on('close',function(){win= null;});

    win.loadURL(modalPath)
    win.show();
})
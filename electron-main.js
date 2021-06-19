const { app, BrowserWindow } = require('electron')
const path = require("path");


function createWindow() {
    const win = new BrowserWindow({
        // width: 800,
        // height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: false,
            nodeIntegration: true
        }
    });
    win.maximize();
    // win.loadFile(__dirname, '.src/index.html')
    // win.loadFile('src/app/home/home.component.html')
    win.loadFile('./dist/angular-build/index.html')
        // win.loadFile('index.html')

}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
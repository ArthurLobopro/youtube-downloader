import { app, BrowserWindow, ipcMain } from 'electron'
import { resolve } from 'path'

function createWindow() {
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            preload: resolve(__dirname, "../renderer/renderer.js")
        }
    })

    win.loadFile('index.html')
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

ipcMain.on("request-download-path", event => {
    event.returnValue = app.getPath("downloads")
})
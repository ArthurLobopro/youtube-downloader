import { is } from "@electron-toolkit/utils"
import { app, BrowserWindow } from 'electron'
import { join } from "path"

import "./events"

function createWindow() {
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            preload: join(__dirname, "../preload/index.js"),
        }
    })

    if (is.dev && process.env.ELECTRON_RENDERER_URL) {
        win.loadURL(process.env.ELECTRON_RENDERER_URL)
    } else {
        win.loadFile(join(__dirname, "../renderer/index.html"))
    }
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
import { BrowserWindow, app, dialog, ipcMain } from "electron";

ipcMain.on("request-download-path", (event) => {
    event.returnValue = app.getPath("downloads");
});

ipcMain.on("request-save-path", async (event) => {
    const win = BrowserWindow.fromId(event.sender.id) as BrowserWindow;
    try {
        const result = await dialog.showOpenDialog(win, {
            properties: ["openDirectory"],
            title: "Selecione uma pasta para salvar:",
        });
        if (result.canceled) {
            event.returnValue = "canceled";
        } else {
            event.returnValue = result.filePaths[0];
        }
    } catch (err) {
        console.log(err);
    }
});

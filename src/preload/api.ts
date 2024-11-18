import { existsSync } from "fs";
import ytdl from "@distube/ytdl-core";
import { ipcRenderer, shell } from "electron";
import { validateAndDownload } from "./downloaders";

async function requestDownloadPath() {
    const folder = ipcRenderer.sendSync("request-download-path");

    if (folder === "canceled") return null;

    if (folder && existsSync(folder)) {
        return folder;
    }

    return null;
}

async function requestSavePath() {
    const folder = ipcRenderer.sendSync("request-save-path");

    if (folder === "canceled") return null;

    if (folder && existsSync(folder)) {
        return folder;
    }

    return null;
}

export const api = {
    ytdl: {
        getInfo: ytdl.getInfo,
    },
    validateAndDownload,
    existsSync,
    shell,
    requestDownloadPath,
    requestSavePath,
};

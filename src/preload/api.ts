import ytdl from "@distube/ytdl-core"
import { shell } from "electron"
import { existsSync } from "fs"
import { validateAndDownload } from "./downloaders"

export const api = {
    ytdl: {
        getInfo: ytdl.getInfo
    },
    validateAndDownload,
    existsSync,
    shell
}
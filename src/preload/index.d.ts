import ytdl from "@distube/ytdl-core"
import type { ElectronAPI } from "@electron-toolkit/preload"
import { type api } from "./api"

declare global {
    interface Window {
        electron: ElectronAPI
        api: typeof api
        ytdl: typeof ytdl
    }
}
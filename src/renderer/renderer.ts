import { ipcRenderer } from 'electron'
// const ffmpeg = require('ffmpeg')
import ytdl from 'ytdl-core'
import { downloadMP3, downloadMP4 } from "./downloaders"

window.addEventListener("DOMContentLoaded", () => {
    const url_input = document.getElementById("video-url") as HTMLInputElement
    const savepath_input = document.getElementById("path-to-save") as HTMLInputElement
    const download_button = document.getElementById("download") as HTMLButtonElement
    const mp4_input = document.getElementById("mp4") as HTMLInputElement
    const mp3_input = document.getElementById("mp3") as HTMLInputElement

    async function validateAndDownload() {
        try {
            const url = url_input.value
            const info = await ytdl.getInfo(url)
            console.log(info)
            if (mp4_input.checked) {
                downloadMP4(info, savepath_input.value)
            }

            if (mp3_input.checked) {
                downloadMP3(info, savepath_input.value)
            }
        } catch (error) {
            alert("A url informada é inválida")
            console.log(error)
        }
    }

    download_button.onclick = validateAndDownload

    savepath_input.value = ipcRenderer.sendSync("request-download-path")
})
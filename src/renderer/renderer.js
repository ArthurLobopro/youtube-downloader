const { ipcRenderer } = require('electron')
const ytdl = require('ytdl-core')
const fs = require('fs')
const path = require('path')
const { tmpdir } = require("os")
// const ffmpeg = require('ffmpeg')
const ffmpeg = require('fluent-ffmpeg')
const { randomUUID } = require("crypto")

window.addEventListener("DOMContentLoaded", () => {
    const url_input = document.getElementById("video-url")
    const savepath_input = document.getElementById("path-to-save")
    const download_button = document.getElementById("download")
    const mp4_input = document.getElementById("mp4")
    const mp3_input = document.getElementById("mp3")

    function formatTitle(title) {
        return title.trim().replace(/\(|\[|\]|\)|\&|\,/g, "_").replace(/ |:/g, "")
    }

    function downloadMP4(info) {
        const path_to_save = savepath_input.value

        const stream = fs.createWriteStream(path.resolve(path_to_save, `${formatTitle(info.videoDetails.title)}.mp4`))

        const donwloader = ytdl(info.videoDetails.video_url)
        donwloader.on("progress", (...args) => console.log(args))

        donwloader.pipe(stream)
    }

    function downloadMP3(info) {
        const path_to_save = savepath_input.value

        const videoPath = path.resolve(tmpdir(), `${randomUUID()}.mp4`)
        const stream = fs.createWriteStream(videoPath)

        const donwloader = ytdl(info.videoDetails.video_url, { quality: "highestaudio" })

        donwloader.pipe(stream).on("finish", () => {
            // const process = new ffmpeg(videoPath)

            // process.then(video => {
            const savePath = path.resolve(path_to_save, `${formatTitle(info.videoDetails.title)}.mp3`)
            //     video.fnExtractSoundToMP3(path.resolve(tmpdir(), "audio"), (error, file) => {
            //         if (error) {
            //             console.error(error)
            //         }

            //         if (file) {
            //             fs.renameSync(file, savePath)
            //         }
            //     })
            // })

            const stream = fs.createWriteStream(savePath)

            ffmpeg()
                .input(videoPath)
                .audioCodec('libmp3lame') // Configura o codec de áudio para MP3
                .toFormat('mp3') // Define o formato de saída para MP3
                .on('end', () => {
                    console.log('Conversão concluída com sucesso!')
                })
                .on('error', (err) => {
                    console.error('Erro durante a conversão:', err)
                })
                .writeToStream(stream, { end: true })
        })
    }

    async function validateAndDownload() {
        try {
            const url = url_input.value
            const info = await ytdl.getInfo(url)
            console.log(info)
            if (mp4_input.checked) {
                downloadMP4(info)
            }

            if (mp3_input.checked) {
                downloadMP3(info)
            }
        } catch (error) {
            alert("A url informada é inválida")
            console.log(error)
        }
    }

    download_button.onclick = validateAndDownload

    savepath_input.value = ipcRenderer.sendSync("request-download-path")
})
import { randomUUID } from "crypto"
import ffmpeg from 'fluent-ffmpeg'
import fs from "fs"
import { tmpdir } from "os"
import path from "path"
import ytdl from "ytdl-core"

function formatTitle(title: string) {
    return title.trim().replace(/\(|\[|\]|\)|\&|\,/g, "_").replace(/ |:/g, "")
}

export function downloadMP4(info: ytdl.videoInfo, path_to_save: string) {
    const stream = fs.createWriteStream(path.resolve(path_to_save, `${formatTitle(info.videoDetails.title)}.mp4`))

    const donwloader = ytdl(info.videoDetails.video_url, { quality: "highest" })
    donwloader.on("progress", (...args) => console.log(args))

    donwloader.pipe(stream, { end: true })
}

export function downloadMP3(info: ytdl.videoInfo, path_to_save: string) {

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
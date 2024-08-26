import ytdl from "@distube/ytdl-core"
import { randomUUID } from "crypto"
import ffmpeg from 'fluent-ffmpeg'
import fs from "fs"
import { tmpdir } from "os"
import path from "path"

function formatTitle(title: string) {
    return title.trim().replace(/\(|\[|\]|\)|\&|\,|@|\//g, "_").replace(/ |:/g, "")
}

export function downloadMP4(info: ytdl.videoInfo, path_to_save: string) {
    const videoPath = path.resolve(path_to_save, `${formatTitle(info.videoDetails.title)}.mp4`)

    const stream = fs.createWriteStream(videoPath)

    const donwloader = ytdl.downloadFromInfo(info, { filter: 'videoandaudio', quality: 'highestvideo' })

    donwloader.pipe(stream, { end: true })
    // .on("progress", (...args) => console.log(args))
}

export function downloadMP3(info: ytdl.videoInfo, path_to_save: string) {

    const videoPath = path.resolve(tmpdir(), `${randomUUID()}.mp4`)
    const stream = fs.createWriteStream(videoPath)

    const donwloader = ytdl.downloadFromInfo(info, { quality: "highestaudio" })

    donwloader.pipe(stream).on("finish", () => {
        const savePath = path.resolve(path_to_save, `${formatTitle(info.videoDetails.title)}.mp3`)

        const stream = fs.createWriteStream(savePath)

        ffmpeg()
            .input(videoPath)
            .audioCodec('libmp3lame') // Configura o codec de áudio para MP3
            .toFormat('mp3') // Define o formato de saída para MP3
            // .on('end', () => {
            //     console.log('Conversão concluída com sucesso!')
            // })
            // .on('error', (err) => {
            //     console.error('Erro durante a conversão:', err)
            // })
            .writeToStream(stream, { end: true })
    })
}

export async function validateAndDownload(
    url: string, savePath: string, format: "mp3" | "mp4"
) {
    try {
        const info = await ytdl.getInfo(url)
        console.log(info)
        if (format === "mp4") {
            downloadMP4(info, savePath)
        }

        if (format === "mp3") {
            downloadMP3(info, savePath)
        }
    } catch (error) {
        alert("A url informada é inválida")
        console.log(error)
    }
}
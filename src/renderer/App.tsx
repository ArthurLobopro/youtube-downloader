import ytdl from "@distube/ytdl-core"
import { ipcRenderer } from "electron"
import { existsSync } from "fs"
import { useEffect, useState } from "react"
import { Button } from "./compontens/Button"
import { Input } from "./compontens/Input"
import { validateAndDownload } from "./downloaders"

type saveFormat = "mp3" | "mp4"

export function App() {
    const [savePath, setSavePath] = useState("")
    const [url, setUrl] = useState("")
    const [saveFormat, setSaveFormat] = useState<saveFormat>("mp3")
    const [info, setInfo] = useState<ytdl.videoInfo | null>(null)

    useEffect(() => {
        try {
            setSavePath(ipcRenderer.sendSync("request-download-path"))
        } catch (error) { }
    }, [])


    useEffect(() => {
        if (url) {
            ytdl.getInfo(url).then(setInfo)
        }
    }, [url])

    function onDownload() {
        console.log(url)

        validateAndDownload(url, savePath, saveFormat)
    }

    function selectFolder() {
        const folder = ipcRenderer.sendSync("request-download-path")

        if (existsSync(folder)) {
            setSavePath(folder)
        }
    }

    return (
        <div className="flex flex-col gap-1 w-full justify-center items-center ">

            {info && (
                <img src={info.videoDetails.thumbnails.at(-1)?.url} width="80%" />
            )}

            <div className="flex flex-col justify-start gap-1">
                <label className="flex gap-1">
                    URL do vídeo:
                    <Input
                        type="url"
                        value={url}
                        onChange={ev => setUrl(ev.currentTarget.value)}
                    />
                </label>

                <label className="flex gap-1">
                    Salvar como:
                    <select value={saveFormat} onChange={ev => setSaveFormat(ev.currentTarget.value as saveFormat)}>
                        <option value="mp3">MP3</option>
                        <option value="mp4">MP4</option>
                    </select>
                </label>

                <label className="flex gap-1">
                    Salvar em
                    <Input type="text" id="path-to-save" readOnly value={savePath} />
                    <Button onClick={selectFolder}>Escolher</Button>
                </label>

                <div className="flex justify-center">
                    <Button onClick={onDownload}>Baixar</Button>
                </div>
            </div>
        </div>
    )
}
import { ipcRenderer } from "electron"
import { useEffect, useState } from "react"
import ytdl from "ytdl-core"
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
        validateAndDownload(url, savePath, saveFormat)
    }

    return (
        <div className="flex-column gap">

            {info && (
                <img src={info.videoDetails.thumbnails.at(-1)?.url} width="80%" />
            )}

            <label className="flex gap">
                URL do vídeo:
                <input
                    type="url"
                    value={url}
                    onChange={ev => setUrl(ev.currentTarget.value)}
                />
            </label>

            <label className="flex gap">
                Salvar como:
                <select value={saveFormat} onChange={ev => setSaveFormat(ev.currentTarget.value as saveFormat)}>
                    <option value="mp3">MP3</option>
                    <option value="mp4">MP4</option>
                </select>
            </label>

            <label className="flex gap">
                Salvar em: <br />
                <input type="text" id="path-to-save" readOnly value={savePath} />
                <button>Escolher</button>
            </label>

            <button className="min-width p" onClick={onDownload}>Baixar</button>
        </div>
    )
}

import { Button } from "@components/Button"
import { Input } from "@components/Input"
import { useEffect, useState } from "react"
import { useModal } from "./hooks/useModal"

import "../output.css"
import { api } from "./api"
import { DownloadSucessModal } from "./components/Modals/DownloadSucessModal"

type saveFormat = "mp3" | "mp4"

export function App() {
    const [savePath, setSavePath] = useState("")
    const [url, setUrl] = useState("")
    const [saveFormat, setSaveFormat] = useState<saveFormat>("mp3")
    const [info, setInfo] = useState<Awaited<ReturnType<typeof api.ytdl.getInfo>> | null>(null)
    const [loadState, setLoadState] = useState<"loaded" | "loading">("loaded")

    const modal = useModal()

    useEffect(() => {
        try {
            setSavePath(window.electron.ipcRenderer.sendSync("request-download-path"))
        } catch (error) { }
    }, [])


    useEffect(() => {
        if (url) {
            setLoadState("loading")
            api.ytdl.getInfo(url).then(setInfo)
            setLoadState("loaded")
        }
    }, [url])

    async function onDownload() {
        setLoadState("loading")

        const result = await window.api.validateAndDownload(url, savePath, saveFormat)

        setLoadState("loaded")

        if (result.success) {
            modal.open(<DownloadSucessModal filePath={result.location} onClose={modal.close} />)
        }
    }

    function selectFolder() {
        const folder = window.electron.ipcRenderer.sendSync("request-download-path")

        if (api.existsSync(folder)) {
            setSavePath(folder)
        }
    }

    return (
        <div className="flex flex-col gap-1 w-full justify-center items-center">
            {modal.content}

            {loadState === "loading" && (
                <div className="z-10 absolute inset-0 bg-black bg-opacity-35 w-[100vw] h-[100vh] grid place-items-center">
                    <div className="w-10 h-10 rounded-full animate-spin border-[4px] border-solid border-gray-600 border-l-transparent"></div>
                </div>
            )}

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
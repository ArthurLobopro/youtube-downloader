import { api } from "@renderer/api"
import { Button } from "@renderer/components/Button"
import { DownloadSucessModal } from "@renderer/components/Modals/DownloadSucessModal"
import { useLoading } from "@renderer/hooks/useLoading"
import { useModal } from "@renderer/hooks/useModal"
import { ArrowLeft } from "@renderer/icons"
import { useEffect, useState } from "react"
import { Link, Location, useLocation } from "react-router-dom"

type DownloadPageState = Location<{
    info: Awaited<ReturnType<typeof api.ytdl.getInfo>>
    url: string
}>
type saveFormat = "mp3" | "mp4"


export function DownloadPage() {
    const { state: { info, url } } = useLocation() as DownloadPageState

    const [savePath, setSavePath] = useState("")
    const [saveFormat, setSaveFormat] = useState<saveFormat>("mp3")

    const { loader, setIsLoading } = useLoading()

    const modal = useModal()

    console.log(info)

    useEffect(() => {
        try {
            api.requestDownloadPath().then(path => {
                path && setSavePath(path)
            })
        } catch (error) { }
    }, [])

    async function onDownload() {
        setIsLoading(true)

        const result = await window.api.validateAndDownload(url, savePath, saveFormat)

        setIsLoading(false)

        if (result.success) {
            modal.open(<DownloadSucessModal filePath={result.location} onClose={modal.close} />)
        }
    }

    async function selectFolder() {
        const folder = await api.requestSavePath()

        if (folder) {
            setSavePath(folder)
        }
    }

    return (
        <div className="flex flex-col gap-1 w-full items-center relative">
            <Link to="/" className="fixed top-2 left-2 rounded-full hover:bg-accent p-2">
                <ArrowLeft className="size-6" />
            </Link>

            {modal.content}

            {loader}

            {info && (
                <iframe width="70%" className="aspect-video" src={`https://www.youtube-nocookie.com/embed/${info.videoDetails.videoId}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
            )}

            <div className="flex flex-col justify-start gap-1">
                {info && (
                    <>
                        <label className="flex w-max gap-1">
                            Salvar como:
                            <select className="border-solid border-1 border-white rounded" value={saveFormat} onChange={ev => setSaveFormat(ev.currentTarget.value as saveFormat)}>
                                <option value="mp3">MP3</option>
                                <option value="mp4">MP4</option>
                            </select>
                        </label>


                        <div className="flex gap-1 items-center">
                            Salvar em
                            <div className="bg-zinc-800 p-0.5 rounded">{savePath}</div>
                            <Button onClick={selectFolder} className="h-full">Escolher</Button>
                        </div>

                        <div className="flex justify-center">
                            <Button onClick={onDownload}>Baixar</Button>
                        </div>
                    </>
                )}
            </div>
        </div >
    )
}
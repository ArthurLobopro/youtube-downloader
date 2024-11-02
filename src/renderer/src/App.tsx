
import { Button } from "@components/Button"
import { Input } from "@components/Input"
import { useEffect, useState } from "react"
import { useModal } from "./hooks/useModal"

import "../output.css"
import { api } from "./api"
import { DownloadSucessModal } from "./components/Modals/DownloadSucessModal"
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalWrapper, OkButton } from "./components/Modals/base"
import { useLoader } from "./hooks/useLoader"
import { useLoading } from "./hooks/useLoading"
import { SearchIcon } from "./icons"

type saveFormat = "mp3" | "mp4"

export function App() {
    const [savePath, setSavePath] = useState("")
    const [url, setUrl] = useState("")
    const [saveFormat, setSaveFormat] = useState<saveFormat>("mp3")


    const modal = useModal()
    const { loader, setIsLoading } = useLoading()

    const { loadState: infoLoadState, data: info, reload } = useLoader<Awaited<ReturnType<typeof api.ytdl.getInfo>> | null>({
        loader: async () => api.ytdl.getInfo(url),
        loadOnUse: false
    })

    useEffect(() => {
        try {
            api.requestDownloadPath().then(path => {
                path && setSavePath(path)
            })


        } catch (error) { }
    }, [])

    function search() {
        url && reload()
    }

    useEffect(() => {
        if (infoLoadState === "error") {
            modal.open(
                <ModalWrapper>
                    <Modal onClose={() => {
                        setUrl("")
                        modal.close()
                    }} type="alert">
                        <ModalHeader title="Erro ao acessar link" closeIcon />
                        <ModalBody>
                            Verifique se o link está correto e tente novamente
                        </ModalBody>
                        <ModalFooter>
                            <OkButton />
                        </ModalFooter>
                    </Modal>
                </ModalWrapper>
            )
        } else {
            setIsLoading(infoLoadState === "loading")
        }
    }, [infoLoadState])

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
        <div className="flex flex-col gap-1 w-full justify-center items-center">
            {modal.content}

            {loader}

            <div className="flex items-center">
                <input
                    placeholder="Video URL"
                    type="url"
                    value={url}
                    size={50}
                    className="rounded-s p-1 border-2 border-solid border-gray-600 focus-within:border-blue-500 border-r-0 text-foreground bg-background"
                    onChange={ev => setUrl(ev.currentTarget.value)}
                />
                <button type="button" className="bg-blue-500 grid place-content-center h-full rounded-e" onClick={search}>
                    <SearchIcon className="follow-colors text-white size-8" />
                </button>
            </div>

            {info && (
                <img src={info.videoDetails.thumbnails.at(-1)?.url} width="70%" />
            )}

            <div className="flex flex-col justify-start gap-1">


                {info && (
                    <>
                        <label className="flex gap-1">
                            Salvar como:
                            <select value={saveFormat} onChange={ev => setSaveFormat(ev.currentTarget.value as saveFormat)}>
                                <option value="mp3">MP3</option>
                                <option value="mp4">MP4</option>
                            </select>
                        </label>

                        <label className="flex gap-1 items-center">
                            Salvar em
                            <Input type="text" id="path-to-save" disabled value={savePath} />
                            <Button onClick={selectFolder}>Escolher</Button>
                        </label>

                        <div className="flex justify-center">
                            <Button onClick={onDownload}>Baixar</Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
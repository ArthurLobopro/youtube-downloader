import { api } from "@renderer/api"
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalWrapper, OkButton } from "./base"

interface DownloadSucessModalProps {
    onClose: () => void
    filePath: string
}

export function DownloadSucessModal({ onClose, filePath }: DownloadSucessModalProps) {
    return (
        <ModalWrapper>
            <Modal onClose={onClose} type="alert">
                <ModalHeader title="Donwload Completo" closeIcon />
                <ModalBody>
                    Você pode acessar o arquivo em: {" "}
                    <span
                        className="text-blue-500 cursor-pointer hover:underline"
                        onClick={() => api.shell.showItemInFolder(filePath)}>
                        {filePath}
                    </span>
                </ModalBody>
                <ModalFooter>
                    <OkButton />
                </ModalFooter>
            </Modal>
        </ModalWrapper>
    )
}
import { shell } from "electron"
import { Modal, ModalBody, ModalFooter, ModalHeader, OkButton } from "./base"

interface DownloadSucessModalProps {
    onClose: () => void
    filePath: string
}

export function DownloadSucessModal({ onClose, filePath }: DownloadSucessModalProps) {
    return (
        <Modal onClose={onClose} type="alert">
            <ModalHeader title="Donwload Completo" />
            <ModalBody>
                Você pode acessar o arquivo em:
                <span
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() => shell.openExternal(filePath)}>
                    {filePath}
                </span>
            </ModalBody>
            <ModalFooter>
                <OkButton />
            </ModalFooter>
        </Modal>
    )
}
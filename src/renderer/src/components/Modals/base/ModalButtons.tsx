import { useContext } from "react"
import { ModalContext } from "../../../contexts/ModalContext"
import { ReactComponent as CloseIcon } from "../../../icons/svgs/close-icon.svg"
import { CircleButton } from "../../buttons/CircleButton"

interface GeneralButtonProps {
  text?: string
  autoFocus?: boolean
}

export function CancelButton({
  text = "Cancelar",
  autoFocus = false,
}: GeneralButtonProps) {
  const { onClose } = useContext(ModalContext)

  return (
    <button
      className="bg-red-500 text-white px-3 py-1 rounded-sm"
      type="button"
      onClick={() => onClose(false)}
      autoFocus={autoFocus}
    >
      {text}
    </button>
  )
}

type OkButtonProps = GeneralButtonProps

export function OkButton({ text = "OK", autoFocus = true }: OkButtonProps) {
  const { onClose } = useContext(ModalContext)

  return (
    <button
      className="bg-blue-400 text-white px-3 py-1 rounded-sm"
      onClick={() => onClose(true)}
      type="button"
      autoFocus={autoFocus}
    >
      {text}
    </button>
  )
}

type SubmitButtonProps = Omit<GeneralButtonProps, "autoFocus">

export function SubmitButton({ text = "Enviar" }: SubmitButtonProps) {
  return <button type="submit">{text}</button>
}

export function CloseModalButton() {
  const { onClose } = useContext(ModalContext)

  return (
    <CircleButton
      title="Fechar"
      small
      onClick={onClose.bind(null, false)}
      useDiv={true}
      className="hover:text-red-500"
    >
      <CloseIcon className="fill-current stroke-current" />
    </CircleButton>
  )
}

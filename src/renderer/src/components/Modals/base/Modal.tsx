/* eslint-disable prettier/prettier */
import { useMemo } from "react"
import { ModalContext } from "../../../contexts/ModalContext"

import "./modal.css"

type ModalProps = React.PropsWithChildren<
  (
    | {
      type: "alert"
      onClose: VoidFunction
    }
    | {
      type: "confirm"
      onClose: (confirm: boolean) => void
    }
  ) & {
    shouldClose?: () => Promise<boolean>
    className?: string
    id?: string
  }
>

export function Modal(props: ModalProps) {
  const handleClose = useMemo(() => {
    return props.type === "alert"
      ? async () => {
        if (props.shouldClose) {
          const should_close = await props.shouldClose()
          if (!should_close) {
            return
          }
        }

        props.onClose()
      }
      : async (confirm: boolean) => {
        if (props.shouldClose) {
          const should_close = await props.shouldClose()
          if (!should_close) {
            return
          }
        }

        props.onClose(confirm)
      }
  }, [props.type, props.shouldClose])

  return (
    <ModalContext.Provider value={{ onClose: handleClose }}>
      <div
        className={[
          `modal p-2 rounded ${props.className || ""}`,
          document.body.classList.contains("dark")
            ? "bg-neutral-900 text-foreground"
            : "bg-slate-200",
        ].join(" ")}
        id={props.id}
      >
        {props.children}
      </div>
    </ModalContext.Provider>
  )
}

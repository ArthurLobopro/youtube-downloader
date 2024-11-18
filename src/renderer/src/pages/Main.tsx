import { api } from "@renderer/api";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalWrapper,
  OkButton,
} from "@renderer/components/Modals/base";
import { useLoading } from "@renderer/hooks/useLoading";
import { useModal } from "@renderer/hooks/useModal";
import { SearchIcon } from "@renderer/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Main() {
  const [url, setUrl] = useState("");

  const modal = useModal();
  const { loader, setIsLoading } = useLoading();

  const navigate = useNavigate();

  async function search() {
    setIsLoading(true);

    api.ytdl
      .getInfo(url)
      .then((info) => {
        navigate("/download", { state: { info, url } });
      })
      .catch((err) => {
        setIsLoading(false);

        console.log(err);

        modal.open(
          <ErrorModal
            onClose={() => {
              setUrl("");
              modal.close();
            }}
          />,
        );
      });
  }

  return (
    <div className="flex flex-col gap-1 w-full justify-center items-center">
      {modal.content}

      {loader}

      <div className="flex items-center w-4/5">
        <input
          placeholder="Video URL"
          type="url"
          value={url}
          className="w-full rounded-s p-1 border-2 border-solid border-gray-600 focus-within:border-blue-500 border-r-0 text-foreground bg-background"
          onChange={(ev) => setUrl(ev.currentTarget.value)}
        />
        <button
          type="button"
          className="w-10 bg-blue-500 grid place-content-center h-full rounded-e"
          onClick={search}
        >
          <SearchIcon className="follow-colors text-white size-8" />
        </button>
      </div>
    </div>
  );
}

function ErrorModal(props: { onClose: VoidFunction }) {
  return (
    <ModalWrapper>
      <Modal onClose={props.onClose} type="alert">
        <ModalHeader title="Erro ao acessar link" closeIcon />
        <ModalBody>
          Verifique se o link está correto e tente novamente
        </ModalBody>
        <ModalFooter>
          <OkButton />
        </ModalFooter>
      </Modal>
    </ModalWrapper>
  );
}

import { useEffect, useState } from "react"

interface useLoaderParams<T> {
    loader: () => Promise<T>
    defaultValue?: T
    loadOnUse?: boolean
}

type loadState = "loading" | "loaded" | "error" | "unloaded"

export function useLoader<T>({ loader, defaultValue, loadOnUse = true }: useLoaderParams<T>) {
    const [loadState, setLoadState] = useState<loadState>(loadOnUse ? "loading" : "unloaded")
    const [data, setData] = useState<T>(defaultValue as T)

    useEffect(() => {
        if (loadState === "loading") {
            loader()
                .then((data) => {
                    setData(data)
                    setLoadState("loaded")
                })
                .catch((error) => {
                    console.log(error)
                    setLoadState("error")
                })
        }
    }, [loadState, loader])

    function reload() {
        setLoadState("loading")
    }

    return {
        loadState,
        data,
        reload,
    }
}
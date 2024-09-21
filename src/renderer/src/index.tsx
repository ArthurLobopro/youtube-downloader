import { createRoot } from "react-dom/client"
import { App } from "./App"

window.addEventListener("DOMContentLoaded", () => {
    const root = createRoot(document.querySelector("#root") as HTMLDivElement)

    root.render(<App />)
})
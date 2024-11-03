import { createRoot } from "react-dom/client"
import { AppRoutes } from "./AppRoutes"

import "../output.css"

window.addEventListener("DOMContentLoaded", () => {
    const root = createRoot(document.querySelector("#root") as HTMLDivElement)

    document.body.className = "dark"

    root.render(<AppRoutes />)
})
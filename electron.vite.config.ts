import react from "@vitejs/plugin-react"
import { defineConfig, externalizeDepsPlugin } from "electron-vite"
import { join } from "path"
import { AliasOptions } from "vite"
import svgr from "vite-plugin-svgr"

const defaultAliases: AliasOptions = [
    {
        find: "@schemas",
        replacement: join(__dirname, "src/schemas")
    },
    {
        find: "@renderer",
        replacement: join(__dirname, "src/renderer/src")
    },
    {
        find: "@components",
        replacement: join(__dirname, "src/renderer/src/components")
    }
]

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()]
    },
    preload: {
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        resolve: {
            alias: defaultAliases
        },
        plugins: [
            react(),
            svgr({
                svgrOptions: {
                    expandProps: "end",
                    namedExport: "ReactComponent",
                    exportType: "named",
                    svgProps: {}
                },
                include: ["**/*.svg"]
            }),
        ]
    }
})
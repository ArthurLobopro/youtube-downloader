const path = require("node:path")


/** @typedef  {import("webpack").Configuration} Configuration*/
/** @typedef {import("webpack").RuleSetRule} Rule */

/** @type {Configuration["resolve"]} */
const commomResolve = {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    mainFields: ["browser", "module", "main"],
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
        "node:os": "os",
        "node:path": "path",
        "node:fs": "fs",
        "node:crypto": "crypto"
    },
    fallback: {},
}

/** @type {Rule} */
const tsRule = {
    test: /\.(ts|tsx)$/,
    exclude: [/node_modules/],
    use: [
        {
            loader: "ts-loader",
        },
    ],
}

/** @type {Configuration["module"]} */
const reactModule = {
    rules: [
        tsRule,
        {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
        },
        {
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: [
                {
                    loader: "@svgr/webpack",
                    options: {
                        exportType: "named",
                        namedExport: "ReactComponent",
                        expandProps: "end",
                        svgProps: {},
                        plugins: ["@svgr/plugin-jsx"],
                    },
                },
            ],
        },
    ],
}

/**
 * @param {{mode: "production" | "development"}} argv
 * @returns {Configuration[]}
 * */
const config = (env, argv) => {
    const devtool = argv.mode === "production" ? false : "source-map"

    /** @type {Configuration} */
    const common = {
        target: "node",
        devtool,
        resolve: commomResolve,
    }

    return [
        {
            ...common,
            entry: {
                renderer: path.resolve(__dirname, "src/renderer/renderer.ts"),
                main: path.resolve(__dirname, "src/main/main.ts"),
            },
            output: {
                path: path.resolve(__dirname, "dist"),
                filename: "[name]/[name].js",
            },
            module: { rules: [tsRule] },
            externals: {
                electron: "commonjs electron"
            },
        },
    ]
}

module.exports = config

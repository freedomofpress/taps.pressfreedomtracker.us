import path from 'path'
import { readFile } from 'fs/promises'
import pluginWebc from "@11ty/eleventy-plugin-webc"

import preactRender from 'preact-render-to-string'
import { html } from 'htm/preact'

export default async function(eleventyConfig) {
    // WebC template support
	eleventyConfig.addPlugin(pluginWebc, {
        components: [
            'src/_components/**/*.webc',
        ]
    })

    // Preact SSR template filter
    eleventyConfig.addFilter('preact', async (filePath, props) => {
        // Timestamp is a cachebreaker that forces the import to be re-evaluated
        // so that live updates work
        const path = !!process.env.PROD ? filePath : filePath + '?t=' + Date.now()
        const appDefinition = await import(path)
        const output = preactRender(html`<${appDefinition.default} ...${props} />`)
        return output
    })

    // ESBuild
    eleventyConfig.on('eleventy.after', async ({ dir, results, runMode, outputMode }) => {
        const esbuild = await import("esbuild")
        const entryPoints = [
            {
                in: path.join(dir.input, 'preact', 'entry.js'),
                out: path.join('preact-components'),
            },
        ]
        await esbuild.build({
            entryPoints,
            format: 'esm',
            outdir: dir.output,
            bundle: true,
            minify: +process.env.PROD ? true : false,
            sourcemap: true,
            define: {
                'PROD': process.env.PROD,
            }
        })
    })
    eleventyConfig.addWatchTarget("src/preact/**.js")

    eleventyConfig.addPassthroughCopy("src/media")
}

export const config = {
    dir: {
        input: "src",
        output: "dist",
        layouts: "_layouts",
    }
}

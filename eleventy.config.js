import path from 'path'
import { readFile, writeFile, mkdir } from 'fs/promises'
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
    eleventyConfig.addWatchTarget("./src/preact/")

    // ESBuild
    eleventyConfig.on('eleventy.before', async ({ dir, results, runMode, outputMode }) => {
        const esbuild = await import("esbuild")
        const entryPoints = [
            {
                in: path.join(dir.input, 'preact', 'entry.js'),
                out: 'preact-components',
            },
        ]
        const result = await esbuild.build({
            entryPoints,
            format: 'esm',
            outdir: dir.output,
            bundle: true,
            minify: +process.env.PROD ? true : false,
            sourcemap: true,
            define: {
                'PROD': process.env.PROD,
            },
            entryNames: '[name]-[hash]',
            metafile: true
        })

        // Save metafile for use in templates
        await mkdir('.cache', { recursive: true }) // Create cache dir if doesn't exist
        await writeFile('.cache/esbuild-meta.json', JSON.stringify(result.metafile), 'utf-8')
    })

    // Filter to get esbuild output path
    eleventyConfig.addFilter('asset', async (entryPoint) => {
        const metaJson = await readFile('.cache/esbuild-meta.json', 'utf-8')
        const meta = JSON.parse(metaJson)
        const outputs = Object.entries(meta.outputs)
        const outputMeta = outputs.find(([name, output]) => output.entryPoint === 'src/' + entryPoint)
        return outputMeta[0].replace(/^dist\//, '/')
    })

    eleventyConfig.addPassthroughCopy("src/media")
}

export const config = {
    dir: {
        input: "src",
        output: "dist",
        layouts: "_layouts",
    }
}

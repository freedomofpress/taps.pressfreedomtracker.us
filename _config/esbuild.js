import path from 'path'
import { readFile, writeFile, mkdir } from 'fs/promises'

export default eleventyConfig => {
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
}
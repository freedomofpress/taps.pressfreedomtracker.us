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
			"npm:@11ty/is-land/*.webc",
        ]
    })

    eleventyConfig.addFilter('preact', async (filePath, props) => {
        const appDefinition = await import(filePath)
        const output = preactRender(html`<${appDefinition.default} ...${props} />`)
        return output
    })

    eleventyConfig.addPassthroughCopy("src/media")
    eleventyConfig.addPassthroughCopy("src/preact")
}

export const config = {
    dir: {
        input: "src",
        output: "dist",
        layouts: "_layouts",
    }
}
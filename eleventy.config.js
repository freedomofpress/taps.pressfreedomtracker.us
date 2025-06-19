import pluginWebc from "@11ty/eleventy-plugin-webc"

import globals from './_config/globals.js'
import esbuild from './_config/esbuild.js'
import preact from './_config/preact.js'

export default async function(eleventyConfig) {
    // Add our global data
    Object.entries(globals).forEach(
        ([key, value]) => eleventyConfig.addGlobalData(key, value)
    )

    // WebC template support
	eleventyConfig.addPlugin(pluginWebc, {
        components: [
            'src/_components/**/*.webc',
        ]
    })

    // Preact SSR template filter
    eleventyConfig.addPlugin(preact, {
        componentsDir: 'src/preact/components'
    })

    // ESBuild
    eleventyConfig.addPlugin(esbuild)

    // Copy media
    eleventyConfig.addPassthroughCopy("src/media")
}

export const config = {
    dir: {
        input: "src",
        output: "dist",
        layouts: "_layouts",
    }
}

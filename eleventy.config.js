import pluginWebc from "@11ty/eleventy-plugin-webc"

export default async function(eleventyConfig) {
	eleventyConfig.addPlugin(pluginWebc)

    eleventyConfig.addPassthroughCopy("src/media")
}

export const config = {
    dir: {
        input: "src",
        output: "dist",
        layouts: "_layouts",
    }
}
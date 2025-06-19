import path from 'path'

import preactRender from 'preact-render-to-string'
import { html } from 'htm/preact'

export default (eleventyConfig, { componentsDir }) => {
    eleventyConfig.addFilter('preact', async (fileName, props) => {
        const fullPath = [
            path.join(process.env.ELEVENTY_ROOT, componentsDir, fileName),
            // Timestamp is a cachebreaker that forces the import to be re-evaluated
            // so that live updates work
            !!process.env.PROD ? '' : fileName + '?t=' + Date.now()
        ].join('')
        const appDefinition = await import(fullPath)
        const output = preactRender(html`<${appDefinition.default} ...${props} />`)
        return output
    })
    eleventyConfig.addWatchTarget("./src/preact/")
}
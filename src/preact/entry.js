// Enable debug mode in development
if (+PROD === 0) await import('preact/debug')

import { hydrate } from 'preact'
import { html } from 'htm/preact'

// Import all components
import PostExplorer from './components/post-explorer.js'

// Helper function to hydrate components
export function hydratePostExplorer(element, props) {
    hydrate(html`<${PostExplorer} ...${props} />`, element)
}

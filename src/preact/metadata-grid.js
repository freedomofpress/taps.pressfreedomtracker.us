import { h } from 'preact'
import { html } from 'htm/preact'

const MetadataGrid = ({ children }) => {
  return html`
    <dl class="metadata-grid">
      ${children}
    </dl>
  `
}

export default MetadataGrid

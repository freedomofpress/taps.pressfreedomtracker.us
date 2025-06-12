import { html } from 'htm/preact'
import FilterLink from './filter-link.js'

const PostType = ({ name }) => {
  return html`
    <span class="post-type">
      <${FilterLink}
        filterType="type"
        value=${name}
        className="post-type-link"
      />
    </span>
  `
}

export default PostType

import { html } from 'htm/preact'
import FilterLink from './filter-link.js'

const PostTag = ({ name }) => {
  return html`
    <span class="post-tag">
      <${FilterLink}
        filterType="tag"
        value=${name}
        className="post-tag-link"
      />
    </span>
  `
}

export default PostTag

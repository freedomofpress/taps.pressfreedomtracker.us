import { html } from 'htm/preact'

const PostTag = ({ name }) => {
  return html`
    <span class="post-tag">
      <a href="#" class="post-tag-link" title=${name}>${name}</a>
    </span>
  `
}

export default PostTag

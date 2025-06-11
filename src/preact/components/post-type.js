import { html } from 'htm/preact'

const PostType = ({ name }) => {
  return html`
    <span class="post-type">
      <a href="#" class="post-type-link" title=${name}>${name}</a>
    </span>
  `
}

export default PostType

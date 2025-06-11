import { html } from 'htm/preact'

const PostType = ({ name }) => {
  return html`
    <span class="post-type">
      <a href="#" class="post-type-link">${name}</a>
    </span>
  `
}

export default PostType

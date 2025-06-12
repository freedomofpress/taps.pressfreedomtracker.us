import { html } from 'htm/preact'
import PostFull from './post-full.js'

const PostList = ({ posts }) => {
    return html`
        <div class="post-list">
            ${posts.map(post => html`<${PostFull} post=${post} horizontal=${true} />`)}
        </div>
    `
}

export default PostList

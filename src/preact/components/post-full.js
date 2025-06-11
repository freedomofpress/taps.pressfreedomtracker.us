import { html } from 'htm/preact'
import PostTag from './post-tag.js'
import PostType from './post-type.js'
import PostBody from './post-body.js'
import MetadataGrid from './metadata-grid.js'

const PostFull = ({ post, horizontal }) => {
  if (!post) return null

  const formattedDate = new Date(post.date).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return html`
    <div class="post-full-container">
        <article class="post-full ${horizontal ? 'horizontal' : ''}" data-hash=${post.hash}>
        <img class="post-avatar" src="/media/avatar.jpeg" alt="Avatar" />
        <div class="post-author">
            <div class="post-author-name">Donald J. Trump</div>
            <div class="post-author-handle">@realDonaldTrump</div>
        </div>
        <${PostBody} post=${post} />
        <div class="post-metadata">
            <${MetadataGrid}>
            <dt>Posted</dt>
            <dd>
                <a class="post-link" href=${`/post/${post.hash}/`}>
                <time datetime=${post.dateString}>${formattedDate}</time>
                </a>
                (<a class="post-link" href=${post.link}>${post.platform}</a>)
            </dd>
            ${post.primaryTarget && html`
                <dt>Target</dt>
                <dd>
                ${post.secondaryTarget && post.primaryTarget !== post.secondaryTarget
                    ? html`
                    <span>${post.primaryTarget}</span>
                    (<span>${post.secondaryTarget}</span>)
                    `
                    : html`<span>${post.primaryTarget}</span>`
                }
                </dd>
            `}
            ${post.tags && html`
                <dt>Tags</dt>
                <dd>
                ${post.tags.map((tag, i) => html`<${PostTag} key=${i} name=${tag} />`)}
                </dd>
            `}
            ${post.type && html`
                <dt>Type</dt>
                <dd>
                ${post.type.map((type, i) => html`<${PostType} key=${i} name=${type} />`)}
                </dd>
            `}
            </${MetadataGrid}>
        </div>
        </article>
    </div>
  `
}

export default PostFull

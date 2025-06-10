import { h } from 'preact'
import { html } from 'htm/preact'
import PostTag from './post-tag.js'
import PostType from './post-type.js'
import MetadataGrid from './metadata-grid.js'

const PostFull = ({ post, horizontal }) => {
  if (!post) return null

  const getContentSizeClass = (text) => {
    if (text.length > 500) return 'long'
    if (text.length > 200) return 'medium'
    return 'short'
  }

  const articleStyle = {
    '--avatar-size': '60px',
    '--padding': 'var(--line-height-base)',
    '--metadata-width': '50%',
    marginBottom: 'var(--line-height-base)',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
    display: 'grid',
    gridTemplateColumns: horizontal
      ? 'calc(var(--avatar-size) + var(--padding)) auto calc(var(--metadata-width) - var(--padding))'
      : 'calc(var(--avatar-size) + var(--padding)) 1fr',
    gridTemplateAreas: horizontal
      ? '"avatar author metadata" "avatar content metadata"'
      : '"avatar author" "avatar content" "metadata metadata"',
    gap: '0 var(--line-height-base)',
    overflow: 'hidden',
    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.05)'
  }

  const avatarStyle = {
    gridArea: 'avatar',
    width: 'var(--avatar-size)',
    borderRadius: '4px',
    marginTop: 'var(--padding)',
    marginLeft: 'var(--padding)'
  }

  const authorStyle = {
    gridArea: 'author',
    paddingTop: 'var(--padding)',
    paddingRight: 'var(--padding)',
    paddingBottom: 'calc(0.5 * var(--padding))'
  }

  const contentStyle = {
    gridArea: 'content',
    fontSize: getContentSizeClass(post.content) === 'long'
      ? 'var(--font-size-base)'
      : getContentSizeClass(post.content) === 'medium'
        ? 'calc(1.5 * var(--font-size-base))'
        : 'calc(2 * var(--font-size-base))',
    paddingRight: 'var(--padding)',
    paddingBottom: 'var(--padding)'
  }

  const metadataStyle = {
    gridArea: 'metadata',
    background: 'var(--color-background-accent)',
    padding: 'var(--padding)'
  }

  const linkStyle = {
    color: 'var(--color-muted)',
    textDecoration: 'none'
  }

  const formattedDate = new Date(post.date).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return html`
    <article style=${articleStyle} data-hash=${post.hash}>
      <img style=${avatarStyle} src="/media/avatar.jpeg" alt="Avatar" />
      <div style=${authorStyle}>
        <div style=${{ fontWeight: 'bold' }}>Donald J. Trump</div>
        <div style=${{ color: 'var(--color-muted)' }}>@realDonaldTrump</div>
      </div>
      <div style=${contentStyle}>${post.content}</div>
      <div style=${metadataStyle}>
        <${MetadataGrid}>
          <dt>Posted</dt>
          <dd>
            <a style=${linkStyle} href=${`/post/${post.hash}/`}>
              <time datetime=${post.dateString}>${formattedDate}</time>
            </a>
            (<a style=${linkStyle} href=${post.link}>${post.platform}</a>)
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
              ${post.tags.map(tag => html`<${PostTag} key=${tag} name=${tag} />`)}
            </dd>
          `}
          ${post.type && html`
            <dt>Type</dt>
            <dd>
              ${post.type.map(type => html`<${PostType} key=${type} name=${type} />`)}
            </dd>
          `}
        </${MetadataGrid}>
      </div>
    </article>
  `
}

export default PostFull

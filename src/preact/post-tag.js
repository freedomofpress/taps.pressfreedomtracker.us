import { h } from 'preact'
import { html } from 'htm/preact'

const PostTag = ({ name }) => {
  const style = {
    display: 'inline-block',
    backgroundColor: 'var(--color-pft-yellow-light)',
    padding: '0.2rem 0.4rem',
    marginLeft: '0.4rem',
    marginBottom: '0.3rem',
    textDecoration: 'none',
    color: 'var(--color-base)',
    position: 'relative',
    paddingLeft: '1.2em'
  }

  const hashStyle = {
    position: 'absolute',
    left: '0.4rem',
    color: 'var(--color-muted-more)'
  }

  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit'
  }

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = 'var(--color-pft-yellow)'
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'var(--color-pft-yellow-light)'
  }

  return html`
    <span style=${style} onMouseEnter=${handleMouseEnter} onMouseLeave=${handleMouseLeave}>
      <span style=${hashStyle}>#</span>
      <a href="#" style=${linkStyle}>${name}</a>
    </span>
  `
}

export default PostTag

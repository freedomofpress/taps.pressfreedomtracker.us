import { h } from 'preact'
import { html } from 'htm/preact'

const PostType = ({ name }) => {
  const style = {
    display: 'inline-block',
    padding: '0.2rem 0.6rem',
    marginLeft: '0.4rem',
    marginBottom: '0.3rem',
    background: 'var(--color-background)',
    border: '1px solid var(--color-border)',
    borderRadius: 'calc(var(--line-height-base) / 2 + 0.2rem)',
    textDecoration: 'none',
    color: 'var(--color-base)'
  }

  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit'
  }

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = 'var(--color-border)'
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'var(--color-background)'
  }

  return html`
    <span style=${style} onMouseEnter=${handleMouseEnter} onMouseLeave=${handleMouseLeave}>
      <a href="#" style=${linkStyle}>${name}</a>
    </span>
  `
}

export default PostType

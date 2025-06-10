import { h } from 'preact'
import { html } from 'htm/preact'

const MetadataGrid = ({ children }) => {
  const style = {
    display: 'grid',
    gridTemplateColumns: '0.3fr 1fr',
    margin: 0,
    padding: 0
  }

  const dtStyle = {
    gridColumn: 1,
    fontWeight: 'bold',
    margin: 0,
    padding: 0,
    marginBottom: 'calc(0.5 * var(--line-height-base))',
    position: 'relative',
    paddingRight: '0.5em'
  }

  const ddStyle = {
    gridColumn: 2,
    margin: 0,
    padding: 0,
    marginBottom: 'calc(0.5 * var(--line-height-base))'
  }

  // Add colon to dt elements
  const processChildren = (children) => {
    return children.map(child => {
      if (child?.type === 'dt') {
        return {
          ...child,
          props: {
            ...child.props,
            style: { ...dtStyle }
          }
        }
      } else if (child?.type === 'dd') {
        return {
          ...child,
          props: {
            ...child.props,
            style: { ...ddStyle }
          }
        }
      }
      return child
    })
  }

  return html`
    <dl style=${style}>
      ${processChildren(children)}
    </dl>
  `
}

export default MetadataGrid

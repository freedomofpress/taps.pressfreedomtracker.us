import { html } from 'htm/preact'

const FilterLink = ({ filterType, value, className, children, basePath = '/' }) => {
  const handleClick = (e) => {
    if (typeof window === 'undefined') return

    e.preventDefault()

    // Update URL with the filter
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set(filterType, value)

    const newURL = `${window.location.pathname}?${urlParams.toString()}`
    window.history.pushState({}, '', newURL)

    // Trigger a popstate event to update the filters
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  // Generate the filter URL for the href
  const getFilterURL = () => {
    if (typeof window === 'undefined') {
      // Server-side rendering: generate a basic filter URL
      const urlParams = new URLSearchParams()
      urlParams.set(filterType, value)
      return `${basePath}?${urlParams.toString()}`
    }

    // Client-side: preserve existing query parameters
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set(filterType, value)
    return `${window.location.pathname}?${urlParams.toString()}`
  }

  return html`
    <a
      href=${getFilterURL()}
      class=${className}
      title="Filter by ${filterType}: ${value}"
      onClick=${handleClick}
    >
      ${children || value}
    </a>
  `
}

export default FilterLink

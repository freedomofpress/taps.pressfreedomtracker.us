import { html } from 'htm/preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import PostList from './post-list.js'
import PostFilters from './post-filters.js'

// Utility functions moved outside component to avoid redefinition on each render
const getFiltersFromURL = () => {
    if (typeof window === 'undefined') return {}

    const urlParams = new URLSearchParams(window.location.search)
    return {
        searchTerm: urlParams.get('search') || '',
        platform: urlParams.get('platform') || '',
        selectedTag: urlParams.get('tag') || '',
        selectedType: urlParams.get('type') || ''
    }
}

const hasActiveFiltersInURL = () => {
    if (typeof window === 'undefined') return false

    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.has('search') || urlParams.has('platform') || urlParams.has('tag') || urlParams.has('type')
}

const updateURLWithFilters = (filters) => {
    if (typeof window === 'undefined') return

    const urlParams = new URLSearchParams()

    if (filters.searchTerm) urlParams.set('search', filters.searchTerm)
    if (filters.platform) urlParams.set('platform', filters.platform)
    if (filters.selectedTag) urlParams.set('tag', filters.selectedTag)
    if (filters.selectedType) urlParams.set('type', filters.selectedType)

    const newURL = urlParams.toString() ?
        `${window.location.pathname}?${urlParams.toString()}` :
        window.location.pathname

    window.history.pushState({}, '', newURL)
}

const PostExplorer = ({ posts, postsPerPage = 25, initialRange = [0, 25] }) => {
    const [isClient, setIsClient] = useState(false)
    const [postStartIndex, setPostStartIndex] = useState(initialRange[0])
    const [postEndIndex, setPostEndIndex] = useState(initialRange[1])
    const [filters, setFilters] = useState(getFiltersFromURL())
    const [filteredPosts, setFilteredPosts] = useState(posts)
    const explorerRef = useRef(null)

    // Handle filter changes
    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters)
        updateURLWithFilters(newFilters)
    }

    // Handle browser back/forward navigation
    useEffect(() => {
        if (typeof window === 'undefined') return

        const handlePopState = () => {
            const newFilters = getFiltersFromURL()
            setFilters(newFilters)
        }

        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])

    // Auto-scroll to explorer if there are active filters in URL
    useEffect(() => {
        if (isClient && hasActiveFiltersInURL() && explorerRef.current) {
            // Small delay to ensure the component is fully rendered
            setTimeout(() => {
                explorerRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }, 100)
        }
    }, [isClient])

    useEffect(() => {
        // When filters are updated, reset post indices
        if (!filters.platform && !filters.searchTerm && !filters.selectedTag && !filters.selectedType) {
            setPostStartIndex(initialRange[0])
        } else {
            setPostStartIndex(0)
        }
        setPostEndIndex(postsPerPage)

        // Filter posts to matches
        setFilteredPosts(
            posts.filter(post => {
                // Check all filter conditions
                const platformMatch = !filters.platform || post.platform === filters.platform

                // Tag filter
                const tagMatch = !filters.selectedTag || (post.tags && post.tags.includes(filters.selectedTag))

                // Type filter
                const typeMatch = !filters.selectedType || (post.type && post.type.includes(filters.selectedType))

                let searchTermMatch = true
                if (filters.searchTerm) {
                    const searchTerm = filters.searchTerm.toLowerCase()
                    const content = (post.content || '').toLowerCase()
                    const types = (Array.isArray(post.type) ? post.type : []).join(' ').toLowerCase()
                    const tags = (Array.isArray(post.tags) ? post.tags : []).join(' ').toLowerCase()

                    searchTermMatch =
                        content.includes(searchTerm) ||
                        types.includes(searchTerm) ||
                        tags.includes(searchTerm)
                }

                // All conditions must match for the post to be included
                return platformMatch && tagMatch && typeMatch && searchTermMatch
            }).sort((a, b) => b.date - a.date)
        )
    }, [filters])

    useEffect(() => {
        // This will only run in the browser after hydration
        setIsClient(true)
    }, [])

    const hasMorePosts = postEndIndex < posts.length

    return html`
        <div class="post-explorer" ref=${explorerRef}>
            <h2>Full Archive</h2>
            <div class="filters-wrapper">
                <${PostFilters} onFiltersChange=${handleFiltersChange} posts=${posts} initialFilters=${filters} />
            </div>
            <div class="main">
                <${PostList} posts=${filteredPosts.slice(postStartIndex, postEndIndex)} />
                ${hasMorePosts && isClient && html`
                    <div class="pagination">
                        <button
                            class="pagination-button"
                            onClick=${() =>setPostEndIndex(postEndIndex + postsPerPage)}
                        >
                            Show 25 more posts
                        </button>
                        <button
                            class="pagination-button"
                            onClick=${() => setPostEndIndex(posts.length)}
                        >
                            Show all ${filteredPosts.length} posts
                        </button>
                    </div>
                `}
                ${hasMorePosts && !isClient && html`
                    <div class="pagination">
                        <a href="/page/2/" class="pagination-button">
                            Next Page →
                        </a>
                    </div>
                `}
            </div>
        </div>
    `
}

export default PostExplorer

import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import PostList from './post-list.js'
import PostFilters from './post-filters.js'

const PostExplorer = ({ posts, postsPerPage = 25, initialRange = [0, 25] }) => {
    const [isClient, setIsClient] = useState(false)
    const [postStartIndex, setPostStartIndex] = useState(initialRange[0])
    const [postEndIndex, setPostEndIndex] = useState(initialRange[1])
    const [filters, setFilters] = useState({})
    const [filteredPosts, setFilteredPosts] = useState(posts)

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
        <div class="post-explorer">
            <h2>Full Archive</h2>
            <div class="filters-wrapper">
                <${PostFilters} onFiltersChange=${setFilters} posts=${posts} />
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

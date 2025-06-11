import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import PostList from './post-list.js'
import PostFilters from './post-filters.js'

const PostExplorer = ({ posts }) => {
    const postsPerPage = 25
    const [isClient, setIsClient] = useState(false)
    const [postStartIndex, setPostStartIndex] = useState(0)
    const [postEndIndex, setPostEndIndex] = useState(postsPerPage)

    useEffect(() => {
        // This will only run in the browser after hydration
        setIsClient(true)
    }, [])

    const hasMorePosts = postEndIndex < posts.length

    return html`
        <div class="post-explorer">
            <div class="filters">
                <h2>Filters</h2>
                <${PostFilters} />
            </div>
            <div class="main">
                <h2>Full Archive</h2>
                <${PostList} posts=${posts.slice(postStartIndex, postEndIndex)} />
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
                            Show all ${posts.length} posts
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

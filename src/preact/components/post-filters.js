import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'

const PostFilters = ({ onFiltersChange, posts = [] }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [platform, setPlatform] = useState('')
    const [selectedTag, setSelectedTag] = useState('')
    const [selectedType, setSelectedType] = useState('')

    // Extract unique tags and types from posts
    const uniqueTags = [...new Set(posts.flatMap(post => post.tags || []))].sort()
    const uniqueTypes = [...new Set(posts.flatMap(post => post.type || []))].sort()

    const updateFilters = (newFilters) => {
        onFiltersChange({
            searchTerm,
            platform,
            selectedTag,
            selectedType,
            ...newFilters
        })
    }

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value
        setSearchTerm(newSearchTerm)
        updateFilters({ searchTerm: newSearchTerm })
    }

    const handlePlatformChange = (e) => {
        const newPlatform = e.target.value
        setPlatform(newPlatform)
        updateFilters({ platform: newPlatform })
    }

    const handleTagChange = (e) => {
        const newSelectedTag = e.target.value
        setSelectedTag(newSelectedTag)
        updateFilters({ selectedTag: newSelectedTag })
    }

    const handleTypeChange = (e) => {
        const newSelectedType = e.target.value
        setSelectedType(newSelectedType)
        updateFilters({ selectedType: newSelectedType })
    }

    const handleClearFilters = () => {
        setSearchTerm('')
        setPlatform('')
        setSelectedTag('')
        setSelectedType('')
        onFiltersChange({ searchTerm: '', platform: '', selectedTag: '', selectedType: '' })
    }

    return html`
        <div class="post-filters">
            <div class="filter-group">
                <label>Search posts:</label>
                <input
                    type="search"
                    class="filter-search"
                    value=${searchTerm}
                    onInput=${handleSearchChange}
                />
            </div>

            <div class="filter-group">
                <label>Platform:</label>
                <select
                    class="filter-platform"
                    value=${platform}
                    onChange=${handlePlatformChange}
                >
                    <option value="">All platforms</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Truth Social">Truth Social</option>
                </select>
            </div>

            <div class="filter-group">
                <label>Tag:</label>
                <select
                    class="filter-tag"
                    value=${selectedTag}
                    onChange=${handleTagChange}
                >
                    <option value="">All tags</option>
                    ${uniqueTags.map(tag => html`
                        <option key=${tag} value=${tag}>${tag}</option>
                    `)}
                </select>
            </div>

            <div class="filter-group">
                <label>Type:</label>
                <select
                    class="filter-type"
                    value=${selectedType}
                    onChange=${handleTypeChange}
                >
                    <option value="">All types</option>
                    ${uniqueTypes.map(type => html`
                        <option key=${type} value=${type}>${type}</option>
                    `)}
                </select>
            </div>

            <div class="filter-group">
                <button
                    type="button"
                    class="filter-clear"
                    onClick=${handleClearFilters}
                >
                    × Clear all filters
                </button>
            </div>
        </div>
    `
}

export default PostFilters

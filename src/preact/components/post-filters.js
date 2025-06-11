import { html } from 'htm/preact'
import { useState } from 'preact/hooks'

const PostFilters = ({ onFiltersChange }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [platform, setPlatform] = useState('')

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value
        setSearchTerm(newSearchTerm)
        onFiltersChange({ searchTerm: newSearchTerm, platform })
    }

    const handlePlatformChange = (e) => {
        const newPlatform = e.target.value
        setPlatform(newPlatform)
        onFiltersChange({ searchTerm, platform: newPlatform })
    }

    const handleClearFilters = () => {
        setSearchTerm('')
        setPlatform('')
        onFiltersChange({ searchTerm: '', platform: '' })
    }

    return html`
        <div class="filter-container">
            <div class="filter-group">
                <label>Search posts:</label>
                <input
                    type="text"
                    class="filter-search"
                    placeholder="Search content..."
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

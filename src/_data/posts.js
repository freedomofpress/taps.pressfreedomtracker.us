import Fetch from '@11ty/eleventy-fetch'
import Papa from 'papaparse'
import crypto from 'crypto'
import Image from '@11ty/eleventy-img'

function hashString(str) {
    const hash = crypto.createHash('sha256')
    hash.update(str)
    return hash.digest('hex').substring(0, 12)
}

/**
 * Extract and process image URLs from content using image URL patterns
 * @param {string} content - The content to extract images from
 * @param {RegExp[]} imageUrlPatterns - Array of regex patterns to match image URLs
 * @returns {Promise<{images: Object[], cleanContent: string}>} - Object with processed images and cleaned content
 */
async function extractImages(content, imageUrlPatterns) {
    if (!content || !imageUrlPatterns || imageUrlPatterns.length === 0) {
        return { images: [], cleanContent: content }
    }

    const images = []
    let cleanContent = content
    const allMatches = []

    // Collect matches from all patterns
    for (const pattern of imageUrlPatterns) {
        pattern.lastIndex = 0
        const matches = content.match(pattern)
        if (matches) {
            allMatches.push(...matches)
        }
    }

    if (allMatches.length > 0) {
        // Remove the URLs from content using all patterns
        for (const pattern of imageUrlPatterns) {
            pattern.lastIndex = 0
            cleanContent = cleanContent.replace(pattern, '').trim()
        }
        // Clean up any double spaces
        cleanContent = cleanContent.replace(/\s+/g, ' ').trim()

        // Process each image URL with eleventy-img
        for (const imageUrl of allMatches) {
            try {
                const metadata = await Image(imageUrl, {
                    widths: [300, 600, 900],
                    formats: ['webp', 'jpeg'],
                    outputDir: './dist/img/',
                    urlPath: '/img/'
                })

                // Create image object with multiple sizes and formats
                const imageData = {
                    original: imageUrl,
                    sizes: {},
                    alt: ''
                }

                // Process the metadata structure
                if (metadata && typeof metadata === 'object' && Object.keys(metadata).length > 0) {
                    for (const [format, formatImages] of Object.entries(metadata)) {
                        if (Array.isArray(formatImages) && formatImages.length > 0) {
                            imageData.sizes[format] = formatImages.map(img => ({
                                url: img.url,
                                width: img.width,
                                height: img.height,
                                size: img.size
                            }))
                        }
                    }
                } else {
                    // If eleventy-img failed to process, fallback to original URL
                    console.warn(`Could not process image ${imageUrl}, using fallback`)
                    imageData.sizes.fallback = [{
                        url: imageUrl,
                        width: null,
                        height: null,
                        size: null
                    }]
                }

                images.push(imageData)
            } catch (error) {
                console.warn(`Failed to process image ${imageUrl}:`, error.message)
                // Fallback to original URL if processing fails
                images.push({
                    original: imageUrl,
                    sizes: {
                        fallback: [{
                            url: imageUrl,
                            width: null,
                            height: null,
                            size: null
                        }]
                    },
                    alt: '',
                    error: error.message
                })
            }
        }
    }

    return { images, cleanContent }
}

/**
 * Split a comma-separated string while preserving phrases in quotes
 * @param {string} str - The string to split
 * @returns {string[]} - Array of trimmed strings with quotes removed
 */
function splitPreservingQuotes(str) {
    if (!str || str.trim() === '') return []

    const result = []
    let current = ''
    let inQuotes = false
    let quoteChar = null

    for (let i = 0; i < str.length; i++) {
        const char = str[i]

        if ((char === '"' || char === "'") && !inQuotes) {
            // Starting a quoted section
            inQuotes = true
            quoteChar = char
            // Don't add the opening quote to current
        } else if (char === quoteChar && inQuotes) {
            // Ending a quoted section
            inQuotes = false
            quoteChar = null
            // Don't add the closing quote to current
        } else if (char === ',' && !inQuotes) {
            // Found a comma outside of quotes, split here
            if (current.trim() !== '') {
                result.push(current.trim())
            }
            current = ''
        } else {
            // Add character to current string
            current += char
        }
    }

    // Add the last part
    if (current.trim() !== '') {
        result.push(current.trim())
    }

    return result.filter(item => item !== '')
}

export default async function (configData) {
    let truthCSV = await Fetch(configData.truthSocialCsvUrl, {
        duration: "1d",
        type: "text"
    })
    const truthPosts = await Promise.all(
        Papa.parse(String(truthCSV), {
            header: true,
            skipEmptyLines: true
        }).data
            .filter(d => d.Content)
            .map(async d => {
                const [month, day, year] = d.Date.split('/').map(Number)
                const date = new Date(year, month - 1, day)
                let dateString
                try {
                    dateString = date.toISOString()
                } catch {
                    console.log('Error parsing date for post:' + d.Content)
                    dateString = ''
                }
                const { images, cleanContent } = await extractImages(d.Content, configData.imageUrlPatterns)
                return {
                    platform: "Truth Social",
                    type: splitPreservingQuotes(d.Type),
                    primaryTarget: d['Primary Target'],
                    secondaryTarget: d['Secondary Target'],
                    mediaDescription: d['Media Description'],
                    link: d.Link,
                    content: cleanContent,
                    images,
                    tags: splitPreservingQuotes(d.Tags),
                    hash: hashString(`${d.platform || 'Unknown'}${d.Content}${dateString || 'InvalidDate'}`),
                    date,
                    dateString
                }
            })
    ).then(posts => posts.filter(d => d.content !== ''))

    let twitterCSV = await Fetch(configData.twitterCsvUrl, {
        duration: "1d",
        type: "text"
    })
    const twitterPosts = await Promise.all(
        Papa.parse(String(twitterCSV), {
            header: true,
            skipEmptyLines: true
        }).data
            .filter(d => d.Content)
            .map(async d => {
                const [month, day, year] = d.Date.split('/').map(Number)
                const date = new Date(year, month - 1, day)
                let dateString
                try {
                    dateString = date.toISOString()
                } catch {
                    console.log('Error parsing date for post:' + d.Content)
                    dateString = ''
                }
                const { images, cleanContent } = await extractImages(d.Content, configData.imageUrlPatterns)
                return {
                    platform: "Twitter",
                    type: splitPreservingQuotes(d.Type),
                    tags: splitPreservingQuotes(d.Tags),
                    primaryTarget: d['Primary Target'],
                    secondaryTarget: d['Secondary Target'],
                    mediaDescription: d['Media Description'],
                    link: d.Link,
                    content: cleanContent,
                    images,
                    hash: hashString(`${d.platform || 'Unknown'}${d.Content}${dateString || 'InvalidDate'}`),
                    date,
                    dateString
                }
            })
    ).then(posts => posts.filter(d => d.content !== ''))

    // Deduplicate posts by hash and sort by date (newest first)
    const allPosts = [...twitterPosts, ...truthPosts]
        .reverse() // The sheets are sorted date ascending, but we need descending
        .filter((post, index, self) =>
            index === self.findIndex(p => p.hash === post.hash)
        )
        .map((d, i) => ({ ...d, i: i }))

    return allPosts
}

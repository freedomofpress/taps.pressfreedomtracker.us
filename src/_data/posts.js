import Fetch from '@11ty/eleventy-fetch'
import Papa from 'papaparse'
import crypto from 'crypto'

const TRUTH_SOCIAL_URL = 'https://docs.google.com/spreadsheets/d/1vbsoLq-Z5_kJaV0GOFMOqyo3dL9S1SKfUSkNWdYtMtU/export?format=csv&id=1vbsoLq-Z5_kJaV0GOFMOqyo3dL9S1SKfUSkNWdYtMtU&gid=201966548'
const TWITTER_URL = 'https://docs.google.com/spreadsheets/d/1vbsoLq-Z5_kJaV0GOFMOqyo3dL9S1SKfUSkNWdYtMtU/export?format=csv&id=1vbsoLq-Z5_kJaV0GOFMOqyo3dL9S1SKfUSkNWdYtMtU&gid=0'

function hashString(str) {
    const hash = crypto.createHash('sha256')
    hash.update(str)
    return hash.digest('hex').substring(0, 12)
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

export default async function () {
    let truthCSV = await Fetch(TRUTH_SOCIAL_URL, {
        duration: "1d",
        type: "text"
    })
    const truthPosts = Papa.parse(truthCSV, { header: true }).data
        .filter(d => d.Content)
        .map(d => {
            const [month, day, year] = d.Date.split('/').map(Number)
            const date = new Date(year, month - 1, day)
            let dateString
            try {
                dateString = date.toISOString()
            } catch {
                console.log('Error parsing date for post:' + d.Content)
                dateString = ''
            }
            return {
                platform: "Truth Social",
                type: splitPreservingQuotes(d.Type),
                primaryTarget: d['Primary Target'],
                secondaryTarget: d['Secondary Target'],
                mediaDescription: d['Media Description'],
                link: d.Link,
                content: d.Content,
                tags: splitPreservingQuotes(d.Tags),
                hash: hashString(`${d.platform || 'Unknown'}${d.Content}${dateString || 'InvalidDate'}`),
                date,
                dateString
            }
        }).filter(d => d.content !== '')

    let twitterCSV = await Fetch(TWITTER_URL, {
        duration: "1d",
        type: "text"
    })
    const twitterPosts =  Papa.parse(twitterCSV, { header: true }).data
        .filter(d => d.Content)
        .map(d => {
            const [month, day, year] = d.Date.split('/').map(Number)
            const date = new Date(year, month - 1, day)
            let dateString
            try {
                dateString = date.toISOString()
            } catch {
                console.log('Error parsing date for post:' + d.Content)
                dateString = ''
            }
            return {
                platform: "Twitter",
                type: splitPreservingQuotes(d.Type),
                tags: splitPreservingQuotes(d.Tags),
                primaryTarget: d['Primary Target'],
                secondaryTarget: d['Secondary Target'],
                mediaDescription: d['Media Description'],
                link: d.Link,
                content: d.Content,
                hash: hashString(`${d.platform || 'Unknown'}${d.Content}${dateString || 'InvalidDate'}`),
                date,
                dateString
            }
        }).filter(d => d.content !== '')

    // Deduplicate posts by hash and sort by date (newest first)
    const allPosts = [...twitterPosts, ...truthPosts]
        .reverse() // The sheets are sorted date ascending, but we need descending
        .filter((post, index, self) =>
            index === self.findIndex(p => p.hash === post.hash)
        )
        .map((d, i) => ({ ...d, i: i }))

    return allPosts
}

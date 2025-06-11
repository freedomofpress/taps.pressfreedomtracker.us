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
                type: d.Type.split(/,\s?/g),
                primaryTarget: d['Primary Target'],
                secondaryTarget: d['Secondary Target'],
                mediaDescription: d['Media Description'],
                link: d.Link,
                content: d.Content,
                tags: d.Tags !== '' ? d.Tags.split(/,\s?/g) : undefined,
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
                type: d.Type.split(/,\s?/g),
                tags: d.Tags !== '' ? d.Tags.split(/,\s?/g) : undefined,
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

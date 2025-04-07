import Fetch from '@11ty/eleventy-fetch'
import Papa from 'papaparse';

const TRUTH_SOCIAL_URL = 'https://docs.google.com/spreadsheets/d/1vbsoLq-Z5_kJaV0GOFMOqyo3dL9S1SKfUSkNWdYtMtU/export?format=csv&id=1vbsoLq-Z5_kJaV0GOFMOqyo3dL9S1SKfUSkNWdYtMtU&gid=201966548'
const TWITTER_URL = 'https://docs.google.com/spreadsheets/d/1vbsoLq-Z5_kJaV0GOFMOqyo3dL9S1SKfUSkNWdYtMtU/export?format=csv&id=1vbsoLq-Z5_kJaV0GOFMOqyo3dL9S1SKfUSkNWdYtMtU&gid=0'

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
                link: d.Link,
                content: d.Content,
                tags: d.Tags !== '' ? d.Tags.split(/,\s?/g) : undefined,
                date
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
                primaryTarget: d['Primary Target'],
                secondaryTarget: d['Secondary Target'],
                link: d.Link,
                content: d.Content,
                date
            }
        }).filter(d => d.content !== '')

    const allPosts = [...twitterPosts, ...truthPosts]
        .sort((a, b) => b.date - a.date)

    return allPosts
}
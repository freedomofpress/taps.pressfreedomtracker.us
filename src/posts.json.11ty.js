export default class PostsJSON {
    data() {
        return {
            permalink: '/posts.json',
        }
    }

    render({ posts }) {
        // Only include necessary data for filtering
        const filteredPosts = posts.map(post => ({
            hash: post.hash,
            platform: post.platform,
            type: post.type,
            primaryTarget: post.primaryTarget,
            secondaryTarget: post.secondaryTarget,
            tags: post.tags,
            content: post.content,
            date: post.date.toISOString(),
            link: post.link
        }))
        
        return JSON.stringify(filteredPosts)
    }
}

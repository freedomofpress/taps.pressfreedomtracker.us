export default class PostsJSON {
    data() {
        return {
            permalink: '/posts.json',
        }
    }

    render({ posts }) {
        return JSON.stringify(posts.sort((a, b) => a.i - b.i))
    }
}

export default class PostsJSON {
    data() {
        return {
            permalink: '/posts.json',
        }
    }

    render({ posts }) {
        return JSON.stringify(posts)
    }
}

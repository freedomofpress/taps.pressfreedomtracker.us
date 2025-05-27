import Papaparse from 'papaparse'

export default class PostCSV {
    data() {
        return {
            permalink: '/posts.csv',
        }
    }

    render({ posts }) {
        return Papaparse.unparse(posts)
    }
}
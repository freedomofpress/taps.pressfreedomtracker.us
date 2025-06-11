const getContentSizeClass = (text) => {
    if (text.length > 500) return 'long'
    if (text.length > 200) return 'medium'
    return 'short'
}

export default getContentSizeClass
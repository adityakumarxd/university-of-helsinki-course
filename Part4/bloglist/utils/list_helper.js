const ld = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let total = 0
    for (let i of blogs) {
        total += i.likes
    }
    return total
}

const favoriteBlog = (blogs) => {
    let blog = blogs[0]
    for (let i of blogs) {
        if (i.likes >= blog.likes) {
            blog = i
        }
    }
    return blog
}

const mostBlogs = (blogs) => {

    const count = ld.countBy(blogs, 'author')

    let max = 0
    let topBlogger
    for (let a of Object.keys(count)) {
        if (count[a] > max) {
            max = count[a]
            topBlogger = a
        }
    }

    return topBlogger
}

const mostLikes = (blogs) => {

    const blogger = ld.groupBy(blogs, 'author')
    let maxLikes = 0, author
    for (let i of Object.keys(blogger)) {
        const sumLikes = blogger[i].reduce(
            (accumulator, currentValue) => {
                return (accumulator + currentValue.likes)
            },
            0,
        );
        if (sumLikes > maxLikes) {
            maxLikes = sumLikes
            author = i
        }
    }

    return author
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
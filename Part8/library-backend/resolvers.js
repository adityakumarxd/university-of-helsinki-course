const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            const allBooks = await Book.find().populate('author')
            if (!args.author && !args.genre) {
                return allBooks
            }

            const byAuthor = (book) => {
                if (!args.author) {
                    return book
                }

                return args.author === book.author.name ? book : !book
            }

            const byGenre = (book) => {
                if (!args.genre) {
                    return book
                }

                return book.genres.includes(args.genre) ? book : !book
            }

            return allBooks.filter(byAuthor).filter(byGenre)
        },
        allAuthors: async (root, args) => {
            return Author.find()
        },
        me: (root, args, context) => {
            return context.currentUser
        }
    },

    Author: {
        bookCount: async (root) => {
            const allBooks = await Book.find().populate('author')
            return allBooks.filter(book => book.author.name === root.name).length
        }
    },

    Mutation: {
        addBook: async (root, args, context) => {

            const currentUser = context.currentUser

            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }

            const allBooks = await Book.find().populate('author')
            const allAuthors = await Author.find()
            if (allBooks.find(p => p.title === args.title)) {
                throw new GraphQLError('Title must be unique', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.title
                    }
                })
            }

            if (args.title.length < 5) {
                throw new GraphQLError('Title must be longer than 5 characters', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.title
                    }
                })
            }

            if (args.author.length < 4) {
                throw new GraphQLError('Author must be longer than 4 characters', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.title
                    }
                })
            }

            let authorExisted = false
            for (let a of allAuthors) {
                if (a.name === args.author) {
                    authorExisted = true
                }
            }

            let author
            if (!authorExisted) {
                const newAuthor = new Author({
                    name: args.author,
                    born: null,
                })

                author = await newAuthor.save()
            } else {
                const result = allAuthors.filter(a => a.name === args.author)
                author = result[0]
            }

            const bookToSave = new Book({
                title: args.title,
                published: args.published,
                author: author._id,
                genres: args.genres
            })

            const savedBook = await bookToSave.save()
            const returnBook = await Book.findById(savedBook.id).populate('author')

            pubsub.publish('BOOK_ADDED', { bookAdded: returnBook })
            return returnBook
        },
        editAuthor: async (root, args, context) => {

            const currentUser = context.currentUser

            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }

            const allAuthors = await Author.find()
            const author = allAuthors.find(a => a.name === args.name)
            if (!author) {
                return null
            }

            const toUpdate = {
                name: args.name,
                born: args.setBornTo
            }

            let updatedAuthor

            try {
                updatedAuthor = await Author.findByIdAndUpdate(author._id, toUpdate, { new: true })
            } catch (err) {
                console.log(err)
            }
            return updatedAuthor
        },

        createUser: async (root, args) => {
            if (await User.findOne({ username: args.username })) {
                throw new GraphQLError('User must be unique', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.username
                    }
                })
            }

            const user = new User({
                username: args.username,
                favoriteGenre: args.favoriteGenre
            })

            return user.save()
                .catch(error => {
                    throw new GraphQLError('Creating the user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.username,
                            error
                        }
                    })
                })
        },

        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== 'secret') {
                throw new GraphQLError('wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        },
    },

    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
        }
    },
}

module.exports = resolvers
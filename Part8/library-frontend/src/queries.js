import { gql } from '@apollo/client'


const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
        title
        published
        author{
            name
        }
        genres
        id
    }
`

const AUTHOR_DETAILS = gql`
    fragment AuthorDetails on Author{
        name
        born
        id
        bookCount
    }
`

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            ...AuthorDetails
        }
    }
    
    ${AUTHOR_DETAILS}
`

export const ALL_BOOKS = gql`
    query filterGenre($genre: String){
        allBooks (
            genre: $genre
        ) {
            ...BookDetails
        }
    }
    
    ${BOOK_DETAILS}
`

export const CREATE_BOOK = gql`
    mutation createBook(
        $title: String! 
        $published: Int!
        $author: String!
        $genres: [String!]!
    ) {
        addBook(
            title: $title
            published: $published
            author: $author
            genres: $genres
        ) {
            ...BookDetails
        }
    }

    ${BOOK_DETAILS}
`

export const CHANGE_BIRTHYEAR = gql`
    mutation changeBirthyear($name: String!, $year: Int!){
        editAuthor(
            name: $name
            setBornTo: $year
        ) {
            ...AuthorDetails
        }
    }

    ${AUTHOR_DETAILS}
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password)  {
            value
        }
    }
`

export const LOGGED_IN_USER = gql`
    query {
        me {
            id
            username
            favoriteGenre
        }
    }
`

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            ...BookDetails
        }
    }

    ${BOOK_DETAILS}
`
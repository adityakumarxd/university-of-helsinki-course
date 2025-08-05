import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Notify from "./components/Notify";
import LoginForm from "./components/LoginForm";
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import { gql } from '@apollo/client'

import {
	ALL_AUTHORS,
	ALL_BOOKS,
	BOOK_ADDED
} from "./queries";
import Recommendations from "./components/Recommendations";

const App = () => {
	const [page, setPage] = useState("authors");
	const [errorMessage, setErrorMessage] = useState(null)
	const [subscriptionMsg, setSubscriptionMsg] = useState(null)
	const [token, setToken] = useState(null)
	const [allGenres, setAllGenres] = useState([])
	const [genre, setGenre] = useState(null)
	const client = useApolloClient()

	const authorQuery = useQuery(ALL_AUTHORS)
	const allBooks = useQuery(ALL_BOOKS)
	const bookQuery = useQuery(ALL_BOOKS, {
		variables: { genre }
	})

	// const allGenres = []

	useSubscription(BOOK_ADDED, {
		onData: (data) => {
			const addedBook = data.data.data?.bookAdded
			const msg = `New book added: ${addedBook.title} by ${addedBook.author.name}`
			setSubscriptionMsg(msg)
			setTimeout(() => {
				setSubscriptionMsg(null)
			}, 10000)


			for (let g of addedBook.genres) {
				if (!allGenres.includes(g)) {
					allGenres.push(g)
				}
			}


			// updateCache(client.cache, ['filterGenre', { query: ALL_AUTHORS }], addedBook)
			client.cache.updateQuery(
				{ query: ALL_BOOKS, variables: { genre: null } },
				data => {
					if (data) {
						// client.cache.updateQuery({ query: ALL_AUTHORS })
						return { allBooks: data.allBooks.concat(addedBook) }
					}
				}
			)
			// client.cache.updateQuery({ query: ALL_AUTHORS })
		},
	})

	if (authorQuery.loading || bookQuery.loading || authorQuery.loading) {
		return <div>loading...</div>
	}

	const authors = authorQuery.data.allAuthors

	const books = bookQuery.data.allBooks

	const notify = (message) => {
		setErrorMessage(message)
		setTimeout(() => {
			setErrorMessage(null)
		}, 10000)
	}

	const logout = () => {
		setToken(null)
		localStorage.clear()
		client.resetStore()
	}

	const login = () => {
		setPage("books")
	}

	const displayedGenres = []
	for (let b of allBooks.data.allBooks) {
		// console.log(b)
		for (let g of b.genres) {
			if (!allGenres.includes(g)) {
				allGenres.push(g)
			}
		}
	}

	return (
		<div>
			{!token ? <Notify errorMessage={errorMessage} /> : <></>}
			<Notify errorMessage={subscriptionMsg} />

			<div>
				<button onClick={() => setPage("authors")}>authors</button>
				<button onClick={() => setPage("books")}>books</button>

				{!token ?
					<button onClick={() => setPage("login")}>login</button>
					:
					<>
						<button onClick={() => setPage("add")}>add book</button>
						<button onClick={() => setPage("recommend")}>recommendations</button>
						<button onClick={logout}>logout</button>
					</>
				}
			</div>

			<Authors show={page === "authors"} authors={authors} />

			<Books show={page === "books"} books={books} genres={allGenres} filter={setGenre} />

			<NewBook show={page === "add"} />

			{token ? <Recommendations show={page === "recommend"} /> : <></>}
			<LoginForm show={page === "login"} setToken={setToken} setError={notify} changePage={login} />
		</div>
	);
};

export default App;

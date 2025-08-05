import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, CHANGE_BIRTHYEAR } from '../queries'

const Authors = (props) => {
	const [name, setName] = useState('')
	const [year, setYear] = useState('')

	const authors = props.authors

	const [createBook] = useMutation(CHANGE_BIRTHYEAR, {
		refetchQueries: [{ query: ALL_AUTHORS }]
	})

	const submit = async (event) => {
		event.preventDefault()

		createBook({ variables: { name, year } })

		setName('')
		setYear('')
	}

	if (!props.show) {
		return null
	}

	return (
		<div>
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>born</th>
						<th>books</th>
					</tr>
					{authors.map((a) => (
						<tr key={a.name}>
							<td>{a.name}</td>
							<td>{a.born}</td>
							<td>{a.bookCount}</td>
						</tr>
					))}
				</tbody>
			</table>

			<h3>Set birthyear</h3>
			<form onSubmit={submit}>
				<div>
					author
					<select value={name} onChange={({ target }) => setName(target.value)}>
						<option value="">Not chosen</option>
						{authors.map((a) => (
							<option key={a.name} value={a.name}>{a.name}</option>
						))}
					</select>
				</div>
				<div>
					born
					<input
						type="number"
						value={year}
						onChange={({ target }) => setYear(Number(target.value))}
					/>
				</div>
				<button type="submit">edit author bornyear</button>
			</form>
		</div>
	)
}

export default Authors

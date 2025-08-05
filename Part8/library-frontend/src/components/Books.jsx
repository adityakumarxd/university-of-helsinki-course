const Books = ({show, books, genres, filter }) => {
	if (!show) {
		return null
	}

	// const books = books

	return (
		<div>
			<h2>books</h2>

			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{books.map((a) => (
						<tr key={a.title}>
							<td>{a.title}</td>
							<td>{a.author.name}</td>
							<td>{a.published}</td>
						</tr>
					))}
				</tbody>
			</table>

			<div>
				{genres.map((g) => (
					<button key={g} onClick={() => filter(g)}>{g}</button>
				))}
				<button onClick={() => filter(null)}>all genres</button>
			</div>
		</div>
	)
}

export default Books

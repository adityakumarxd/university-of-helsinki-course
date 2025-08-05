import { useQuery } from "@apollo/client"
import { LOGGED_IN_USER, ALL_BOOKS } from "../queries"

const Recommendations = ({ show }) => {
    const loginInfo = useQuery(LOGGED_IN_USER, {
        skip: !localStorage.getItem("library-user-token")
    })
    const favGenre = loginInfo?.data?.me?.favoriteGenre
    const recommendedQuery = useQuery(ALL_BOOKS, {
        variables: { genre: favGenre }
    })
    const recommended = recommendedQuery.data?.allBooks

    if (!show) {
        return null
    }

    return (
        <div>
            <h2>recommendations</h2>
            <p>books in your favorite genre {favGenre}</p>

            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {recommended.map((a) => (
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Recommendations

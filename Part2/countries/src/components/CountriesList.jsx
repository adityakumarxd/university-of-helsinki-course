export default function CountriesList({ list, onSelect }) {
    if (list.length == 1) {
        return null
    }

    return (
        <table>
            <tbody>
                {list.length < 10
                    ? list.map((c) => <tr key={c}><td>{c}</td><td><button onClick={onSelect} value={c}>Show</button></td></tr>)
                    : <tr><td>Too many matches, specify another filter</td></tr>
                }
            </tbody>
        </table>

    )
}
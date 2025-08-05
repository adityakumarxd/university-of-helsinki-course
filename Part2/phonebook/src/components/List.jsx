export default function List({ persons, onDelete }) {
    return (
        <>
            <table>
                <tbody>
                    {persons.map((p) => <tr key={p.id}><td>{p.name}</td><td>{p.number}</td><td><button onClick={onDelete} value={p.id}>Delete</button></td></tr>)}
                </tbody>
            </table>

        </>
    )
}
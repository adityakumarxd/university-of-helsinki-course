export default function StatisticLine({ name, stat }) {
    return (
        <tr>
            <td>{name}</td>
            <td>{stat}</td>
        </tr>
    )
}
export function Total(props) {
    let total = 0
    for (let i of props.parts) {
        total += i.exercises
    }
    return (
        <div>Number of exercises {total}</div>
    )
}
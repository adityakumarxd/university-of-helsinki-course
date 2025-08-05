export function Total({ parts }) {
    console.log(parts)
    const total =
        parts.reduce((s, p) => {
            return { exercises: Number(s.exercises) + Number(p.exercises) }
        }).exercises
    
    return (
        <div><b>total of {total} exercises</b></div>
    )
}
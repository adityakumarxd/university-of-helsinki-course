export default function Filter({ label, onChange, type, value }) {
    return (
        <p>{label}: <input onChange={onChange} type={type} value={value} /></p>
    )
}
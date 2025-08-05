export default function Input({label, onChange, type, value}) {
    return (
        <p>{label}: <input onChange={onChange} type={type} value={value} /></p>
    )
}
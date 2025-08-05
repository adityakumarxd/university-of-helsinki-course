import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const NewAnecdote = () => {
    const dispatch = useDispatch()

    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.note.value
        event.target.note.value = ''
        dispatch(createAnecdote(content))
    }

    return (
        <>
            <h2>Add new anecdote</h2>
            <form onSubmit={addAnecdote}>
                <input name="note" />
                <button type="submit">add</button>
            </form>
        </>
    )
}

export default NewAnecdote
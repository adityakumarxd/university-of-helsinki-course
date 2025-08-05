import { useEffect } from 'react'
import NewAnecdote from './components/NewAnecdote'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'

const App = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(initializeAnecdotes())
    }, [dispatch])

    return (
        <div>
            <h2>Anecdotes</h2>
            <Filter />
            <AnecdoteList />
            <NewAnecdote />
        </div>
    )
}

export default App
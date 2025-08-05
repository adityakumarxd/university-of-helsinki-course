import { createSlice, current } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll()
        console.log(anecdotes)
        dispatch(setAnecdotes(anecdotes))
    }
}

export const createAnecdote = content => {
    return async dispatch => {
        const newAnecdote = await anecdoteService.createNew(content)
        dispatch(appendAnecdote(newAnecdote))
    }
}

export const upvoteAnecdote = (id, anecdote) => {
    return async dispatch => {
        const votedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
        const saved = await anecdoteService.update(id, votedAnecdote)
        dispatch(voteAnecdote(saved))
    }
}

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        voteAnecdote(state, action) {
            const voted = action.payload
            const notSorted = state.map(anec => anec.id !== voted.id ? anec : voted)
            return state = notSorted.sort(function (a, b) {
                return b.votes - a.votes
            })
        },
        appendAnecdote(state, action) {
            state.push(action.payload)
        },
        setAnecdotes(state, action) {
            return action.payload
        }
    },
})


export const { voteAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
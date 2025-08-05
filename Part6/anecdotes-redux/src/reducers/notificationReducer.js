import { createSlice, current } from '@reduxjs/toolkit'

const initialState = "NONE"

export const setNotification = (content, timeoutSeconds) => {
    return dispatch => {
        dispatch(getNotification(content))
        setTimeout(() => {
            dispatch(clearNotification())
        }, timeoutSeconds*1000)
    }
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        getNotification(state, action) {
            const content = action.payload
            return state = `You voted ${content}`
        },
        clearNotification(state, action) {
            return state = 'NONE'
        }
    }
})

export const { getNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
import { useDispatch, useSelector } from 'react-redux'

const Notification = () => {
    const notification = useSelector(state => {
        if(state.notification === 'NONE') {
            return state = 'NONE'
        } else {
            return state = state.notification
        }
    })
    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1
    }
    if (notification === 'NONE') {
        return null
    }

    return (
        <div style={style}>
            {notification}
        </div>
    )
}

export default Notification
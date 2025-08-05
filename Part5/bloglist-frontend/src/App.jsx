import { useState, useEffect } from 'react'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import './index.css'
import Togglable from './components/Togglable'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState({ text: null, type: 'success' })
    const [loginVisible, setLoginVisible] = useState(false)

    function renderMessage(newMsg, type) {
        setMessage({ text: newMsg, type: type })
        setTimeout(() => {
            setMessage({ ...message, text: null })
        }, 5000)
    }

    useEffect(() => {

        getBlogs()

    }, [])

    useEffect(() => {

        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }

    }, [])

    const getBlogs = async () => {
        const fetchedBlogs = await blogService.getAll()
        var sorted = fetchedBlogs.slice(0)
        sorted.sort(function (a, b) {
            return b.likes - a.likes
        })

        setBlogs(sorted)
    }

    const handleLogin = async (event) => {

        event.preventDefault()
        try {

            const user = await loginService.login({
                username, password,
            })

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')

        } catch (exception) {

            renderMessage('Wrong credentials', 'error')

        }

    }

    const handleLogOut = async (event) => {
        window.localStorage.clear()
        setUser(null)
        console.log('logged out')
    }

    const addBlog = async (newBlog) => {
        const blog = await blogService.create(newBlog)
        console.log(blog)
        // setBlogs(blogs.concat(blog))
        getBlogs()
    }

    const loginForm = () => {
        const hideWhenVisible = { display: loginVisible ? 'none' : '' }
        const showWhenVisible = { display: loginVisible ? '' : 'none' }

        return (
            <Togglable buttonLabel={'log in'}>
                <LoginForm
                    handleLogin={handleLogin}
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                />
            </Togglable>
        )
    }

    const updateLike = async (blog) => {
        const updatedBlog = { ...blog, likes: (blog.likes + 1) }
        await blogService.update(blog._id, updatedBlog)
        getBlogs()
    }

    const removeBlog = async (blog) => {
        await blogService.remove(blog._id)
        getBlogs()
    }


    return (

        <>
            <Notification message={message} />
            <h1>Blogs app</h1>
            {user === null && loginForm()}

            {user !== null &&
                <>
                    <p>{user.name} logged in </p>
                    <button onClick={handleLogOut}>Log out</button>
                    <Togglable buttonLabel={'add new blog'}>
                        <BlogForm
                            addBlog={addBlog}
                            renderMessage={renderMessage}
                        />
                    </Togglable>

                <BlogList
                    blogs={blogs}
                    updateLike={updateLike}
                    removeBlog={removeBlog}
                    user={user}
                />
                </>
            }
        </>

    )
}

export default App
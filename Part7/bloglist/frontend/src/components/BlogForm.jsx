import { useState, useEffect } from 'react'

const BlogForm = ({ addBlog, renderMessage }) => {
    
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [author, setAuthor] = useState('')

    const createBlog = async (event) => {
        event.preventDefault()
        try {

            const newBlog = {
                title: title,
                author: author,
                url: url
            }

            setAuthor('')
            setTitle('')
            setUrl('')

            addBlog(newBlog)
            renderMessage(`added new blog ${newBlog.title} by ${newBlog.author}`, 'success')

        } catch (exception) {

            // renderMessage('Invalid values', 'error')

        }
    }

    return (
        <div>
            <h4>New Blog</h4>
            <form onSubmit={createBlog}>
                <div>Title
                    <input
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                        data-testid='title'
                    /></div>
                <div>Author
                    <input
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                        data-testid='author'
                    /></div>
                <div>URL
                    <input
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                        data-testid='url'
                    />
                </div>
                <button type="submit">save</button>
            </form>
        </div>
    )
}

export default BlogForm

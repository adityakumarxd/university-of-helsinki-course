import Togglable from './Togglable'

const Blog = ({ blog, updateLike, removeBlog, user }) => {

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const removeButton = () => {
        if (blog.user.username === user.username) {
            return (
                <><button onClick={() => removeBlog(blog)}>Remove</button></>
            )
        }
    }

    return (
        <div style={blogStyle} className='blog'>
            <div className='blog-title'>{blog.title} by {blog.author}</div>
            <Togglable buttonLabel={'view'}>
                <>
                    <div>{blog.url}</div>
                    <div> <span className='likes'>Likes: {blog.likes}</span><button onClick={() => updateLike(blog)}>Like</button></div>
                    {blog.user && <div>added by {blog.user.name}</div>}
                    {blog.user && removeButton()}

                </>
            </Togglable>
        </div>
    )
}

export default Blog
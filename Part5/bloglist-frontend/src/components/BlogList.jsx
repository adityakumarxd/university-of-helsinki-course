import Blog from './Blog'

const BlogList = ({ blogs, updateLike, removeBlog, user }) => {
    return (
        <>
            <h2>All blogs</h2>
            {blogs.map(blog =>
                <Blog
                    key={blog._id}
                    blog={blog}
                    updateLike={updateLike}
                    removeBlog={removeBlog}
                    user={user}
                />
            )}
        </>
    )
}

export default BlogList
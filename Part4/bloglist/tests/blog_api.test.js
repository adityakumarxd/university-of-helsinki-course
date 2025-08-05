const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const helper = require('../utils/test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

let token

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
    
    const newUser = {
        username: 'aaaaaaa',
        name: 'Matti Luukkainen',
        password: 'qwerty',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const login = {
        username: 'aaaaaaa',
        password: 'qwerty',
    }

    const credentials = await api
        .post('/api/login')
        .send(login)
        .expect(200)
        .expect('Content-Type', /application\/json/)


    token = credentials.body.token
})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('invalid user is not added', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'sa',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})


test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 6)
})

test('the unique id property of the blog posts is named id', async () => {
    const blogs = await helper.blogsInDb()
    blogs.forEach((blog) => {
        assert.notStrictEqual(blog.id, undefined);
        assert.strictEqual(blog._id, undefined);
    });
})

const postHelper = async (token) => {
    const newBlog = {
        title: "ABC",
        author: "XYZ",
        url: "http://localhost:1111",
        likes: 2,
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)


    const response = await api.get('/api/blogs')
    return response.body[6]
}

test('a valid blog can be added ', async () => {
    const newBlog = {
        title: "ABC",
        author: "XYZ",
        url: "http://localhost:1111",
        likes: 2,
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

    assert(titles.includes('ABC'))
})

test('if no likes specified, default is 0 ', async () => {
    const newBlog = {
        title: "ABC",
        author: "XYZ",
        url: "http://localhost:1111"
    }

    const addedBlog = await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(addedBlog.body.likes, 0)
})


test('invalid blog is not added and return status 400', async () => {
    const newBlog = {
        author: "XYZ",
        url: "http://localhost:1111"
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('succeeds with status code 204 if id is valid', async () => {

    const blogToDelete = await postHelper(token) //add one blog just for delete, hence end result should be == initial

    await api
        .delete(`/api/blogs/${blogToDelete._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const contents = blogsAtEnd.map(r => r.title)
    assert(!contents.includes(blogToDelete.title))
})

test('blog is updated correctly', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const updatedBlog = {
        title: blogsAtStart[0].title,
        author: blogsAtStart[0].author,
        url: blogsAtStart[0].url,
        likes: 100
    }

    const response = await api
        .put(`/api/blogs/${blogsAtStart[0].id}`)
        .send(updatedBlog)
        .expect(200)

    assert.strictEqual(response.body.likes, 100)
})


after(async () => {
    await mongoose.connection.close()
})
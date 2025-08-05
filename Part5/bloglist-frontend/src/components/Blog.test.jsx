import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog.jsx'
import { expect } from 'vitest'

test('renders content', () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Admin',
        url: 'abc.com',
        likes: 19
    }

    render(<Blog blog={blog} />)

    const element = screen.getByText('Component testing is done with react-testing-library by Admin')
    const url = screen.getByText('abc.com')
    const likes = screen.getByText('Likes: 19')
    screen.debug(element)
    screen.debug(url)
    screen.debug(likes)
    expect(element).toBeDefined()
    expect(url).not.toBeVisible()
    expect(likes).not.toBeVisible()
})


test('clicking the view button makes blog detail visible', async () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Admin',
        url: 'abc.com',
        likes: 19
    }

    render(

        <Blog blog={blog} />
    )


    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.getByText('abc.com')
    const likes = screen.getByText('Likes: 19')
    expect(url).toBeVisible()
    expect(likes).toBeVisible()

})

test('clicking the button calls event handler once', async () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Admin',
        url: 'abc.com',
        likes: 19
    }

    const mockHandler = vi.fn()

    render(

        <Blog blog={blog} updateLike={mockHandler}/>
    )


    const user = userEvent.setup()
    const button = screen.getByText('Like')
    await user.click(button)
    await user.click(button)
    

    expect(mockHandler.mock.calls).toHaveLength(2)
})
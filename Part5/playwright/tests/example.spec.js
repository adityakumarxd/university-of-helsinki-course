const { test, describe, expect, beforeEach } = require('@playwright/test')


describe('Note app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Testing admin',
                username: 'admin',
                password: 'qwerty'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        await page.getByRole('button', { name: 'log in' }).click()

        await expect(page.getByTestId('username')).toBeVisible()
        await expect(page.getByTestId('password')).toBeVisible()
    })

    describe('Login', () => {
        test('Login form is shown', async ({ page }) => {
            await page.getByRole('button', { name: 'log in' }).click()
            await page.getByTestId('username').fill('admin')
            await page.getByTestId('password').fill('qwerty')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Testing admin logged in')).toBeVisible()
        })

        test('Unable to log in with wrong credentials', async ({ page }) => {
            await page.getByRole('button', { name: 'log in' }).click()
            await page.getByTestId('username').fill('faulty')
            await page.getByTestId('password').fill('qwerty')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Wrong credentials')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.getByRole('button', { name: 'log in' }).click()
            await page.getByTestId('username').fill('admin')
            await page.getByTestId('password').fill('qwerty')
            await page.getByRole('button', { name: 'login' }).click()

            await page.getByRole('button', { name: 'add new blog' }).click()
            await page.getByTestId('title').fill('Test from playwright')
            await page.getByTestId('author').fill('playwright')
            await page.getByTestId('url').fill('aaa')
            await page.getByRole('button', { name: 'save' }).click()
            await page.getByRole('button', { name: 'cancel' }).click()

        })

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'add new blog' }).click()
            await page.getByTestId('title').fill('Test from playwright 2')
            await page.getByTestId('author').fill('playwright')
            await page.getByTestId('url').fill('aaa')
            await page.getByRole('button', { name: 'save' }).click()

            await expect(page.getByText('added new blog Test from playwright 2 by playwright')).toBeVisible()
            await expect(page.getByText('Test from playwright 2 by playwright')).toBeVisible()
        })

        test('like can be added', async ({ page }) => {
            await page.getByRole('button', { name: 'View' }).click()
            await page.getByRole('button', { name: 'Like' }).click()
            await expect(page.getByText('Likes: 1')).toBeVisible()
        })

        test('blog can be removed by author', async ({ page }) => {
            await page.getByRole('button', { name: 'View' }).click()
            await page.getByRole('button', { name: 'Remove' }).click()
            await expect(page.getByText('added by Testing admin')).toHaveCount(0)
        })

        test('[only] author can see remove button', async ({ page, request }) => {
            //author
            await page.getByRole('button', { name: 'View' }).click()

            await expect(page.getByRole('button', { name: 'Remove' })).toHaveCount(1)


            //not author
            await page.getByRole('button', { name: 'Log out' }).click()
            await request.post('http://localhost:3003/api/users', {
                data: {
                    name: 'Testing admin 2',
                    username: 'admin2',
                    password: 'qwerty'
                }
            })

            await page.getByRole('button', { name: 'log in' }).click()
            await page.getByTestId('username').fill('admin2')
            await page.getByTestId('password').fill('qwerty')
            await page.getByRole('button', { name: 'login' }).click()
            await page.getByRole('button', { name: 'View' }).click()

            await expect(page.getByRole('button', { name: 'Remove' })).toHaveCount(0)
        })
    })

    test('Blogs are arranged in the order according to the likes, the blog with most likes first', async ({ page }) => {
        await page.getByRole('button', { name: 'log in' }).click()
        await page.getByTestId('username').fill('admin')
        await page.getByTestId('password').fill('qwerty')
        await page.getByRole('button', { name: 'login' }).click()

        await page.getByRole('button', { name: 'add new blog' }).click()
        await page.getByTestId('title').fill('Least favourite')
        await page.getByTestId('author').fill('admin')
        await page.getByTestId('url').fill('aaa')
        await page.getByRole('button', { name: 'save' }).click()
        await page.getByRole('button', { name: 'view' }).click()

        await page.getByTestId('title').fill('Second favourite')
        await page.getByTestId('author').fill('admin')
        await page.getByTestId('url').fill('aaa')
        await page.getByRole('button', { name: 'save' }).click()
        await page.getByRole('button', { name: 'view' }).click()
        
        await page.getByTestId('title').fill('Fan favourite')
        await page.getByTestId('author').fill('admin')
        await page.getByTestId('url').fill('aaa')
        await page.getByRole('button', { name: 'save' }).click()
        await page.getByRole('button', { name: 'view' }).click()

        let likeButtons = await page.getByRole('button', { name: 'Like' }).all()
        await likeButtons[2].click() //like the last one on list
        const likes0 = await page.locator('.likes')
        const expectedLikesInOrder0 = ['Likes: 1', 'Likes: 0', 'Likes: 0'];
        await expect(likes0).toHaveText(expectedLikesInOrder0); //check if the order changed

        await likeButtons[0].click()
        await likeButtons[2].click()

        const likes1 = await page.locator('.likes')
        const expectedLikesInOrder1 = ['Likes: 2', 'Likes: 1', 'Likes: 0'];
        const titles = await page.locator('.blog-title')
        const expectedTitleInOrder = ['Fan favourite by admin', 'Second favourite by admin', 'Least favourite by admin']
        await expect(likes1).toHaveText(expectedLikesInOrder1);
        await expect(titles).toHaveText(expectedTitleInOrder);

    })
})
import { test as base, expect, type Page } from '@playwright/test'

type Fixtures = { page: Page }

export const test = base.extend<Fixtures>({
  page: async ({ page, context }, USE) => {
    await context.route('**/api/auth/login', async route => {
      const body = route.request().postDataJSON?.() ?? {}
      const { userName, password } = body

      if ((userName?.length ?? 0) < 3 || (password?.length ?? 0) < 6) {
        return route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ message: 'Invalid payload', issues: [{}] }) })
      }
      if (userName === 'admin' && password === '12345678') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: { 'set-cookie': 'accessToken=fake; Path=/; HttpOnly' },
          body: JSON.stringify({ user: { id: 'u1', firstName: 'Admin', lastName: 'Test', email: 'admin@test.com', role: { id: 'r1', name: 'admin', permissions: [] } } }),
        })
      }
      if (userName === 'user' && password === '123456789') {
        return route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ status: 400, contentType: 'application/json', body: JSON.stringify({ message: 'Error'}) }),
        })
      }
      return route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ message: 'Invalid credentials' }) })
    })

    await context.route('**/api/auth/register', async route => {
      const body = route.request().postDataJSON?.() ?? {}
      return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ user: { id: 'u2', ...body, isActive: true, role: { id: 'r_user', name: 'user', permissions: [] } } }) })
    })

    await context.route('**/api/auth/me', async route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', firstName: 'Admin', lastName: 'Test', createdAt: new Date().toISOString(), role: { id: 'r1', name: 'admin', permissions: [] } }),
      })
    })

    await context.route('**/api/auth/logout', async route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'set-cookie': 'accessToken=; Path=/; HttpOnly; Max-Age=0' },
        body: JSON.stringify({ ok: true }),
      })
    })

    await USE(page)
  },
})

export { expect }

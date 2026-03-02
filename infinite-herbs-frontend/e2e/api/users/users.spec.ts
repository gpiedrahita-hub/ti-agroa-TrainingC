import { test, expect } from '@playwright/test';


const USERS_URL = '/api/users'
const LOGIN_URL = '/api/auth/login'

async function login(api: any, userName: string, password: string) {
  const res = await api.post(LOGIN_URL, { data: { userName, password } })
  expect(res.status()).toBe(200)
  return res
}

test.describe('GET/POST /api/users', () => {
  test('GET returns 401 when no session', async ({ request }) => {
    const res = await request.get(USERS_URL)
    expect(res.status()).toBe(401)
    expect((await res.json()).message).toBe('Unauthorized')
  })

  test('POST returns 401 when no session', async ({ request }) => {
    const res = await request.post(USERS_URL, {
      data: {
        firstName: 'X',
        lastName: 'Y',
        email: 'x@y.com',
        userName: 'xy1',
        password: '123456',
        isActive: true,
        role: 'user',
      },
    })
    expect(res.status()).toBe(401)
    expect((await res.json()).message).toBe('Unauthorized')
  })

  test('GET returns 200 for ADMIN (or VIEWER)', async ({ request }) => {
    const adminUser = process.env.TEST_USER_ADMIN_USERNAME
    const adminPass = process.env.TEST_USER_ADMIN_PASSWORD

    await login(request, adminUser!, adminPass!)

    const res = await request.get(USERS_URL)
    expect(res.status()).toBe(200)

    const users = await res.json()
    expect(Array.isArray(users)).toBe(true)

    if (users.length > 0) {
      const u = users[0]
      expect(u).toHaveProperty('id')
      expect(u).toHaveProperty('email')
      expect(u).toHaveProperty('userName')
      expect(u).toHaveProperty('isActive')
      expect(u).toHaveProperty('createdAt')
      expect(u).toHaveProperty('role')
      expect(u.role).toHaveProperty('name')
      expect(u.role).toHaveProperty('permissions')
      expect(Array.isArray(u.role.permissions)).toBe(true)
      if (u.role.permissions.length > 0) {
        expect(u.role.permissions[0]).toHaveProperty('id')
        expect(u.role.permissions[0]).toHaveProperty('key')
      }
    }
  })

  test('GET returns 403 for a non ADMIN/VIEWER role (e.g. USER)', async ({ request }) => {
    const userName = process.env.TEST_USER_USER_USERNAME
    const password = process.env.TEST_USER_USER_PASSWORD
    test.skip(!userName || !password, 'Missing non-privileged user credentials in env')

    await login(request, userName!, password!)

    const res = await request.get(USERS_URL)
    expect(res.status()).toBe(403)
    expect((await res.json()).message).toBe('Forbidden')
  })

  test('POST returns 403 for VIEWER (cannot create)', async ({ request }) => {
    const viewerUser = process.env.TEST_USER_VIEWER_USERNAME
    const viewerPass = process.env.TEST_USER_VIEWER_PASSWORD
    test.skip(!viewerUser || !viewerPass, 'Missing viewer credentials in env')

    await login(request, viewerUser!, viewerPass!)

    const ts = Date.now()
    const res = await request.post(USERS_URL, {
      data: {
        firstName: 'No',
        lastName: 'Create',
        email: `viewer_cannot_${ts}@mail.com`,
        userName: `viewer_cannot_${ts}`,
        password: process.env.TEST_USER_ADMIN_PASSWORD,
        isActive: true,
        role: 'user',
      },
    })

    expect(res.status()).toBe(403)
    expect((await res.json()).message).toBe('Forbidden')
  })

  test('POST returns 400 on invalid payload (zod)', async ({ request }) => {
    const adminUser = process.env.TEST_USER_ADMIN_USERNAME
    const adminPass = process.env.TEST_USER_ADMIN_PASSWORD
    test.skip(!adminUser || !adminPass, 'Missing admin credentials in env')
    
    await login(request, adminUser!, adminPass!)

    const res = await request.post(USERS_URL, {
      data: {
        firstName: 'A',
        lastName: 'B',
        email: 'bad',
        userName: 'ab',
        password: '123',
      },
    })

    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.message).toBe('Invalid payload')
    expect(Array.isArray(body.issues)).toBe(true)
  })

  test('POST returns 201 for ADMIN and creates user', async ({ request }) => {
    const adminUser = process.env.TEST_USER_ADMIN_USERNAME
    const adminPass = process.env.TEST_USER_ADMIN_PASSWORD
    test.skip(!adminUser || !adminPass, 'Missing admin credentials in env')
    
    await login(request, adminUser!, adminPass!)

    const ts = Date.now()
    const payload = {
      firstName: 'Created',
      lastName: 'ByAdmin',
      email: `created_${ts}@mail.com`,
      userName: `created_${ts}`,
      password: process.env.TEST_USER_ADMIN_PASSWORD,
      isActive: true,
      role: 'user',
    }

    const res = await request.post(USERS_URL, { data: payload })
    expect(res.status()).toBe(201)

    const body = await res.json()
    expect(body).toHaveProperty('user')
    expect(body.user).toHaveProperty('id')
    expect(body.user.email).toBe(payload.email)
    expect(body.user.isActive).toBe(payload.isActive)
    expect(body.user).toHaveProperty('role')
    expect(body.user.role).toHaveProperty('name')
    expect(body.user.role).toHaveProperty('permissions')
    expect(Array.isArray(body.user.role.permissions)).toBe(true)

    const deleted = await request.delete(`/api/users/${body.user.id}`);
    expect(deleted.status()).toBe(200);
  })

  test('POST returns 409 when email or username already exists', async ({ request }) => {
    const adminUser = process.env.TEST_USER_ADMIN_USERNAME
    const adminPass = process.env.TEST_USER_ADMIN_PASSWORD
    test.skip(!adminUser || !adminPass, 'Missing admin credentials in env')
    
    await login(request, adminUser!, adminPass!)

    const ts = Date.now()
    const base = {
      firstName: 'Dup',
      lastName: 'Test',
      email: `dup_${ts}@mail.com`,
      userName: `dup_${ts}`,
      password: process.env.TEST_USER_ADMIN_PASSWORD,
      isActive: true,
      role: 'user',
    }

    const first = await request.post(USERS_URL, { data: base })
    expect([201, 409]).toContain(first.status())

    const second = await request.post(USERS_URL, { data: base })
    expect(second.status()).toBe(409)

    const body = await second.json()
    expect(body.message).toMatch(/already in use/i)
  })
})

test.describe('GET/PATCH/DELETE /api/users/:id', () => {
  test('admin can read/update/delete a user by id; validations work', async ({ request }) => {
    const adminUser = process.env.TEST_USER_ADMIN_USERNAME
    const adminPass = process.env.TEST_USER_ADMIN_PASSWORD
    test.skip(!adminUser || !adminPass, 'Missing admin credentials in env')

    await login(request, adminUser!, adminPass!)

    const ts = Date.now()
    const createRes = await request.post(USERS_URL, {
      data: {
        firstName: 'Play',
        lastName: 'Wright',
        email: `pw_${ts}@mail.com`,
        userName: `pw_${ts}`,
        password: process.env.TEST_USER_ADMIN_PASSWORD,
        isActive: true,
        role: 'user',
      },
    })
    expect(createRes.status()).toBe(201)

    const created = await createRes.json()
    expect(created).toHaveProperty('user')
    const id = created.user.id as string
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)

    const userByIdUrl = `${USERS_URL}/${id}`

    const getRes = await request.get(userByIdUrl)
    expect(getRes.status()).toBe(200)
    const user = await getRes.json()
    expect(user.id).toBe(id)
    expect(user).toHaveProperty('role')
    expect(user.role).toHaveProperty('permissions')

    const badPatch = await request.patch(userByIdUrl, {
      data: {
        firstName: 'A',
        lastName: 'B',
        userName: 'ab',
      },
    })
    expect(badPatch.status()).toBe(400)
    const badBody = await badPatch.json()
    expect(badBody.message).toBe('Invalid payload')
    expect(Array.isArray(badBody.issues)).toBe(true)

    const patchRes = await request.patch(userByIdUrl, {
      data: {
        firstName: 'Updated',
        lastName: 'User',
        userName: `pw_${ts}_updated`,
        isActive: false,
      },
    })
    expect(patchRes.status()).toBe(200)
    const patched = await patchRes.json()
    expect(patched.id).toBe(id)
    expect(patched.firstName).toBe('Updated')
    expect(patched.lastName).toBe('User')
    expect(patched.userName).toBe(`pw_${ts}_updated`)
    expect(patched.isActive).toBe(false)

    const delRes = await request.delete(userByIdUrl)
    expect(delRes.status()).toBe(200)
    expect(await delRes.json()).toEqual({ ok: true })

    const getAfter = await request.get(userByIdUrl)
    expect(getAfter.status()).toBe(404)
    expect((await getAfter.json()).message).toBe('Not found')
  })
})

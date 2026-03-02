import { expect , test } from '@playwright/test';


test.describe('POST /api/auth/register' , () => {
  test('returns 400 on invalid payload (zod)' , async ({ request }) => {
    const res = await request.post('/api/auth/register' , {
      data: {
        firstName: 'A' ,
        lastName: 'B' ,
        email: 'not-an-email' ,
        userName: 'ab' ,
        password: '123' ,
      } ,
    });

    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body.message).toBe('Invalid payload');
    expect(Array.isArray(body.issues)).toBe(true);
    expect(body.issues.length).toBeGreaterThan(0);
  });

  test('returns 201 and creates a user' , async ({ request }) => {
    const ts = Date.now();

    const payload = {
      firstName: 'Test' ,
      lastName: 'User' ,
      email: `test_${ts}@mail.com` ,
      userName: `test_${ts}` ,
      password: process.env.TEST_USER_USER_PASSWORD ,
    };

    const res = await request.post('/api/auth/register' , {data: payload});

    console.log(res)

    expect(res.status()).toBe(201);
    expect(res.ok()).toBeTruthy();

    const body = await res.json();

    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('id');
    expect(body.user.firstName).toBe(payload.firstName);
    expect(body.user.lastName).toBe(payload.lastName);
    expect(body.user.email).toBe(payload.email);

    expect(body.user).toHaveProperty('isActive');
    expect(body.user).toHaveProperty('role');
    expect(body.user.role).toHaveProperty('id');
    expect(body.user.role).toHaveProperty('name');
    expect(body.user.role).toHaveProperty('permissions');
    expect(Array.isArray(body.user.role.permissions)).toBe(true);

    if (body.user.role.permissions.length > 0) {
      expect(body.user.role.permissions[0]).toHaveProperty('id');
      expect(body.user.role.permissions[0]).toHaveProperty('name');
    }

    const login = await request.post('/api/auth/login', {
      data: {
        userName: process.env.TEST_USER_ADMIN_USERNAME ,
        password: process.env.TEST_USER_ADMIN_PASSWORD
      }
    });
    expect(login.status()).toBe(200);
    const deleted = await request.delete(`/api/users/${body.user.id}`);
    expect(deleted.status()).toBe(200);
  });

  test('returns 409 when email already exists' , async ({ request }) => {
    const ts = Date.now();

    const email = `dup_${ts}@mail.com`;
    const userName1 = `dup_${ts}_1`;

    const first = await request.post('/api/auth/register' , {
      data: {
        firstName: 'Dup' ,
        lastName: 'Email' ,
        email ,
        userName: userName1 ,
        password: process.env.TEST_USER_USER_PASSWORD ,
      } ,
    });
    expect([201 , 409]).toContain(first.status());

    const second = await request.post('/api/auth/register' , {
      data: {
        firstName: 'Dup' ,
        lastName: 'Email2' ,
        email ,
        userName: `dup_${ts}_2` ,
        password: process.env.TEST_USER_USER_PASSWORD ,
      } ,
    });

    expect(second.status()).toBe(409);
    const body = await second.json();
    expect(body.message).toMatch(/Email already in use/i);
  });

  test('returns 409 when username already exists' , async ({ request }) => {
    const ts = Date.now();

    const userName = `dupuser_${ts}`;
    const email1 = `dupuser_${ts}_1@mail.com`;

    const first = await request.post('/api/auth/register' , {
      data: {
        firstName: 'Dup' ,
        lastName: 'UserName' ,
        email: email1 ,
        userName ,
        password: process.env.TEST_USER_USER_PASSWORD ,
      } ,
    });
    expect([201 , 409]).toContain(first.status());

    const second = await request.post('/api/auth/register' , {
      data: {
        firstName: 'Dup' ,
        lastName: 'UserName2' ,
        email: `dupuser_${ts}_2@mail.com` ,
        userName ,
        password: process.env.TEST_USER_USER_PASSWORD ,
      } ,
    });

    expect(second.status()).toBe(409);
    const body = await second.json();
    expect(body.message).toMatch(/Username already in use/i);
  });
});

test.describe('POST /api/auth/login' , () => {

  test('returns 400 on invalid payload (zod)' , async ({ request }) => {
    const res = await request.post('/api/auth/login' , {
      data: {userName: 'ab' , password: '123'} ,
    });

    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Invalid payload');
    expect(body).toHaveProperty('issues');
    expect(Array.isArray(body.issues)).toBe(true);
  });

  test('returns 401 on invalid credentials (user not found)' , async ({ request }) => {
    const res = await request.post('/api/auth/login' , {
      data: {userName: `no_user_${Date.now()}` , password: '123456'} ,
    });

    expect(res.status()).toBe(401);

    const body = await res.json();
    expect(body.message).toBe('Invalid credentials');
  });

  test('returns 401 on invalid credentials (wrong password)' , async ({ request }) => {
    const res = await request.post('/api/auth/login' , {
      data: {userName: process.env.TEST_USER_USER_USERNAME, password: 'wrongpass123'} ,
    });

    expect(res.status()).toBe(401);

    const body = await res.json();
    expect(body.message).toBe('Invalid credentials');
  });

  test('returns 200, sets auth cookies, and returns user payload' , async ({ request }) => {
    const res = await request.post('/api/auth/login' , {
      data: {userName: process.env.TEST_USER_ADMIN_USERNAME, password: process.env.TEST_USER_ADMIN_PASSWORD} ,
    });

    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(res.ok()).toBeTruthy();

    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('id');
    expect(body.user).toHaveProperty('firstName');
    expect(body.user).toHaveProperty('lastName');
    expect(body.user).toHaveProperty('email');

    expect(body.user).toHaveProperty('role');
    expect(body.user.role).toHaveProperty('id');
    expect(body.user.role).toHaveProperty('name');
    expect(body.user.role).toHaveProperty('permissions');
    expect(Array.isArray(body.user.role.permissions)).toBe(true);

    const headers = await res.headersArray();
    const setCookieHeaders = headers
        .filter(h => h.name.toLowerCase() === 'set-cookie')
        .map(h => h.value);

    expect(setCookieHeaders.length).toBeGreaterThan(0);

    const joined = setCookieHeaders.join(' | ').toLowerCase();
    expect(joined).toContain('httponly');
  });

  test('returns 403 when user is inactive (if you have a seeded inactive user)' , async ({ request }) => {
    const ts = Date.now();
    
    const inactiveUserName = `inactive_${ts}`;
    const inactivePassword = `admin123`;

    const payload = {
      firstName: 'Test' ,
      lastName: 'User' ,
      email: `test_${ts}@mail.com` ,
      userName: inactiveUserName ,
      password: inactivePassword ,
    };

    const createdUser = await request.post('/api/auth/register' , {data: payload});

    expect(createdUser.status()).toBe(201);

    test.skip(!inactiveUserName || !inactivePassword , 'No inactive user credentials provided');

    const res = await request.post('/api/auth/login' , {
      data: {userName: inactiveUserName! , password: inactivePassword!} ,
    });

    expect(res.status()).toBe(403);

    const body = await res.json();
    expect(body.message).toBe('User is inactive');
  });
});

test.describe('GET /api/users/me' , () => {
  test('returns 401 when no session cookie' , async ({ request }) => {
    const res = await request.get('/api/auth/me');
    expect(res.status()).toBe(401);

    const body = await res.json();
    expect(body.message).toBe('Unauthorized');
  });

  test('returns 200 with session cookie (login first)' , async ({request}) => {

    const loginRes = await request.post('/api/auth/login' , {
      data: {userName: process.env.TEST_USER_USER_USERNAME, password: process.env.TEST_USER_USER_PASSWORD} ,
    });
    expect(loginRes.status()).toBe(200);

    const setCookie = loginRes.headers()['set-cookie'];
    expect(setCookie).toBeTruthy();

    const meRes = await request.get('/api/auth/me');
    expect(meRes.status()).toBe(200);

    const me = await meRes.json();
    expect(me).toHaveProperty('id');
    expect(me).toHaveProperty('firstName');
    expect(me).toHaveProperty('lastName');
    expect(me).toHaveProperty('createdAt');

    expect(me).toHaveProperty('role');
    expect(me.role).toHaveProperty('id');
    expect(me.role).toHaveProperty('name');
    expect(me.role).toHaveProperty('permissions');
    expect(Array.isArray(me.role.permissions)).toBe(true);

    if (me.role.permissions.length > 0) {
      expect(me.role.permissions[0]).toHaveProperty('id');
      expect(me.role.permissions[0]).toHaveProperty('key');
    }
  });
});

test.describe('POST /api/auth/logout' , () => {
  test('clears auth cookies and invalidates session' , async ({browser}) => {
    const context = await browser.newContext();
    const api = context.request;

    const loginRes = await api.post('/api/auth/login' , {
      data: {userName: process.env.TEST_USER_USER_USERNAME, password: process.env.TEST_USER_USER_PASSWORD} ,
    });

    expect(loginRes.status()).toBe(200);

    const meBefore = await api.get('/api/auth/me');
    expect(meBefore.status()).toBe(200);

    const logoutRes = await api.post('/api/auth/logout');
    expect(logoutRes.status()).toBe(200);

    const logoutBody = await logoutRes.json();
    expect(logoutBody).toEqual({ok: true});

    const setCookie = logoutRes.headers()['set-cookie'];
    expect(setCookie).toBeTruthy();

    const meAfter = await api.get('/api/users/me');
    expect(meAfter.status()).toBe(401);

    const body = await meAfter.json();
    expect(body.message).toBe('Unauthorized');

    await context.close();
  });
});



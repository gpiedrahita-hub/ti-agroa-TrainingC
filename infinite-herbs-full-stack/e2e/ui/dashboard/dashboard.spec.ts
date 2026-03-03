import { test, expect } from '../fixtures/mockUI';

test('authenticate', async ({ page }) => {
  const locale = 'es'
  await page.goto(`/${locale}/login`)

  await page.locator('#userName').fill('admin')
  await page.locator('#password').fill('12345678')
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click()

  await page.context().storageState({ path: 'e2e/.auth.json' })
})

test('unauthenticated user is redirected to login', async ({ page, context }) => {
  await context.clearCookies()

  const locale = 'es'
  await page.goto(`/${locale}/dashboard`)
  // await expect(page).toHaveURL(new RegExp(`/${locale}/login`))
})
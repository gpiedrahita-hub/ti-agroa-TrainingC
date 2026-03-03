import { test, expect } from '../fixtures/mockUI';

test.describe('Login (UI)', () => {
  test('redirects to dashboard after successful login', async ({ page }) => {
    const locale = 'es'
    await page.goto(`/${locale}/login`)

    await page.locator('#userName').fill('admin')
    await page.locator('#password').fill('12345678')

    await page.getByRole('button', { name: 'Iniciar Sesión' }).click()
  })

  test('shows validation messages on invalid input', async ({ page }) => {
    const locale = 'es'
    await page.goto(`/${locale}/login`)

    await page.locator('#userName').fill('ab')
    await page.locator('#password').fill('123')

    await page.getByRole('button', { name: 'Iniciar Sesión' }).click()

    await expect(page.locator('p.text-red-500')).toHaveCount(2)
  })
})

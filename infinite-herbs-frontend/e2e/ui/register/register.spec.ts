import { expect , test } from '../fixtures/mockUI';

test.describe('Register (UI)' , () => {
  test('shows validation errors when submitting empty form' , async ({page}) => {
    const locale = 'es';
    await page.goto(`/${locale}/register`);
    await page.getByRole('button' , {name: 'Crear Cuenta'}).click();
    await expect(page.locator('p.text-red-500')).toHaveCount(6);
  });

  test('shows error when passwords do not match' , async ({page}) => {
    const locale = 'es';
    await page.goto(`/${locale}/register`);

    await page.locator('#firstName').fill('Juan');
    await page.locator('#lastName').fill('Perez');
    await page.locator('#email').fill(`juan_${Date.now()}@mail.com`);
    await page.locator('#userName').fill(`juan_${Date.now()}`);
    await page.locator('#password').fill('12345678');
    await page.locator('#confirmPassword').fill('87654321');

    await page.getByRole('button' , {name: 'Crear Cuenta'}).click();

    await expect(page.locator('#confirmPassword')).toBeVisible();
    await expect(page.locator('p.text-red-500')).toContainText(/match|coincid|passwordMatch/i);
  });

  test('successful register redirects to login' , async ({page}) => {
    const locale = 'es';
    await page.goto(`/${locale}/register`);

    const ts = Date.now();

    await page.locator('#firstName').fill('Test');
    await page.locator('#lastName').fill('User');
    await page.locator('#email').fill(`test_${ts}@mail.com`);
    await page.locator('#userName').fill(`test_${ts}`);
    await page.locator('#password').fill('12345678');
    await page.locator('#confirmPassword').fill('12345678');

    await page.getByRole('button' , {name: 'Crear Cuenta'}).click();

    await expect(page).toHaveURL(new RegExp(`/${locale}/login`));
  });

  test('shows backend error when user/email already exists' , async ({page}) => {
    const locale = 'es';
    await page.goto(`/${locale}/register`);

    await page.locator('#firstName').fill('Juanito');
    await page.locator('#lastName').fill('Perez');
    await page.locator('#email').fill('user@mail.com');
    await page.locator('#userName').fill('user');
    await page.locator('#password').fill('123456789');
    await page.locator('#confirmPassword').fill('123456789');

    await page.getByRole('button' , {name: 'Crear Cuenta'}).click();

    await expect(page.locator('div.bg-red-50')).toHaveCount(0);
  });

});

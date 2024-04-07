import { test, expect } from '@playwright/test';

const d = new Date();
const time = d.getTime();

test('Basic Signup', async ({ page, context }) => {
  const suffix = crypto.getRandomValues(new Uint32Array(1))[0];
  const username = `test_${time}_${suffix}`;
  await page.goto('http://localhost:3000/login');
  await page.getByRole('link', { name: 'Don\'t have an account? Sign up' }).click();

  await expect(page.getByRole('heading')).toContainText('Sign Up');

  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill('password123');
  await page.locator('input[name="confirmPassword"]').fill('password123');
  await page.locator('input[name="inviteCode"]').fill('123');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('navigation')).toContainText('Hondana');

  await context.clearCookies();

  await page.goto('http://localhost:3000/login');

  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill('password123');
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByRole('navigation')).toContainText('Hondana');
});

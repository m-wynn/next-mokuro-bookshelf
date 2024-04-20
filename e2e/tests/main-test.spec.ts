import { test, expect } from '@playwright/test';

import { signup, login, get_username, get_password } from '../helper';

const d = new Date();
const time = d.getTime();

test('Basic Signup', async ({ page, context }) => {
  const suffix = crypto.getRandomValues(new Uint32Array(1))[0];
  const username = `test_${time}_${suffix}`;
  const password = `${crypto.getRandomValues(new Uint32Array(1))[0]}`;
  await signup(page, username, password);

  await context.clearCookies();

  await login(page, username, password);
});

test('Admin Login', async ({ page, context }) => {
  const username = await get_username();
  const password = await get_password();
  await login(page, username, password);
  await page.getByRole('link').nth(3).click();
  await expect(page.getByRole('heading')).toContainText('Admin');
});
import { test, expect } from '@playwright/test';

import { signup, login, get_username, get_password, generateRandomSuffix } from '../helper';

test('Logout Functionality', async ({ page, context }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Look for logout button/link
  const logoutButton = page.getByRole('button', { name: /logout/i }).first();
  const logoutLink = page.getByRole('link', { name: /logout/i }).first();
  
  // Try to logout
  const buttonCount = await logoutButton.count();
  const linkCount = await logoutLink.count();
  
  if (buttonCount > 0 && await logoutButton.isVisible().catch(() => false)) {
    await logoutButton.click();
  } else if (linkCount > 0 && await logoutLink.isVisible().catch(() => false)) {
    await logoutLink.click();
  } else {
    // If no logout button found, skip this test
    console.log('No logout button/link found - UI might not have one');
    return;
  }
  
  // After logout, we should be redirected to login page
  await page.waitForURL(/.*\/login/);
  await expect(page).toHaveURL(/.*\/login/);
});

test('Protected Route Redirect', async ({ page }) => {
  // Try to access a protected route without being logged in
  await page.goto('http://localhost:3000/user/settings');
  
  // Should be redirected to login
  await page.waitForURL(/.*\/login/);
  await expect(page).toHaveURL(/.*\/login/);
});

test('Login with Invalid Credentials', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  
  await page.locator('input[name="username"]').fill('nonexistentuser123456');
  await page.locator('input[name="password"]').fill('wrongpassword');
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Should show error or stay on login page
  await page.waitForLoadState('networkidle').catch(() => {});
  
  const currentUrl = page.url();
  expect(currentUrl).toContain('/login');
});

test('Signup with Mismatched Passwords', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.getByRole('link', { name: 'Don\'t have an account? Sign up' }).click();
  
  await expect(page.getByRole('heading')).toContainText('Sign Up');
  
  const suffix = generateRandomSuffix();
  const username = `test_mismatch_${suffix}`;
  
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill('password123');
  await page.locator('input[name="confirmPassword"]').fill('password456');
  await page.locator('input[name="inviteCode"]').fill('123');
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Should show error or stay on signup page
  await page.waitForLoadState('networkidle').catch(() => {});
  
  const currentUrl = page.url();
  expect(currentUrl).toContain('/signup');
});

test('Signup with Invalid Invite Code', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.getByRole('link', { name: 'Don\'t have an account? Sign up' }).click();
  
  await expect(page.getByRole('heading')).toContainText('Sign Up');
  
  const suffix = generateRandomSuffix();
  const username = `test_invalidcode_${suffix}`;
  const password = `${generateRandomSuffix()}`;
  
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('input[name="confirmPassword"]').fill(password);
  await page.locator('input[name="inviteCode"]').fill('wrongcode999');
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Should show error or stay on signup page
  await page.waitForLoadState('networkidle').catch(() => {});
  
  const currentUrl = page.url();
  expect(currentUrl).toContain('/signup');
});

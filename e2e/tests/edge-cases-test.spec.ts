import { test, expect } from '@playwright/test';

import { signup } from '../helper';

test('Multiple Sequential Signups', async ({ page }) => {
  // Create multiple users to test database and session handling
  const d = new Date();
  const time = d.getTime();
  
  for (let i = 0; i < 3; i++) {
    const suffix = crypto.getRandomValues(new Uint32Array(1))[0];
    const username = `test_multi_${time}_${suffix}`;
    const password = `${crypto.getRandomValues(new Uint32Array(1))[0]}`;
    
    await signup(page, username, password);
    
    // Verify successful signup by checking navigation
    await expect(page.getByRole('navigation')).toContainText('Hondana');
    
    // Navigate to signup page for next iteration
    if (i < 2) {
      await page.goto('http://localhost:3000/signup');
    }
  }
});

test('Duplicate Username Prevention', async ({ page }) => {
  const d = new Date();
  const time = d.getTime();
  const suffix = crypto.getRandomValues(new Uint32Array(1))[0];
  const username = `test_duplicate_${time}_${suffix}`;
  const password = `${crypto.getRandomValues(new Uint32Array(1))[0]}`;
  
  // First signup should succeed
  await signup(page, username, password);
  await expect(page.getByRole('navigation')).toContainText('Hondana');
  
  // Navigate to signup page again
  await page.goto('http://localhost:3000/signup');
  
  // Try to signup with the same username
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('input[name="confirmPassword"]').fill(password);
  await page.locator('input[name="inviteCode"]').fill('123');
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Should show error or stay on signup page
  await page.waitForTimeout(1000);
  const currentUrl = page.url();
  expect(currentUrl).toContain('/signup');
});

test('Session Persistence Across Page Reloads', async ({ page }) => {
  const d = new Date();
  const time = d.getTime();
  const suffix = crypto.getRandomValues(new Uint32Array(1))[0];
  const username = `test_session_${time}_${suffix}`;
  const password = `${crypto.getRandomValues(new Uint32Array(1))[0]}`;
  
  // Signup
  await signup(page, username, password);
  await expect(page.getByRole('navigation')).toContainText('Hondana');
  
  // Reload the page
  await page.reload();
  
  // Should still be logged in
  await expect(page.getByRole('navigation')).toContainText('Hondana');
});

test('Empty Username Validation', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.getByRole('link', { name: 'Don\'t have an account? Sign up' }).click();
  
  await expect(page.getByRole('heading')).toContainText('Sign Up');
  
  // Try to submit with empty username
  await page.locator('input[name="password"]').fill('password123');
  await page.locator('input[name="confirmPassword"]').fill('password123');
  await page.locator('input[name="inviteCode"]').fill('123');
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Should show validation error or stay on page
  await page.waitForTimeout(500);
  const currentUrl = page.url();
  expect(currentUrl).toContain('/signup');
});

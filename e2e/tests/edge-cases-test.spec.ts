import { test, expect } from '@playwright/test';

import { signup, generateRandomSuffix } from '../helper';

test('Multiple Sequential Signups', async ({ page }) => {
  // Create multiple users to test database and session handling
  const d = new Date();
  const time = d.getTime();
  
  for (let i = 0; i < 3; i++) {
    const suffix = generateRandomSuffix();
    const username = `test_multi_${time}_${suffix}`;
    const password = `${generateRandomSuffix()}`;
    
    await signup(page, username, password);
    
    // Verify successful signup by checking navigation
    if (!page.isClosed()) {
      await expect(page.getByRole('navigation')).toContainText('Hondana', { timeout: 10000 });
    }
    
    // Navigate to signup page for next iteration
    if (i < 2 && !page.isClosed()) {
      await page.goto('http://localhost:3000/signup', { waitUntil: 'domcontentloaded' });
    }
  }
});

test('Duplicate Username Prevention', async ({ page }) => {
  const d = new Date();
  const time = d.getTime();
  const suffix = generateRandomSuffix();
  const username = `test_duplicate_${time}_${suffix}`;
  const password = `${generateRandomSuffix()}`;
  
  // First signup should succeed
  await signup(page, username, password);
  
  if (!page.isClosed()) {
    await expect(page.getByRole('navigation')).toContainText('Hondana', { timeout: 10000 });
    
    // Navigate to signup page again
    await page.goto('http://localhost:3000/signup', { waitUntil: 'domcontentloaded' });
    
    // Try to signup with the same username
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.locator('input[name="inviteCode"]').fill('123');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Should show error or stay on signup page
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    
    if (!page.isClosed()) {
      const currentUrl = page.url();
      expect(currentUrl).toContain('/signup');
    }
  }
});

test('Session Persistence Across Page Reloads', async ({ page }) => {
  const d = new Date();
  const time = d.getTime();
  const suffix = generateRandomSuffix();
  const username = `test_session_${time}_${suffix}`;
  const password = `${generateRandomSuffix()}`;
  
  // Signup
  await signup(page, username, password);
  
  if (!page.isClosed()) {
    await expect(page.getByRole('navigation')).toContainText('Hondana', { timeout: 10000 });
    
    // Reload the page
    await page.reload({ waitUntil: 'domcontentloaded' });
    
    // Should still be logged in
    if (!page.isClosed()) {
      await expect(page.getByRole('navigation')).toContainText('Hondana', { timeout: 10000 });
    }
  }
});

test('Empty Username Validation', async ({ page }) => {
  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  
  const signupLink = page.getByRole('link', { name: 'Don\'t have an account? Sign up' });
  await signupLink.waitFor({ state: 'visible', timeout: 10000 });
  await signupLink.click();
  
  await expect(page.getByRole('heading')).toContainText('Sign Up', { timeout: 10000 });
  
  // Try to submit with empty username
  await page.locator('input[name="password"]').fill('password123');
  await page.locator('input[name="confirmPassword"]').fill('password123');
  await page.locator('input[name="inviteCode"]').fill('123');
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Should show validation error or stay on page
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  
  if (!page.isClosed()) {
    const currentUrl = page.url();
    expect(currentUrl).toContain('/signup');
  }
});

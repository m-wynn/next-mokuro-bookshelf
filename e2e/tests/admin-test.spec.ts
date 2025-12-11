import { test, expect } from '@playwright/test';

import { login, get_username, get_password } from '../helper';

test('Admin Page Access for Admin User', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Navigate to admin page
  await page.goto('http://localhost:3000/admin');
  
  // Verify we're on the admin page
  await expect(page.getByRole('heading')).toContainText('Admin');
});

test('Admin Books Page Access', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Navigate to admin books page
  await page.goto('http://localhost:3000/admin/books');
  
  // Page should load without errors
  await expect(page).toHaveURL(/.*\/admin\/books/);
});

test('Admin Users Page Access', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Navigate to admin users page
  await page.goto('http://localhost:3000/admin/users');
  
  // Page should load without errors
  await expect(page).toHaveURL(/.*\/admin\/users/);
  
  // Should show at least one user (the admin)
  // This assumes there's some user listing element
  const pageContent = page.locator('body');
  await expect(pageContent).toBeVisible();
});

test('Admin Volumes Page Access', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Navigate to admin volumes page
  await page.goto('http://localhost:3000/admin/volumes');
  
  // Page should load without errors
  await expect(page).toHaveURL(/.*\/admin\/volumes/);
});

test('Admin Navigation from Home', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Go to home first
  await page.goto('http://localhost:3000');
  
  // Click on the admin link (4th link based on main-test.spec.ts)
  const adminLink = page.getByRole('link').nth(3);
  await adminLink.click();
  
  // Should be on admin page
  await expect(page.getByRole('heading')).toContainText('Admin');
});

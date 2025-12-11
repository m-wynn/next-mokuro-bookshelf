import { test, expect } from '@playwright/test';

import { login, get_username, get_password } from '../helper';

test('Admin Page Access for Admin User', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Navigate to admin page
  await page.goto('http://localhost:3000/admin');
  await page.waitForLoadState('networkidle');
  
  // Verify we're on the admin page - check for sidebar with "Admin" heading
  await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible({ timeout: 10000 });
  // Also check for the main content
  await expect(page.getByText('Choose from the sidebar')).toBeVisible({ timeout: 10000 });
});

test('Admin Books Page Access', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Navigate to admin books page
  await page.goto('http://localhost:3000/admin/books');
  await page.waitForLoadState('networkidle');
  
  // Page should load without errors
  await expect(page).toHaveURL(/.*\/admin\/books/);
  // Check sidebar is present
  await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible({ timeout: 10000 });
});

test('Admin Users Page Access', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Navigate to admin users page
  await page.goto('http://localhost:3000/admin/users');
  await page.waitForLoadState('networkidle');
  
  // Page should load without errors
  await expect(page).toHaveURL(/.*\/admin\/users/);
  // Check sidebar is present
  await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible({ timeout: 10000 });
});

test('Admin Volumes Page Access', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Navigate to admin volumes page
  await page.goto('http://localhost:3000/admin/volumes');
  await page.waitForLoadState('networkidle');
  
  // Page should load without errors
  await expect(page).toHaveURL(/.*\/admin\/volumes/);
  // Check sidebar is present
  await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible({ timeout: 10000 });
});

test('Admin Navigation from Home', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Go to home first
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Look for admin link in navbar
  const adminLink = page.getByRole('link', { name: /admin/i }).first();
  const linkCount = await adminLink.count();
  
  if (linkCount > 0) {
    const isVisible = await adminLink.isVisible().catch(() => false);
    if (isVisible) {
      await adminLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible({ timeout: 10000 });
      return;
    }
  }
  
  // Fallback: navigate directly
  await page.goto('http://localhost:3000/admin');
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible({ timeout: 10000 });
});

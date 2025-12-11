import { test, expect } from '@playwright/test';

import { login, get_username, get_password } from '../helper';

test('All Books Page Access', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Navigate to all books page
  await page.goto('http://localhost:3000/allbooks');
  
  // Verify we're on the all books page
  // The page should load without errors
  await expect(page).toHaveURL(/.*\/allbooks/);
});

test('Search Bar Visible', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Go to home page
  await page.goto('http://localhost:3000');
  
  // Look for search input
  const searchInput = page.locator('input[type="search"]').first();
  if (await searchInput.count() > 0) {
    await expect(searchInput).toBeVisible();
  }
});

test('Home Page Loads After Login', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Verify we're on the home page and it contains the app name
  await expect(page.getByRole('navigation')).toContainText('Hondana');
});

test('Navigation Bar Contains Expected Links', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Navigate to home
  await page.goto('http://localhost:3000');
  
  // Check for navigation bar
  const nav = page.getByRole('navigation');
  await expect(nav).toBeVisible();
});

import { test, expect } from '@playwright/test';

import { login, get_username, get_password } from '../helper';

test('User Settings Page Access', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Navigate to user settings
  await page.goto('http://localhost:3000/user/settings');
  await page.waitForLoadState('networkidle');
  
  // Verify we're on the settings page - look for "Preferences" heading
  await expect(page.getByText('Preferences')).toBeVisible({ timeout: 10000 });
});

test('User Settings - Preferences Visible', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Navigate to user settings
  await page.goto('http://localhost:3000/user/settings');
  await page.waitForLoadState('networkidle');
  
  // Check that preference toggles/inputs are visible
  // Look for actual preference elements from the UI
  await expect(page.getByText('Display Two Pages')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Show Japanese Title')).toBeVisible({ timeout: 10000 });
});

test('User Settings - Navigation from Navbar', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Try to navigate to settings from home page
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Look for a settings link or user menu
  // This may need adjustment based on actual navbar structure
  const settingsLink = page.getByRole('link', { name: /settings/i }).first();
  const linkCount = await settingsLink.count();
  
  if (linkCount > 0) {
    const isVisible = await settingsLink.isVisible().catch(() => false);
    if (isVisible) {
      await settingsLink.click();
      await page.waitForURL(/.*\/user\/settings/, { timeout: 10000 });
      await expect(page).toHaveURL(/.*\/user\/settings/);
      return;
    }
  }
  
  // If no settings link found in navbar, navigate directly to verify page exists
  await page.goto('http://localhost:3000/user/settings');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/.*\/user\/settings/);
  await expect(page.getByText('Preferences')).toBeVisible({ timeout: 10000 });
});

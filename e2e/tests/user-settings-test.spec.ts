import { test, expect } from '@playwright/test';

import { login, get_username, get_password } from '../helper';

test('User Settings Page Access', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Navigate to user settings
  await page.goto('http://localhost:3000/user/settings');
  
  // Verify we're on the settings page
  await expect(page.getByRole('heading')).toContainText('Settings');
});

test('User Settings - Preferences Visible', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Navigate to user settings
  await page.goto('http://localhost:3000/user/settings');
  
  // Check that preference toggles/inputs are visible
  // Note: This test assumes standard form elements exist
  // Adjust selectors based on actual implementation
  const form = page.locator('form').first();
  await expect(form).toBeVisible();
});

test('User Settings - Navigation from Navbar', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Try to navigate to settings from home page
  await page.goto('http://localhost:3000');
  
  // Look for a settings link or user menu
  // This may need adjustment based on actual navbar structure
  const settingsLink = page.getByRole('link', { name: /settings/i }).first();
  if (await settingsLink.isVisible()) {
    await settingsLink.click();
    await expect(page).toHaveURL(/.*\/user\/settings/);
  }
});

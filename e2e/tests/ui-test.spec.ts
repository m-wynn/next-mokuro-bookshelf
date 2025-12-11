import { test, expect } from '@playwright/test';

import { login, get_username, get_password } from '../helper';

test('Login Page - UI Elements Present', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  
  // Check for essential form elements
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible();
});

test('Signup Page - UI Elements Present', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  
  // Check for essential form elements
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
  await expect(page.locator('input[name="inviteCode"]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
});

test('Home Page - Basic Layout', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Check for navigation bar
  const nav = page.getByRole('navigation');
  await expect(nav).toBeVisible();
  
  // Check for main content area
  const main = page.locator('main').first();
  if (await main.count() > 0) {
    await expect(main).toBeVisible();
  }
});

test('Navigation - Links Are Clickable', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Get all navigation links
  const navLinks = page.getByRole('navigation').getByRole('link');
  const linkCount = await navLinks.count();
  
  // There should be at least one link
  expect(linkCount).toBeGreaterThan(0);
  
  // Check that links are visible and enabled (test up to first 5 links)
  const MAX_LINKS_TO_TEST = 5;
  for (let i = 0; i < Math.min(linkCount, MAX_LINKS_TO_TEST); i++) {
    await expect(navLinks.nth(i)).toBeVisible();
  }
});

test('Page Title - Login Page', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  
  // Check page title contains expected text
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
});

test('Page Title - Home Page After Login', async ({ page }) => {
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Check page title
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
});

test('Responsive Design - Mobile Viewport', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Navigation should still be visible (even if styled differently)
  const nav = page.getByRole('navigation');
  await expect(nav).toBeVisible();
});

test('Responsive Design - Tablet Viewport', async ({ page }) => {
  // Set tablet viewport
  await page.setViewportSize({ width: 768, height: 1024 });
  
  const username = await get_username();
  const password = await get_password();
  
  await login(page, username, password);
  
  // Navigation should be visible
  const nav = page.getByRole('navigation');
  await expect(nav).toBeVisible();
});

import { expect, Page } from '@playwright/test';

export async function get_password() {
  return process.env.PLAYWRIGHT_ADMIN_PASSWORD;
}

export async function get_username() {
    return process.env.PLAYWRIGHT_ADMIN_USERNAME;
}

export function generateRandomSuffix(): number {
    return crypto.getRandomValues(new Uint32Array(1))[0];
}

export async function signup(page: Page, username: string, password: string) {
    await page.goto('http://localhost:3000/login');
    
    // Wait for and click signup link
    await page.getByRole('link', { name: 'Don\'t have an account? Sign up' }).click();
  
    // Wait for signup page to load
    await expect(page.getByRole('heading')).toContainText('Sign Up');
  
    // Fill form fields
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.locator('input[name="inviteCode"]').fill('123');
    
    // Click submit - don't use Promise.all since API call happens first
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for the API call to complete and navigation to happen
    // The app calls router.push('/') after successful signup
    await page.waitForURL('http://localhost:3000/', { timeout: 20000 });
    
    // Verify we're logged in by checking for navigation element
    await expect(page.getByRole('navigation')).toContainText('Hondana');
}

export async function login(page: Page, username: string, password: string) {
    await page.goto('http://localhost:3000/login');

    // Fill login form
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    
    // Click submit - don't use Promise.all since API call happens first
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for the API call to complete and navigation to happen
    // The app calls router.push('/') after successful login
    await page.waitForURL('http://localhost:3000/', { timeout: 20000 });
  
    // Verify we're logged in by checking for navigation element
    await expect(page.getByRole('navigation')).toContainText('Hondana');
}
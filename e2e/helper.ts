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

export async function signup(page: Page, username: string, password: string): Promise<void> {
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
    
    // Listen for the API response to check for errors
    const responsePromise = page.waitForResponse(
        response => response.url().includes('/api/signup') && response.request().method() === 'POST',
        { timeout: 25000 }
    );
    
    // Click submit
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for API response
    const response = await responsePromise;
    const status = response.status();
    
    if (status !== 201) {
        // Log response body for debugging failures
        const body = await response.text().catch(() => 'Unable to read response body');
        console.error(`[SIGNUP] Failed with status ${status}. Response: ${body}`);
        throw new Error(`Signup API returned ${status}. Expected 201. Response: ${body}`);
    }
    
    // Wait for navigation after successful signup
    await page.waitForURL('http://localhost:3000/', { timeout: 15000 });
    
    // Verify we're logged in
    await expect(page.getByRole('navigation')).toContainText('Hondana');
}

export async function login(page: Page, username: string, password: string): Promise<void> {
    await page.goto('http://localhost:3000/login');

    // Fill login form
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    
    // Listen for the API response to check for errors
    const responsePromise = page.waitForResponse(
        response => response.url().includes('/api/login') && response.request().method() === 'POST',
        { timeout: 25000 }
    );
    
    // Click submit
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for API response
    const response = await responsePromise;
    const status = response.status();
    
    if (status !== 200) {
        // Log response body for debugging failures
        const body = await response.text().catch(() => 'Unable to read response body');
        console.error(`[LOGIN] Failed with status ${status}. Response: ${body}`);
        throw new Error(`Login API returned ${status}. Expected 200. Response: ${body}`);
    }
    
    // Wait for navigation after successful login
    await page.waitForURL('http://localhost:3000/', { timeout: 15000 });
  
    // Verify we're logged in
    await expect(page.getByRole('navigation')).toContainText('Hondana');
}

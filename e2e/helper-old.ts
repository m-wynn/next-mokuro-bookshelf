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
    console.log(`[SIGNUP] Starting signup for user: ${username}`);
    await page.goto('http://localhost:3000/login');
    
    // Wait for and click signup link
    await page.getByRole('link', { name: 'Don\'t have an account? Sign up' }).click();
  
    // Wait for signup page to load
    await expect(page.getByRole('heading')).toContainText('Sign Up');
  
    // Fill form fields
    console.log(`[SIGNUP] Filling form for user: ${username}`);
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
    console.log(`[SIGNUP] Clicking submit button`);
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for API response
    console.log(`[SIGNUP] Waiting for API response...`);
    const response = await responsePromise;
    const status = response.status();
    console.log(`[SIGNUP] API response status: ${status}`);
    
    if (status !== 201) {
        // Log response body for debugging
        const body = await response.text().catch(() => 'Unable to read response body');
        console.error(`[SIGNUP] Signup failed with status ${status}. Response: ${body}`);
        throw new Error(`Signup API returned ${status}. Expected 201. Response: ${body}`);
    }
    
    // Wait for navigation after successful signup
    console.log(`[SIGNUP] Waiting for navigation to home page...`);
    await page.waitForURL('http://localhost:3000/', { timeout: 15000 });
    console.log(`[SIGNUP] Navigation successful, current URL: ${page.url()}`);
    
    // Verify we're logged in
    console.log(`[SIGNUP] Verifying login by checking navigation...`);
    await expect(page.getByRole('navigation')).toContainText('Hondana');
    console.log(`[SIGNUP] Signup complete for user: ${username}`);
}

export async function login(page: Page, username: string, password: string) {
    console.log(`[LOGIN] Starting login for user: ${username}`);
    await page.goto('http://localhost:3000/login');

    // Fill login form
    console.log(`[LOGIN] Filling login form for user: ${username}`);
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    
    // Listen for the API response to check for errors
    const responsePromise = page.waitForResponse(
        response => response.url().includes('/api/login') && response.request().method() === 'POST',
        { timeout: 25000 }
    );
    
    // Click submit
    console.log(`[LOGIN] Clicking submit button`);
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for API response
    console.log(`[LOGIN] Waiting for API response...`);
    const response = await responsePromise;
    const status = response.status();
    console.log(`[LOGIN] API response status: ${status}`);
    
    if (status !== 200) {
        // Log response body for debugging
        const body = await response.text().catch(() => 'Unable to read response body');
        console.error(`[LOGIN] Login failed with status ${status}. Response: ${body}`);
        throw new Error(`Login API returned ${status}. Expected 200. Response: ${body}`);
    }
    
    // Wait for navigation after successful login
    console.log(`[LOGIN] Waiting for navigation to home page...`);
    await page.waitForURL('http://localhost:3000/', { timeout: 15000 });
    console.log(`[LOGIN] Navigation successful, current URL: ${page.url()}`);
  
    // Verify we're logged in
    console.log(`[LOGIN] Verifying login by checking navigation...`);
    await expect(page.getByRole('navigation')).toContainText('Hondana');
    console.log(`[LOGIN] Login complete for user: ${username}`);
}
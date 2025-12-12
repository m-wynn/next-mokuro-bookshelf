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

// Helper to wait for rate limit window to reset
async function waitForRateLimit(retryCount: number) {
    if (retryCount > 0) {
        const waitTime = 15000; // Wait 15 seconds between retries to avoid rate limit
        console.log(`[RATE_LIMIT] Waiting ${waitTime/1000}s before retry ${retryCount}...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }
}

export async function signup(page: Page, username: string, password: string, retryCount = 0): Promise<void> {
    const maxRetries = 3;
    
    try {
        console.log(`[SIGNUP] Starting signup for user: ${username} (attempt ${retryCount + 1})`);
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
        
        if (status === 429) {
            // Rate limited - retry with delay
            const body = await response.text().catch(() => 'Unable to read response body');
            console.log(`[SIGNUP] Rate limited (429). Response: ${body}`);
            
            if (retryCount < maxRetries) {
                await waitForRateLimit(retryCount + 1);
                return signup(page, username, password, retryCount + 1);
            } else {
                throw new Error(`Signup failed after ${maxRetries} retries due to rate limiting`);
            }
        }
        
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
    } catch (error) {
        if (retryCount < maxRetries && error.message && error.message.includes('429')) {
            await waitForRateLimit(retryCount + 1);
            return signup(page, username, password, retryCount + 1);
        }
        throw error;
    }
}

export async function login(page: Page, username: string, password: string, retryCount = 0): Promise<void> {
    const maxRetries = 3;
    
    try {
        console.log(`[LOGIN] Starting login for user: ${username} (attempt ${retryCount + 1})`);
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
        
        if (status === 429) {
            // Rate limited - retry with delay
            const body = await response.text().catch(() => 'Unable to read response body');
            console.log(`[LOGIN] Rate limited (429). Response: ${body}`);
            
            if (retryCount < maxRetries) {
                await waitForRateLimit(retryCount + 1);
                return login(page, username, password, retryCount + 1);
            } else {
                throw new Error(`Login failed after ${maxRetries} retries due to rate limiting`);
            }
        }
        
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
    } catch (error) {
        if (retryCount < maxRetries && error.message && error.message.includes('429')) {
            await waitForRateLimit(retryCount + 1);
            return login(page, username, password, retryCount + 1);
        }
        throw error;
    }
}

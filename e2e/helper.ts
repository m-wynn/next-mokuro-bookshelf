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

/**
 * Helper to safely check if page is still active
 */
async function isPageActive(page: Page): Promise<boolean> {
    try {
        return !page.isClosed();
    } catch {
        return false;
    }
}

/**
 * Helper to safely wait for navigation with timeout protection
 */
async function safeWaitForNavigation(page: Page, urlPattern: string | RegExp, timeout: number = 30000): Promise<void> {
    try {
        await page.waitForURL(urlPattern, { timeout, waitUntil: 'domcontentloaded' });
    } catch (error) {
        // If navigation timeout or page closed, check if we're already at the destination
        if (await isPageActive(page)) {
            const currentUrl = page.url();
            const matches = typeof urlPattern === 'string' 
                ? currentUrl.includes(urlPattern) 
                : urlPattern.test(currentUrl);
            if (!matches) {
                throw error;
            }
        } else {
            throw error;
        }
    }
}

export async function signup(page: Page, username: string, password: string) {
    // Ensure page is active
    if (!await isPageActive(page)) {
        throw new Error('Page is closed or inactive');
    }
    
    await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
    
    // Wait for and click signup link
    const signupLink = page.getByRole('link', { name: 'Don\'t have an account? Sign up' });
    await signupLink.waitFor({ state: 'visible', timeout: 10000 });
    await signupLink.click();
  
    // Wait for signup page to load
    await expect(page.getByRole('heading')).toContainText('Sign Up', { timeout: 10000 });
  
    // Fill form fields
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.locator('input[name="inviteCode"]').fill('123');
    
    // Click submit button
    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();
    
    // Wait for navigation to complete
    await safeWaitForNavigation(page, 'http://localhost:3000/');
    
    // Wait for the navigation element to be visible
    if (await isPageActive(page)) {
        await page.waitForSelector('nav', { timeout: 15000, state: 'visible' });
        await expect(page.getByRole('navigation')).toContainText('Hondana', { timeout: 10000 });
    }
}

export async function login(page: Page, username: string, password: string) {
    // Ensure page is active
    if (!await isPageActive(page)) {
        throw new Error('Page is closed or inactive');
    }
    
    await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });

    // Fill login form
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    
    // Click submit button
    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();
    
    // Wait for navigation to complete
    await safeWaitForNavigation(page, 'http://localhost:3000/');
  
    // Wait for the navigation element to be visible
    if (await isPageActive(page)) {
        await page.waitForSelector('nav', { timeout: 15000, state: 'visible' });
        await expect(page.getByRole('navigation')).toContainText('Hondana', { timeout: 10000 });
    }
}
import { expect } from '@playwright/test';

export async function get_password() {
  return process.env.PLAYWRIGHT_ADMIN_PASSWORD;
}

export async function get_username() {
    return process.env.PLAYWRIGHT_ADMIN_USERNAME;
}

export function generateRandomSuffix(): number {
    return crypto.getRandomValues(new Uint32Array(1))[0];
}

export async function signup(page, username: string, password: string) {
    await page.goto('http://localhost:3000/login');
    await page.getByRole('link', { name: 'Don\'t have an account? Sign up' }).click();
  
    await expect(page.getByRole('heading')).toContainText('Sign Up');
  
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.locator('input[name="inviteCode"]').fill('123');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('navigation')).toContainText('Hondana');
}

export async function login(page, username: string, password: string) {
    await page.goto('http://localhost:3000/login');

    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole('button', { name: 'Submit' }).click();
  
    await expect(page.getByRole('navigation')).toContainText('Hondana');
}
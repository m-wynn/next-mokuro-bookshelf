import { firefox, type FullConfig } from '@playwright/test';
import { signup, login, generateRandomSuffix } from './helper';

require('dotenv').config();

const d = new Date();
const time = d.getTime();

async function globalSetup(config: FullConfig) {
    // Create admin user if not exists
    if (process.env.PLAYWRIGHT_ADMIN_USERNAME == undefined && process.env.PLAYWRIGHT_ADMIN_PASSWORD == undefined) {
        const browser = await firefox.launch();
        const page = await browser.newPage();

        const suffix = generateRandomSuffix();
        const username = `test_${time}_${suffix}`;
        const password = `${generateRandomSuffix()}`;
        await signup(page, username, password);

        process.env.PLAYWRIGHT_ADMIN_PASSWORD = password;
        process.env.PLAYWRIGHT_ADMIN_USERNAME = username;
        
        // Save auth state to reuse across tests
        await page.context().storageState({ path: 'e2e/.auth/admin.json' });
        
        await browser.close();
    } else {
        // If admin credentials exist, login and save state
        const browser = await firefox.launch();
        const page = await browser.newPage();
        
        await login(page, process.env.PLAYWRIGHT_ADMIN_USERNAME, process.env.PLAYWRIGHT_ADMIN_PASSWORD);
        
        // Save auth state to reuse across tests
        await page.context().storageState({ path: 'e2e/.auth/admin.json' });
        
        await browser.close();
    }
}

export default globalSetup;
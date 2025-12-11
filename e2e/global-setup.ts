import { firefox, type FullConfig } from '@playwright/test';
import { signup, generateRandomSuffix } from './helper';

require('dotenv').config();

const d = new Date();
const time = d.getTime();

async function globalSetup(config: FullConfig) {
    if (process.env.PLAYWRIGHT_ADMIN_USERNAME == undefined && process.env.PLAYWRIGHT_ADMIN_PASSWORD == undefined) {
        const browser = await firefox.launch();
        const page = await browser.newPage();

        const suffix = generateRandomSuffix();
        const username = `test_${time}_${suffix}`;
        const password = `${generateRandomSuffix()}`;
        await signup(page, username, password);

        process.env.PLAYWRIGHT_ADMIN_PASSWORD = password;
        process.env.PLAYWRIGHT_ADMIN_USERNAME = username;
    }
}

export default globalSetup;
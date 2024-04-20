import { firefox, type FullConfig } from '@playwright/test';
import { signup } from './helper';

require('dotenv').config();

const d = new Date();
const time = d.getTime();

async function globalSetup(config: FullConfig) {
    if (process.env.PLAYWRIGHT_ADMIN_USERNAME == undefined && process.env.PLAYWRIGHT_ADMIN_PASSWORD == undefined) {
        const browser = await firefox.launch();
        const page = await browser.newPage();

        const suffix = crypto.getRandomValues(new Uint32Array(1))[0];
        const username = `test_${time}_${suffix}`;
        const password = `${crypto.getRandomValues(new Uint32Array(1))[0]}`;
        await signup(page, username, password);

        process.env.PLAYWRIGHT_ADMIN_PASSWORD = password;
        process.env.PLAYWRIGHT_ADMIN_USERNAME = username;
    }
}

export default globalSetup;
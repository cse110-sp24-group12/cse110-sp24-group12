import { test, expect, _electron as electron } from '@playwright/test';

test.describe('Playwright Testing', () => {
    let window, electronApp;

    test.beforeAll(async () => {
        electronApp = await electron.launch({ 
            args: ['.'],
            env: {
                ...process.env,
                NODE_ENV: 'development'
            }
        });
        window = await electronApp.firstWindow();
    });

    test.afterAll(async () => {
        await electronApp.close();
    });

    test('First link should be Calendar', async () => {
        const firstLink = await window.$('a');
        const linkText = await firstLink.textContent();
        expect(linkText).toBe('Create Password');
    });

    test('have 2 <a> tag for create password', async () => {
        const links = await window.$$('a');
        expect(links).toHaveLength(2);
    });
});
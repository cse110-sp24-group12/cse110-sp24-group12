import { test, expect, _electron as electron } from '@playwright/test';
import fs from 'fs';
import path from 'path';
const PASSWORD_FILE_PATH = path.join('data', 'password.json');

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

    test('First link should be Create Password', async () => {
        const firstLink = await window.$('a');
        const linkText = await firstLink.textContent();
        expect(linkText).toBe('Create Password');
    });

    test('have 2 <a> tag for create password', async () => {
        const links = await window.$$('a');
        expect(links).toHaveLength(2);
    });
    test('Navigate to Create Password page and check elements', async () => {
        const firstLink = await window.$('a');
        await firstLink.click();

        const passwordField = await window.$('#password');
        const alert = await window.$('#strongPassword');
        const submitButton = await window.$('button');

        expect(passwordField).not.toBeNull();
        expect(alert).not.toBeNull();
        expect(submitButton).not.toBeNull();
    });
    test('Create new password upon first open', async () => {
        const firstLink = await window.$('a');
        await firstLink.click();
        const passwordField = await window.$('#password');
        const submitButton = await window.$('button');
        await passwordField.type('NewStrongPassword1!');
        await submitButton.click();
        // Wait for the file operation to complete
        await window.waitForFile(PASSWORD_FILE_PATH);
        // Verify the password is saved in the JSON file
        const passwords = JSON.parse(fs.readFileSync(PASSWORD_FILE_PATH, 'utf-8'));
        expect(passwords).toHaveProperty('password');
        expect(passwords.password).toBe('NewStrongPassword1!');
    });
    
});
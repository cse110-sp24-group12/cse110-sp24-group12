import { test, expect, _electron as electron } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const PASSWORD_FILE_PATH = path.join('data', 'password.json');

// Function to clear the contents of password.json
const clearPasswordFile = () => {
    fs.writeFileSync(PASSWORD_FILE_PATH, '{}');
};

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
        clearPasswordFile();
        await window.waitForTimeout(500);
        await window.reload();
    });

    test.afterAll(async () => {
        await electronApp.close();
    });

    test('Create Password button should be present on first open', async () => {
        // Check if the "Create Password" button is present
        clearPasswordFile();
        const createPasswordButton = await window.waitForSelector('#createPassword');
        expect(createPasswordButton).not.toBeNull();
    });

    test('First link should be Create Password', async () => {
        clearPasswordFile();
        const firstLink = await window.$('a');
        const linkText = await firstLink.textContent();
        expect(linkText).toBe('Create Password');
    });

    test('have 2 <a> tags for create password', async () => {
        clearPasswordFile();
        const links = await window.$$('a');
        expect(links).toHaveLength(2);
    });

    test('Navigate to Create Password page and check elements', async () => {
        // Clear password file
        clearPasswordFile();
        const firstLink = await window.$('a');
        await firstLink.click();

        // Wait for elements to be ready
        const passwordField = await window.waitForSelector('#password');
        const alert = await window.waitForSelector('#strongPassword');
        const submitButton = await window.waitForSelector('button');

        expect(passwordField).not.toBeNull();
        expect(alert).not.toBeNull();
        expect(submitButton).not.toBeNull();
    });
    test('Check strong and weak password', async () => {
        // Clear password file
        clearPasswordFile();
    
        // Wait for the password field to be ready
        const passwordField = await window.waitForSelector('#password');
    
        // Click on the password field to activate it
        await passwordField.click();
    
        // Introduce a short delay to ensure the DOM updates
        await window.waitForTimeout(500);
    
        // Type a weak password and press Enter
        await passwordField.type('weak');
        await passwordField.press('Enter');

        const alert = await window.waitForSelector('#strongPassword');
        // Check the alert text for the weak password message
        let alertText = await alert.textContent();
        expect(alertText).toContain('Password must be at least 6 characters long.');
    
        // Clear the password field and type a stronger password
        await passwordField.fill('');
        await passwordField.type('Stronger1!');
        await passwordField.press('Enter');
        await window.waitForTimeout(100);
        // Get the title of the page
        const title = await window.title();
        // Expect the title to be "Password Page"
        expect(title).toBe('Password Page');
    });
    test('Enter invalid password', async () => {
        // Assuming the application is already open and the first link has been clicked
        await window.waitForTimeout(2000);
        const passwordField = await window.$('#password');
        const submitButton = await window.$('button');
    
        await passwordField.type('Stronger!');
        await submitButton.click();
    
        await window.waitForTimeout(100);
        const alert = await window.waitForSelector('#invalidPassword');
        // Check the alert text for the weak password message
        let alertText = await alert.textContent();
        expect(alertText).toContain('Invalid password!');
    });
    test('Enter password', async () => {
        // clearPasswordFile();
        // Assuming the application is already open and the first link has been clicked
        const passwordField = await window.$('#password');
        const submitButton = await window.$('button');
        await passwordField.fill('Stronger1!');
        await submitButton.click();
    
        await window.waitForTimeout(100);
        // Get the title of the page
        const title = await window.title();
        // Expect the title to be "Calendar"
        expect(title).toBe('Calendar');
    });
    test('Remember me', async () => {
        // clearPasswordFile();
        // Assuming the application is already open and the first link has been clicked
        await window.evaluate(() => {
            window.api.loadHtmlFile('password.html');
        });
        await window.waitForTimeout(500);
        const rememberMeCheckbox = await window.$('#rememberMe');
        const passwordField = await window.$('#password');
        const submitButton = await window.$('button');
        await passwordField.fill('Stronger1!');
        await rememberMeCheckbox.check();
        await submitButton.click();

        // Get the title of the page
        const title = await window.title();
        // Expect the title to be "Calendar"
        expect(title).toBe('Calendar');

        await window.evaluate(() => {
            window.api.loadHtmlFile('password.html');
        });
        await window.waitForTimeout(500);

        // Get the title of the page
        const title1 = await window.title();
        // Expect the title to be "Calendar"
        expect(title1).toBe('Calendar');
        clearPasswordFile();
    });
});

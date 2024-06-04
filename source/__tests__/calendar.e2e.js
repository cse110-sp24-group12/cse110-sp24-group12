import { test, expect, _electron as electron } from '@playwright/test';
import fs from 'fs';

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
        await window.waitForTimeout(500);
        await window.evaluate(async () => {
            await window.api.loadHtmlFile('calendar.html');
        });
    });

    test.afterAll(async () => {
        await electronApp.close();
    });

    test('Title of the page should be Calendar', async () => {
        await window.waitForTimeout(100);
        const title = await window.evaluate(() => {
            return document.title;
        });
        expect(title).toBe('Calendar');
    });

    test('Add entry to today', async () => {
        const today = new Date();
        const formattedDate = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`;
        
        const dayElement = await window.$(`td.today`);
        await dayElement.click();
        await window.waitForTimeout(50);

        const titleContainer = await window.$(`#entryTitle`);
        await titleContainer.fill('Test Entry');
        const saveButton = await window.$('#saveMarkdown');
        await saveButton.click();

        const entryButtons = await window.$$('.entryButton');
        const containsTestEntry = await Promise.all(entryButtons.map(async (button) => {
            const buttonText = await button.textContent();
            return buttonText === 'Test Entry';
        }));
        expect(containsTestEntry.includes(true)).toBe(true);
    });

    test('Edit entry', async () => {
        const entryButtons = await window.$$('.entryButton');
        const testEntryButton = entryButtons.find(async (button) => {
            const buttonText = await button.textContent();
            return buttonText === 'Test Entry';
        });
        await testEntryButton.click();
        await window.waitForTimeout(50);
        const titleContainer = await window.$(`#entryTitle`);
        await titleContainer.fill('Edited Test Entry');
        const saveButton = await window.$('#saveMarkdown');
        await saveButton.click();
        await window.waitForTimeout(50);
        const entryButtonsAfterEdit = await window.$$('.entryButton');
        const containsTestEntry = await Promise.all(entryButtonsAfterEdit.map(async (button) => {
            const buttonText = await button.textContent();
            return buttonText === 'Edited Test Entry';
        }));
        expect(containsTestEntry.includes(true)).toBe(true);
    });

    test('delete entry', async () => {
        const entryButtons = await window.$$('.entryButton');
        const testEntryButton = entryButtons.find(async (button) => {
            const buttonText = await button.textContent();
            return buttonText === 'Edited Test Entry';
        });
        await testEntryButton.click();
        await window.waitForTimeout(50);
        const deleteButton = await window.$('#deleteEntryButton');
        await deleteButton.click();
        await window.waitForTimeout(50);
        const entryButtonsAfterDelete = await window.$$('.entryButton');
        const containsTestEntry = await Promise.all(entryButtonsAfterDelete.map(async (button) => {
            const buttonText = await button.textContent();
            return buttonText === 'Test Entry';
        }));
        expect(containsTestEntry.includes(true)).toBe(false);
    });

    
});
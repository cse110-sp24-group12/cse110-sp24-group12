import { test, expect, _electron as electron } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ENTRIES_FILE_PATH = path.join('data', 'entries.json');

// Function to clear the contents of password.json
const clearEntriesFile = () => {
    fs.writeFileSync(ENTRIES_FILE_PATH, '[]');
};


test.describe('Playwright Dashboard Page Testing', () => {
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
        await window.evaluate(async () => {
            await window.api.loadHtmlFile('dashboard.html');
        });
        await window.waitForTimeout(500);
    });

    test.afterAll(async () => {
        await electronApp.close();
    });

    test('Add Entries', async () => {
        clearEntriesFile();
        await window.evaluate( async () => {
            await window.api.addMarkdownEntry({
                date: '6-5-2024',
                title: 'Test Entry',
                bookmarked: true,
                markdownContent: 'Hello'
            }),
            await window.api.addMarkdownEntry({
                date: '6-5-2024',
                title: 'Test Entry1',
                bookmarked: false,
                markdownContent: 'Hello'
            }),
            await window.api.addMarkdownEntry({
                date: '6-4-2024',
                title: 'Test Entry2',
                bookmarked: false,
                markdownContent: 'Hello'
            }),
            await window.api.addMarkdownEntry({
                date: '6-3-2024',
                title: 'Test Entry3',
                bookmarked: false,
                markdownContent: 'Hello'
            }),
            await window.api.addMarkdownEntry({
                date: '6-2-2024',
                title: 'Test Entry4',
                bookmarked: false,
                markdownContent: 'Hello'
            }),
            await window.api.addMarkdownEntry({
                date: '6-1-2024',
                title: 'Test Entry5',
                bookmarked: false,
                markdownContent: 'Hello'
            }),
            await window.api.addMarkdownEntry({
                date: '5-31-2024',
                title: 'Test Entry6',
                bookmarked: false,
                markdownContent: 'Hello'
            }),
            await window.api.addMarkdownEntry({
                date: '5-30-2024',
                title: 'Test Entry7',
                bookmarked: false,
                markdownContent: 'Hello'
            }),
            await window.api.addMarkdownEntry({
                date: '5-29-2024',
                title: 'Test Entry8',
                bookmarked: false,
                markdownContent: 'Hello'
            })
        })
        await window.waitForTimeout(100);
    });
    test('Contribution chart functionality', async () => {
        await window.reload();
        await window.waitForTimeout(500);
        const fifthDiv = await window.$('#graph-container div:nth-of-type(5)');
        const fourthDiv = await window.$('#graph-container div:nth-of-type(4)');
        const hasClass = await fifthDiv.evaluate(el => el.classList.contains('more-active'));
        expect (hasClass).toBe(true);
        const hasClass1 = await fourthDiv.evaluate(el => el.classList.contains('active'));
        expect (hasClass1).toBe(true);
    });
    test('Infinity stone', async () => {
        const selector = 'img[src="images/1is.png"]';
        const imgElement = await window.$(selector);
        expect(imgElement).not.toBeNull();
    });
    test('Bookmark', async () => {
        const bookmarkedEntry = await window.$('#bookmarked-entries-container .entry');
        const entryTitle = await bookmarkedEntry.$('.entry-details .entry-title');
        const text = await entryTitle.textContent();
        expect (text).toBe('Test Entry')
    });
});

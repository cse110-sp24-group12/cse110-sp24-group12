import { browser, $, expect } from '@wdio/globals'

describe('Electron Testing', () => {
    it('should have the right title', async () => {
        const title = await browser.getTitle();
        await expect(title).toBe('Dev Journal');
    });
    
    it('First link should be Calendar', async () => {
        const firstLink = await $('a');
        const linkText = await firstLink.getText();
        await expect(linkText).toBe('Calendar');
    })

    it('have 5 <a> tags', async () => {
        const links = await $$('a');
        await expect(links).toBeElementsArrayOfSize(5);
    });

    it('clicking the calendar link and clicking back', async () => {
        const calendarLink = await $('a');
        await calendarLink.click();
        await browser.pause(2000);
        const backLink = await $('a');
        await backLink.click();
        await browser.pause(2000);

        const links = await $$('a');
        await expect(links).toBeElementsArrayOfSize(5);
    });
});


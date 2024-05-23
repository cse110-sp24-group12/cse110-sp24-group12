import path from 'path';
import assert from 'assert';
import { Application } from 'spectron';
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';
import { execPath } from 'process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Electron App Tests', function () {
  this.timeout(10000);

  let app;
  let browser;

  before(async function () {
    app = new Application({
      path: execPath, // Ensure this is the path to the Electron executable
      args: [path.join(__dirname, '..')],
      startTimeout: 10000,
      waitTimeout: 10000
    });
    await app.start();

    const { webContents } = app.browserWindow;
    const debuggerUrl = await webContents.debuggerAddress;
    browser = await puppeteer.connect({ browserWSEndpoint: `ws://${debuggerUrl}` });
  });

  after(async function () {
    if (app && app.isRunning()) {
      await app.stop();
    }
  });

  it('should load the app window', async function () {
    const page = (await browser.pages())[0];
    const title = await page.title();
    assert.strictEqual(title, 'Notes App'); // Change 'Notes App' to your actual app title
  });

  it('should render markdown correctly', async function () {
    const page = (await browser.pages())[0];
    const testMarkdown = '## This is a test';
    
    // Add a markdown entry
    await page.evaluate((markdown) => {
      window.api.addMarkdownEntry({
        date: '2022-01-01',
        title: 'Test Entry',
        markdownContent: markdown,
        bookmarked: false
      });
    }, testMarkdown);

    // Check if the entry was added and rendered correctly
    const renderedHtml = await page.evaluate(() => {
      return document.querySelector('.markdown-rendered-class').innerHTML; // Change the selector to match your rendered markdown element
    });
    assert.ok(renderedHtml.includes('<h2>This is a test</h2>')); // Adjust this check based on your rendered HTML
  });

  // Add more tests as needed...
});

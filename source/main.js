import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'fs';
import { v4 } from 'uuid';

import markdown from 'markdown-it';
import hljs from 'highlight.js';

let win;

/**
 * Create the main window and maximize it.
 * It will by default load the index.html file
 * and uses the preload.js script as the preload script.
 */
const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(path.resolve(), 'scripts/preload.js'),
        },
        resizable: true,
    });

    win.loadFile('index.html');
    win.maximize();
};

/**
 * Create the main window when the app is ready.
 * It will also recreate the window if it is activated on macOS.
 */
app.whenReady().then(() => {
    createWindow();

    // Reactivate on macOS
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Close the app if all windows are closed
// and the platform is not macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

/**
 * renderMarkdownHelper - Render the markdown text into HTML.
 * @function
 * @param {string} markdownText - The markdown text to render into HTML.
 * @returns {string} The HTML rendering of the markdown text.
 *                  It highlights the code blocks as well using highlight.js.
 */
const renderMarkdownHelper = (markdownText) => {
    try {
        const md = markdown({
            highlight: (code, lang) => {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return `<pre><code class="hljs">${
                            hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
                        }</code></pre>`;
                    } catch (error) {
                        console.error(error);
                    }
                }
                return `<pre><code class="hljs">${md.utils.escapeHtml(code)}</code></pre>`;
            },
        });
        return md.render(markdownText);
    } catch (error) {
        console.error(error);
        return '';
    }
};

/**
 * render-markdown - Render the markdown text from a file into HTML.
 * @param {string} arg - The path to the markdown file.
 * @returns {string} The HTML rendering of the markdown file.
 */
ipcMain.handle('read-markdown', async (event, arg) => {
    try {
        const data = fs.readFileSync(arg, 'utf-8');
        return renderMarkdownHelper(data);
    } catch (error) {
        console.error(error);
        return '';
    }
});

/**
 * read-file - Read the content of a file.
 * @param {string} arg - The path to the file to read.
 * @returns {string} The content of the file.
 */
ipcMain.handle('read-file', async (event, arg) => {
    try {
        return fs.readFileSync(arg, 'utf-8');
    } catch (error) {
        console.error(error);
        return '';
    }
});

/**
 * write-file - Write the content to a file.
 * @param {object} arg - The file path and the data to write.
 * @param {string} arg.filePath - The path to the file to write.
 * @param {string} arg.data - The content to write to the file.
 * @returns {void}
 */
ipcMain.handle('write-file', async (event, arg) => {
    try {
        fs.writeFileSync(arg.filePath, arg.data, 'utf-8');
    } catch (error) {
        console.error(error);
    }
});

/**
 * render-markdown - Render the markdown text into HTML.
 * @param {string} arg - The markdown text to render into HTML.
 * @returns {string} The HTML rendering of the markdown text.
 */
ipcMain.handle('render-markdown', async (event, arg) => renderMarkdownHelper(arg));

const readEntriesJSONFile = () => {
    try {
        return JSON.parse(fs.readFileSync('./data/entries.json', 'utf-8'));
    } catch (error) {
        console.error(error);
        return [];
    }
};

const writeEntriesJSONFile = (entries) => {
    try {
        fs.writeFileSync('data/entries.json', JSON.stringify(entries, null, 4), 'utf-8');
    } catch (error) {
        console.error(error);
    }
};

/**
 * get-entries-for-month - Get all the entries for a given month.
 * @param {string} arg - The year and month to get the entries for.
 * @returns {array} The entries for the given month.
 * @example
 * const entries = await window.api.getEntriesForMonth('2022-01');
 */
ipcMain.handle('get-entries-for-month', async (event, arg) => {
    const entries = readEntriesJSONFile();
    return entries.filter((entry) => entry.date.startsWith(arg));
});

/**
 * get-entry-by-id - Get an entry by its id.
 * @param {string} arg - The id of the entry.
 * @returns {object} The entry with the given id.
 * @example
 * const entry = await window.api.getEntryById('1');
 */
ipcMain.handle('get-entry-by-id', async (event, arg) => {
    const entries = readEntriesJSONFile();
    return entries.filter((entry) => entry.id === arg);
});

/**
 * add-markdown-entry - Add a new markdown entry.
 * @param {object} arg - The entry details.
 * @param {string} arg.date - The date of the entry.
 * @param {string} arg.title - The title of the entry.
 * @param {string} arg.markdownContent - The markdown content of the entry.
 * @example
 * await window.api.addMarkdownEntry({
 *    date: '2022-01-01',
 *    title: 'New Entry',
 *    markdownContent: '## This is a new entry.'
 * });
 */
ipcMain.handle('add-markdown-entry', async (event, arg) => {
    const entries = readEntriesJSONFile();

    const newId = v4();
    const newEntry = {
        id: newId,
        date: arg.date,
        fileName: `data/${newId}.md`,
        title: arg.title,
        type: 'markdown',
    };

    entries.push(newEntry);
    fs.writeFileSync(newEntry.fileName, arg.markdownContent, 'utf-8');
    writeEntriesJSONFile(entries);
});

/**
 * update-markdown-entry - Update an existing markdown entry.
 * @param {object} arg - The entry details.
 * @param {string} arg.id - The id of the entry.
 * @param {string} arg.date - The date of the entry.
 * @param {string} arg.title - The title of the entry.
 * @param {string} arg.markdownContent - The markdown content of the entry.
 * @example
 * await window.api.updateMarkdownEntry({
 *   id: '1',
 *   date: '2022-01-01',
 *   title: 'Updated Entry',
 *   markdownContent: '## This is an updated entry.'
 * });
 */
ipcMain.handle('update-markdown-entry', async (event, arg) => {
    const entries = readEntriesJSONFile();
    const entryIndex = entries.findIndex((entry) => entry.id === arg.id);

    if (entryIndex !== -1) {
        const newEntry = {
            id: arg.id,
            date: arg.date,
            fileName: `data/${arg.id}.md`,
            title: arg.title,
            type: 'markdown',
        };
        entries[entryIndex] = newEntry;
        writeEntriesJSONFile(entries);
        fs.writeFileSync(entries[entryIndex].fileName, arg.markdownContent, 'utf-8');
    }
});

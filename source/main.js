import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'fs';
import markdown from 'markdown-it';
import taskLists from 'markdown-it-task-lists';
import hljs from 'highlight.js';
import CryptoJS from 'crypto-js';

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

    win.loadFile('password.html');
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
                        return `<pre><code class="hljs">${hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
                        }</code></pre>`;
                    } catch (error) {
                        console.error(error);
                    }
                }
                return `<pre><code class="hljs">${md.utils.escapeHtml(code)}</code></pre>`;
            },
        });
        md.use(taskLists);
        return md.render(markdownText);
    } catch (error) {
        console.error(error);
        return '';
    }
};

/**
 * load-html-file - Load an HTML file into the main window.
 * @param {string} arg - The path to the HTML file. It should have a .html extension.
 * @returns {void}
 */
ipcMain.handle('load-html-file', async (event, arg) => {
    const regex = /\.html$/i;

    if (regex.test(arg)) {
        win.loadFile(arg);
    } else {
        console.error('Can\'t Load HTML File: The file must have an .html extension.');
    }
});

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
 * write-file - Write the content to a file.
 * @param {object} arg - The file path and the data to write.
 * @param {string} arg.filePath - The path to the file to write.
 * @param {string} arg.data - The content to write to json file.
 * @returns {void}
 */
ipcMain.handle('write-json-file', async (event, arg) => {
    const { filePath, data } = arg;
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing JSON file:', err);
                reject(err);
            } else {
                resolve('JSON file has been saved.');
            }
        });
    });
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

// /**
//  * get-entries-on-date - Get an array of entries by their date.
//  * @param {string} arg - The date of the entry.
//  * @returns {object} The entry with the given date or null if the entry doesn't exist.
//  * @example
//  * const entry = await window.api.getAllEntryByDate('1');
//  */
ipcMain.handle('get-entries-on-date', async (event, arg) => {
    const entries = readEntriesJSONFile();
    const filtered = entries.filter((entry) => entry.date === arg);
    if (filtered.length === 0) {
        return [];
    }
    return filtered;
});

// /**
//  * get-entry-by-id - Get an entry by its id.
//  * @param {string} arg - The id of the entry.
//  * @returns {object} The entry with the given id or null if the entry doesn't exist.
//  * @example
//  * const entry = await window.api.getEntryById('1');
//  */
// ipcMain.handle('get-entry-by-id', async (event, arg) => {
//     const entries = readEntriesJSONFile();
//     const filtered = entries.filter((entry) => entry.id === arg);
//     if (filtered.length > 0) {
//         return filtered[0];
//     }
//     return null;
// });

/**
 * get-entry-by-title-and-date - Get an entry by its title and date.
 * @param {array} arg - An array with the title and date in that order [title, date]
 * @returns {object|null} The entry with the given title and date or null if it doesnt exist
 * @example
 * const entry = await window.api.getEntryByTitleAndDate('1');
 */
ipcMain.handle('get-entry-by-title-and-date', async (event, arg) => {
    const [name, date] = arg;
    const entries = readEntriesJSONFile();
    const filtered = entries.filter((entry) => entry.title === name && entry.date === date);
    if (filtered.length > 0) {
        return filtered[0];
    }
    return null;
});

// Function to delete a file
function deleteFile(filePath) {
    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Delete the file
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${err}`);
            } else {
                console.log(`File deleted successfully: ${filePath}`);
            }
        });
    } else {
        console.log(`File not found: ${filePath}`);
    }
}

/**
 * delete-entry-by-title-and-date - delete an entry by its title and date.
 * @param {array} arg - An array with the title and date in that order [title, date]
 * @returns {object} true if we were able to delete it, false if it failed
 * @example
 * const entry = await window.api.deleteEntryByTitleAndDate(name, date);
 */
ipcMain.handle('delete-entry-by-title-and-date', async (event, arg) => {
    const [name, date] = arg;
    const entries = readEntriesJSONFile();
    const oldID = `${name}.${date}`;
    const arrayWithoutElement = entries.filter(
        (entry) => !(entry.title === name && entry.date === date),
    );
    if (arrayWithoutElement.length < entries.length) {
        writeEntriesJSONFile(arrayWithoutElement);
        deleteFile(`data/${oldID}.md`);
        return true;
    }
    return false;
});

// Function to ensure the directory exists
async function ensureDirectoryExists(dirPath) {
    try {
        await fs.promises.mkdir(dirPath, { recursive: true });
        console.log(`Directory ensured: ${dirPath}`);
    } catch (err) {
        console.error(`Error ensuring directory exists: ${err}`);
    }
}
function deleteDirectoryContents(directoryPath) {
    fs.readdirSync(directoryPath).forEach((file) => {
        const filePath = path.join(directoryPath, file);
        if (fs.lstatSync(filePath).isDirectory()) {
            deleteDirectoryContents(filePath); // Recursively delete subdirectories
            fs.rmdirSync(filePath); // Remove the subdirectory itself
        } else {
            fs.unlinkSync(filePath); // Delete file
        }
    });
}
// Function to write an empty JSON array to a new file
async function createEmptyJsonFile(filePath) {
    const emptyArrayContent = '[]';
    try {
        await fs.promises.writeFile(filePath, emptyArrayContent);
        console.log(`File created and written to successfully: ${filePath}`);
    } catch (err) {
        console.error(`Error writing to file: ${err}`);
    }
}

ipcMain.handle('clear-entries', async () => {
    const dirPath = 'data';
    const filePath = path.join(dirPath, 'entries.json'); // Ensure this points to a file, not a directory
    await ensureDirectoryExists(dirPath);
    await deleteDirectoryContents(dirPath);
    await createEmptyJsonFile(filePath);
});

/**
 * get-entry-by-id - Get an entry by its id.
 * @param {string} arg - The id of the entry.
 * @returns {object} The entry with the given id or null if the entry doesn't exist.
 * @example
 * const entry = await window.api.getEntryById('1');
 */
ipcMain.handle('get-entry-by-id', async (event, arg) => {
    const entries = readEntriesJSONFile();
    const filtered = entries.filter((entry) => entry.id === arg);
    if (filtered.length > 0) {
        return filtered[0];
    }
    return null;
});

/**
 * add-markdown-entry - Add a new markdown entry.
 * @param {object} arg - The entry details.
 * @param {string} arg.date - The date of the entry.
 * @param {string} arg.title - The title of the entry.
 * @param {string} arg.markdownContent - The markdown content of the entry.
 * @param {boolean} arg.bookmarked - The bookmark status of the entry.
 * @example
 * await window.api.addMarkdownEntry({
 *    date: '2022-01-01',
 *    title: 'New Entry',
 *    markdownContent: '## This is a new entry.',
 *    bookmarked: false
 * });
 */
ipcMain.handle('add-markdown-entry', async (event, arg) => {
    const entries = readEntriesJSONFile();
    console.log('We just added an entry!');
    const newId = `${arg.title}.${arg.date}`;// may also use v4() to get random id's
    const newEntry = {
        id: newId,
        date: arg.date,
        fileName: `data/${newId}.md`,
        title: arg.title,
        type: 'markdown',
        bookmarked: arg.bookmarked,
    };

    entries.push(newEntry);
    fs.writeFileSync(newEntry.fileName, arg.markdownContent, 'utf-8');
    writeEntriesJSONFile(entries);
});

ipcMain.handle('get-markdown-entry-by-id', async (event, arg) => fs.readFileSync(`./data/${arg}.md`, 'utf-8'));

/**
 * update-markdown-entry - Update an existing markdown entry.
 * @param {object} arg - The entry details.
 * @param {string} arg.id - The id of the entry.
 * @param {string} arg.date - The date of the entry.
 * @param {string} arg.title - The title of the entry.
 * @param {boolean} arg.bookmarked - The bookmark status of the entry.
 * @param {string} arg.markdownContent - The markdown content of the entry.
 * @example
 * await window.api.updateMarkdownEntry({
 *   id: '1',
 *   date: '2022-01-01',
 *   title: 'Updated Entry',
 *   markdownContent: '## This is an updated entry.',
 *   bookmarked: true
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
            bookmarked: arg.bookmarked,
        };
        entries[entryIndex] = newEntry;
        writeEntriesJSONFile(entries);
        fs.writeFileSync(entries[entryIndex].fileName, arg.markdownContent, 'utf-8');
    }
});

/**
 * encryptData - takes in raw password and encrypts password using CryptoJS
 * @param {string} arg - String for the Unencrypted password
 * @returns {string} encrypted password
 * input: {"password":"123456"}
 * output: {"password":"HGSGDHDSjhedwdjwdwd"}
 */
const encryptData = (data) => {
    const ciphertext = CryptoJS.AES.encrypt(data, '12').toString();
    return ciphertext;
};

/**
 * encrypt-data - calls encryptData function and passes in raw password
 * and returns output from encryptData function
 * @param {string} arg - String for the Unencrypted password
 * @returns {string} encrypted password
 * input: {"password":"123456"}
 */
ipcMain.handle('encrypt-data', async (event, arg) => encryptData(arg));

/**
 * decryptData - takes in encrypted password and decrypts it
 * and returns decrypted result using CryptoJS
 * @param {string} arg - String for the encrypted password
 * @returns {string} decrypted password
 * input: {"password":"HGSGDHDSjhedwdjwdwd"}
 */
const decryptData = (data) => {
    const bytes = CryptoJS.AES.decrypt(data, '12');
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

/**
 * decrypt-data - calls decryptData function and passes in encrypted password
 * and returns output from decryptData function
 * @param {string} arg - String for the encrypted password
 * @returns {string} decrypted password
 * input: {"password":"HGSGDHDSjhedwdjwdwd"}
 */
ipcMain.handle('decrypt-data', async (event, arg) => decryptData(arg));

/**
 * write-password - Writes password and backup pin to the password.json file
 * @param {string} arg - String for the password
 * @param {string} arg - String for backup pin
 * input: {"password":"1234556","pin":"1234",rememberMe:False}
 */
ipcMain.handle('write-password', (event, args) => {
    try {
        fs.writeFileSync('./data/password.json', args, 'utf-8');
    } catch (error) {
        console.error(error);
    }
});

/**
 * Handles the 'read-password' IPC event.
 * Reads the password data from a JSON file and returns it as a string.
 * The JSON string typically contains `password` and `pin` properties.
 * @returns {string} returns.password - The password.
 * @returns {string} returns.pin - The pin.
 * return example: {"password":"1234556","pin":"1234", rememberMe:False}
 */
ipcMain.handle('read-password', async () => {
    try {
        const data = fs.readFileSync('./data/password.json', 'utf8');
        return data;
    } catch (error) {
        console.error(error);
        return '';
    }
});

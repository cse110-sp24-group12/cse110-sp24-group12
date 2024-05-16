import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'fs';

import markdown from 'markdown-it';
import hljs from 'highlight.js';

let win;

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

ipcMain.handle('read-markdown', async (event, arg) => {
    try {
        const data = fs.readFileSync(arg, 'utf-8');
        const md = markdown();
        return md.render(data);
    } catch (error) {
        console.error(error);
        return '';
    }
});

ipcMain.handle('read-file', async (event, arg) => {
    try {
        return fs.readFileSync(arg, 'utf-8');
    } catch (error) {
        console.error(error);
        return '';
    }
});

ipcMain.handle('write-file', async (event, arg) => {
    try {
        fs.writeFileSync(arg.filePath, arg.data, 'utf-8');
    } catch (error) {
        console.error(error);
    }
});

ipcMain.handle('render-markdown', async (event, arg) => {
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
        return md.render(arg);
    } catch (error) {
        console.error(error);
        return '';
    }
});

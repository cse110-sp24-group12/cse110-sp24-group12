const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('fs');

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
}

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

ipcMain.on('write-file', (event, args) => {
    try {
        fs.writeFileSync('test.txt', args, 'utf-8');
    } catch (error) {
        console.error(error);
    }
})

const markdown = require('markdown-it')();
ipcMain.on('read-markdown', (event, args) => {
    try {
        const data = fs.readFileSync(args, 'utf-8');
        //event.reply('read-markdown-reply', data);
        event.sender.send('read-markdown-reply', markdown.render(data));
    } catch (error) {
        console.error(error);
    }
})
/**
 * @namespace Preload
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };
    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }
});

/**
 * This function defines the API that will be exposed to the renderer process.
 * @author Ramtin Tajbakhsh
 * @memberof Preload
 */
contextBridge.exposeInMainWorld(
    'api', {
        writeFile: (args) => ipcRenderer.send('write-file', args),
        readMarkdown: (args) => ipcRenderer.send('read-markdown', args),
        onReadMarkdownReply: (callback) => ipcRenderer.on('read-markdown-reply', (event, args) => callback(args)),
        writePassword: (args) => ipcRenderer.invoke('write-password', args),
    },
    'markdown', {
        
    }
);

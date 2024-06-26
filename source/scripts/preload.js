/**
 * @namespace Preload
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

/**
 * This function listens for the DOMContentLoaded event and replaces the text content of the elements with the versions of the dependencies.
 * This is to demonstrate how to access the process information from the renderer process.
 * @memberof Preload
 */
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
 * @memberof Preload
 */
contextBridge.exposeInMainWorld(
    'api', {
        // Expose the functions that will be used in the renderer process.
        // These functions will be available in the window.api object.
        // The functions will be called using window.api.<function-name>.
        // example: window.api.writeFile({ path: 'path/to/file', data: 'data' });
        // for the details of the parameters, see the main.js file.
        writeFile: (args) => ipcRenderer.invoke('write-file', args),
        readMarkdown: (args) => ipcRenderer.invoke('read-markdown', args),
        readFile: (args) => ipcRenderer.invoke('read-file', args),
        writeJsonFile: (args) => ipcRenderer.invoke('write-json-file', args),
        renderMarkdown: (args) => ipcRenderer.invoke('render-markdown', args),
        getEntryByMonth: (args) => ipcRenderer.invoke('get-entries-for-month', args),
        getEntryById: (args) => ipcRenderer.invoke('get-entry-by-id', args),
        getEntryByTitleAndDate: (args) => ipcRenderer.invoke('get-entry-by-title-and-date', args),
        addMarkdownEntry: (args) => ipcRenderer.invoke('add-markdown-entry', args),
        updateMarkdownEntry: (args) => ipcRenderer.invoke('update-markdown-entry', args),
        getEntriesOnDate: (args) => ipcRenderer.invoke('get-entries-on-date', args),
        deleteEntryByTitleAndDate: (args) => ipcRenderer.invoke('delete-entry-by-title-and-date', args),
        clearEntries: (args) => ipcRenderer.invoke('clear-entries', args),
        getMarkDownEntryById: (args) => ipcRenderer.invoke('get-markdown-entry-by-id', args),
        writePassword: (args) => ipcRenderer.invoke('write-password', args),
        readPassword: (args) => ipcRenderer.invoke('read-password', args),
        loadHtmlFile: (args) => ipcRenderer.invoke('load-html-file', args),
        encryptData: (arg) => ipcRenderer.invoke('encrypt-data', arg),
        decryptData: (arg) => ipcRenderer.invoke('decrypt-data', arg),
    }
);

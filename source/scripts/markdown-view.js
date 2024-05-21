/**
 * Have tab work as expected in the textarea instead of
 * switching focus to the next element.
 */
document.getElementById('markdown-input').addEventListener('keydown', async (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;

        e.target.value = `${e.target.value.substring(0, start)}\t${e.target.value.substring(end)}`;

        e.target.selectionStart = start + 1;
        e.target.selectionEnd = start + 1;
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const entry = await window.api.getEntryById('1');
    const markdownContent = await window.api.readFile(entry.fileName);
    document.getElementById('markdown-input').value = markdownContent;
});

document.querySelector('button').addEventListener('click', async () => {
    const markdownInput = document.getElementById('markdown-input');
    const markdownText = markdownInput.value;
    const entry = await window.api.getEntryById('1');
    await window.api.updateMarkdownEntry({
        id: entry.id,
        date: entry.date,
        title: entry.title,
        bookmarked: entry.bookmarked,
        markdownContent: markdownText,
    });
});

/**
 * Render the markdown text into the markdown-container
 * element every 100ms.
 */
setInterval(async () => {
    const markdownInput = document.getElementById('markdown-input');
    const markdownText = markdownInput.value;
    const rendered = await window.api.renderMarkdown(markdownText);
    document.getElementById('markdown-container').innerHTML = rendered;
}, 100);

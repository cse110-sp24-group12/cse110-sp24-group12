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

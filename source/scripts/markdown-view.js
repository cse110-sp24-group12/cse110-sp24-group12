window.api.readMarkdown('assets/markdown/markdown-test.md');
window.api.onReadMarkdownReply((data) => {
    console.log(data);
    document.getElementById('markdown-container').innerHTML = data;
});
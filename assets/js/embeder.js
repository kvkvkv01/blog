document.addEventListener('DOMContentLoaded', (event) => {
    // Search for paragraphs that contain YouTube video IDs
    const paragraphs = document.querySelectorAll('p');

    paragraphs.forEach((paragraph) => {
        // Check if the paragraph text contains a YouTube link
        const ytLinkRegex = /https:\/\/www\.youtube\.com\/watch\?v=([^&]+)/;
        if (ytLinkRegex.test(paragraph.textContent)) {
            // Extract the video ID from the paragraph text
            const videoId = paragraph.textContent.match(ytLinkRegex)[1];

            // Create the embed code for the video
            const iframe = document.createElement('iframe');
            iframe.width = '560';
            iframe.height = '315';
            iframe.src = `https://www.youtube.com/embed/${videoId}?si=M6HWB0Zz1oEHolEh`;
            iframe.title = 'YouTube video player';
            iframe.frameborder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.referrerpolicy = 'strict-origin-when-cross-origin';
            iframe.allowfullscreen = true;

            // Replace the text node with the iframe within the paragraph
            const textNode = paragraph.childNodes[0];
            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                paragraph.replaceChild(iframe, textNode);
                // If there are other child nodes, replace them as well
                while (paragraph.firstChild) {
                    paragraph.removeChild(paragraph.firstChild);
                }
            }
        }
    });
});

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', (event) => {
    // Select all anchor tags that contain YouTube video IDs in their href attribute
    const youtubeLinks = document.querySelectorAll('a[href^="https://www.youtube.com/watch?v="]');

    youtubeLinks.forEach((link) => {
        // Extract the video ID from the href attribute
        const videoId = link.href.match(/v=([^&]+)/)[1];

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

        // Replace the link with the iframe
        link.parentNode.replaceChild(iframe, link);
    });
});

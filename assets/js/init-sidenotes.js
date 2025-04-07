// Initialize sidenotes.js
document.addEventListener('DOMContentLoaded', function() {
  // Create a markdownBody element if it doesn't exist
  let markdownBody = document.querySelector('#markdownBody');
  if (!markdownBody) {
    markdownBody = document.createElement('div');
    markdownBody.id = 'markdownBody';
    document.querySelector('.post-content').appendChild(markdownBody);
  }

  // Move the content into the markdownBody
  const content = document.querySelector('.post-content');
  const contentChildren = Array.from(content.childNodes);
  contentChildren.forEach(child => {
    if (child !== markdownBody) {
      markdownBody.appendChild(child);
    }
  });

  // Create a footnotes section if it doesn't exist
  let footnotesSection = document.querySelector('.footnotes');
  if (!footnotesSection) {
    footnotesSection = document.createElement('div');
    footnotesSection.className = 'footnotes';
    markdownBody.appendChild(footnotesSection);
  }

  // Initialize sidenotes
  if (typeof Sidenotes !== 'undefined') {
    // Override the default configuration if needed
    Sidenotes.minimumViewportWidthForSidenotes = "1200px";
    Sidenotes.minimumViewportWidthForSidenoteMarginNotes = "1000px";
    
    // Initialize sidenotes
    Sidenotes.setup();
  }
}); 
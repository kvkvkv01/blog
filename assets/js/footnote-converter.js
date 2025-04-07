// Convert regular footnotes to sidenotes-compatible format
document.addEventListener('DOMContentLoaded', function() {
  // Find all footnote references in the content
  const footnoteRefs = document.querySelectorAll('a[href^="#fn"]');
  
  if (footnoteRefs.length === 0) {
    return; // No footnotes to convert
  }
  
  // Find the footnotes section
  let footnotesSection = document.querySelector('.footnotes');
  if (!footnotesSection) {
    footnotesSection = document.createElement('div');
    footnotesSection.className = 'footnotes';
    document.querySelector('#markdownBody').appendChild(footnotesSection);
  }
  
  // Process each footnote reference
  footnoteRefs.forEach((ref, index) => {
    // Extract the footnote number
    const footnoteNumber = ref.getAttribute('href').replace('#fn', '');
    
    // Update the reference to use the sidenotes format
    ref.classList.add('footnote-ref');
    ref.id = `fnref${footnoteNumber}`;
    ref.setAttribute('role', 'doc-noteref');
    
    // Find the corresponding footnote content
    const footnoteContent = document.querySelector(`#fn${footnoteNumber}`);
    if (footnoteContent) {
      // Create a sidenote element
      const sidenote = document.createElement('li');
      sidenote.className = 'sidenote';
      sidenote.id = `sn${footnoteNumber}`;
      sidenote.setAttribute('role', 'doc-endnote');
      
      // Create the outer wrapper
      const outerWrapper = document.createElement('div');
      outerWrapper.className = 'sidenote-outer-wrapper';
      sidenote.appendChild(outerWrapper);
      
      // Create the inner wrapper
      const innerWrapper = document.createElement('div');
      innerWrapper.className = 'sidenote-inner-wrapper';
      outerWrapper.appendChild(innerWrapper);
      
      // Create the self-link
      const selfLink = document.createElement('a');
      selfLink.className = 'sidenote-self-link';
      selfLink.href = `#sn${footnoteNumber}`;
      selfLink.textContent = footnoteNumber;
      sidenote.appendChild(selfLink);
      
      // Clone the footnote content
      const content = footnoteContent.cloneNode(true);
      
      // Remove the footnote backlink
      const backlink = content.querySelector('.footnote-backref');
      if (backlink) {
        backlink.remove();
      }
      
      // Add the content to the inner wrapper
      innerWrapper.appendChild(content);
      
      // Add the sidenote to the footnotes section
      footnotesSection.appendChild(sidenote);
      
      // Hide the original footnote
      footnoteContent.style.display = 'none';
    }
  });
}); 
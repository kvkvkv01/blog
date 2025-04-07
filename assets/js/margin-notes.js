// Add margin notes support
document.addEventListener('DOMContentLoaded', function() {
  // Find all margin notes in the content
  const marginNotes = document.querySelectorAll('.marginnote');
  
  if (marginNotes.length === 0) {
    return; // No margin notes to process
  }
  
  // Process each margin note
  marginNotes.forEach((note, index) => {
    // Add a unique ID if it doesn't have one
    if (!note.id) {
      note.id = `margin-note-${index}`;
    }
    
    // Check if the viewport is wide enough for sidenotes
    const isWideViewport = window.matchMedia('(min-width: 1000px)').matches;
    
    if (isWideViewport) {
      // Add the sidenote class
      note.classList.add('sidenote');
      
      // Create the outer wrapper
      const outerWrapper = document.createElement('div');
      outerWrapper.className = 'sidenote-outer-wrapper';
      
      // Create the inner wrapper
      const innerWrapper = document.createElement('div');
      innerWrapper.className = 'sidenote-inner-wrapper';
      
      // Move the content to the inner wrapper
      while (note.firstChild) {
        innerWrapper.appendChild(note.firstChild);
      }
      
      // Assemble the structure
      outerWrapper.appendChild(innerWrapper);
      note.appendChild(outerWrapper);
      
      // Add the note to the appropriate sidenote column
      const sidenoteColumn = document.querySelector('#sidenote-column-right');
      if (sidenoteColumn) {
        sidenoteColumn.appendChild(note);
      }
    } else {
      // For narrow viewports, just style it as an inline note
      note.classList.add('inline');
      note.style.fontStyle = 'italic';
      note.style.color = 'var(--text-muted, #666)';
    }
  });
}); 
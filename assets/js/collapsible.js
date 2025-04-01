function parseMarkdown(text) {
    // Headers
    text = text.replace(/### (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(/## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/# (.*$)/gm, '<h1>$1</h1>');
    
    // Paragraphs
    text = text.split('\n\n').map(para => {
      if (!para.startsWith('<h') && !para.startsWith('<ul') && !para.startsWith('<ol')) {
        return `<p>${para.trim()}</p>`;
      }
      return para;
    }).join('\n');
    
    // Lists
    text = text.replace(/^\s*\*\s(.+)/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    text = text.replace(/^\s*\d+\.\s(.+)/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>\n?)+/g, '<ol>$&</ol>');
    
    // Bold and Italic
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Links
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    return text;
  }
  
  // Initialize collapsibles when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    const collapsibles = document.querySelectorAll('.collapsible');
    
    collapsibles.forEach(collapsible => {
      // Parse markdown in preview and content
      const preview = collapsible.querySelector('.collapse-preview');
      const contentText = collapsible.querySelector('.collapse-text');
      
      if (preview) {
        preview.innerHTML = parseMarkdown(preview.textContent.trim());
      }
      if (contentText) {
        contentText.innerHTML = parseMarkdown(contentText.textContent.trim());
      }
  
      const content = collapsible.querySelector('.collapse-content');
      const triggers = collapsible.querySelectorAll('.collapse-trigger');
      
      // Function to toggle content visibility with animation
      const toggleContent = (event) => {
        event.preventDefault();
        const isExpanded = window.getComputedStyle(content).display !== 'none';
        
        // Update all icons in this collapsible
        collapsible.querySelectorAll('.collapse-icon').forEach(icon => {
          icon.textContent = isExpanded ? '▶' : '▼';
        });
  
        if (isExpanded) {
          // Collapse
          content.style.height = content.scrollHeight + 'px';
          requestAnimationFrame(() => {
            content.style.height = '0';
            content.style.overflow = 'hidden';
            content.style.display = 'block';
            
            setTimeout(() => {
              content.style.display = 'none';
              content.style.height = '';
              content.style.overflow = '';
            }, 300);
          });
        } else {
          // Expand
          content.style.display = 'block';
          content.style.overflow = 'hidden';
          content.style.height = '0';
          
          requestAnimationFrame(() => {
            content.style.height = content.scrollHeight + 'px';
            
            setTimeout(() => {
              content.style.height = '';
              content.style.overflow = '';
            }, 300);
          });
        }
      };
  
      // Add click handlers to all triggers in this collapsible
      triggers.forEach(trigger => {
        trigger.addEventListener('click', toggleContent);
      });
  
      // Set initial state
      content.style.display = 'none';
    });
  });
  
  // Add CSS styles
  const style = document.createElement('style');
  style.textContent = `
    .collapsible {
      border: 1px solid #ddd;
      margin: 1rem 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    
    .collapse-preview {
      padding: 1rem;
      background: #f8f9fa;
    }
    
    .collapse-trigger {
      display: block;
      width: 100%;
      padding: 0.5rem 1rem;
      background: none;
      border: none;
      border-top: 1px solid #ddd;
      text-align: left;
      cursor: pointer;
      color: #666;
      font-size: 0.9rem;
      transition: background-color 0.2s ease;
    }
    
    .collapse-trigger:hover {
      background: #f0f0f0;
    }
    
    .collapse-icon {
      display: inline-block;
      margin-right: 0.5rem;
    }
    
    .collapse-content {
      transition: height 0.3s ease-out;
      background: #fff;
    }
    
    .collapse-text {
      padding: 1rem;
      line-height: 1.5;
    }
    
    /* Markdown content styles */
    .collapse-text h1,
    .collapse-text h2,
    .collapse-text h3,
    .collapse-preview h1,
    .collapse-preview h2,
    .collapse-preview h3 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
      line-height: 1.25;
    }
    
    .collapse-text h1,
    .collapse-preview h1 {
      font-size: 2em;
    }
    
    .collapse-text h2,
    .collapse-preview h2 {
      font-size: 1.5em;
    }
    
    .collapse-text h3,
    .collapse-preview h3 {
      font-size: 1.25em;
    }
    
    .collapse-text p,
    .collapse-preview p {
      margin: 1em 0;
    }
    
    .collapse-text ul,
    .collapse-text ol,
    .collapse-preview ul,
    .collapse-preview ol {
      margin: 1em 0;
      padding-left: 2em;
    }
    
    .collapse-text li,
    .collapse-preview li {
      margin: 0.5em 0;
    }
    
    .collapse-text a,
    .collapse-preview a {
      color: #0366d6;
      text-decoration: none;
    }
    
    .collapse-text a:hover,
    .collapse-preview a:hover {
      text-decoration: underline;
    }
    
    .collapse-text strong,
    .collapse-preview strong {
      font-weight: 600;
    }
    
    .collapse-text em,
    .collapse-preview em {
      font-style: italic;
    }
  `;
  
  document.head.appendChild(style);
// Enhanced Popup System
(() => {
    // Prevent multiple initializations
    if (window.enhancedPopupsInitialized) return;
    window.enhancedPopupsInitialized = true;

    const styles = document.createElement('style');
    styles.textContent = `
         .popup-preview {
            position: fixed;
            background: white;
            border: 1px solid #ddd;
            box-shadow: 0 2px 15px rgba(0,0,0,0.1);
            width: var(--popup-width, 400px);
            height: var(--popup-height, 500px);
            min-width: 200px;
            min-height: 100px;
            overflow: hidden;
            resize: both;
            z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        }

        .popup-preview.fullscreen {
            width: 100% !important;
            height: 100% !important;
            top: 0 !important;
            left: 0 !important;
            resize: none;
        }

        .popup-preview.minimized {
            position: fixed;
            height: 35px !important;
            overflow: hidden;
            width: 200px !important;
            resize: none;
            min-height: 0px;
        }

        .popup-header {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            background: #f8f9fa;
            border-bottom: 1px solid #ddd;
            cursor: move;
            user-select: none;
        }

        .popup-title {
            flex-grow: 1;
            font-size: 14px;
            font-weight: 500;
            margin-right: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #333;
        }

        .popup-actions {
            display: flex;
            gap: 8px;
        }

        .popup-action {
            padding: 2px;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            color: #666;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
        }

        .popup-action:hover {
            background: #eee;
            color: #333;
        }

        .popup-preview::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 15px;
            height: 15px;
            cursor: se-resize;
            background: linear-gradient(135deg, transparent 50%, #ccc 50%);
            display: none;
        }

        .popup-preview:not(.minimized):not(.fullscreen)::after {
            display: block;
        }

        .popup-content {
            padding: 16px;
            overflow-y: auto;
            height: calc(100% - 45px);
            font-size: 14px;
            line-height: 1.5;
            text-align: justify;
        }

        .popup-content img {
            max-width: 100%;
            height: auto;
        }

        .popup-content h1, 
        .popup-content h2, 
        .popup-content h3, 
        .popup-content h4 {
            margin-top: 24px;
            margin-bottom: 16px;
            line-height: 1.25;
        }

        .popup-content h1 { font-size: 1.5em; }
        .popup-content h2 { font-size: 1.3em; }
        .popup-content h3 { font-size: 1.1em; }
        .popup-content p { margin: 0 0 16px 0; }

        .popup-preview .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #666;
        }

        .thumb {
        display: grid;
        justify-items: center;
        }

        figure {
                place-items: center;
    text-align: center;
        display: table-cell;

        }
    `;
    document.head.appendChild(styles);

    class PopupManager {
        constructor() {
            this.popups = new Set();
            this.contentCache = new Map();
            this.hoverDelay = 300;
            this.hoverTimeout = null;
            this.dragData = null;
            this.nextZIndex = 1000;
            this.wikipediaCache = new Map();

            // Bind methods
            this.handleMouseOver = this.handleMouseOver.bind(this);
            this.handleMouseOut = this.handleMouseOut.bind(this);
            this.handleDragStart = this.handleDragStart.bind(this);
            this.handleDrag = this.handleDrag.bind(this);
            this.handleDragEnd = this.handleDragEnd.bind(this);
            this.bringToFront = this.bringToFront.bind(this);
        }

        bringToFront(popup) {
            this.nextZIndex += 1;
            popup.style.zIndex = this.nextZIndex;
        }

        async fetchContent(url) {
            // Handle Wikipedia URLs differently
            if (url.includes('wikipedia.org/wiki/')) {
                return this.fetchWikipediaContent(url);
            }

            if (this.contentCache.has(url)) {
                return this.contentCache.get(url);
            }

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const text = await response.text();
                
                let content;
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                if (url.includes('/wiki/') || url.includes('/journal/') || url.includes('/pages/')) {
                    const postContent = doc.querySelector('.content.post-content');
                    if (postContent) {
                        content = `<div class="content post-content">${postContent.innerHTML}</div>`;
                    } else {
                        content = 'Error Loading. Try clicking on the link!';
                    }
                } else if (url.endsWith('.pdf')) {
                    content = `<embed src="${url}" type="application/pdf" style="width:100%;height:100%;">`;
                } else {
                    const mainContent = doc.querySelector('main, article, .content');
                    if (mainContent) {
                        content = mainContent.innerHTML;
                    } else {
                        content = `<iframe src="${url}" style="width:100%;height:500px;border:none;"></iframe>`;
                    }
                }

                this.contentCache.set(url, content);

                setTimeout(() => {
                    if (window.MathJax) {
                        MathJax.typeset();
                    }
                }, 0);

                return content;
            } catch (error) {
                console.error('Error fetching content:', error);
                return 'Failed to load content. Try clicking the link!';
            }
        }

        async fetchWikipediaContent(url) {
            if (this.wikipediaCache.has(url)) {
                return this.wikipediaCache.get(url);
            }

            try {
                const wikipage = url.match(/wikipedia\.org\/wiki\/([^#]+)/)[1].replace(/\//g, '%2F');
                const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/html/${wikipage}`;
                const response = await fetch(apiUrl);
                
                if (!response.ok) {
                    throw new Error(`Wikipedia API error: ${response.status}`);
                }

                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Remove unwanted elements
                doc.querySelectorAll('.hatnote').forEach(el => el.remove());
                doc.querySelectorAll('.mw-empty-elt').forEach(el => el.remove());
                doc.querySelectorAll('.sidebar').forEach(el => el.remove());
                doc.querySelectorAll('[class^="box"]').forEach(el => el.remove());
                doc.querySelectorAll('[class^="infobox"]').forEach(el => el.remove());
                
                // Remove reference numbers/footnotes
                doc.querySelectorAll('sup.reference').forEach(el => el.remove());
                
                // Process internal wiki links
                doc.querySelectorAll('a[rel="mw:WikiLink"]').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('./')) {
                        // Convert relative Wikipedia links to absolute URLs
                        const pageName = href.substring(2); // Remove './'
                        link.href = `https://en.wikipedia.org/wiki/${pageName}`;
                        link.setAttribute('data-preview-initialized', 'true');
                        link.classList.add('wiki-link');
                    }
                });

                const content = doc.body.innerHTML;
                this.wikipediaCache.set(url, content);
                return content;
            } catch (error) {
                console.error('Error fetching Wikipedia content:', error);
                return 'Failed to load Wikipedia preview';
            }
        }

        createPopup(link) {
            let initialWidth = 400;
            let initialHeight = 500;
            if (link.href.endsWith('.pdf')) {
                initialWidth = 500;
                initialHeight = 500;
            }

            const popup = document.createElement('div');
            popup.className = 'popup-preview';
            popup.style.setProperty('--popup-width', initialWidth + 'px');
            popup.style.setProperty('--popup-height', initialHeight + 'px');

            popup.innerHTML = `
                <div class="popup-header">
                    <div class="popup-title">${link.textContent}</div>
                    <div class="popup-actions">
                        <button class="popup-action minimize" title="Minimize">▽</button>
                        <button class="popup-action fullscreen" title="Fullscreen">⊡</button>
                        <button class="popup-action pin" title="Pin">🞚</button>
                        <button class="popup-action close" title="Close">×</button>
                    </div>
                </div>
                <div class="popup-content">
                    <div class="loading">Loading...</div>
                </div>
            `;

            const rect = link.getBoundingClientRect();
            this.positionPopup(popup, rect);

            popup.querySelector('.popup-header').addEventListener('mousedown', (e) => {
                if (!e.target.closest('.popup-action')) {
                    this.handleDragStart(e, popup);
                }
            });

            popup.querySelector('.minimize').addEventListener('click', () => this.toggleMinimize(popup));
            popup.querySelector('.fullscreen').addEventListener('click', () => this.toggleFullscreen(popup));
            popup.querySelector('.pin').addEventListener('click', () => this.togglePin(popup));
            popup.querySelector('.close').addEventListener('click', () => this.closePopup(popup));

            popup.addEventListener('click', () => this.bringToFront(popup));

            popup.addEventListener('mouseenter', () => {
                if (popup.hasAttribute('data-pending-close')) {
                    clearTimeout(Number(popup.getAttribute('data-pending-close')));
                }
                this.bringToFront(popup);
            });

            popup.addEventListener('mouseleave', () => {
                if (!popup.hasAttribute('data-pinned') && !popup.classList.contains('minimized')) {
                    const timeout = setTimeout(() => this.closePopup(popup), 300);
                    popup.setAttribute('data-pending-close', timeout);
                }
            });

            document.body.appendChild(popup);
            this.popups.add(popup);
            this.bringToFront(popup);

            return popup;
        }

        positionPopup(popup, triggerRect) {
            const spacing = 10;
            let left = triggerRect.right + spacing;
            let top = triggerRect.top;

            if (left + 400 > window.innerWidth) {
                left = triggerRect.left - 400 - spacing;
                if (left < 0) {
                    left = (window.innerWidth - 400) / 2;
                }
            }

            if (top + 500 > window.innerHeight) {
                top = window.innerHeight - 500 - spacing;
            }

            popup.style.left = `${Math.max(spacing, left)}px`;
            popup.style.top = `${Math.max(spacing, top)}px`;
        }

        handleMouseOver(event) {
            const link = event.target.closest('a');
            if (!link) return;

            // Convert relative Wikipedia links if necessary
            if (link.getAttribute('rel') === 'mw:WikiLink') {
                const href = link.getAttribute('href');
                if (href && href.startsWith('./')) {
                    const pageName = href.substring(2);
                    link.href = `https://en.wikipedia.org/wiki/${pageName}`;
                }
            }

            // Check if popup already exists for this URL
            const existingPopup = Array.from(this.popups).find(popup => 
                popup.getAttribute('data-url') === link.href
            );

            if (existingPopup) {
                this.bringToFront(existingPopup);
                if (existingPopup.hasAttribute('data-pending-close')) {
                    clearTimeout(Number(existingPopup.getAttribute('data-pending-close')));
                }
                return;
            }

            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = setTimeout(async () => {
                const popup = this.createPopup(link);
                popup.setAttribute('data-url', link.href);
                const content = await this.fetchContent(link.href);
                const contentDiv = popup.querySelector('.popup-content');
                contentDiv.innerHTML = content;
                this.setupPreviewTriggers(contentDiv);
            }, this.hoverDelay);
        }

        handleMouseOut(event) {
            clearTimeout(this.hoverTimeout);
        }

        handleDragStart(event, popup) {
            if (event.target.closest('.popup-action')) return;
            
            this.dragData = {
                popup,
                startX: event.clientX,
                startY: event.clientY,
                startLeft: popup.offsetLeft,
                startTop: popup.offsetTop
            };

            this.bringToFront(popup);
        }

        handleDrag(event) {
            if (!this.dragData) return;
            
            const deltaX = event.clientX - this.dragData.startX;
            const deltaY = event.clientY - this.dragData.startY;
            
            const popup = this.dragData.popup;
            popup.style.left = `${this.dragData.startLeft + deltaX}px`;
            popup.style.top = `${this.dragData.startTop + deltaY}px`;
        }

        handleDragEnd() {
            this.dragData = null;
        }

        toggleMinimize(popup) {
            const minimizeBtn = popup.querySelector('.minimize');
            if (popup.classList.contains('minimized')) {
                popup.classList.remove('minimized');
                minimizeBtn.textContent = '▽';
                minimizeBtn.title = 'Minimize';
                popup.setAttribute('data-pinned', 'true');
                const pinBtn = popup.querySelector('.pin');
                pinBtn.textContent = '🞜';
                pinBtn.title = 'Unpin';
            } else {
                popup.classList.add('minimized');
                minimizeBtn.textContent = '△';
                minimizeBtn.title = 'Restore';
            }
            this.bringToFront(popup);
        }

        toggleFullscreen(popup) {
            const fullscreenBtn = popup.querySelector('.fullscreen');
            if (popup.classList.contains('fullscreen')) {
                popup.classList.remove('fullscreen');
                fullscreenBtn.textContent = '⊡';
                fullscreenBtn.title = 'Fullscreen';
            } else {
                popup.classList.add('fullscreen');
                fullscreenBtn.textContent = '⊠';
                fullscreenBtn.title = 'Exit Fullscreen';
            }
            if (popup.classList.contains('minimized')) {
                popup.classList.remove('minimized');
            }
            this.bringToFront(popup);
        }

        togglePin(popup) {
            const pinBtn = popup.querySelector('.pin');
            if (popup.hasAttribute('data-pinned')) {
                popup.removeAttribute('data-pinned');
                pinBtn.textContent = '🞚';
                pinBtn.title = 'Pin';
            } else {
                popup.setAttribute('data-pinned', 'true');
                pinBtn.textContent = '🞜';
                pinBtn.title = 'Unpin';
            }
            this.bringToFront(popup);
        }

        closePopup(popup) {
            this.popups.delete(popup);
            popup.remove();
        }

        setupPreviewTriggers(container) {
            // Direct binding to all links, simpler approach
            const links = container.querySelectorAll('a[rel="mw:WikiLink"], a.wiki-link, a.web-link');
            
            links.forEach(link => {
                // Remove old listeners first to prevent duplicates
                link.removeEventListener('mouseover', this.handleMouseOver);
                link.removeEventListener('mouseout', this.handleMouseOut);
                
                // Add new listeners
                link.addEventListener('mouseover', this.handleMouseOver);
                link.addEventListener('mouseout', this.handleMouseOut);
                
                link.classList.add('wiki-link');
                
                // Ensure absolute URL
                if (link.getAttribute('rel') === 'mw:WikiLink' && link.href.startsWith('./')) {
                    const pageName = link.href.substring(2);
                    link.href = `https://en.wikipedia.org/wiki/${pageName}`;
                }
            });

            // Also process any links in nested content containers
            const nestedContainers = container.querySelectorAll('.popup-content');
            nestedContainers.forEach(nestedContainer => {
                this.setupPreviewTriggers(nestedContainer);
            });
        }

        init() {
            // Initial setup of all links
            this.setupPreviewTriggers(document.body);

            // Set up a mutation observer to handle dynamically added content
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // ELEMENT_NODE
                                this.setupPreviewTriggers(node);
                            }
                        });
                    }
                });
            });

            // Start observing
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Set up drag handlers
            document.addEventListener('mousemove', this.handleDrag);
            document.addEventListener('mouseup', this.handleDragEnd);
        }
    }

    const popupManager = new PopupManager();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => popupManager.init());
    } else {
        popupManager.init();
    }
})();
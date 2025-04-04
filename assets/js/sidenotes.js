/**
 * Sidenotes.js - A library for transforming footnotes into sidenotes
 * 
 * This library transforms footnotes into sidenotes that appear in the margins
 * of a document when the viewport is wide enough. It handles positioning,
 * collision detection, and responsive behavior.
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        sidenoteSpacing: 20, // Vertical spacing between sidenotes
        sidenotePadding: 10, // Padding for sidenote containers
        sidenoteWidth: '30%', // Width of sidenote columns
        minViewportWidth: 760, // Minimum viewport width for sidenotes
        selectors: {
            sidenote: '.sidenote',
            footnoteRef: '.footnote-ref',
            footnoteBack: '.footnote-back',
            sidenoteColumn: '.sidenote-column',
            potentiallyOverlapping: 'h1, h2, h3, h4, h5, h6, p, blockquote, pre, table, .sidenote'
        }
    };

    // Main Sidenotes class
    class Sidenotes {
        constructor() {
            this.sidenotes = [];
            this.footnoteRefs = [];
            this.sidenoteColumns = {
                left: null,
                right: null
            };
            this.mediaQuery = window.matchMedia(`(min-width: ${config.minViewportWidth}px)`);
            this.isEnabled = this.mediaQuery.matches;
            
            this.init();
        }

        init() {
            this.setupSidenoteColumns();
            this.collectSidenotes();
            this.setupEventListeners();
            this.handleMediaQuery(this.mediaQuery);
        }

        setupSidenoteColumns() {
            // Create left and right sidenote columns
            const leftColumn = document.createElement('div');
            leftColumn.id = 'sidenote-column-left';
            leftColumn.className = 'sidenote-column';
            
            const rightColumn = document.createElement('div');
            rightColumn.id = 'sidenote-column-right';
            rightColumn.className = 'sidenote-column';
            
            document.body.appendChild(leftColumn);
            document.body.appendChild(rightColumn);
            
            this.sidenoteColumns.left = leftColumn;
            this.sidenoteColumns.right = rightColumn;
        }

        collectSidenotes() {
            // Collect all sidenotes and footnote references
            this.sidenotes = Array.from(document.querySelectorAll(config.selectors.sidenote));
            this.footnoteRefs = Array.from(document.querySelectorAll(config.selectors.footnoteRef));
            
            // Add event listeners to footnote references
            this.footnoteRefs.forEach(ref => {
                ref.addEventListener('click', (e) => this.handleFootnoteClick(e, ref));
                ref.addEventListener('mouseenter', () => this.highlightSidenote(ref));
                ref.addEventListener('mouseleave', () => this.unhighlightSidenote(ref));
            });
        }

        setupEventListeners() {
            // Handle media query changes
            this.mediaQuery.addListener((mq) => this.handleMediaQuery(mq));
            
            // Handle window resize
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => this.updateLayout(), 100);
            });
            
            // Handle scroll
            window.addEventListener('scroll', () => this.updateLayout());
        }

        handleMediaQuery(mq) {
            this.isEnabled = mq.matches;
            this.updateLayout();
        }

        updateLayout() {
            if (!this.isEnabled) {
                this.resetLayout();
                return;
            }
            
            this.positionSidenotes();
        }

        resetLayout() {
            // Reset all sidenotes to their original positions
            this.sidenotes.forEach(sidenote => {
                sidenote.style.position = 'relative';
                sidenote.style.float = 'none';
                sidenote.style.clear = 'both';
                sidenote.style.width = '100%';
                sidenote.style.margin = '1rem 0';
            });
        }

        positionSidenotes() {
            // Clear sidenote columns
            this.sidenoteColumns.left.innerHTML = '';
            this.sidenoteColumns.right.innerHTML = '';
            
            // Position each sidenote
            this.sidenotes.forEach((sidenote, index) => {
                const ref = this.footnoteRefs[index];
                if (!ref) return;
                
                const refRect = ref.getBoundingClientRect();
                const column = this.determineColumn(sidenote, refRect);
                
                this.positionSidenote(sidenote, refRect, column);
            });
        }

        determineColumn(sidenote, refRect) {
            // Determine which column to place the sidenote in
            const viewportWidth = window.innerWidth;
            const viewportCenter = viewportWidth / 2;
            
            return refRect.left < viewportCenter ? this.sidenoteColumns.right : this.sidenoteColumns.left;
        }

        positionSidenote(sidenote, refRect, column) {
            // Position the sidenote in the appropriate column
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const topPosition = refRect.top + scrollTop - config.sidenotePadding;
            
            sidenote.style.position = 'absolute';
            sidenote.style.top = `${topPosition}px`;
            sidenote.style.width = config.sidenoteWidth;
            
            // Add to column
            column.appendChild(sidenote);
            
            // Check for collisions
            this.checkCollisions(sidenote, column);
        }

        checkCollisions(sidenote, column) {
            const sidenoteRect = sidenote.getBoundingClientRect();
            const otherSidenotes = Array.from(column.children).filter(s => s !== sidenote);
            
            let hasCollision = false;
            let displacement = 0;
            
            otherSidenotes.forEach(other => {
                const otherRect = other.getBoundingClientRect();
                
                if (this.isColliding(sidenoteRect, otherRect)) {
                    hasCollision = true;
                    displacement = Math.max(displacement, otherRect.bottom - sidenoteRect.top + config.sidenoteSpacing);
                }
            });
            
            if (hasCollision) {
                sidenote.style.transform = `translateY(${displacement}px)`;
                sidenote.classList.add('displaced');
            }
        }

        isColliding(rect1, rect2) {
            return !(rect1.bottom < rect2.top || 
                    rect1.top > rect2.bottom || 
                    rect1.right < rect2.left || 
                    rect1.left > rect2.right);
        }

        handleFootnoteClick(e, ref) {
            e.preventDefault();
            const sidenote = this.sidenotes[this.footnoteRefs.indexOf(ref)];
            if (sidenote) {
                sidenote.scrollIntoView({ behavior: 'smooth', block: 'center' });
                this.highlightSidenote(ref);
                setTimeout(() => this.unhighlightSidenote(ref), 2000);
            }
        }

        highlightSidenote(ref) {
            const sidenote = this.sidenotes[this.footnoteRefs.indexOf(ref)];
            if (sidenote) {
                ref.classList.add('highlighted');
                sidenote.classList.add('highlighted', 'hovering');
            }
        }

        unhighlightSidenote(ref) {
            const sidenote = this.sidenotes[this.footnoteRefs.indexOf(ref)];
            if (sidenote) {
                ref.classList.remove('highlighted');
                sidenote.classList.remove('highlighted', 'hovering');
            }
        }
    }

    // Initialize Sidenotes when the DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        new Sidenotes();
    });
})();

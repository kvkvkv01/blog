// Global Window object definition
var GW = {
    // Common utility functions
    getElement: function(id) {
        return document.getElementById(id);
    },
    
    getElements: function(className) {
        return document.getElementsByClassName(className);
    },
    
    // Add other common utility functions as needed
    ready: function(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    },

    // Logging functionality
    log: function(message, type) {
        if (console && console.log) {
            console.log(`[${type || 'INFO'}] ${message}`);
        }
    },

    // Content load handlers
    contentLoadHandlers: [],

    // Notification center functionality
    notificationCenter: {
        notifications: [],
        listeners: {},
        handlers: {},
        
        add: function(message, type) {
            this.notifications.push({ message, type });
            this.fireEvent('notification', { message, type });
            // You can implement actual notification display logic here
            console.log(`[${type}] ${message}`);
        },
        
        clear: function() {
            this.notifications = [];
        },

        addEventListener: function(event, callback) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
        },

        removeEventListener: function(event, callback) {
            if (this.listeners[event]) {
                this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
            }
        },

        fireEvent: function(event, data) {
            if (this.listeners[event]) {
                this.listeners[event].forEach(callback => {
                    try {
                        callback(data);
                    } catch (e) {
                        console.error('Error in notification event listener:', e);
                    }
                });
            }
        },

        addHandlerForEvent: function(event, handler) {
            if (!this.handlers[event]) {
                this.handlers[event] = [];
            }
            this.handlers[event].push(handler);
        }
    },

    // Mobile detection
    isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    // Local storage utilities
    getSavedCount: function() {
        try {
            return localStorage.getItem('savedCount') || 0;
        } catch (e) {
            console.error('Error accessing localStorage:', e);
            return 0;
        }
    },

    setSavedCount: function(count) {
        try {
            localStorage.setItem('savedCount', count);
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    },

    // DOM manipulation utilities
    insertBefore: function(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
    },

    // Event handling
    addEvent: function(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, handler);
        } else {
            element['on' + event] = handler;
        }
    },

    // Class manipulation
    hasClass: function(element, className) {
        return element.classList ? element.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(element.className);
    },

    addClass: function(element, className) {
        if (element.classList) {
            element.classList.add(className);
        } else if (!this.hasClass(element, className)) {
            element.className += ' ' + className;
        }
    },

    removeClass: function(element, className) {
        if (element.classList) {
            element.classList.remove(className);
        } else {
            element.className = element.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
        }
    },

    // Content load handling
    addContentLoadHandler: function(handler) {
        this.contentLoadHandlers.push(handler);
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', handler);
        } else {
            handler();
        }
    },

    // Scroll handling
    addScrollListener: function(element, handler) {
        if (element.addEventListener) {
            element.addEventListener('scroll', handler, { passive: true });
        } else if (element.attachEvent) {
            element.attachEvent('onscroll', handler);
        } else {
            element.onscroll = handler;
        }
    },

    // UI element handling
    addUIElement: function(element) {
        if (element && element.parentNode) {
            this.contentLoadHandlers.forEach(handler => {
                try {
                    handler(element);
                } catch (e) {
                    console.error('Error in content load handler:', e);
                }
            });
        }
    },

    // Mode selector handling
    injectModeSelector: function(element) {
        if (!element) return;
        
        // Create mode selector container if it doesn't exist
        let container = element.querySelector('.mode-selector-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'mode-selector-container';
            element.appendChild(container);
        }

        // Create mode selector if it doesn't exist
        let selector = container.querySelector('.mode-selector');
        if (!selector) {
            selector = document.createElement('select');
            selector.className = 'mode-selector';
            container.appendChild(selector);
        }

        // Add mode options if they don't exist
        if (selector.options.length === 0) {
            const modes = ['default', 'popup', 'inline'];
            modes.forEach(mode => {
                const option = document.createElement('option');
                option.value = mode;
                option.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
                selector.appendChild(option);
            });
        }

        // Add change event listener
        selector.addEventListener('change', function() {
            const mode = this.value;
            // Trigger mode change event
            const event = new CustomEvent('modechange', { detail: { mode } });
            element.dispatchEvent(event);
        });
    },

    // Media query handling
    doWhenMatchMedia: function(query, callback) {
        const mediaQuery = window.matchMedia(query);
        if (mediaQuery.matches) {
            callback(mediaQuery);
        }
        mediaQuery.addListener(callback);
    }
};

// Make GW available globally
window.GW = GW;

// Make GWLog available globally
window.GWLog = function(message, type) {
    GW.log(message, type);
};

// Make getSavedCount available globally for backward compatibility
window.getSavedCount = function() {
    return GW.getSavedCount();
};

// Make addContentLoadHandler available globally
window.addContentLoadHandler = function(handler) {
    GW.addContentLoadHandler(handler);
};

// Make addScrollListener available globally
window.addScrollListener = function(element, handler) {
    GW.addScrollListener(element, handler);
};

// Make addUIElement available globally
window.addUIElement = function(element) {
    GW.addUIElement(element);
};

// Make injectModeSelector available globally
window.injectModeSelector = function(element) {
    GW.injectModeSelector(element);
};

// Make doWhenMatchMedia available globally
window.doWhenMatchMedia = function(query, callback) {
    GW.doWhenMatchMedia(query, callback);
}; 
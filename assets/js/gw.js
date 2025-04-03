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

    // Notification center functionality
    notificationCenter: {
        notifications: [],
        add: function(message, type) {
            this.notifications.push({ message, type });
            // You can implement actual notification display logic here
            console.log(`[${type}] ${message}`);
        },
        clear: function() {
            this.notifications = [];
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
    }
};

// Make GW available globally
window.GW = GW; 
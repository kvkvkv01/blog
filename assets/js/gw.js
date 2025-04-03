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
    }
};

// Make GW available globally
window.GW = GW; 
// Load Font Awesome
function loadFontAwesome() {
    if (!document.querySelector('#font-awesome')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.id = 'font-awesome';
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }
}

// Path handling for content.json based on current page depth
function getContentPath() {
    const path = window.location.pathname;
    return path.includes('/pages/') ? '../assets/data/content.json' : './assets/data/content.json';
}

// Format relative image paths based on page location
function formatImagePath(path) {
    return window.location.pathname.includes('/pages/') ? `../${path}` : path;
}

// Generic error handler
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    // You could add more error handling logic here
}

// Utility function to create elements with classes
function createElement(tag, className, innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

// Export utilities
window.utils = {
    loadFontAwesome,
    getContentPath,
    formatImagePath,
    handleError,
    createElement
};

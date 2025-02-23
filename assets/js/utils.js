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
    return path.includes('/pages/') ? '../assets/data/content.json' : 'assets/data/content.json';
}

// Format relative image paths based on page location
function formatImagePath(path) {
    const base = window.location.pathname.includes('/pages/') ? '..' : '.';
    return `${base}/${path}`;
}

// Get base URL for assets
function getBaseUrl() {
    return window.location.pathname.includes('/pages/') ? '..' : '.';
}

// Enhanced error handler with user feedback
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    
    // Create or get error container
    let errorContainer = document.getElementById('error-container');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        errorContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 1000;
            display: none;
            max-width: 300px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(errorContainer);
    }

    // Show user-friendly error message
    const userMessage = error.message || 'An unexpected error occurred. Please try again.';
    errorContainer.textContent = userMessage;
    errorContainer.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 5000);
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
    createElement,
    getBaseUrl
};

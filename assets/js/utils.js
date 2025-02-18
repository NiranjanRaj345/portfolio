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
    const basePath = window.location.hostname.includes('.pages.dev') 
        ? '/portfolio'  // For Cloudflare Pages deployment
        : '';          // For root deployment

    const isInPagesDir = window.location.pathname.includes('/pages/');
    return isInPagesDir 
        ? '../assets/data/content.json'
        : `${basePath}/assets/data/content.json`;
}

// Format relative image paths based on page location
function formatImagePath(path) {
    // Get the base path of the site
    const basePath = window.location.hostname.includes('.pages.dev') 
        ? '/portfolio'  // For Cloudflare Pages deployment
        : '';          // For root deployment

    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // If we're in the pages directory, go up one level
    if (window.location.pathname.includes('/pages/')) {
        return `../${cleanPath}`;
    }

    // Return the path with the correct base
    return `${basePath}/${cleanPath}`;
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

// Get correct path for navigation
function getNavPath(path) {
    // Get the base path of the site
    const basePath = window.location.hostname.includes('.pages.dev') 
        ? '/portfolio'  // For Cloudflare Pages deployment
        : '';          // For root deployment

    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // If we're in the pages directory and the path is not absolute, go up one level
    const isInPagesDir = window.location.pathname.includes('/pages/');
    const isAbsolutePath = path.startsWith('/');

    if (isInPagesDir && !isAbsolutePath) {
        return `../${cleanPath}`;
    }

    // Return the path with the correct base
    return `${basePath}/${cleanPath}`;
}

// Export utilities
window.utils = {
    loadFontAwesome,
    getContentPath,
    formatImagePath,
    handleError,
    createElement,
    getNavPath
};

// Update navbar links based on current location
function updateNavLinks() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    const links = nav.querySelectorAll('a');
    links.forEach(link => {
        const originalHref = link.getAttribute('href');
        // Special handling for home link
        if (link.id === 'home-link') {
            const basePath = window.location.hostname.includes('.pages.dev') 
                ? '/portfolio'  // For Cloudflare Pages deployment
                : '';          // For root deployment
            link.href = `${basePath}/index.html`;
        } else {
            link.href = utils.getNavPath(originalHref);
        }
    });
}

// Add this to window load event
window.addEventListener('load', updateNavLinks);

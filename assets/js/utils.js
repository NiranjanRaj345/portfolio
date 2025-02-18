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

// Core path utilities
const pathUtils = {
    getBasePath() {
        return window.location.hostname.includes('.pages.dev') ? '/portfolio' : '';
    },

    isInPagesDirectory() {
        return window.location.pathname.includes('/pages/');
    },

    normalizePath(path) {
        return path.startsWith('/') ? path.slice(1) : path;
    },

    resolvePath(path, options = {}) {
        const basePath = this.getBasePath();
        const cleanPath = this.normalizePath(path);
        
        if (this.isInPagesDirectory() && !options.absolute) {
            return `../${cleanPath}`;
        }
        
        return `${basePath}/${cleanPath}`;
    }
};

// Get content.json path
function getContentPath() {
    return pathUtils.resolvePath('assets/data/content.json');
}

// Format image path
function formatImagePath(path) {
    return pathUtils.resolvePath(path);
}

// Enhanced error handler with console grouping
function handleError(error, context) {
    console.group(`Error in ${context}`);
    console.error(error);
    console.trace('Stack trace:');
    console.groupEnd();
}

// Enhanced element creator with optional attributes
function createElement(tag, className = '', options = {}) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (options.innerHTML) element.innerHTML = options.innerHTML;
    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
    return element;
}

// Get navigation path
function getNavPath(path) {
    return pathUtils.resolvePath(path, { absolute: path.startsWith('/') });
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

// Core path utilities
const pathUtils = {
    getBasePath() {
        // Check if we're on the production domain
        if (window.location.hostname.includes('.pages.dev') || 
            window.location.hostname.includes('.github.io')) {
            return '/portfolio';
        }
        return '';
    },

    isInPagesDirectory() {
        return window.location.pathname.includes('/pages/');
    },

    isRootPage() {
        const path = window.location.pathname;
        return path === '/' || path.endsWith('index.html') || 
               path === '/portfolio/' || path.endsWith('/portfolio/index.html');
    },

    normalizePath(path) {
        return path.startsWith('/') ? path.slice(1) : path;
    },

    resolvePath(path, options = {}) {
        const basePath = this.getBasePath();
        const cleanPath = this.normalizePath(path);
        
        // If we're in the pages directory and not requesting an absolute path
        if (this.isInPagesDirectory() && !options.absolute) {
            return `../${cleanPath}`;
        }
        
        // If we're on the root page (index.html)
        if (this.isRootPage()) {
            return `${basePath}/${cleanPath}`;
        }
        
        return `${basePath}/${cleanPath}`;
    }
};

// Content loading utilities with caching
const contentUtils = {
    cache: null,
    cacheTimestamp: null,
    cacheDuration: 5 * 60 * 1000, // 5 minutes

    async load() {
        try {
            // Check cache validity
            const now = Date.now();
            if (this.cache && this.cacheTimestamp && (now - this.cacheTimestamp < this.cacheDuration)) {
                return this.cache;
            }

            const path = pathUtils.resolvePath('assets/data/content.json', { absolute: true });
            const response = await fetch(path);
            const data = await response.json();
            
            // Update cache
            this.cache = data;
            this.cacheTimestamp = now;
            
            return data;
        } catch (error) {
            handleError(error, 'contentUtils.load');
            return this.cache || null; // Fallback to cached data if available
        }
    },

    clearCache() {
        this.cache = null;
        this.cacheTimestamp = null;
    },

    setElementText(selector, text, fallback = '') {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text || fallback;
        }
    },

    renderList(selector, items, renderItem) {
        const container = document.querySelector(selector);
        if (!container || !items) return;

        const fragment = document.createDocumentFragment();
        items.forEach(item => {
            const element = renderItem(item);
            if (element) {
                fragment.appendChild(element);
            }
        });
        container.appendChild(fragment);
    }
};

// DOM utilities
function createElement(tag, className = '', options = {}) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (options.innerHTML) element.innerHTML = options.innerHTML;
    if (options.text) element.textContent = options.text;
    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
    return element;
}

// Font Awesome loader with performance optimization
function loadFontAwesome() {
    if (document.querySelector('#font-awesome')) return;
    
    // Add stylesheet with media="print" to prevent render blocking
    const fontAwesome = createElement('link', '', {
        attributes: {
            id: 'font-awesome',
            rel: 'stylesheet',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
            media: 'print',
            onload: "this.media='all'"  // Switch to 'all' once loaded
        }
    });

    // Add noscript fallback
    const noscript = createElement('noscript', '', {
        innerHTML: `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">`
    });

    document.head.appendChild(fontAwesome);
    document.head.appendChild(noscript);
}

// Error handler with console grouping
function handleError(error, context) {
    console.group(`Error in ${context}`);
    console.error(error);
    console.trace('Stack trace:');
    console.groupEnd();
}

// Animation utilities
const animationUtils = {
    addPageTransition(element) {
        element.classList.add('page-transition');
        return element;
    },

    fadeIn(element) {
        element.style.opacity = '0';
        element.style.display = 'block';
        setTimeout(() => element.style.opacity = '1', 10);
        return element;
    },

    fadeOut(element) {
        element.style.opacity = '0';
        setTimeout(() => element.style.display = 'none', 300);
        return element;
    }
};

// Get content.json path
function getContentPath() {
    return pathUtils.resolvePath('assets/data/content.json', { absolute: true });
}

// Format image path
function formatImagePath(path) {
    return pathUtils.resolvePath(path);
}

// Get navigation path
function getNavPath(path) {
    return pathUtils.resolvePath(path, { absolute: path.startsWith('/') });
}

// Update navbar links
function updateNavLinks() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    const links = nav.querySelectorAll('a');
    links.forEach(link => {
        const originalHref = link.getAttribute('href');
        if (link.id === 'home-link') {
            link.href = `${pathUtils.getBasePath()}/index.html`;
        } else {
            link.href = getNavPath(originalHref);
        }
    });
}

// Export utilities
window.utils = {
    pathUtils,
    contentUtils,
    animationUtils,
    createElement,
    loadFontAwesome,
    handleError,
    getContentPath,
    formatImagePath,
    getNavPath,
    updateNavLinks
};

// Initialize navbar links
window.addEventListener('load', updateNavLinks);

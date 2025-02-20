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

// Content loading utilities
const contentUtils = {
    async load() {
        try {
            const response = await fetch(getContentPath());
            return await response.json();
        } catch (error) {
            handleError(error, 'contentUtils.load');
            return null;
        }
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

// Font Awesome loader
function loadFontAwesome() {
    if (!document.querySelector('#font-awesome')) {
        const fontAwesome = createElement('link', '', {
            attributes: {
                id: 'font-awesome',
                rel: 'stylesheet',
                href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
            }
        });
        document.head.appendChild(fontAwesome);
    }
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
    return pathUtils.resolvePath('assets/data/content.json');
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

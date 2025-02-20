// Path utilities
const pathUtils = {
    getBasePath() {
        return window.location.hostname.includes('.pages.dev') || window.location.hostname.includes('.github.io') ? '/portfolio' : '';
    },

    resolvePath(path, absolute = false) {
        const basePath = this.getBasePath();
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return absolute ? `${basePath}/${cleanPath}` : `../${cleanPath}`;
    }
};

// Content loading utilities with caching
const contentUtils = {
    cache: null,
    cacheDuration: 5 * 60 * 1000, // 5 minutes

    async load() {
        const now = Date.now();
        if (this.cache && (now - this.cache.timestamp < this.cacheDuration)) {
            return this.cache.data;
        }

        try {
            const path = pathUtils.resolvePath('assets/data/content.json', true);
            const response = await fetch(path);
            const data = await response.json();
            this.cache = { data, timestamp: now };
            return data;
        } catch (error) {
            handleError(error, 'contentUtils.load');
            return this.cache ? this.cache.data : null;
        }
    },

    renderList(selector, items, renderItem) {
        const container = document.querySelector(selector);
        if (!container || !items) return;

        const fragment = document.createDocumentFragment();
        items.forEach(item => fragment.appendChild(renderItem(item)));
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
        Object.entries(options.attributes).forEach(([key, value]) => element.setAttribute(key, value));
    }
    return element;
}

// Font Awesome loader with performance optimization
function loadFontAwesome() {
    if (document.querySelector('#font-awesome')) return;

    const fontAwesome = createElement('link', '', {
        attributes: {
            id: 'font-awesome',
            rel: 'stylesheet',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
            media: 'print',
            onload: "this.media='all'"
        }
    });

    const noscript = createElement('noscript', '', {
        innerHTML: `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">`
    });

    document.head.appendChild(fontAwesome);
    document.head.appendChild(noscript);
}

// Error handler
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
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

// Export utilities
window.utils = {
    pathUtils,
    contentUtils,
    animationUtils,
    createElement,
    loadFontAwesome,
    handleError
};

// Initialize navbar links
window.addEventListener('load', () => {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    const links = nav.querySelectorAll('a');
    links.forEach(link => {
        const originalHref = link.getAttribute('href');
        link.href = link.id === 'home-link' ? `${pathUtils.getBasePath()}/index.html` : pathUtils.resolvePath(originalHref, originalHref.startsWith('/'));
    });
});

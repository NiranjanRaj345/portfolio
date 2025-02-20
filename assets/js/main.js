// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Include HTML content with lazy loading
async function includeHTML() {
    const elements = document.querySelectorAll('[data-include]');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(async entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                observer.unobserve(element);
                
                try {
                    const file = element.getAttribute('data-include');
                    if (!file) return;

                    // Add loading state
                    element.classList.add('loading');
                    
                    // Check sessionStorage cache first
                    const cached = sessionStorage.getItem(file);
                    if (cached) {
                        element.innerHTML = cached;
                    } else {
                        const response = await fetch(file);
                        const content = await response.text();
                        element.innerHTML = content;
                        // Cache the component
                        sessionStorage.setItem(file, content);
                    }
                    
                    element.classList.remove('loading');
                } catch (error) {
                    utils.handleError(error, 'includeHTML');
                    element.innerHTML = 'Error loading content.';
                    element.classList.add('error');
                }
            }
        });
    }, {
        rootMargin: '50px' // Start loading slightly before element comes into view
    });

    elements.forEach(element => observer.observe(element));
}

// Navbar Controller
const NavbarController = {
    navbar: null,
    indicator: null,
    lastScroll: 0,
    initialized: false,

    init() {
        this.navbar = document.querySelector('.navbar');
        this.indicator = document.querySelector('.nav-indicator');
        if (!this.navbar || this.initialized) return;
        
        this.initialized = true;
        this.setupScrollHandler();
        this.updateIndicator();
    },

    setupScrollHandler() {
        window.addEventListener('scroll', debounce(() => {
            this.handleScroll();
            this.updateIndicator();
        }, 10));
    },

    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Handle navbar visibility and style
        if (currentScroll > this.lastScroll && currentScroll > 50) {
            this.navbar.classList.add('scrolled');
            this.navbar.style.transform = 'translateY(-100%)';
        } else {
            this.navbar.style.transform = 'translateY(0)';
            this.navbar.classList.toggle('scrolled', currentScroll > 50);
        }
        
        this.lastScroll = currentScroll;
    },

    updateIndicator() {
        const activeLink = document.querySelector('.nav-links a.active');
        if (activeLink && this.indicator) {
            this.indicator.style.width = `${activeLink.offsetWidth}px`;
            this.indicator.style.left = `${activeLink.offsetLeft}px`;
        }
    }
};

// Navigation Controller
const NavigationController = {
    init() {
        this.initSmoothScroll();
        this.initActiveNavLinks();
    },

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    },

    initActiveNavLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        window.addEventListener('scroll', debounce(() => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - 60) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href').includes(current));
            });
            NavbarController.updateIndicator();
        }, 100));
    }
};

// Animation Controller
const AnimationController = {
    resetTypingAnimation() {
        const typing = document.querySelector('.typing');
        if (!typing) return;
        
        typing.style.animation = 'none';
        typing.offsetHeight; // Trigger reflow
        typing.style.animation = null;
    }
};

// Initialize Everything
document.addEventListener('DOMContentLoaded', async () => {
    utils.loadFontAwesome();
    await includeHTML();
    
    NavbarController.init();
    NavigationController.init();
});

// Handle page transitions
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.reload(); // Force fresh load on back/forward
    }
});

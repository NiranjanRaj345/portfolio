// Mobile Navigation Handler
class MobileNav {
    constructor() {
        this.button = document.querySelector('.mobile-menu-btn');
        this.menu = document.querySelector('.nav-links');
        this.isOpen = false;
        
        utils.performance.start('nav-init');
        this.init();
        utils.performance.end('nav-init');
    }

    init() {
        if (!this.button || !this.menu) return;

        // Initialize Touch Swipe
        utils.enableTouchInteractions(this.menu, {
            move: ({ deltaX }) => {
                if (this.isOpen && deltaX < -50) {
                    this.closeMenu();
                }
            }
        });

        // Event Listeners
        this.button.addEventListener('click', () => this.toggleMenu());
        
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.menu.contains(e.target) && !this.button.contains(e.target)) {
                this.closeMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Responsive Handling
        window.addEventListener('resize', this.debounce(() => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        }, 250));

        this.updateARIA();
        this.setActiveLink();
    }

    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        this.isOpen = true;
        this.menu.classList.add('active');
        this.button.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        this.updateARIA();
    }

    closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('active');
        this.button.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        this.updateARIA();
    }

    updateARIA() {
        this.button.setAttribute('aria-expanded', this.isOpen.toString());
        this.menu.setAttribute('aria-hidden', (!this.isOpen).toString());
    }

    setActiveLink() {
        const links = this.menu.querySelectorAll('a');
        const currentPath = window.location.pathname;
        
        links.forEach(link => {
            // Get the normalized paths for comparison
            const linkPath = utils.getNavPath(link.getAttribute('href'));
            const normalizedCurrentPath = currentPath.endsWith('/') 
                ? currentPath + 'index.html' 
                : currentPath;
            
            if (normalizedCurrentPath.endsWith(linkPath)) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize mobile navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const mobileNav = new MobileNav();
});

// Mobile Navigation Controller
class MobileNav {
    constructor() {
        this.button = document.querySelector('.mobile-menu-btn');
        this.menu = document.querySelector('.nav-links');
        this.isOpen = false;
        this.touchStartX = 0;
        this.boundHandleClick = this.handleClick.bind(this);
        this.boundHandleKeydown = this.handleKeydown.bind(this);
        this.boundHandleResize = debounce(this.handleResize.bind(this), 250);
        
        if (this.validateElements()) {
            this.init();
        }
    }

    validateElements() {
        if (!this.button || !this.menu) {
            utils.handleError(
                new Error('Required navigation elements not found'),
                'MobileNav'
            );
            return false;
        }
        return true;
    }

    init() {
        // Initialize touch events
        this.initTouchEvents();
        
        // Set up event listeners
        this.button.addEventListener('click', () => this.toggleMenu());
        document.addEventListener('click', this.boundHandleClick);
        document.addEventListener('keydown', this.boundHandleKeydown);
        window.addEventListener('resize', this.boundHandleResize);

        this.updateARIA();
        this.setActiveLink();
    }

    initTouchEvents() {
        this.menu.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this.menu.addEventListener('touchmove', (e) => {
            if (!this.isOpen) return;
            
            const deltaX = this.touchStartX - e.touches[0].clientX;
            if (deltaX > 50) { // Swipe threshold
                this.closeMenu();
            }
        }, { passive: true });
    }

    handleClick(e) {
        if (this.isOpen && !this.menu.contains(e.target) && !this.button.contains(e.target)) {
            this.closeMenu();
        }
    }

    handleKeydown(e) {
        if (e.key === 'Escape' && this.isOpen) {
            this.closeMenu();
        }
    }

    handleResize() {
        if (window.innerWidth > 768 && this.isOpen) {
            this.closeMenu();
        }
    }

    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        this.isOpen = true;
        this.menu.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.updateARIA();
    }

    closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('active');
        document.body.style.overflow = '';
        this.updateARIA();
    }

    updateARIA() {
        this.button.setAttribute('aria-expanded', this.isOpen.toString());
        this.menu.setAttribute('aria-hidden', (!this.isOpen).toString());
    }

    setActiveLink() {
        try {
            const links = this.menu.querySelectorAll('a');
            const currentPath = window.location.pathname;
            
            links.forEach(link => {
                const linkPath = utils.getNavPath(link.getAttribute('href'));
                const normalizedCurrentPath = currentPath.endsWith('/') 
                    ? currentPath + 'index.html' 
                    : currentPath;
                
                const isActive = normalizedCurrentPath.endsWith(linkPath);
                link.classList.toggle('active', isActive);
                link.setAttribute('aria-current', isActive ? 'page' : 'false');
            });
        } catch (error) {
            utils.handleError(error, 'MobileNav.setActiveLink');
        }
    }

    // Cleanup method to remove event listeners
    destroy() {
        document.removeEventListener('click', this.boundHandleClick);
        document.removeEventListener('keydown', this.boundHandleKeydown);
        window.removeEventListener('resize', this.boundHandleResize);
    }
}

// Initialize mobile navigation when DOM is ready
let mobileNav;
document.addEventListener('DOMContentLoaded', () => {
    mobileNav = new MobileNav();
});

// Cleanup on page unload
window.addEventListener('unload', () => {
    if (mobileNav) {
        mobileNav.destroy();
    }
});

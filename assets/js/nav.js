const MobileNavController = {
    elements: {
        button: null,
        menu: null
    },
    isOpen: false,
    touchStartX: 0,

    initialize: function() {
        this.cacheElements();
        if (!this.validateElements()) return;

        this.bindEvents();
        this.setActiveLink();
        this.updateARIA();
    },

    cacheElements: function() {
        this.elements = {
            button: document.querySelector('.mobile-menu-btn'),
            menu: document.querySelector('.nav-links')
        };
    },

    validateElements: function() {
        if (!this.elements.button || !this.elements.menu) {
            utils.handleError(
                new Error('Required navigation elements not found'),
                'MobileNavController'
            );
            return false;
        }
        return true;
    },

    bindEvents: function() {
        // Menu button click
        this.elements.button.addEventListener('click', () => this.toggleMenu());

        // Touch events
        this.elements.menu.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        this.elements.menu.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });

        // Close menu when clicking outside
        document.addEventListener('click', this.handleOutsideClick.bind(this));

        // ESC key to close menu
        document.addEventListener('keydown', this.handleKeydown.bind(this));

        // Resize handling
        window.addEventListener('resize', this.handleResize.bind(this));
    },

    handleTouchStart: function(e) {
        this.touchStartX = e.touches[0].clientX;
    },

    handleTouchMove: function(e) {
        if (!this.isOpen) return;
        
        const deltaX = this.touchStartX - e.touches[0].clientX;
        if (deltaX > 50) { // Swipe threshold
            this.closeMenu();
        }
    },

    handleOutsideClick: function(e) {
        if (this.isOpen && 
            !this.elements.menu.contains(e.target) && 
            !this.elements.button.contains(e.target)) {
            this.closeMenu();
        }
    },

    handleKeydown: function(e) {
        if (e.key === 'Escape' && this.isOpen) {
            this.closeMenu();
        }
    },

    handleResize: function() {
        if (window.innerWidth > 768 && this.isOpen) {
            this.closeMenu();
        }
    },

    toggleMenu: function() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    },

    openMenu: function() {
        this.isOpen = true;
        this.elements.menu.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.updateARIA();
        utils.animationUtils.fadeIn(this.elements.menu);
    },

    closeMenu: function() {
        this.isOpen = false;
        this.elements.menu.classList.remove('active');
        document.body.style.overflow = '';
        this.updateARIA();
        utils.animationUtils.fadeOut(this.elements.menu);
    },

    updateARIA: function() {
        this.elements.button.setAttribute('aria-expanded', this.isOpen.toString());
        this.elements.menu.setAttribute('aria-hidden', (!this.isOpen).toString());
    },

    setActiveLink: function() {
        try {
            const links = this.elements.menu.querySelectorAll('a');
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
            utils.handleError(error, 'MobileNavController.setActiveLink');
        }
    }
};

// Initialize mobile navigation
document.addEventListener('DOMContentLoaded', () => {
    MobileNavController.initialize();
});

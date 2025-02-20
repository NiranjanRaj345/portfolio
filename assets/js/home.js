const HomeController = {
    elements: {
        name: null,
        tagline: null,
        socialLinks: null,
        quickLinks: null
    },

    initialize: async function() {
        this.cacheElements();
        if (!this.validateElements()) return;

        await this.loadContent();
        this.initQuickLinks();
        this.initParticles();
    },

    cacheElements: function() {
        this.elements = {
            name: document.querySelector('.hero-name'),
            tagline: document.querySelector('.typing'),
            socialLinks: document.querySelector('.social-links'),
            quickLinks: document.querySelector('.quick-links .container')
        };
    },

    validateElements: function() {
        const missing = Object.entries(this.elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);

        if (missing.length > 0) {
            utils.handleError(
                new Error(`Missing home elements: ${missing.join(', ')}`),
                'HomeController'
            );
            return false;
        }
        return true;
    },

    loadContent: async function() {
        try {
            const data = await utils.contentUtils.load();
            if (!data) return;

            // Update hero content with loading state
            this.elements.name.classList.add('loading');
            this.elements.tagline.classList.add('loading');

            // Update hero content
            this.elements.name.textContent = data.hero.name;
            this.elements.tagline.textContent = data.hero.tagline;

            // Generate social links
            this.elements.socialLinks.innerHTML = Object.entries(data.hero.social_links)
                .map(([platform, url]) => `
                    <a href="${url}" 
                       target="_blank" 
                       rel="noopener"
                       aria-label="${platform}">
                        <i class="fab fa-${platform.toLowerCase()}" 
                           aria-hidden="true"></i>
                    </a>
                `).join('');

            // Remove loading state
            this.elements.name.classList.remove('loading');
            this.elements.tagline.classList.remove('loading');

            // Initialize typing animation after content is loaded
            this.elements.tagline.addEventListener('animationend', 
                () => AnimationController.resetTypingAnimation());

        } catch (error) {
            utils.handleError(error, 'HomeController.loadContent');
            this.handleLoadError();
        }
    },

    handleLoadError: function() {
        if (this.elements.name) {
            this.elements.name.textContent = 'Error loading content';
            this.elements.name.classList.add('error');
        }
        if (this.elements.tagline) {
            this.elements.tagline.textContent = 'Please try again later';
            this.elements.tagline.classList.add('error');
        }
    },

    initQuickLinks: function() {
        const cards = this.elements.quickLinks.querySelectorAll('.card');
        cards.forEach(card => {
            // Add keyboard accessibility
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            const handleNavigation = () => {
                const href = card.dataset.href;
                if (href) {
                    window.location.href = utils.getNavPath(href);
                }
            };

            card.addEventListener('click', handleNavigation);
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleNavigation();
                }
            });
        });
    },

    initParticles: function() {
        const configPath = utils.formatImagePath('assets/js/particles-config.json');
        particlesJS.load('particles-js', configPath, (response) => {
            if (!response) {
                utils.handleError(
                    new Error('Failed to load particles.js configuration'),
                    'HomeController.initParticles'
                );
            }
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await includeHTML();
    await HomeController.initialize();
});

const HomeController = {
    elements: {
        name: null,
        tagline: null,
        socialLinks: null,
        quickLinks: null,
        particles: null
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
            quickLinks: document.querySelector('.quick-links .container'),
            particles: document.getElementById('particles-js')
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
            // Add loading states
            this.elements.name.classList.add('loading');
            this.elements.tagline.classList.add('loading');
            this.elements.socialLinks.classList.add('loading');

            const data = await utils.contentUtils.load();
            if (!data?.hero) {
                throw new Error('Hero data not found');
            }

            // Update hero content
            this.elements.name.textContent = data.hero.name;
            this.elements.tagline.textContent = data.hero.tagline;

            // Generate social links with platform name mapping
            const platformIcons = {
                github: 'github',
                linkedin: 'linkedin',
                twitter: 'twitter',
                X: 'twitter',
                instagram: 'instagram'
            };

            this.elements.socialLinks.innerHTML = Object.entries(data.hero.social_links)
                .map(([platform, url]) => {
                    const iconName = platformIcons[platform.toLowerCase()] || platform.toLowerCase();
                    return `
                        <a href="${url}" 
                           target="_blank" 
                           rel="noopener"
                           aria-label="${platform}">
                            <i class="fab fa-${iconName}" 
                               aria-hidden="true"></i>
                        </a>
                    `;
                }).join('');

            // Remove loading states
            this.elements.name.classList.remove('loading');
            this.elements.tagline.classList.remove('loading');
            this.elements.socialLinks.classList.remove('loading');

            // Initialize typing animation
            if (this.elements.tagline) {
                this.elements.tagline.addEventListener('animationend', 
                    () => AnimationController.resetTypingAnimation());
            }

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
        this.elements.socialLinks.innerHTML = '';
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
        if (!this.elements.particles) return;

        const configPath = utils.pathUtils.resolvePath('assets/js/particles-config.json', {
            absolute: true
        });

        // Add loading state to particles container
        this.elements.particles.classList.add('loading');

        particlesJS.load('particles-js', configPath, (response) => {
            this.elements.particles.classList.remove('loading');
            
            if (!response) {
                utils.handleError(
                    new Error('Failed to load particles.js configuration'),
                    'HomeController.initParticles'
                );
                this.elements.particles.classList.add('error');
            }
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Load Font Awesome first for icons
    utils.loadFontAwesome();
    
    // Load HTML includes
    await includeHTML();
    
    // Initialize main controller
    await HomeController.initialize();
});

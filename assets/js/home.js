// Hero Section Controller
const HeroController = {
    elements: {
        name: null,
        tagline: null,
        socialLinks: null,
        particles: null
    },

    init() {
        this.elements = {
            name: document.querySelector('.hero-name'),
            tagline: document.querySelector('.typing'),
            socialLinks: document.querySelector('.social-links'),
            particles: document.getElementById('particles-js')
        };

        if (!this.validateElements()) return;
        
        this.loadContent();
        this.initTypingAnimation();
    },

    validateElements() {
        const missing = Object.entries(this.elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);

        if (missing.length > 0) {
            utils.handleError(
                new Error(`Missing hero elements: ${missing.join(', ')}`),
                'HeroController'
            );
            return false;
        }
        return true;
    },

    async loadContent() {
        try {
            // Add loading state
            this.elements.name.classList.add('loading');
            this.elements.tagline.classList.add('loading');
            
            const response = await fetch(utils.getContentPath());
            const data = await response.json();
            
            // Update content
            this.elements.name.textContent = data.hero.name;
            this.elements.tagline.textContent = data.hero.tagline;
            
            // Generate social links
            this.elements.socialLinks.innerHTML = this.generateSocialLinks(data.hero.social_links);
            
            // Remove loading state
            this.elements.name.classList.remove('loading');
            this.elements.tagline.classList.remove('loading');
        } catch (error) {
            utils.handleError(error, 'HeroController.loadContent');
            this.handleLoadError();
        }
    },

    generateSocialLinks(links) {
        return Object.entries(links)
            .map(([platform, url]) => `
                <a href="${url}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   aria-label="${platform}">
                    <i class="fab fa-${platform.toLowerCase()}" aria-hidden="true"></i>
                </a>
            `).join('');
    },

    handleLoadError() {
        this.elements.name.textContent = 'Error loading content';
        this.elements.tagline.textContent = 'Please try again later';
        this.elements.name.classList.add('error');
        this.elements.tagline.classList.add('error');
    },

    initTypingAnimation() {
        if (this.elements.tagline) {
            this.elements.tagline.addEventListener('animationend', 
                () => AnimationController.resetTypingAnimation());
        }
    }
};

// Quick Links Controller
const QuickLinksController = {
    init() {
        const cards = document.querySelectorAll('.quick-links .card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const href = card.dataset.href;
                if (href) {
                    window.location.href = utils.getNavPath(href);
                }
            });

            // Add keyboard accessibility
            card.setAttribute('tabindex', '0');
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const href = card.dataset.href;
                    if (href) {
                        window.location.href = utils.getNavPath(href);
                    }
                }
            });
        });
    }
};

// Particles Controller
const ParticlesController = {
    init() {
        const configPath = utils.formatImagePath('assets/js/particles-config.json');
        particlesJS.load('particles-js', configPath, function(response) {
            if (!response) {
                utils.handleError(
                    new Error('Failed to load particles.js configuration'),
                    'ParticlesController'
                );
            }
        });
    }
};

// Initialize home page
document.addEventListener('DOMContentLoaded', async () => {
    await includeHTML();
    
    HeroController.init();
    QuickLinksController.init();
    ParticlesController.init();
});

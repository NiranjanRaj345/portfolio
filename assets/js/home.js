// Load hero section content
async function loadHeroContent() {
    try {
        const response = await fetch(utils.getContentPath());
        const data = await response.json();
        
        // Load hero section content
        document.querySelector('.hero-name').textContent = data.hero.name;
        const tagline = document.querySelector('.typing');
        tagline.textContent = data.hero.tagline;
        
        // Load social links
        const socialLinksContainer = document.querySelector('.social-links');
        socialLinksContainer.innerHTML = Object.entries(data.hero.social_links)
            .map(([platform, url]) => `
                <a href="${url}" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-${platform.toLowerCase()}"></i>
                </a>
            `).join('');
    } catch (error) {
        utils.handleError(error, 'loadHeroContent');
    }
}

// Handle quick link clicks
function initQuickLinks() {
    const cards = document.querySelectorAll('.quick-links .card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const href = card.dataset.href;
            if (href) {
                window.location.href = utils.getNavPath(href);
            }
        });
    });
}

// Initialize home page
document.addEventListener('DOMContentLoaded', async () => {
    await includeHTML();
    loadHeroContent();
    initQuickLinks();

    // Initialize particles.js
    particlesJS.load('particles-js', utils.formatImagePath('assets/js/particles-config.json'), function() {
        console.log('particles.js loaded');
    });

    // Add typing animation reset
    const typing = document.querySelector('.typing');
    if (typing) {
        typing.addEventListener('animationend', resetTypingAnimation);
    }
});

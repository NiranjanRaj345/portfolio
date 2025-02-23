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

// Initialize home page
document.addEventListener('DOMContentLoaded', async () => {
    await includeHTML();
    loadHeroContent();

    // Initialize particles.js
    particlesJS.load('particles-js', 'assets/js/particles-config.json', function() {
        console.log('particles.js loaded');
    });

    // Add cursor after typing animation
    const typing = document.querySelector('.typing');
    if (typing) {
        typing.addEventListener('animationend', () => {
            typing.classList.add('typing-cursor');
        });
    }
});

// Dynamic Content Loading
async function loadContent() {
    try {
        const response = await fetch('./assets/data/content.json');
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
        
        // Add Font Awesome for social icons
        if (!document.querySelector('#font-awesome')) {
            const fontAwesome = document.createElement('link');
            fontAwesome.id = 'font-awesome';
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
            document.head.appendChild(fontAwesome);
        }
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Navbar Scroll Behavior
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Handle navbar visibility based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 50) {
            // Scrolling down - shrink navbar
            navbar.classList.add('scrolled');
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up - expand navbar
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
            
            // Still add scrolled class if we're not at the top
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            }
        }
        
        // Update nav indicator position
        const activeLink = document.querySelector('.nav-links a.active');
        if (activeLink) {
            const indicator = document.querySelector('.nav-indicator');
            indicator.style.width = `${activeLink.offsetWidth}px`;
            indicator.style.left = `${activeLink.offsetLeft}px`;
        }
        
        lastScroll = currentScroll;
    });

    // Initialize nav indicator position
    const activeLink = document.querySelector('.nav-links a.active');
    if (activeLink) {
        const indicator = document.querySelector('.nav-indicator');
        indicator.style.width = `${activeLink.offsetWidth}px`;
        indicator.style.left = `${activeLink.offsetLeft}px`;
    }
}

// Smooth Scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Update Active Navigation Link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// Typing Animation Reset
function resetTypingAnimation() {
    const typing = document.querySelector('.typing');
    typing.style.animation = 'none';
    typing.offsetHeight; // Trigger reflow
    typing.style.animation = null;
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    initNavbar();
    initSmoothScroll();
    updateActiveNavLink();
    
    // Reset typing animation when it ends
    const typing = document.querySelector('.typing');
    typing.addEventListener('animationend', resetTypingAnimation);
});

// Handle page transitions
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page was loaded from cache (browser back/forward)
        loadContent();
    }
});

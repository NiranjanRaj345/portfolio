// Include HTML content
async function includeHTML() {
    const elements = document.querySelectorAll('[data-include]');
    for (let element of elements) {
        const file = element.getAttribute('data-include');
        if (file) {
            try {
                const baseUrl = utils.getBaseUrl();
                const fullPath = `${baseUrl}/${file}`;
                const response = await fetch(fullPath);
                const html = await response.text();
                element.innerHTML = html;
                
                // If this is the navbar, update its links based on current location
                if (file.includes('navbar.html')) {
                    const isInPagesDir = window.location.pathname.includes('/pages/');
                    const navLinks = element.querySelectorAll('.nav-links a');
                    navLinks.forEach(link => {
                        if (isInPagesDir) {
                            // When in /pages/, convert paths to relative
                            if (link.getAttribute('href') === 'index.html') {
                                link.href = '../index.html';
                            } else if (link.getAttribute('href').startsWith('pages/')) {
                                link.href = link.getAttribute('href').replace('pages/', '');
                            }
                        }
                    });
                }
            } catch (error) {
                utils.handleError(error, 'includeHTML');
                element.innerHTML = 'Error loading content.';
            }
        }
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
document.addEventListener('DOMContentLoaded', async () => {
    // Load Font Awesome
    utils.loadFontAwesome();

    // Initialize core functionalities
    await includeHTML();
    initNavbar();
    initSmoothScroll();
    updateActiveNavLink();
});

// Handle page transitions
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page was loaded from cache (browser back/forward)
        loadContent();
    }
});

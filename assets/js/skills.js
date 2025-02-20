const SkillsController = {
    init: async function() {
        const data = await utils.contentUtils.load();
        if (!data) return;

        this.initializeFilters(data.skills);
        this.renderSkills(data.skills);
        this.renderCertifications(data.certifications);
        this.filterSkills('all');
    },

    initializeFilters: function(skills) {
        // Get unique categories
        const categories = [...new Set(skills.map(skill => skill.category))];
        
        // Render filter buttons
        utils.contentUtils.renderList('.filter-buttons', categories, category => {
            const button = utils.createElement('button', 'filter-btn', {
                text: category,
                attributes: {
                    'data-category': category.toLowerCase()
                }
            });
            
            button.addEventListener('click', () => this.filterSkills(category));
            return button;
        });

        // Add event listener to "All" button if it exists
        const allButton = document.querySelector('.filter-btn[data-category="all"]');
        if (allButton) {
            allButton.addEventListener('click', () => this.filterSkills('all'));
        }
    },

    renderSkills: function(skills) {
        utils.contentUtils.renderList('.skills-grid', skills, skill => {
            const card = utils.createElement('div', 'skill-card flip-in', {
                attributes: {
                    'data-category': skill.category.toLowerCase()
                },
                innerHTML: `
                    <div class="skill-card-inner">
                        <div class="skill-card-front">
                            <i class="fas fa-code skill-icon"></i>
                            <h3 class="skill-name">${skill.name}</h3>
                            <span class="skill-level">${skill.level}</span>
                        </div>
                        <div class="skill-card-back">
                            <h3 class="skill-name">${skill.name}</h3>
                            <div class="progress-container">
                                <div class="progress-bar" style="width: ${skill.proficiency}%"></div>
                            </div>
                            <p>Proficiency: ${skill.proficiency}%</p>
                        </div>
                    </div>
                `
            });
            return card;
        });
    },

    renderCertifications: function(certifications) {
        utils.contentUtils.renderList('.cert-grid', certifications, cert => {
            const card = utils.createElement('div', 'cert-card', {
                innerHTML: `
                    <h3 class="cert-title">${cert.name}</h3>
                    <p class="cert-issuer">${cert.issuer}</p>
                    <span class="cert-year">${cert.year}</span>
                    <a href="${cert.link}" target="_blank" rel="noopener" class="cert-link">
                        <i class="fas fa-external-link-alt"></i> View Certificate
                    </a>
                `
            });
            return utils.animationUtils.addPageTransition(card);
        });
    },

    filterSkills: function(category) {
        const currentCategory = category.toLowerCase();
        const buttons = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.skill-card');

        // Update active button state
        buttons.forEach(btn => {
            btn.classList.toggle('active', 
                btn.dataset.category.toLowerCase() === currentCategory);
        });

        // Filter cards
        cards.forEach(card => {
            const shouldShow = currentCategory === 'all' || 
                             card.dataset.category === currentCategory;
            
            if (shouldShow) {
                card.style.display = 'block';
                card.classList.add('flip-in');
            } else {
                card.style.display = 'none';
                card.classList.remove('flip-in');
            }
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await includeHTML();
    SkillsController.init();
});

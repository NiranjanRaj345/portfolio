async function loadSkillsAndCerts() {
    try {
        const response = await fetch('../assets/data/content.json');
        const data = await response.json();
        
        // Load categories
        const categories = [...new Set(data.skills.map(skill => skill.category))];
        const filterButtons = document.querySelector('.filter-buttons');
        
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.textContent = category;
            button.dataset.category = category;
            button.addEventListener('click', () => filterSkills(category));
            filterButtons.appendChild(button);
        });

        // Load skills
        loadSkills(data.skills);

        // Load certifications
        loadCertifications(data.certifications);
    } catch (error) {
        console.error('Error loading skills and certifications:', error);
    }
}

function loadSkills(skills) {
    const skillsGrid = document.querySelector('.skills-grid');
    skillsGrid.innerHTML = '';

    skills.forEach(skill => {
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card flip-in';
        skillCard.dataset.category = skill.category;
        
        skillCard.innerHTML = `
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
        `;

        skillsGrid.appendChild(skillCard);
    });
}

function loadCertifications(certifications) {
    const certGrid = document.querySelector('.cert-grid');
    
    certifications.forEach(cert => {
        const certCard = document.createElement('div');
        certCard.className = 'cert-card page-transition';
        
        certCard.innerHTML = `
            <h3 class="cert-title">${cert.name}</h3>
            <p class="cert-issuer">${cert.issuer}</p>
            <span class="cert-year">${cert.year}</span>
            <a href="${cert.link}" target="_blank" style="display: block; margin-top: 1rem;">
                <i class="fas fa-external-link-alt"></i> View Certificate
            </a>
        `;

        certGrid.appendChild(certCard);
    });
}

function filterSkills(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.skill-card');

    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });

    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await includeHTML();
    loadSkillsAndCerts();

    // Initialize click handler for "All" button
    document.querySelector('.filter-btn[data-category="all"]').addEventListener('click', () => {
        filterSkills('all');
    });
});

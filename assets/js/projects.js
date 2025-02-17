// Load and display projects
async function loadProjects() {
    try {
        const response = await fetch(utils.getContentPath());
        const data = await response.json();
        const projectsGrid = document.querySelector('.projects-grid');
        
        data.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card page-transition';
            projectCard.innerHTML = `
                <img src="../${project.image}" alt="${project.title}" class="project-image">
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="tech-stack">
                        ${project.tech.map(tech => `
                            <span class="tech-badge">${tech}</span>
                        `).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.demo}" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                        <a href="${project.github}" target="_blank">
                            <i class="fab fa-github"></i> GitHub
                        </a>
                    </div>
                </div>
            `;
            
            // Add click event for case study view
            projectCard.addEventListener('click', () => showProjectDetail(project));
            projectsGrid.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Show project detail/case study
function showProjectDetail(project) {
    const detailView = document.querySelector('.project-detail');
    const caseStudy = detailView.querySelector('.case-study');
    
    caseStudy.innerHTML = `
        <section>
            <h2>Overview</h2>
            <p>${project.description}</p>
        </section>
        <section>
            <h2>Problem</h2>
            <p>${project.problem}</p>
        </section>
        <section>
            <h2>Solution</h2>
            <p>${project.solution}</p>
        </section>
        <section>
            <h2>Technologies Used</h2>
            <div class="tech-stack">
                ${project.tech.map(tech => `
                    <span class="tech-badge">${tech}</span>
                `).join('')}
            </div>
        </section>
        <section>
            <h2>Links</h2>
            <div class="project-links">
                <a href="${project.demo}" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>
                <a href="${project.github}" target="_blank">
                    <i class="fab fa-github"></i> GitHub
                </a>
            </div>
        </section>
    `;
    
    detailView.classList.add('active');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await includeHTML();
    loadProjects();

    // Handle back button
    document.querySelector('.back-button').addEventListener('click', () => {
        document.querySelector('.project-detail').classList.remove('active');
    });
});

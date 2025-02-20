const ProjectsController = {
    init: async function() {
        const data = await utils.contentUtils.load();
        if (!data) return;

        this.renderProjects(data.projects);
        this.initEventListeners();
    },

    renderProjects: function(projects) {
        utils.contentUtils.renderList('.projects-grid', projects, project => {
            const card = utils.createElement('div', 'project-card', {
                innerHTML: `
                    <img src="${utils.formatImagePath(project.image)}" alt="${project.title}" class="project-image">
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="tech-stack">
                            ${project.tech.map(tech => 
                                `<span class="tech-badge">${tech}</span>`
                            ).join('')}
                        </div>
                        <div class="project-links">
                            <a href="${project.demo}" target="_blank" rel="noopener">
                                <i class="fas fa-external-link-alt"></i> Live Demo
                            </a>
                            <a href="${project.github}" target="_blank" rel="noopener">
                                <i class="fab fa-github"></i> GitHub
                            </a>
                        </div>
                    </div>
                `
            });

            card.addEventListener('click', () => this.showProjectDetail(project));
            return utils.animationUtils.addPageTransition(card);
        });
    },

    showProjectDetail: function(project) {
        const detailView = document.querySelector('.project-detail');
        if (!detailView) return;

        const caseStudy = detailView.querySelector('.case-study');
        if (!caseStudy) return;

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
                    ${project.tech.map(tech => 
                        `<span class="tech-badge">${tech}</span>`
                    ).join('')}
                </div>
            </section>
            <section>
                <h2>Links</h2>
                <div class="project-links">
                    <a href="${project.demo}" target="_blank" rel="noopener">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>
                    <a href="${project.github}" target="_blank" rel="noopener">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                </div>
            </section>
        `;

        utils.animationUtils.fadeIn(detailView);
        detailView.classList.add('active');
    },

    initEventListeners: function() {
        const backButton = document.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                const detailView = document.querySelector('.project-detail');
                if (detailView) {
                    utils.animationUtils.fadeOut(detailView);
                    detailView.classList.remove('active');
                }
            });
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await includeHTML();
    ProjectsController.init();
});

const AboutController = {
    init: async function() {
        const data = await utils.contentUtils.load();
        if (!data) return;

        this.renderBio(data.about);
        this.renderTimeline(data.about.timeline);
        this.renderLists(data.about);
    },

    renderBio: function(about) {
        utils.contentUtils.setElementText('.bio-text', about.bio, 
            'Bio content unavailable');
    },

    renderTimeline: function(timeline) {
        utils.contentUtils.renderList('.timeline', timeline, item => {
            const timelineItem = utils.createElement('div', 'timeline-item', {
                innerHTML: `
                    <div class="timeline-content">
                        <div class="timeline-year">${item.year}</div>
                        <h3 class="timeline-title">${item.title}</h3>
                        <div class="timeline-company">${item.company}</div>
                        <p>${item.description}</p>
                    </div>
                `
            });
            return utils.animationUtils.addPageTransition(timelineItem);
        });
    },

    renderLists: function(about) {
        // Render hobbies
        utils.contentUtils.renderList('.hobbies-list', about.hobbies, hobby => 
            utils.createElement('li', '', {
                innerHTML: `<i class="fas fa-chevron-right"></i>${hobby}`
            })
        );

        // Render learning items
        utils.contentUtils.renderList('.learning-list', about.learning, item =>
            utils.createElement('li', '', {
                innerHTML: `<i class="fas fa-graduation-cap"></i>${item}`
            })
        );

        // Render fun facts
        utils.contentUtils.renderList('.fun-facts-list', about.funFacts, fact =>
            utils.createElement('li', '', {
                text: fact
            })
        );
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await includeHTML();
    AboutController.init();
});

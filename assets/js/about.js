async function loadAboutContent() {
    try {
        const response = await fetch(utils.getContentPath());
        const data = await response.json();
        
        // Load Bio
        document.querySelector('.bio-text').textContent = data.about.bio;
        
        // Load Timeline
        const timeline = document.querySelector('.timeline');
        data.about.timeline.forEach(item => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item page-transition';
            
            timelineItem.innerHTML = `
                <div class="timeline-content">
                    <div class="timeline-year">${item.year}</div>
                    <h3 class="timeline-title">${item.title}</h3>
                    <div class="timeline-company">${item.company}</div>
                    <p>${item.description}</p>
                </div>
            `;
            
            timeline.appendChild(timelineItem);
        });
        
        // Load Hobbies
        const hobbiesList = document.querySelector('.hobbies-list');
        data.about.hobbies.forEach(hobby => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-chevron-right"></i>${hobby}`;
            hobbiesList.appendChild(li);
        });
        
        // Load Learning Items
        const learningList = document.querySelector('.learning-list');
        data.about.learning.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-graduation-cap"></i>${item}`;
            learningList.appendChild(li);
        });
        
        // Load Fun Facts
        const funFactsList = document.querySelector('.fun-facts-list');
        data.about.funFacts.forEach(fact => {
            const li = document.createElement('li');
            li.textContent = fact;
            funFactsList.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading about content:', error);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await includeHTML();
    loadAboutContent();
});

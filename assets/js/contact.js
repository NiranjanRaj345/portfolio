// Load contact information and social links
async function loadContactInfo() {
    try {
        const response = await fetch('../assets/data/content.json');
        const data = await response.json();
        
        // Load social links
        const connectGrid = document.querySelector('.connect-grid');
        Object.entries(data.contact.socialMedia).forEach(([platform, url]) => {
            const connectItem = document.createElement('a');
            connectItem.href = url;
            connectItem.target = '_blank';
            connectItem.className = 'connect-item';
            
            connectItem.innerHTML = `
                <i class="fab fa-${platform.toLowerCase()} connect-icon"></i>
                <div class="connect-label">${platform}</div>
            `;
            
            connectGrid.appendChild(connectItem);
        });

        // Generate QR Code (using LinkedIn URL as an example)
        new QRCode(document.getElementById("qrCode"), {
            text: data.contact.socialMedia.linkedin,
            width: 180,
            height: 180,
            colorDark: "#007bff",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Set up email template button
        document.getElementById('emailTemplateBtn').href = `mailto:${data.contact.email}?subject=Let's Connect&body=Hi ${data.hero.name},%0D%0A%0D%0AI came across your portfolio and would love to connect!%0D%0A%0D%0ABest regards,%0D%0A[Your Name]`;
    } catch (error) {
        console.error('Error loading contact information:', error);
    }
}

// Form validation and submission
function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true;

    // Reset error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });

    // Validate name
    if (!name.value.trim()) {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }

    // Validate message
    if (!message.value.trim()) {
        document.getElementById('messageError').style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        // In a real application, you would send this data to a server
        alert('Thank you for your message! I will get back to you soon.');
        event.target.reset();
    }

    return false;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await includeHTML();
    loadContactInfo();
});

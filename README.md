# Modern Portfolio Website

A modern, interactive, and easy-to-maintain personal portfolio website featuring dynamic content loading, smooth animations, and a responsive design.

## 🌟 Features

### 🎯 Core Features
- **Dynamic Content Loading** - All content is loaded from a single JSON file for easy updates
- **Responsive Design** - Fully responsive on all devices
- **Modern UI/UX** - Clean, minimalist design with smooth animations
- **Interactive Elements** - Engaging user interactions throughout

### 📱 Page-Specific Features

#### 🏠 Homepage
- Glassmorphism navbar with scroll behavior
- Interactive Particles.js background
- Typing animation for tagline
- Social media integration

#### 💼 Projects
- Grid layout with hover effects
- Case study format (Problem → Solution → Tech Used → Demo)
- Live demo & GitHub links
- Tech stack badges

#### 🎯 Skills & Certifications
- Flip cards with proficiency levels
- Animated progress bars
- Category filtering system
- Certification showcase

#### 👤 About
- Interactive career timeline
- "Beyond Code" section
- Currently learning section
- Fun facts display

#### 📞 Contact
- Validated contact form
- Social media integration
- QR code for easy connection
- Custom email template

## 🗂️ Directory Structure

```
portfolio/
│── assets/           # Static assets
│   ├── css/          # Stylesheets
│   │   ├── styles.css       # Main styles
│   │   ├── animations.css   # Animation definitions
│   ├── js/           # JavaScript files
│   │   ├── main.js          # Core functionality
│   │   ├── particles-config.json # Particles.js config
│   ├── data/         # JSON data
│   │   ├── content.json     # All website content
│   ├── images/       # Image assets
│── pages/            # HTML pages
│   ├── projects.html # Projects showcase
│   ├── skills.html   # Skills & certifications
│   ├── about.html    # About section
│   ├── contact.html  # Contact form
│── index.html        # Main landing page
│── README.md         # Project documentation
```

## 🚀 Setup & Usage

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Customize the content:
   - Edit `assets/data/content.json` to update website content
   - Replace images in `assets/images/` with your own
   - Modify color schemes in `assets/css/styles.css` if desired

3. Launch the website:
   - Open `index.html` in a web browser
   - Or use a local server for better performance:
     ```bash
     npx serve
     ```

## 🛠️ Technology Stack

- **HTML5** - Semantic structure
- **CSS3**
  - Custom properties for theming
  - Flexbox & Grid for layouts
  - Animations & transitions
  - Media queries for responsiveness
- **JavaScript**
  - ES6+ features
  - Async/await for data fetching
  - DOM manipulation
  - Event handling
- **Libraries**
  - Particles.js for background effects
  - QRCode.js for QR code generation
  - Font Awesome for icons

## 💡 Customization

1. **Content Updates**
   - All website content is stored in `assets/data/content.json`
   - Edit this file to update text, links, and information
   - Changes reflect immediately without touching HTML

2. **Styling**
   - Main color scheme in `:root` variables (styles.css)
   - Animation timings in animations.css
   - Responsive breakpoints in media queries

3. **Features**
   - Particles effect customizable via particles-config.json
   - Form handling can be connected to a backend
   - Social media links easily configurable in content.json

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints at 768px and 480px
- Flexible grid layouts
- Adaptive typography
- Touch-friendly interactions

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

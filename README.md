# Aligned Arc Landing Page

A modern, responsive landing page for Aligned Arc consulting business. Built with pure HTML, CSS, and JavaScript for optimal GitHub Pages compatibility.

**Live Site:** [alignedarc.com](https://alignedarc.com)

## Features

- **Story stack animations**: Scroll-based reveals and interactive toggles
- **Fully Responsive**: Mobile-first design that works beautifully on all devices
- **SEO Optimized**: Complete meta tags, Open Graph, Twitter Cards, structured data
- **PWA Ready**: Progressive Web App manifest for app-like experience
- **Accessible**: WCAG 2.1 AA compliant with keyboard navigation support
- **Fast Loading**: Optimized performance with lazy loading and efficient code
- **Formspree Integration**: Contact form with validation and user feedback

## Tech Stack

- **HTML5**: Semantic markup with proper heading hierarchy
- **CSS3**: Custom properties, Grid, Flexbox, smooth animations
- **Vanilla JavaScript**: No frameworks, pure JS for best performance
- **GitHub Pages**: Static hosting with custom domain support

## Brand Guidelines

### Colors
- **Yellow/Gold** (#D09FA6): Primary brand color, CTAs, energy
- **Charcoal** (#303030): Text, authority, structure
- **Light Gray** (#DFDEDA): Backgrounds, subtle sections
- **Pink/Flesh** (#FDDFF1): Warmth, humanity accents
- **Cyan/Teal** (#03A791): Clarity, trust, secondary actions

### Typography
- **Founders Grotesk** (Sans-serif): Body text, navigation, functional copy
- **Cormorant Garamond** (Serif): Headlines, section titles, display moments

## Project Structure

```
/alignedarc/
├── index.html                 # Main landing page
├── robots.txt                 # SEO crawler directives
├── sitemap.xml                # Site structure for search engines
├── manifest.json              # PWA manifest
├── README.md                  # This file
├── css/
│   ├── reset.css             # CSS reset for cross-browser consistency
│   ├── variables.css         # Brand colors, typography, spacing tokens
│   ├── typography.css        # Font imports and text styles
│   ├── layout.css            # Grid systems, containers, utilities
│   ├── components.css        # Buttons, cards, navigation, forms
│   ├── sections.css          # Section-specific styles (hero, services, etc.)
│   └── responsive.css        # Media queries and breakpoints
├── js/
│   ├── navigation.js         # Mobile menu, sticky nav, smooth scroll
│   ├── story-animations.js   # Story stack reveals and toggle
│   ├── accordion.js          # Process section accordion
│   ├── impact-carousel.js    # Results carousel
│   ├── services-tabs.js      # Services tab switching
│   ├── services-carousel.js  # Services carousel sizing/auto-rotation
│   └── form-handler.js       # Formspree integration and validation
├── assets/
│   ├── images/               # Logo, hero image, service images
│   ├── fonts/                # Custom fonts (to be added)
│   └── icons/                # Favicons, PWA icons (to be added)
└── design-ideas/             # Brand guidelines and reference materials
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/alignedarc.git
cd alignedarc
```

### 2. Test Locally

You can test the site locally using any local server:

**Using Python 3:**
```bash
python -m http.server 8000
```

**Using Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Using Node.js (npx):**
```bash
npx http-server
```

**Using VS Code:**
Install "Live Server" extension and click "Go Live" in the status bar.

Then open `http://localhost:8000` in your browser.

### 5. Update Meta Tags

Before deploying, update the following in `index.html`:

## TODOs

### Image Optimization

1. **Compress images** before adding to `/assets/images/`:
   - Use tools like [TinyPNG](https://tinypng.com) or [Squoosh](https://squoosh.app)
   - Target: <100KB for hero image, <50KB for service cards
   - Use WebP format with JPG fallback for best results

2. **Lazy loading** is already enabled in HTML:
   ```html
   <img src="image.jpg" loading="lazy" alt="Description">
   ```

3. **JS Minifcation**

4. **Google Analytics** or Plausible tracking code

5. **Configure Formspree** by updating the form action in `index.html`:
   ```html
   <form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

   Replace `YOUR_FORM_ID` with your actual Formspree form ID.

## Maintenance

1. Update meta tags in index.html when updating domain name
2. Update image, font assets
3. When adding new pages, update `sitemap.xml`:
```xml
<url>
  <loc>https://alignedarc.com/new-page</loc>
  <lastmod>2025-XX-XX</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

## Support

For questions or issues:
- **Email**: sunidhi@alignedarc.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/alignedarc/issues)

## License

© 2025 Aligned Arc. All rights reserved.

---

**Built with care by the Aligned Arc team**

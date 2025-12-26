# Aligned Arc Landing Page

A modern, responsive landing page for Aligned Arc consulting business. Built with pure HTML, CSS, and JavaScript for optimal GitHub Pages compatibility.

**Live Site:** [alignedarc.com](https://alignedarc.com)

## Features

- **Signature Hero Scroll Effect**: Smooth zoom-out animation with tagline reveal
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
│   ├── hero-scroll.js        # Signature hero zoom effect
│   ├── navigation.js         # Mobile menu, sticky nav, smooth scroll
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

### 2. Add Required Assets

Before deploying, you need to add the following assets:

#### Fonts (Priority: High)
Add font files to `/assets/fonts/` and uncomment the `@font-face` declarations in `css/typography.css`:

- **Founders Grotesk**: Regular (400), Medium (500), Semibold (600)
- **Cormorant Garamond**: Regular (400), Medium (500), Semibold (600), Italic

#### Images (Priority: High)
Add to `/assets/images/`:

- `hero-image.jpg` - Main hero section background
- `service-strategic.jpg` - Strategic Facilitation service card
- `service-strengths.jpg` - Strengths-Based Team Work card
- `service-integrated.jpg` - Integrated Alignment Program card
- `founder.jpg` - Photo for About section
- `logo.svg` - Full horizontal logo
- `logo-icon.svg` - Icon-only version

#### Icons & Favicons (Priority: Medium)
Add to `/assets/icons/`:

- `favicon.svg` - Vector favicon (scalable)
- `favicon-32x32.png` - Standard browser favicon
- `favicon-16x16.png` - Small browser favicon
- `apple-touch-icon.png` (180x180) - iOS home screen
- `icon-192x192.png` - PWA icon for Android
- `icon-512x512.png` - PWA icon for Android splash screen

#### Social Media Images (Priority: Medium)
Add to `/assets/images/`:

- `og-image.jpg` (1200x630) - Open Graph for Facebook/LinkedIn
- `twitter-image.jpg` (1200x600) - Twitter card image

### 3. Configure Formspree

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form and get your form endpoint
3. Update the form action in `index.html` (line ~XXX):

```html
<form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

Replace `YOUR_FORM_ID` with your actual Formspree form ID.

**Formspree Settings:**
- Email notifications to: `sunidhi@alignedarc.com`
- Enable reCAPTCHA (optional, for spam protection)
- Configure custom thank you message (optional)
- Set up autoresponder (optional)

### 4. Test Locally

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

- **Domain**: Replace `https://alignedarc.com/` with your actual domain if different
- **Social Images**: Ensure og-image.jpg and twitter-image.jpg are created and paths are correct
- **Analytics**: Add Google Analytics or Plausible tracking code if desired (optional)

## Deployment to GitHub Pages

### Option 1: Deploy from Main Branch

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit: Aligned Arc landing page"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Source", select **main** branch
   - Select **/ (root)** folder
   - Click **Save**

3. **Wait for deployment:**
   - GitHub will build and deploy your site (usually takes 1-2 minutes)
   - Your site will be available at: `https://yourusername.github.io/alignedarc/`

### Option 2: Custom Domain

1. **Add CNAME file:**
   Create a file named `CNAME` in the root directory with your domain:
   ```
   alignedarc.com
   ```

2. **Configure DNS:**
   Add the following DNS records at your domain registrar:

   **For apex domain (alignedarc.com):**
   ```
   Type: A
   Host: @
   Value: 185.199.108.153

   Type: A
   Host: @
   Value: 185.199.109.153

   Type: A
   Host: @
   Value: 185.199.110.153

   Type: A
   Host: @
   Value: 185.199.111.153
   ```

   **For www subdomain:**
   ```
   Type: CNAME
   Host: www
   Value: yourusername.github.io
   ```

3. **Enable custom domain in GitHub:**
   - Go to **Settings** → **Pages**
   - Under "Custom domain", enter: `alignedarc.com`
   - Check "Enforce HTTPS" (wait for SSL certificate to provision)

4. **Wait for DNS propagation** (can take 24-48 hours)

## Performance Optimization

### Image Optimization

1. **Compress images** before adding to `/assets/images/`:
   - Use tools like [TinyPNG](https://tinypng.com) or [Squoosh](https://squoosh.app)
   - Target: <100KB for hero image, <50KB for service cards
   - Use WebP format with JPG fallback for best results

2. **Lazy loading** is already enabled in HTML:
   ```html
   <img src="image.jpg" loading="lazy" alt="Description">
   ```

### CSS/JS Minification (Optional)

For production, consider minifying CSS and JS files:

**Using online tools:**
- CSS: [cssnano](https://cssnano.co/playground/)
- JS: [JavaScript Minifier](https://javascript-minifier.com)

**Using build tools (advanced):**
```bash
# Install terser for JS minification
npm install -g terser

# Minify JavaScript
terser js/hero-scroll.js -o js/hero-scroll.min.js -c -m

# Update script tags in index.html to use .min.js versions
```

## Testing

### Browser Testing
Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

### Performance Testing
Run Lighthouse audits in Chrome DevTools:

**Target Scores:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Accessibility Testing
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Screen reader compatibility (NVDA, JAWS, VoiceOver)
- ✅ Color contrast (WCAG AA compliance)
- ✅ Focus indicators visible

### Form Testing
1. Test contact form with valid data
2. Test validation (empty fields, invalid email)
3. Verify email arrives at sunidhi@alignedarc.com
4. Test on mobile devices

## Maintenance

### Update Content
- **Services**: Edit service cards in `index.html` (lines ~XXX-XXX)
- **Testimonials**: Update testimonial section (lines ~XXX-XXX)
- **Contact Email**: Update in footer and Formspree settings

### Update Sitemap
When adding new pages, update `sitemap.xml`:
```xml
<url>
  <loc>https://alignedarc.com/new-page</loc>
  <lastmod>2025-XX-XX</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### Monitor Analytics
- Track form submissions
- Monitor bounce rate and page views
- Check for 404 errors in Google Search Console

## Troubleshooting

### Hero scroll effect not working
- Check browser console for JavaScript errors
- Verify element IDs match in HTML and JavaScript
- Ensure scripts are loaded at bottom of `<body>`

### Form not submitting
- Verify Formspree form ID is correct in index.html
- Check browser console for CORS errors
- Test form endpoint directly: `https://formspree.io/f/YOUR_FORM_ID`

### Images not loading on GitHub Pages
- Ensure image paths are relative (not absolute)
- Verify images are committed to repository
- Check file extensions match exactly (case-sensitive on Linux)

### Fonts not loading
- Verify @font-face declarations are uncommented in typography.css
- Check font file paths are correct
- Ensure font files are committed to repository
- Test font loading with browser DevTools Network tab

## Support

For questions or issues:
- **Email**: sunidhi@alignedarc.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/alignedarc/issues)

## License

© 2025 Aligned Arc. All rights reserved.

---

**Built with care by the Aligned Arc team**

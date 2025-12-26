/* ===================================
   HERO SCROLL EFFECT - Aligned Arc
   Image grows from 60% to 100% width as you scroll
   =================================== */

(function() {
  'use strict';

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If reduced motion is preferred, exit early
  if (prefersReducedMotion) {
    return;
  }

  // Get DOM elements
  const heroImage = document.getElementById('hero-image');
  const heroImageWrapper = document.getElementById('hero-image-wrapper');
  const hero = document.querySelector('.hero');

  // Exit if elements don't exist
  if (!heroImage || !heroImageWrapper || !hero) {
    return;
  }

  // Configuration
  const WIDTH_START = 80;   // Starting width percentage
  const WIDTH_END = 100;    // Ending width percentage
  const HEIGHT_START = 35;  // Starting height (vh)
  const HEIGHT_END = 100;   // Ending height (vh)
  const RADIUS_START = 60;  // Starting border radius (px)
  const RADIUS_END = 0;     // Ending border radius (px)

  // Responsive scroll distance
  const isMobile = window.innerWidth <= 768;
  const SCROLL_DISTANCE = isMobile ? 400 : 600; // Pixels to scroll for full effect

  let ticking = false;

  // Store the wrapper's initial offset from top (when it becomes sticky)
  let stickyStartOffset = null;

  /**
   * Calculate scroll progress (0 to 1)
   * Animation starts when wrapper becomes sticky (reaches top of viewport)
   * @returns {number} Progress value between 0 and 1
   */
  function getScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Calculate offset where wrapper becomes sticky (first time only)
    if (stickyStartOffset === null) {
      const wrapperRect = heroImageWrapper.getBoundingClientRect();
      stickyStartOffset = scrollTop + wrapperRect.top;
    }

    // Animation only starts when wrapper reaches top (becomes sticky)
    if (scrollTop < stickyStartOffset) {
      return 0;
    }

    // Calculate progress from when wrapper becomes sticky
    const scrollFromSticky = scrollTop - stickyStartOffset;
    const progress = Math.min(scrollFromSticky / SCROLL_DISTANCE, 1);
    return progress;
  }

  /**
   * Easing function for smooth animation
   * @param {number} t - Progress value (0 to 1)
   * @returns {number} Eased value
   */
  function easeOutQuad(t) {
    return 1 - Math.pow(1 - t, 2);
  }

  /**
   * Apply scroll effects to hero elements
   */
  function updateHeroEffect() {
    const progress = getScrollProgress();
    const easedProgress = easeOutQuad(progress);

    // Calculate width (60% → 100%)
    const width = WIDTH_START + ((WIDTH_END - WIDTH_START) * easedProgress);

    // Calculate height (60vh → 100vh)
    const height = HEIGHT_START + ((HEIGHT_END - HEIGHT_START) * easedProgress);

    // Calculate border radius (24px → 0px)
    const radius = RADIUS_START - ((RADIUS_START - RADIUS_END) * easedProgress);

    // Apply styles to hero image
    heroImage.style.width = `${width}%`;
    heroImage.style.height = `${height}vh`;
    heroImage.style.borderRadius = `${radius}vh`;

    ticking = false;
  }

  /**
   * Request animation frame for smooth 60fps
   */
  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeroEffect);
      ticking = true;
    }
  }

  /**
   * Scroll event handler
   */
  function onScroll() {
    requestTick();
  }

  /**
   * Reset sticky offset on resize
   */
  function onResize() {
    stickyStartOffset = null;
    requestTick();
  }

  /**
   * Initialize scroll listener
   */
  function init() {
    // Set initial state
    updateHeroEffect();

    // Listen for scroll events
    window.addEventListener('scroll', onScroll, { passive: true });

    // Listen for resize events to recalculate sticky offset
    window.addEventListener('resize', onResize, { passive: true });

    // Optional: Use IntersectionObserver to optimize performance
    // Only run scroll effect when hero is in viewport
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            window.addEventListener('scroll', onScroll, { passive: true });
          } else {
            // Hero is out of view, remove listener to save performance
            window.removeEventListener('scroll', onScroll);
          }
        });
      }, {
        rootMargin: '100px' // Trigger slightly before/after hero is visible
      });

      observer.observe(hero);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

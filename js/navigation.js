/* ===================================
   NAVIGATION - Aligned Arc
   Mobile menu toggle, sticky nav, smooth scroll
   =================================== */

(function() {
  'use strict';

  // Get DOM elements
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.querySelector('.nav__menu');
  const navLinks = document.querySelectorAll('.nav__menu a');

  /**
   * Toggle mobile menu
   */
  function toggleMenu() {
    if (!navToggle || !navMenu) return;

    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Update ARIA attributes for accessibility
    const isExpanded = navToggle.classList.contains('active');
    navToggle.setAttribute('aria-expanded', isExpanded);

    // Prevent body scroll when menu is open
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * Close mobile menu
   */
  function closeMenu() {
    if (!navToggle || !navMenu) return;

    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /**
   * Handle sticky navigation on scroll
   */
  let lastScroll = 0;
  function handleStickyNav() {
    if (!nav) return;

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Add 'scrolled' class when scrolled down
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }

  /**
   * Smooth scroll to section
   * @param {string} targetId - ID of the target section
   */
  function smoothScrollTo(targetId) {
    const targetElement = document.querySelector(targetId);

    if (!targetElement) return;

    // Get navigation height for offset
    const navHeight = nav ? nav.offsetHeight : 0;
    const targetPosition = targetElement.offsetTop - navHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  /**
   * Handle navigation link clicks
   * @param {Event} e - Click event
   */
  function handleNavLinkClick(e) {
    const href = e.currentTarget.getAttribute('href');

    // Only handle internal links (starting with #)
    if (href && href.startsWith('#')) {
      e.preventDefault();

      // Close mobile menu if open
      closeMenu();

      // Smooth scroll to section
      smoothScrollTo(href);

      // Update URL without jumping
      if (history.pushState) {
        history.pushState(null, null, href);
      }
    }
  }

  /**
   * Set active navigation link based on scroll position
   */
  function setActiveNavLink() {
    if (!navLinks.length) return;

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const navHeight = nav ? nav.offsetHeight : 0;

    // Get all sections with IDs
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
      const sectionTop = section.offsetTop - navHeight - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');

      // Check if current scroll position is within section
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        // Remove active class from all links
        navLinks.forEach(link => {
          link.classList.remove('active');
        });

        // Add active class to current section link
        const activeLink = document.querySelector(`.nav__menu a[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }

  /**
   * Handle escape key to close mobile menu
   * @param {KeyboardEvent} e - Keyboard event
   */
  function handleEscapeKey(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      closeMenu();
    }
  }

  /**
   * Initialize navigation functionality
   */
  function init() {
    // Mobile menu toggle
    if (navToggle) {
      navToggle.addEventListener('click', toggleMenu);
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Toggle navigation menu');
    }

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', handleNavLinkClick);
    });

    // Sticky navigation on scroll
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          handleStickyNav();
          setActiveNavLink();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    // Close menu on escape key
    document.addEventListener('keydown', handleEscapeKey);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu && navToggle) {
        const isClickInsideNav = nav.contains(e.target);
        const isMenuOpen = navMenu.classList.contains('active');

        if (!isClickInsideNav && isMenuOpen) {
          closeMenu();
        }
      }
    });

    // Close menu on window resize if viewport gets larger
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
          closeMenu();
        }
      }, 250);
    });

    // Set initial state
    handleStickyNav();
    setActiveNavLink();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

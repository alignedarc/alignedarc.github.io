/**
 * Goa & Premium Packages — Page Interactions
 * - Scroll reveal with stagger
 * - Quick guide smooth-scroll navigation
 */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===================================
     1. SCROLL REVEAL ANIMATIONS
     =================================== */

  var revealElements = document.querySelectorAll('.goa-reveal');

  if (prefersReducedMotion) {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ===================================
     2. QUICK GUIDE SMOOTH-SCROLL
     =================================== */

  var guideItems = document.querySelectorAll('[data-guide-target]');

  guideItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = item.getAttribute('data-guide-target');
      var targetSection = document.getElementById(targetId);

      if (!targetSection) return;

      var offset = 100;
      var top = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });

})();

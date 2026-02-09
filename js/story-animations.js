/* ===================================
   STORY SECTIONS - Scroll Animations
   Handles reveal, parallax, and toggle
   =================================== */

(function() {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If reduced motion, make everything visible immediately and bail
  if (prefersReducedMotion) {
    document.addEventListener('DOMContentLoaded', function() {
      var els = document.querySelectorAll('.story-reveal');
      for (var i = 0; i < els.length; i++) {
        els[i].classList.add('is-visible');
      }
    });
    return;
  }

  /* ----- Scroll Reveal Observer ----- */
  function createRevealObserver(selector, options) {
    var defaults = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };
    var opts = Object.assign({}, defaults, options);

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: opts.threshold, rootMargin: opts.rootMargin });

    var targets = document.querySelectorAll(selector);
    for (var i = 0; i < targets.length; i++) {
      observer.observe(targets[i]);
    }
  }

  /* ----- Late Reveal (when card is fully in view) ----- */
  function initLateReveal() {
    createRevealObserver('.story-reveal--late', {
      threshold: 0.45,
      rootMargin: '0px 0px -10% 0px'
    });
  }

  /* ----- Section 2: Parallax Drift ----- */
  function initParallax() {
    var section = document.querySelector('.story-mismatch');
    if (!section) return;

    var cardBuilder = section.querySelector('.story-mismatch__persona--builder');
    var cardDriver  = section.querySelector('.story-mismatch__persona--driver');
    if (!cardBuilder || !cardDriver) return;

    // Only enable parallax on desktop
    if (window.innerWidth < 768) return;

    var isInView = false;
    var ticking  = false;

    var io = new IntersectionObserver(function(entries) {
      isInView = entries[0].isIntersecting;
    }, { rootMargin: '100px' });
    io.observe(section);

    function onScroll() {
      if (!isInView || ticking) return;
      ticking = true;
      requestAnimationFrame(function() {
        var rect = section.getBoundingClientRect();
        var vh   = window.innerHeight;
        // progress: 0 when section enters from bottom, 1 when top hits top
        var progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
        var range = window.innerWidth >= 1024 ? 30 : 15; // tablet = smaller range
        var drift = (progress - 0.5) * range;

        cardBuilder.style.transform = 'translateX(' + (-drift) + 'px)';
        cardDriver.style.transform  = 'translateX(' + drift + 'px)';
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----- Section 5: Transformation Toggle ----- */
  function initTransformToggle() {
    var btn = document.getElementById('transform-toggle');
    if (!btn) return;

    var section = document.querySelector('.story-transform');
    var vals = document.querySelectorAll('.story-transform__metric-value');
    var autoToggled = false;
    var userInteracted = false;
    var autoTimer = null;

    // [before label, after label]
    var data = [
      ['2 hrs', '45 min'],
      ['5 days', '1 day'],
      ['8 / mo', '1-2 / mo']
    ];

    function setToggle(next) {
      btn.setAttribute('aria-checked', String(next));
      if (section) section.classList.toggle('is-fit', next);
      for (var i = 0; i < vals.length; i++) {
        vals[i].textContent = next ? data[i][1] : data[i][0];
      }
    }

    btn.addEventListener('click', function() {
      userInteracted = true;
      if (autoTimer) {
        clearTimeout(autoTimer);
        autoTimer = null;
      }

      var isChecked = btn.getAttribute('aria-checked') === 'true';
      setToggle(!isChecked);
    });

    if (section && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        var entry = entries[0];
        if (entry.isIntersecting && !autoToggled && !userInteracted) {
          autoTimer = setTimeout(function() {
            if (autoToggled || userInteracted) return;
            setToggle(true);
            autoToggled = true;
            autoTimer = null;
          }, 700);
        } else if (!entry.isIntersecting && autoTimer) {
          clearTimeout(autoTimer);
          autoTimer = null;
        }
      }, { threshold: 0.4, rootMargin: '0px 0px -10% 0px' });

      observer.observe(section);
    }
  }

  /* ----- Init ----- */
  function init() {
    createRevealObserver('.story-reveal:not(.story-reveal--late)');
    initLateReveal();
    initParallax();
    initTransformToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

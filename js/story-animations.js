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
      // Also reveal method steps + principle
      var methodSteps = document.querySelectorAll('[data-method-step]');
      for (var j = 0; j < methodSteps.length; j++) {
        methodSteps[j].classList.add('is-visible');
      }
      var principle = document.querySelector('.about__method-principle');
      if (principle) principle.classList.add('is-visible');
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

  /* ----- Section 6: CTA Process Path ----- */
  function initCtaPathAnimation() {
    var section = document.querySelector('.story-stack__card--cta');
    if (!section) return;

    var sequence = ['before', 'during', 'after'];
    var stops = [0.1, 0.5, 0.83];
    var dots = section.querySelectorAll('.story-cta__checkpoint');
    var cards = section.querySelectorAll('.story-cta__step[data-step-card]');
    var path = section.querySelector('.story-cta__path-line');
    var traveler = section.querySelector('.story-cta__traveler');
    if (!dots.length || !cards.length || !traveler) return;

    var current = 0;
    var target = 1;
    var phase = 'move';
    var moveProgress = 0;
    var holdElapsed = 0;
    var moveDuration = 1150;
    var holdDuration = 360;
    var rafId = null;
    var running = false;
    var lastTs = 0;
    var totalLength = 0;

    function alignDotsToPath() {
      if (!path || typeof path.getTotalLength !== 'function') return;
      totalLength = path.getTotalLength();
      for (var i = 0; i < sequence.length; i++) {
        var dot = section.querySelector('.story-cta__checkpoint[data-step-dot="' + sequence[i] + '"]');
        if (!dot) continue;
        var point = path.getPointAtLength(totalLength * stops[i]);
        dot.setAttribute('cx', point.x.toFixed(2));
        dot.setAttribute('cy', point.y.toFixed(2));
      }

      var startPoint = path.getPointAtLength(totalLength * stops[current]);
      traveler.setAttribute('cx', startPoint.x.toFixed(2));
      traveler.setAttribute('cy', startPoint.y.toFixed(2));
    }

    function easeInOut(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function setTravelerAt(progress) {
      if (!totalLength) return;
      var start = stops[current];
      var end = stops[target];
      var eased = easeInOut(progress);
      var dist = (start + (end - start) * eased) * totalLength;
      var point = path.getPointAtLength(dist);
      traveler.setAttribute('cx', point.x.toFixed(2));
      traveler.setAttribute('cy', point.y.toFixed(2));
    }

    function setActive(step) {
      for (var i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('is-active', dots[i].getAttribute('data-step-dot') === step);
      }

      for (var j = 0; j < cards.length; j++) {
        cards[j].classList.toggle('is-active', cards[j].getAttribute('data-step-card') === step);
      }
    }

    function stepFrame(ts) {
      if (!running) return;
      if (!lastTs) lastTs = ts;
      var delta = ts - lastTs;
      lastTs = ts;

      if (phase === 'move') {
        moveProgress += delta / moveDuration;
        if (moveProgress >= 1) {
          moveProgress = 1;
          setTravelerAt(moveProgress);
          current = target;
          target = (current + 1) % sequence.length;
          setActive(sequence[current]);
          phase = 'hold';
          holdElapsed = 0;
        } else {
          setTravelerAt(moveProgress);
        }
      } else {
        holdElapsed += delta;
        if (holdElapsed >= holdDuration) {
          phase = 'move';
          moveProgress = 0;
        }
      }

      rafId = requestAnimationFrame(stepFrame);
    }

    function start() {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(stepFrame);
    }

    function stop() {
      if (!running) return;
      running = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    alignDotsToPath();
    setActive(sequence[current]);
    setTravelerAt(0);

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        var entry = entries[0];
        if (entry.isIntersecting) {
          start();
        } else {
          stop();
        }
      }, { threshold: 0.35, rootMargin: '0px 0px -15% 0px' });
      observer.observe(section);
    } else {
      start();
    }

    var resizeTicking = false;
    window.addEventListener('resize', function() {
      if (resizeTicking) return;
      resizeTicking = true;
      requestAnimationFrame(function() {
        alignDotsToPath();
        setTravelerAt(moveProgress);
        resizeTicking = false;
      });
    });
  }

  /* ----- About Method Circle Steps ----- */
  function initMethodSteps() {
    var steps = document.querySelectorAll('[data-method-step]');
    var principle = document.querySelector('.about__method-principle');
    if (!steps.length) return;

    var stepObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // Stagger: calculate delay based on index
          var idx = Array.prototype.indexOf.call(steps, entry.target);
          var delay = idx * 200; // 200ms stagger between each step
          setTimeout(function() {
            entry.target.classList.add('is-visible');
          }, delay);
          stepObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -80px 0px' });

    for (var i = 0; i < steps.length; i++) {
      stepObserver.observe(steps[i]);
    }

    // Reveal the principle footer
    if (principle) {
      var principleObserver = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
          entries[0].target.classList.add('is-visible');
          principleObserver.unobserve(entries[0].target);
        }
      }, { threshold: 0.3, rootMargin: '0px 0px -40px 0px' });
      principleObserver.observe(principle);
    }
  }

  /* ----- Init ----- */
  function init() {
    createRevealObserver('.story-reveal:not(.story-reveal--late)');
    initLateReveal();
    initParallax();
    initTransformToggle();
    initCtaPathAnimation();
    initMethodSteps();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

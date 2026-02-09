(function () {
  'use strict';

  var trigger = document.querySelector('[data-hero-scroll]');
  if (!trigger) return;

  var reduceMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  function getOffset() {
    var rawOffset = parseInt(trigger.getAttribute('data-scroll-offset'), 10);
    return Number.isFinite(rawOffset) ? rawOffset : 0;
  }

  function getTargetTop() {
    var targetSelector = trigger.getAttribute('data-scroll-target');
    if (!targetSelector) return null;

    var target = document.querySelector(targetSelector);
    if (!target) return null;

    var top = target.getBoundingClientRect().top + window.scrollY - getOffset();
    return Math.max(0, top);
  }

  trigger.addEventListener('click', function () {
    var destination = getTargetTop();
    if (destination === null) {
      destination = window.scrollY + Math.max(window.innerHeight * 0.85, 420);
    }

    window.scrollTo({
      top: destination,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  });
})();

/**
 * Services Carousel - Workshop cards inside services canvas
 * Adds responsive sizing and auto-rotation for cards.
 */
(function() {
  'use strict';

  class ServicesCarousel {
    constructor() {
      this.carousels = Array.from(document.querySelectorAll('.services__carousel'));
      if (!this.carousels.length) return;

      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.states = this.carousels.map(carousel => this.initCarousel(carousel)).filter(Boolean);
      this.handleResize = this.handleResize.bind(this);
      window.addEventListener('resize', this.handleResize);
    }

    getCardsPerView() {
      const w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 768) return 2;
      return 1;
    }

    initCarousel(carousel) {
      const viewport = carousel.querySelector('.services__carousel-viewport');
      const track = carousel.querySelector('.services__carousel-track');
      const cards = Array.from(track.querySelectorAll('.services__workshop-card'));
      const prevBtn = carousel.querySelector('.services__carousel-btn--prev');
      const nextBtn = carousel.querySelector('.services__carousel-btn--next');

      if (!viewport || !track || !cards.length || !prevBtn || !nextBtn) return null;

      // Read the actual CSS gap so card sizing stays in sync with styles
      const computedGap = parseFloat(getComputedStyle(track).columnGap) || 24;

      const state = {
        carousel,
        viewport,
        track,
        cards,
        prevBtn,
        nextBtn,
        gap: computedGap,
        currentIndex: 0,
        cardsPerView: this.getCardsPerView(),
        isTransitioning: false,
        autoTimer: null,
      };

      this.sizeCards(state);
      this.updateButtons(state);

      prevBtn.addEventListener('click', () => {
        this.prev(state);
        this.restartAuto(state);
      });
      nextBtn.addEventListener('click', () => {
        this.next(state);
        this.restartAuto(state);
      });

      carousel.addEventListener('mouseenter', () => this.stopAuto(state));
      carousel.addEventListener('mouseleave', () => this.startAuto(state));
      carousel.addEventListener('focusin', () => this.stopAuto(state));
      carousel.addEventListener('focusout', () => this.startAuto(state));

      this.setupTouch(state);
      this.startAuto(state);

      return state;
    }

    sizeCards(state) {
      const { viewport, cards, track, gap } = state;
      state.cardsPerView = this.getCardsPerView();

      const viewportWidth = viewport.clientWidth;
      const totalGaps = (state.cardsPerView - 1) * gap;
      const cardWidth = (viewportWidth - totalGaps) / state.cardsPerView;

      cards.forEach(card => {
        card.style.width = cardWidth + 'px';
        card.style.minWidth = cardWidth + 'px';
      });

      const maxIndex = Math.max(0, cards.length - state.cardsPerView);
      if (state.currentIndex > maxIndex) {
        state.currentIndex = maxIndex;
      }

      this.updatePosition(state);
      this.updateButtons(state);
    }

    updateButtons(state) {
      const shouldDisable = state.cards.length <= state.cardsPerView;
      state.prevBtn.disabled = shouldDisable;
      state.nextBtn.disabled = shouldDisable;
    }

    updatePosition(state) {
      const { track, cards, viewport, gap } = state;
      if (!cards.length) return;

      const viewportWidth = viewport.clientWidth;
      const totalGaps = (state.cardsPerView - 1) * gap;
      const cardWidth = (viewportWidth - totalGaps) / state.cardsPerView;
      const offset = state.currentIndex * (cardWidth + gap);

      track.style.transform = `translateX(-${offset}px)`;
    }

    prev(state) {
      if (state.isTransitioning) return;
      state.isTransitioning = true;

      if (state.currentIndex <= 0) {
        state.currentIndex = Math.max(0, state.cards.length - state.cardsPerView);
      } else {
        state.currentIndex--;
      }

      this.updatePosition(state);
      setTimeout(() => { state.isTransitioning = false; }, 450);
    }

    next(state) {
      if (state.isTransitioning) return;
      state.isTransitioning = true;

      const maxIndex = Math.max(0, state.cards.length - state.cardsPerView);
      if (state.currentIndex >= maxIndex) {
        state.currentIndex = 0;
      } else {
        state.currentIndex++;
      }

      this.updatePosition(state);
      setTimeout(() => { state.isTransitioning = false; }, 450);
    }

    setupTouch(state) {
      let startX = 0;
      let startY = 0;

      state.viewport.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
        startY = e.changedTouches[0].screenY;
      }, { passive: true });

      state.viewport.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].screenX;
        const endY = e.changedTouches[0].screenY;
        const dx = startX - endX;
        const dy = Math.abs(startY - endY);

        if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
          if (dx > 0) {
            this.next(state);
          } else {
            this.prev(state);
          }
          this.restartAuto(state);
        }
      }, { passive: true });
    }

    startAuto(state) {
      const shouldAuto = !this.prefersReducedMotion.matches;
      if (!shouldAuto) return;
      if (state.cards.length <= state.cardsPerView) return;

      this.stopAuto(state);
      state.autoTimer = setInterval(() => {
        this.next(state);
      }, 3000);
    }

    stopAuto(state) {
      if (state.autoTimer) {
        clearInterval(state.autoTimer);
        state.autoTimer = null;
      }
    }

    restartAuto(state) {
      this.stopAuto(state);
      this.startAuto(state);
    }

    handleResize() {
      this.states.forEach(state => {
        this.sizeCards(state);
        this.startAuto(state);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ServicesCarousel());
  } else {
    new ServicesCarousel();
  }
})();

/**
 * Workshops Carousel - Category Lanes
 * Manages horizontally scrollable card carousels per category lane.
 */

class WorkshopsCarousel {
  constructor() {
    this.lanes = Array.from(document.querySelectorAll('.workshops__lane'));
    if (!this.lanes.length) return;

    this.carousels = this.lanes.map(lane => this.initLane(lane));
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  getCardsPerView() {
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 768) return 2;
    return 1;
  }

  initLane(lane) {
    const viewport = lane.querySelector('.workshops__lane-viewport');
    const track = lane.querySelector('.workshops__lane-track');
    const cards = Array.from(track.querySelectorAll('.workshops__card'));
    const prevBtn = lane.querySelector('.workshops__lane-prev');
    const nextBtn = lane.querySelector('.workshops__lane-next');

    const state = {
      lane,
      viewport,
      track,
      cards,
      prevBtn,
      nextBtn,
      currentIndex: 0,
      cardsPerView: this.getCardsPerView(),
      isTransitioning: false,
    };

    this.sizeCards(state);

    prevBtn.addEventListener('click', () => this.prev(state));
    nextBtn.addEventListener('click', () => this.next(state));
    this.setupTouch(state);

    return state;
  }

  sizeCards(state) {
    const { viewport, cards, track } = state;
    state.cardsPerView = this.getCardsPerView();

    // On mobile, let native scroll handle it
    if (state.cardsPerView === 1 && window.innerWidth < 768) {
      track.style.transform = '';
      const gap = 16;
      const viewportWidth = viewport.clientWidth;
      const cardWidth = viewportWidth - gap;
      cards.forEach(card => {
        card.style.width = cardWidth + 'px';
        card.style.minWidth = cardWidth + 'px';
      });
      state.currentIndex = 0;
      return;
    }

    // Calculate card width based on viewport and gap
    const gap = 16; // var(--space-md) typically 16px
    const viewportWidth = viewport.clientWidth;
    const totalGaps = (state.cardsPerView - 1) * gap;
    const cardWidth = (viewportWidth - totalGaps) / state.cardsPerView;

    cards.forEach(card => {
      card.style.width = cardWidth + 'px';
      card.style.minWidth = cardWidth + 'px';
    });

    // Clamp currentIndex
    const maxIndex = Math.max(0, cards.length - state.cardsPerView);
    if (state.currentIndex > maxIndex) {
      state.currentIndex = maxIndex;
    }

    this.updatePosition(state);
  }

  updatePosition(state) {
    const { track, cards, viewport } = state;
    if (!cards.length) return;

    const gap = 16;
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
      // Wrap to end
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
      // Wrap to start
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

      // Only act on horizontal swipes (desktop/tablet with JS nav)
      if (Math.abs(dx) > 50 && Math.abs(dx) > dy && window.innerWidth >= 768) {
        if (dx > 0) {
          this.next(state);
        } else {
          this.prev(state);
        }
      }
    }, { passive: true });
  }

  handleResize() {
    this.carousels.forEach(state => this.sizeCards(state));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new WorkshopsCarousel();
});

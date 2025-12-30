/**
 * Impact Carousel - Redesigned
 * Stack & Fade approach for perfect centering on all resolutions
 */

class ImpactCarousel {
  constructor() {
    this.carousel = document.querySelector('.impact-carousel');
    if (!this.carousel) return;

    this.track = this.carousel.querySelector('.impact-carousel__track');
    this.cards = Array.from(this.carousel.querySelectorAll('.impact-card'));
    this.prevButton = this.carousel.querySelector('.carousel-nav--prev');
    this.nextButton = this.carousel.querySelector('.carousel-nav--next');
    this.indicators = Array.from(this.carousel.querySelectorAll('.carousel-indicator'));

    this.totalCards = this.cards.length;
    this.currentIndex = 0;
    this.isTransitioning = false;

    this.init();
  }

  init() {
    // Set initial active card
    this.updateCarousel();

    // Event listeners for navigation buttons
    this.prevButton.addEventListener('click', () => this.prev());
    this.nextButton.addEventListener('click', () => this.next());

    // Event listeners for indicators
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Keyboard navigation
    this.handleKeyboard = this.handleKeyboard.bind(this);
    document.addEventListener('keydown', this.handleKeyboard);

    // Touch/swipe support
    this.setupTouchEvents();
  }

  updateCarousel(direction = null) {
    // Remove all active and slide classes
    this.cards.forEach(card => {
      card.classList.remove('active', 'slide-from-left', 'slide-from-right');
    });

    // Add slide direction class if specified
    if (direction === 'next') {
      this.cards[this.currentIndex].classList.add('slide-from-right');
    } else if (direction === 'prev') {
      this.cards[this.currentIndex].classList.add('slide-from-left');
    }

    // Activate current card (small delay for slide class to apply)
    requestAnimationFrame(() => {
      this.cards[this.currentIndex].classList.add('active');
    });

    // Update indicators
    this.indicators.forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.classList.add('active');
        indicator.setAttribute('aria-current', 'true');
      } else {
        indicator.classList.remove('active');
        indicator.removeAttribute('aria-current');
      }
    });

    // Update ARIA live region for screen readers
    this.announceSlide();
  }

  prev() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
    this.updateCarousel('prev');

    setTimeout(() => {
      this.isTransitioning = false;
    }, 600); // Match transition duration
  }

  next() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.currentIndex = (this.currentIndex + 1) % this.totalCards;
    this.updateCarousel('next');

    setTimeout(() => {
      this.isTransitioning = false;
    }, 600); // Match transition duration
  }

  goToSlide(index) {
    if (this.isTransitioning || index === this.currentIndex) return;
    this.isTransitioning = true;

    const direction = index > this.currentIndex ? 'next' : 'prev';
    this.currentIndex = index;
    this.updateCarousel(direction);

    setTimeout(() => {
      this.isTransitioning = false;
    }, 600);
  }

  handleKeyboard(e) {
    // Only respond if carousel is in viewport or focused
    if (!this.isInViewport() && !this.carousel.contains(document.activeElement)) {
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.next();
    }
  }

  setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    this.track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    this.track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);
    }, { passive: true });
  }

  handleSwipe(startX, endX, startY, endY) {
    const minSwipeDistance = 50;
    const swipeDistanceX = startX - endX;
    const swipeDistanceY = Math.abs(startY - endY);

    // Only trigger if horizontal swipe is greater than vertical (prevent scroll interference)
    if (Math.abs(swipeDistanceX) > minSwipeDistance && Math.abs(swipeDistanceX) > swipeDistanceY) {
      if (swipeDistanceX > 0) {
        // Swiped left - go to next
        this.next();
      } else {
        // Swiped right - go to prev
        this.prev();
      }
    }
  }

  isInViewport() {
    const rect = this.carousel.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  announceSlide() {
    // Create or update ARIA live region for accessibility
    let liveRegion = document.getElementById('carousel-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'carousel-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      this.carousel.appendChild(liveRegion);
    }

    const cardTitle = this.cards[this.currentIndex].querySelector('.impact-card__title').textContent;
    liveRegion.textContent = `Slide ${this.currentIndex + 1} of ${this.totalCards}: ${cardTitle}`;
  }

  destroy() {
    // Cleanup for SPA scenarios
    document.removeEventListener('keydown', this.handleKeyboard);
  }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ImpactCarousel();
});

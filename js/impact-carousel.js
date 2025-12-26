/**
 * Impact Carousel
 * Handles the carousel functionality for impact cards with blur effects
 */

class ImpactCarousel {
  constructor() {
    this.carousel = document.querySelector('.impact-carousel');
    if (!this.carousel) return;

    this.track = this.carousel.querySelector('.impact-carousel__track');
    this.originalCards = Array.from(this.carousel.querySelectorAll('.impact-card'));
    this.prevButton = this.carousel.querySelector('.carousel-nav--prev');
    this.nextButton = this.carousel.querySelector('.carousel-nav--next');
    this.indicators = Array.from(this.carousel.querySelectorAll('.carousel-indicator'));

    this.totalCards = this.originalCards.length;
    this.currentIndex = 1; // Start at first card (1 clone before it)
    this.cardWidth = 600; // Default card width
    this.gap = 32; // Default gap (var(--space-xl))
    this.isTransitioning = false;

    this.init();
  }

  init() {
    // Clone first and last cards for infinite effect
    this.cloneCards();

    // Get all cards including clones
    this.cards = Array.from(this.track.querySelectorAll('.impact-card'));

    // Set initial active state
    this.updateCarousel(false);

    // Event listeners for navigation buttons
    this.prevButton.addEventListener('click', () => this.prev());
    this.nextButton.addEventListener('click', () => this.next());

    // Event listeners for indicators
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Touch/swipe support
    this.setupTouchEvents();

    // Update on window resize
    window.addEventListener('resize', () => this.handleResize());
    this.handleResize(); // Initial sizing

    // Listen for transition end to handle infinite loop
    this.track.addEventListener('transitionend', () => this.handleTransitionEnd());
  }

  cloneCards() {
    // Clone only the last card at the beginning and first card at the end
    const lastCardClone = this.originalCards[this.originalCards.length - 1].cloneNode(true);
    const firstCardClone = this.originalCards[0].cloneNode(true);

    lastCardClone.classList.add('clone');
    firstCardClone.classList.add('clone');

    this.track.insertBefore(lastCardClone, this.track.firstChild);
    this.track.appendChild(firstCardClone);
  }

  updateCarousel(animate = true) {
    // Enable/disable transition
    if (!animate) {
      this.track.style.transition = 'none';
    } else {
      this.track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    // Calculate transform based on current index
    const offset = this.currentIndex * (this.cardWidth + this.gap);
    this.track.style.transform = `translateX(-${offset}px)`;

    // Update active states on cards
    this.cards.forEach((card, index) => {
      if (index === this.currentIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update indicators based on real card index
    const realIndex = this.getRealIndex();
    this.indicators.forEach((indicator, index) => {
      if (index === realIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });

    // Force reflow if transition was disabled
    if (!animate) {
      this.track.offsetHeight; // Trigger reflow
    }
  }

  getRealIndex() {
    // Convert current index to real card index (0 to totalCards - 1)
    // Index 0 is clone of last card, indices 1-4 are real cards, index 5 is clone of first card
    if (this.currentIndex === 0) {
      return this.totalCards - 1; // Last card
    } else if (this.currentIndex === this.totalCards + 1) {
      return 0; // First card
    } else {
      return this.currentIndex - 1; // Adjust for the clone at beginning
    }
  }

  handleTransitionEnd() {
    this.isTransitioning = false;

    // Check if we're at a clone and need to jump to the real card
    if (this.currentIndex === 0) {
      // At clone of last card (before first), jump to real last card
      this.currentIndex = this.totalCards;
      this.updateCarousel(false);
    } else if (this.currentIndex === this.totalCards + 1) {
      // At clone of first card (after last), jump to real first card
      this.currentIndex = 1;
      this.updateCarousel(false);
    }
  }

  prev() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentIndex--;
    this.updateCarousel(true);
  }

  next() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentIndex++;
    this.updateCarousel(true);
  }

  goToSlide(index) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    // Convert real index to current index (add 1 for the clone at the beginning)
    this.currentIndex = index + 1;
    this.updateCarousel(true);
  }

  handleResize() {
    const width = window.innerWidth;

    // Update card width and gap based on viewport
    if (width <= 767) {
      this.cardWidth = 320;
      this.gap = 24;
    } else if (width <= 1023) {
      this.cardWidth = 400;
      this.gap = 32;
    } else if (width <= 1200) {
      this.cardWidth = 500;
      this.gap = 32;
    } else {
      this.cardWidth = 600;
      this.gap = 32;
    }

    // Update carousel position without animation
    this.updateCarousel(false);
  }

  setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;

    this.track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
  }

  handleSwipe(startX, endX) {
    const minSwipeDistance = 50;
    const swipeDistance = startX - endX;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped left - go to next
        this.next();
      } else {
        // Swiped right - go to prev
        this.prev();
      }
    }
  }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ImpactCarousel();
});

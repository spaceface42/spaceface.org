// elegantSlideshow.js
export default class ElegantSlideshow {
  /**
   * @param {string | HTMLElement} containerSelector - A selector string or DOM element for the slideshow container.
   * @param {Object} options - Optional settings.
   * @param {number} options.interval - Time in milliseconds between slides (default is 5000).
   */
  constructor(containerSelector, options = {}) {
    this.container =
      typeof containerSelector === 'string'
        ? document.querySelector(containerSelector)
        : containerSelector;

    if (!this.container) {
      throw new Error('Container element not found.');
    }

    // Query slides and dots from container
    this.slides = this.container.querySelectorAll('.slide');
    this.dots = this.container.querySelectorAll('.dot');

    // Options
    this.interval = options.interval || 5000;
    this.currentIndex = 0;
    this.lastTimestamp = 0;
    this.isPaused = false;
    this.rafId = null;

    // Swipe variables
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    // Initialize dot navigation
    this.dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        this.goToSlide(index);
        this.lastTimestamp = performance.now();
      });
    });

    // Touch events for swipe functionality
    this.container.addEventListener(
      'touchstart',
      (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      },
      false
    );

    this.container.addEventListener(
      'touchend',
      (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      },
      false
    );

    // Pause on hover and resume on mouse leave
    this.container.addEventListener('mouseenter', () => {
      this.isPaused = true;
    });
    this.container.addEventListener('mouseleave', () => {
      this.isPaused = false;
      this.lastTimestamp = performance.now();
    });

    // Listen for visibility change to resume autoplay
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.lastTimestamp = performance.now();
      }
    });

    // Start the animation loop
    this.rafId = requestAnimationFrame(this.animate.bind(this));
  }

  animate(timestamp) {
    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    const elapsed = timestamp - this.lastTimestamp;

    if (elapsed >= this.interval && !this.isPaused) {
      this.nextSlide();
      this.lastTimestamp = timestamp;
    }
    this.rafId = requestAnimationFrame(this.animate.bind(this));
  }

  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;

    // Remove active classes from current slide and dot
    this.slides[this.currentIndex].classList.remove('active');
    this.dots[this.currentIndex].classList.remove('active');

    // Set new active slide and dot
    this.currentIndex = index;
    this.slides[this.currentIndex].classList.add('active');
    this.dots[this.currentIndex].classList.add('active');
  }

  nextSlide() {
    this.goToSlide((this.currentIndex + 1) % this.slides.length);
  }

  handleSwipe() {
    const threshold = 50; // Minimum swipe distance in pixels
    if (this.touchEndX < this.touchStartX - threshold) {
      // Swipe left: next slide
      this.nextSlide();
      this.lastTimestamp = performance.now();
    } else if (this.touchEndX > this.touchStartX + threshold) {
      // Swipe right: previous slide
      const previousIndex =
        (this.currentIndex - 1 + this.slides.length) % this.slides.length;
      this.goToSlide(previousIndex);
      this.lastTimestamp = performance.now();
    }
  }

  /**
   * Clean up and cancel the animation loop.
   */
  destroy() {
    cancelAnimationFrame(this.rafId);
    // Optionally, remove event listeners here if needed.
  }
}

const carousel = document.querySelector('[data-carousel-region]');
const track = carousel?.querySelector('.stories-track');
const cards = track ? Array.from(track.children) : [];
const dotsContainer = document.querySelector('.carousel-dots');
const previousButton = document.querySelector('[data-carousel="previous"]');
const nextButton = document.querySelector('[data-carousel="next"]');

if (carousel && track && cards.length && dotsContainer) {
  let currentIndex = 0;
  let cardsPerView = getCardsPerView();
  let autoplayTimer;

  function getCardsPerView() {
    return window.matchMedia('(max-width: 600px)').matches ? 1 : 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - cardsPerView);
  }

  function renderDots() {
    dotsContainer.innerHTML = '';
    const dotCount = getMaxIndex() + 1;

    for (let index = 0; index < dotCount; index += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Show student story group ${index + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;

    Array.from(dotsContainer.children).forEach((dot, index) => {
      dot.classList.toggle('is-active', index === currentIndex);
    });
  }

  function moveCarousel(direction) {
    const maxIndex = getMaxIndex();
    currentIndex = (currentIndex + direction + maxIndex + 1) % (maxIndex + 1);
    updateCarousel();
  }

  function restartAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(() => moveCarousel(1), 4500);
  }

  previousButton.addEventListener('click', () => {
    moveCarousel(-1);
    restartAutoplay();
  });

  nextButton.addEventListener('click', () => {
    moveCarousel(1);
    restartAutoplay();
  });

  carousel.addEventListener('mouseenter', () => window.clearInterval(autoplayTimer));
  carousel.addEventListener('mouseleave', restartAutoplay);

  window.addEventListener('resize', () => {
    const nextCardsPerView = getCardsPerView();
    if (nextCardsPerView !== cardsPerView) {
      cardsPerView = nextCardsPerView;
      currentIndex = Math.min(currentIndex, getMaxIndex());
      renderDots();
    }
    updateCarousel();
  });

  renderDots();
  updateCarousel();
  restartAutoplay();
}

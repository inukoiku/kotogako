import { ref, onMounted, onBeforeUnmount } from 'vue';

/**
 * Hero carousel logic extraction.
 * Handles auto-play, manual navigation and basic transition state.
 */
export function useHeroCarousel(options = {}) {
  const slides = ref(options.slides || []);
  const intervalMs = options.intervalMs ?? 6000;
  const currentSlide = ref(0);
  const timer = ref(null);
  const transitioning = ref(false);
  const prevSlideIndex = ref(-1);
  const nextSlideIndex = ref(-1);
  const transitionDurationMs = options.transitionDurationMs ?? 750;

  function nextSlide() {
    if (transitioning.value || slides.value.length === 0) return;
    transitioning.value = true;
    prevSlideIndex.value = currentSlide.value;
    currentSlide.value = (currentSlide.value + 1) % slides.value.length;
    nextSlideIndex.value = currentSlide.value;
    setTimeout(() => { transitioning.value = false; }, transitionDurationMs);
  }
  function prevSlide() {
    if (transitioning.value || slides.value.length === 0) return;
    transitioning.value = true;
    prevSlideIndex.value = currentSlide.value;
    currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
    nextSlideIndex.value = currentSlide.value;
    setTimeout(() => { transitioning.value = false; }, transitionDurationMs);
  }
  function goTo(i) {
    if (i === currentSlide.value || i < 0 || i >= slides.value.length) return;
    prevSlideIndex.value = currentSlide.value;
    currentSlide.value = i;
    nextSlideIndex.value = i;
  }
  function startAuto() {
    stopAuto();
    if (slides.value.length > 1) {
      timer.value = setInterval(nextSlide, intervalMs);
    }
  }
  function stopAuto() { if (timer.value) { clearInterval(timer.value); timer.value = null; } }

  onMounted(startAuto);
  onBeforeUnmount(stopAuto);

  return { slides, currentSlide, nextSlide, prevSlide, goTo, startAuto, stopAuto, transitioning, prevSlideIndex, nextSlideIndex };
}

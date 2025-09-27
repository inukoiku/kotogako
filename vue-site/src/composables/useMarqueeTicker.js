import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';

/**
 * Seamless marquee ticker logic.
 * Usage:
 * const { viewportRef, rowRef, marqueeItems, pauseTicker, resumeTicker, isTickerPaused, speed } = useMarqueeTicker(() => sourceArray);
 */
export function useMarqueeTicker(getMessagesFn, options = {}) {
  const speed = options.speed || 70; // px/sec
  const viewportRef = ref(null);
  const rowRef = ref(null);
  const isTickerPaused = ref(false);
  const marqueeItems = ref([]);

  let rafId = null;
  let lastTs = 0;
  let offsetX = 0;

  const baseMessages = computed(() => {
    const msgs = getMessagesFn?.() || [];
    return Array.isArray(msgs) ? msgs : [];
  });

  function buildItems() {
    marqueeItems.value = [...baseMessages.value];
    nextTick(() => {
      const viewportWidth = viewportRef.value?.offsetWidth || 0;
      let totalWidth = rowRef.value?.scrollWidth || 0;
      let guard = 0;
      while (totalWidth < viewportWidth * 2 && guard < 20) {
        marqueeItems.value.push(...baseMessages.value);
        guard++;
        totalWidth = rowRef.value?.scrollWidth || 0;
      }
      offsetX = viewportWidth; // start just outside right edge
    });
  }

  function step(ts) {
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    if (!isTickerPaused.value) {
      offsetX -= speed * dt;
      let firstEl = rowRef.value?.firstElementChild;
      let safety = 0;
      while (firstEl && -offsetX >= firstEl.offsetWidth && safety < 50) {
        offsetX += firstEl.offsetWidth;
        marqueeItems.value.push(marqueeItems.value.shift());
        firstEl = rowRef.value?.firstElementChild;
        safety++;
      }
    }
    if (rowRef.value) {
      rowRef.value.style.transform = `translateX(${offsetX}px)`;
    }
    rafId = requestAnimationFrame(step);
  }

  function pauseTicker() { isTickerPaused.value = true; }
  function resumeTicker() { isTickerPaused.value = false; }

  watch(baseMessages, () => { buildItems(); });

  onMounted(() => {
    buildItems();
    rafId = requestAnimationFrame(step);
    window.addEventListener('resize', buildItems);
  });
  onBeforeUnmount(() => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('resize', buildItems);
  });

  return { viewportRef, rowRef, marqueeItems, pauseTicker, resumeTicker, isTickerPaused, speed };
}

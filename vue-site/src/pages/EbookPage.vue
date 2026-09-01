<template>
  <section class="ebook-page">
    <header class="ebook-toolbar">
      <RouterLink class="ebook-back" to="/library">← 返回圖書館</RouterLink>
      <div class="ebook-heading">
        <p>Digital Book</p>
        <h1>電子書閱覽</h1>
      </div>
      <button
        class="ebook-icon-button"
        type="button"
        :aria-label="isFullscreen ? '離開全螢幕' : '進入全螢幕'"
        :title="isFullscreen ? '離開全螢幕' : '進入全螢幕'"
        @click="toggleFullscreen"
      >
        {{ isFullscreen ? '↙' : '↗' }}
      </button>
    </header>

    <div v-if="isLoading" class="ebook-status" role="status">頁面載入中...</div>
    <div v-else-if="!bookPages.length" class="ebook-status" role="status">目前沒有可顯示的頁面</div>

    <div v-else ref="readerRef" class="ebook-reader">
      <button
        class="ebook-nav ebook-nav-prev"
        type="button"
        aria-label="上一頁"
        :disabled="isAtStart"
        @click="previousPage"
      >
        ‹
      </button>

      <Swiper
        class="ebook-swiper"
        :modules="swiperModules"
        :slides-per-view="1"
        :space-between="12"
        :keyboard="{ enabled: true }"
        :a11y="{ enabled: true }"
        :breakpoints="swiperBreakpoints"
        @swiper="setSwiper"
        @slide-change="handleSlideChange"
      >
        <SwiperSlide v-for="(page, index) in bookPages" :key="page.id">
          <article class="ebook-sheet" :aria-label="`第 ${index + 1} 頁`">
            <img
              v-if="!failedPageIds.has(page.id)"
              :src="page.imageUrl"
              :alt="page.alt || `電子書第 ${index + 1} 頁`"
              :loading="index < 2 ? 'eager' : 'lazy'"
              draggable="false"
              @error="markPageFailed(page.id)"
            >
            <div v-else class="ebook-image-error">圖片無法載入</div>
            <span class="ebook-sheet-number">{{ index + 1 }}</span>
          </article>
        </SwiperSlide>
      </Swiper>

      <button
        class="ebook-nav ebook-nav-next"
        type="button"
        aria-label="下一頁"
        :disabled="isAtEnd"
        @click="nextPage"
      >
        ›
      </button>
    </div>

    <footer v-if="bookPages.length" class="ebook-progress">
      <span>{{ visiblePageLabel }}</span>
      <input
        :value="activePage + 1"
        type="range"
        min="1"
        :max="bookPages.length"
        aria-label="前往指定頁面"
        @input="goToPage"
      >
      <span>共 {{ bookPages.length }} 頁</span>
    </footer>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { A11y, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import '@/styles/ebook.css';
import { useFirestore } from '@/composables/useFirestore';

const MAX_PAGES = 20;
const localPageImages = [
  'about_vault.webp',
  'vault_1.webp',
  'vault_2.webp',
  'vault_3.webp',
  'vault_4.webp',
  'vault_5.webp',
  'vault_6.webp',
  'vault_7.webp',
  'vault_8.webp',
  'left_worlds.webp',
  'gallery_img_1.webp',
  'gallery_img_2.webp',
  'gallery_img_3.webp',
  'gallery_img_4.webp',
  'gallery_img_5.webp'
];

const { getEbookPages } = useFirestore();
const bookPages = ref([]);
const activePage = ref(0);
const isLoading = ref(true);
const isFullscreen = ref(false);
const readerRef = ref(null);
const swiperInstance = ref(null);
const failedPageIds = ref(new Set());
const swiperModules = [A11y, Keyboard];
const swiperBreakpoints = {
  800: { slidesPerView: 2, spaceBetween: 0 }
};

const visiblePageCount = computed(() => (
  typeof window !== 'undefined' && window.innerWidth >= 800 ? 2 : 1
));
const isAtStart = computed(() => activePage.value === 0);
const isAtEnd = computed(() => activePage.value >= bookPages.value.length - visiblePageCount.value);
const visiblePageLabel = computed(() => {
  const firstPage = activePage.value + 1;
  const lastPage = Math.min(firstPage + visiblePageCount.value - 1, bookPages.value.length);
  return firstPage === lastPage ? `第 ${firstPage} 頁` : `第 ${firstPage}–${lastPage} 頁`;
});

function getLocalPages() {
  let base = import.meta.env.BASE_URL || '/';
  if (base.endsWith('/')) base = base.slice(0, -1);

  return localPageImages.slice(0, MAX_PAGES).map((fileName, index) => ({
    id: `local-${index + 1}`,
    imageUrl: `${base}/images/library/${fileName}`,
    alt: `電子書示範頁 ${index + 1}`
  }));
}

function setSwiper(swiper) {
  swiperInstance.value = swiper;
}

function handleSlideChange(swiper) {
  activePage.value = swiper.activeIndex;
}

function previousPage() {
  swiperInstance.value?.slidePrev();
}

function nextPage() {
  swiperInstance.value?.slideNext();
}

function goToPage(event) {
  swiperInstance.value?.slideTo(Number(event.target.value) - 1);
}

function markPageFailed(pageId) {
  failedPageIds.value = new Set([...failedPageIds.value, pageId]);
}

async function toggleFullscreen() {
  if (!document.fullscreenElement) {
    await readerRef.value?.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
}

function handleFullscreenChange() {
  isFullscreen.value = Boolean(document.fullscreenElement);
}

onMounted(async () => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  const remotePages = await getEbookPages();
  bookPages.value = (remotePages.length ? remotePages : getLocalPages()).slice(0, MAX_PAGES);
  isLoading.value = false;
});

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});
</script>
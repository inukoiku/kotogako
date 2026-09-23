<template>
  <section
    class="ebook-page"
    ref="pageRootRef"
    :class="{
      'ebook-page-embedded': embedded,
      'ebook-page-reading': selectedBook,
      'ebook-fs-controls-hidden': isFullscreen && !fsControlsVisible
    }"
  >
    <header class="ebook-toolbar">
      <RouterLink v-if="showBack" class="ebook-back" to="/library">← 返回圖書館</RouterLink>
      <button
        v-else-if="selectedBook"
        class="ebook-back ebook-back-button"
        type="button"
        @click="returnToCatalog"
      >
        ← 返回雜誌列表
      </button>
      <span v-else class="ebook-back ebook-back-placeholder" aria-hidden="true"></span>
      <div class="ebook-heading">
        <p>{{ selectedBook ? selectedBook.kicker : 'Magazine' }}</p>
        <h1>{{ selectedBook ? selectedBook.title : '犬高雜誌' }}</h1>
      </div>
      <button
        v-if="selectedBook"
        class="ebook-icon-button"
        type="button"
        :aria-label="isFullscreen ? '離開全螢幕' : '進入全螢幕'"
        :title="isFullscreen ? '離開全螢幕' : '進入全螢幕'"
        @click="toggleFullscreen"
      >
        {{ isFullscreen ? '↙' : '↗' }}
      </button>
      <span v-else class="ebook-back-placeholder" aria-hidden="true"></span>
    </header>

    <template v-if="!selectedBook">
      <div v-if="isCatalogLoading" class="ebook-status" role="status">雜誌讀取中...</div>
      <div v-else-if="!magazines.length" class="ebook-status" role="status">目前沒有可顯示的雜誌</div>
      <div v-else class="ebook-catalog" aria-label="犬高雜誌列表">
        <button
          v-for="book in magazines"
          :key="book.id"
          class="ebook-book-card"
          type="button"
          @click="selectBook(book)"
        >
          <span class="ebook-book-cover">
            <img :src="book.coverUrl" :alt="book.title" draggable="false">
          </span>
          <span class="ebook-book-meta">
            <span class="ebook-book-kicker">{{ book.kicker }}</span>
            <span class="ebook-book-title">{{ book.title }}</span>
          </span>
        </button>
      </div>
    </template>

    <div v-else-if="isLoading" class="ebook-status" role="status">頁面載入中...</div>
    <div v-else-if="!bookPages.length" class="ebook-status" role="status">目前沒有可顯示的頁面</div>

    <div
      v-else
      ref="readerRef"
      class="ebook-reader"
      @click="handleReaderTap"
      @touchstart.passive="handleReaderTouchStart"
      @touchend.passive="handleReaderTouchEnd"
    >
      <button
        class="ebook-nav ebook-nav-prev"
        type="button"
        aria-label="上一頁"
        :disabled="isAtStart"
        @click.stop="previousPage"
      >
        ‹
      </button>

      <div ref="flipbookRef" :key="flipbookKey" class="ebook-flipbook"></div>

      <button
        class="ebook-nav ebook-nav-next"
        type="button"
        aria-label="下一頁"
        :disabled="isAtEnd"
        @click.stop="nextPage"
      >
        ›
      </button>
    </div>

    <footer v-if="selectedBook && bookPages.length" class="ebook-progress">
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
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { PageFlip } from 'page-flip';
import '@/styles/ebook.css';
import { useFirestore } from '@/composables/useFirestore';

const props = defineProps({
  showBack: { type: Boolean, default: true },
  embedded: { type: Boolean, default: false }
});

const { getMagazines, getMagazinePages } = useFirestore();
const magazines = ref([]);
const isCatalogLoading = ref(false);
const bookPages = ref([]);
const activePage = ref(0);
const isLoading = ref(false);
const isFullscreen = ref(false);
const fsControlsVisible = ref(false);
const pageRootRef = ref(null);
const readerRef = ref(null);
const flipbookRef = ref(null);
const flipbookKey = ref(0);
const pageFlipRef = ref(null);
const selectedBook = ref(null);

const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);
const visiblePageCount = computed(() => (viewportWidth.value >= 800 ? 2 : 1));
const isAtStart = computed(() => activePage.value === 0);
const isAtEnd = computed(() => activePage.value >= displayBookPages.value.length - visiblePageCount.value);
const isTurning = ref(false);
const displayBookPages = computed(() => {
  if(bookPages.value.length % 2 === 0) return bookPages.value;
  return [
    ...bookPages.value,
    { id: 'blank-last-page', blank: true, alt: '空白頁' }
  ];
});
const visiblePageLabel = computed(() => {
  const firstPage = activePage.value + 1;
  const lastPage = Math.min(firstPage + visiblePageCount.value - 1, bookPages.value.length);
  return firstPage === lastPage ? `第 ${firstPage} 頁` : `第 ${firstPage}–${lastPage} 頁`;
});

function previousPage() {
  const targetPage = Math.max(activePage.value - visiblePageCount.value, 0);
  pageFlipRef.value?.flipPrev('bottom');
  syncActivePageFallback(targetPage, activePage.value);
}

function nextPage() {
  const targetPage = Math.min(activePage.value + visiblePageCount.value, Math.max(displayBookPages.value.length - visiblePageCount.value, 0));
  pageFlipRef.value?.flipNext('bottom');
  syncActivePageFallback(targetPage, activePage.value);
}

function goToPage(event) {
  const targetPage = Number(event.target.value) - 1;
  if(targetPage === activePage.value) return;
  const pageStep = visiblePageCount.value;
  const spreadStart = Math.floor(targetPage / pageStep) * pageStep;
  const boundedPage = Math.min(spreadStart, Math.max(displayBookPages.value.length - pageStep, 0));
  pageFlipRef.value?.flip(boundedPage, 'top');
  syncActivePageFallback(boundedPage, activePage.value);
}

function syncActivePageFallback(targetPage, previousPage) {
  window.setTimeout(() => {
    if(!pageFlipRef.value) return;

    const currentPage = pageFlipRef.value.getCurrentPageIndex?.() ?? previousPage;
    if(currentPage !== previousPage) {
      activePage.value = currentPage;
      return;
    }

    activePage.value = targetPage;
  }, 950);
}

function createFlipPageElement(page, index) {
  const article = document.createElement('article');
  article.className = 'ebook-sheet ebook-flip-page';
  article.setAttribute('aria-label', `第 ${index + 1} 頁`);

  if (page.blank) {
    article.classList.add('ebook-flip-page-blank');
    return article;
  }

  const img = document.createElement('img');
  img.src = page.imageUrl;
  img.alt = page.alt || `電子書第 ${index + 1} 頁`;
  img.loading = 'eager';
  img.draggable = false;
  img.addEventListener('error', () => {
    const placeholder = document.createElement('div');
    placeholder.className = 'ebook-image-error';
    placeholder.textContent = '圖片無法載入';
    img.replaceWith(placeholder);
  });
  article.appendChild(img);

  const number = document.createElement('span');
  number.className = 'ebook-sheet-number';
  number.textContent = String(index + 1);
  article.appendChild(number);

  return article;
}

function renderFlipPages() {
  if(!flipbookRef.value) return;
  flipbookRef.value.replaceChildren(
    ...displayBookPages.value.map((page, index) => createFlipPageElement(page, index))
  );
}

async function selectBook(book) {
  selectedBook.value = book;
  activePage.value = 0;
  isTurning.value = false;
  isLoading.value = true;
  bookPages.value = await getMagazinePages(book.id);
  isLoading.value = false;
}

function returnToCatalog() {
  if (document.fullscreenElement === pageRootRef.value) {
    document.exitFullscreen().catch(() => {});
  }
  destroyPageFlip();
  selectedBook.value = null;
  bookPages.value = [];
  activePage.value = 0;
  isTurning.value = false;
}

function destroyPageFlip() {
  pageFlipRef.value?.destroy();
  pageFlipRef.value = null;
}

async function initPageFlip() {
  const previousPageFlip = pageFlipRef.value;
  pageFlipRef.value = null;
  flipbookKey.value += 1;
  await nextTick();
  previousPageFlip?.destroy();
  if(!flipbookRef.value || !bookPages.value.length) return;

  renderFlipPages();

  const startPage = Math.min(activePage.value, Math.max(displayBookPages.value.length - visiblePageCount.value, 0));
  const fullscreenMode = document.fullscreenElement === pageRootRef.value;

  // 依容器實際寬高反推頁面尺寸（維持 3:4 頁面比例），寬、高哪個先頂到就用哪個，
  // 讓書頁盡量置中滿版顯示，同時避免手機/全螢幕時跟固定尺寸打架而截斷或溢出
  const containerWidth = flipbookRef.value.clientWidth || 420;
  const containerHeight = flipbookRef.value.clientHeight || 560;
  const perPageWidthByWidth = Math.floor(containerWidth / visiblePageCount.value);
  const perPageWidthByHeight = Math.floor(containerHeight * 3 / 4);
  const perPageWidth = Math.max(1, Math.min(perPageWidthByWidth, perPageWidthByHeight));
  const minPageWidth = Math.min(220, perPageWidth);
  const maxPageWidth = fullscreenMode ? Math.max(perPageWidth, 760) : Math.max(perPageWidth, 340);
  const baseWidth = Math.min(Math.max(perPageWidth, minPageWidth), maxPageWidth);
  const baseHeight = Math.round(baseWidth * 4 / 3);

  const pageFlip = new PageFlip(flipbookRef.value, {
    width: baseWidth,
    height: baseHeight,
    size: 'stretch',
    minWidth: minPageWidth,
    maxWidth: maxPageWidth,
    minHeight: Math.round(minPageWidth * 4 / 3),
    maxHeight: Math.round(maxPageWidth * 4 / 3),
    showCover: false,
    usePortrait: true,
    drawShadow: true,
    flippingTime: 850,
    maxShadowOpacity: 0.55,
    mobileScrollSupport: false,
    swipeDistance: 12,
    clickEventForward: true,
    disableFlipByClick: false,
    startPage
  });

  pageFlip.on('flip', (event) => {
    activePage.value = Number(event.data) || 0;
  });
  pageFlip.on('changeState', (event) => {
    isTurning.value = event.data !== 'read';
  });

  pageFlip.loadFromHTML(flipbookRef.value.querySelectorAll('.ebook-flip-page'));
  pageFlipRef.value = pageFlip;
}

async function toggleFullscreen() {
  if (!document.fullscreenElement) {
    await pageRootRef.value?.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
}

function handleFullscreenChange() {
  isFullscreen.value = document.fullscreenElement === pageRootRef.value;
  // 進全螢幕時先隱藏上下 bar，讓書頁盡量滿版；離開全螢幕則跟全螢幕狀態脫鉤，一律視為顯示
  fsControlsVisible.value = !isFullscreen.value;
  if(selectedBook.value && bookPages.value.length) initPageFlip();
}

let lastTapAt = 0;
function handleReaderTap() {
  if (!isFullscreen.value) return;
  // 避免同一次觸控又補觸發一次 click 造成連續切換兩次（形同沒反應）
  const now = Date.now();
  if (now - lastTapAt < 300) return;
  lastTapAt = now;
  fsControlsVisible.value = !fsControlsVisible.value;
}

// PageFlip 在 mobileScrollSupport:false 時會對 touchstart 呼叫 preventDefault，
// 這會讓瀏覽器不再合成 click 事件，導致手機/觸控裝置上點擊完全不會觸發 handleReaderTap，
// 因此改用自己偵測的輕觸手勢（沒有明顯移動、時間夠短）來觸發，不依賴 click。
let touchStartPos = null;
let touchStartTime = 0;
function handleReaderTouchStart(event) {
  if (!isFullscreen.value || !event.touches?.length) return;
  const touch = event.touches[0];
  touchStartPos = { x: touch.clientX, y: touch.clientY };
  touchStartTime = Date.now();
}
function handleReaderTouchEnd(event) {
  if (!isFullscreen.value || !touchStartPos) return;
  if (event.target?.closest?.('.ebook-nav')) {
    touchStartPos = null;
    return;
  }
  const touch = event.changedTouches?.[0];
  if (touch) {
    const moved = Math.hypot(touch.clientX - touchStartPos.x, touch.clientY - touchStartPos.y);
    const duration = Date.now() - touchStartTime;
    if (moved < 12 && duration < 500) {
      handleReaderTap();
    }
  }
  touchStartPos = null;
}

let resizeTimer = null;
function handleResize() {
  viewportWidth.value = window.innerWidth;
  if(resizeTimer) window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    if(selectedBook.value && bookPages.value.length) initPageFlip();
  }, 200);
}

onMounted(async () => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  window.addEventListener('resize', handleResize);

  isCatalogLoading.value = true;
  magazines.value = await getMagazines();
  isCatalogLoading.value = false;

  if (!props.embedded && magazines.value.length) {
    await selectBook(magazines.value[0]);
  }
});

watch(bookPages, () => {
  if(selectedBook.value && bookPages.value.length) initPageFlip();
});

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  window.removeEventListener('resize', handleResize);
  if(resizeTimer) window.clearTimeout(resizeTimer);
  destroyPageFlip();
});
</script>
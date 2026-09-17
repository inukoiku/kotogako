<template>
  <section class="ebook-page" :class="{ 'ebook-page-embedded': embedded, 'ebook-page-reading': selectedBook }">
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

    <div v-if="!selectedBook" class="ebook-catalog" aria-label="犬高雜誌列表">
      <button
        v-for="book in catalogBooks"
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
          <span class="ebook-book-count">共 {{ book.pageImages.length }} 頁</span>
        </span>
      </button>
    </div>

    <div v-else-if="isLoading" class="ebook-status" role="status">頁面載入中...</div>
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

      <div ref="flipbookRef" :key="flipbookKey" class="ebook-flipbook"></div>

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

const temporaryBooks = [
  {
    id: 'magazine-02',
    kicker: 'Vol. 02',
    title: '犬高雜誌-第二期',
    cover: 'about_vault.webp',
    pageImages: localPageImages
  },
  {
    id: 'magazine-01',
    kicker: 'Vol. 01',
    title: '犬高雜誌-第一期',
    cover: 'left_worlds.webp',
    pageImages: localPageImages.slice(8).concat(localPageImages.slice(0, 8))
  },
  {
    id: 'special-gallery',
    kicker: 'Special',
    title: 'Gallery 特別刊',
    cover: 'gallery_img_1.webp',
    pageImages: localPageImages.slice(9).concat(localPageImages.slice(0, 9))
  },
  {
    id: 'vault-archive',
    kicker: 'Archive',
    title: 'Vault 典藏刊',
    cover: 'vault_1.webp',
    pageImages: localPageImages.slice(1).concat(localPageImages.slice(0, 1))
  }
];

const { getEbookPages } = useFirestore();
const bookPages = ref([]);
const remoteBookPages = ref([]);
const activePage = ref(0);
const isLoading = ref(false);
const isFullscreen = ref(false);
const readerRef = ref(null);
const flipbookRef = ref(null);
const flipbookKey = ref(0);
const pageFlipRef = ref(null);
const selectedBook = ref(props.embedded ? null : temporaryBooks[0]);

const catalogBooks = computed(() => temporaryBooks.map((book) => ({
  ...book,
  coverUrl: getLocalImageUrl(book.cover)
})));

const visiblePageCount = computed(() => (
  typeof window !== 'undefined' && window.innerWidth >= 800 ? 2 : 1
));
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

function getBaseUrl() {
  let base = import.meta.env.BASE_URL || '/';
  if (base.endsWith('/')) base = base.slice(0, -1);
  return base;
}

function getLocalImageUrl(fileName) {
  return `${getBaseUrl()}/images/library/${fileName}`;
}

function getLocalPages(book = temporaryBooks[0]) {
  return book.pageImages.slice(0, MAX_PAGES).map((fileName, index) => ({
    id: `${book.id}-${index + 1}`,
    imageUrl: getLocalImageUrl(fileName),
    alt: `${book.title} 第 ${index + 1} 頁`
  }));
}

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

function selectBook(book) {
  selectedBook.value = book;
  activePage.value = 0;
  isTurning.value = false;
  bookPages.value = (
    book.id === 'magazine-02' && remoteBookPages.value.length
      ? remoteBookPages.value
      : getLocalPages(book)
  ).slice(0, MAX_PAGES);
}

function returnToCatalog() {
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
  const fullscreenMode = document.fullscreenElement === readerRef.value;

  const pageFlip = new PageFlip(flipbookRef.value, {
    width: fullscreenMode ? 560 : 420,
    height: fullscreenMode ? 746 : 560,
    size: 'stretch',
    minWidth: 260,
    maxWidth: fullscreenMode ? 760 : 520,
    minHeight: 346,
    maxHeight: fullscreenMode ? 980 : 700,
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
    await readerRef.value?.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
}

function handleFullscreenChange() {
  isFullscreen.value = Boolean(document.fullscreenElement);
  if(selectedBook.value && bookPages.value.length) initPageFlip();
}

onMounted(async () => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  if (!selectedBook.value) return;

  isLoading.value = true;
  const remotePages = await getEbookPages();
  remoteBookPages.value = remotePages.slice(0, MAX_PAGES);
  selectBook(selectedBook.value);
  isLoading.value = false;
});

watch(bookPages, () => {
  if(selectedBook.value && bookPages.value.length) initPageFlip();
});

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  destroyPageFlip();
});
</script>
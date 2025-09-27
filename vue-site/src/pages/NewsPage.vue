<template>
  <!-- 全幅封面（背景左右滿版） -->
  <section
      class="cover-frame cover-frame-library"
      :style="{ '--cover-img': 'url(' + base + '/images/events/events.png)' }"
    >
      <div class="cover-frame-inner">
    </div>
  </section>

  <!-- 新聞橫幅區塊 -->
  <section class="news-banners-section container my-5">
    <div class="news-banners-container">
      <div 
        v-for="banner in reversedNewsBanners" 
        :key="banner.id"
        class="news-banner-item"
        @click="openModal(banner)"
        @keydown.enter="openModal(banner)"
        tabindex="0"
        role="button"
        :aria-label="`查看新聞詳情 ${banner.id}`"
      >
        <img 
          :src="banner.image.startsWith('http') ? banner.image : base + banner.image" 
          :alt="`新聞橫幅 ${banner.id}`"
          class="news-banner-image"
          loading="lazy"
        />
        <div class="news-banner-overlay">
          <span class="view-details">點擊查看詳情</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 彈出視窗 -->
  <Teleport to="body">
    <div 
      v-if="showModal" 
      class="news-modal-overlay"
      @click="closeModal"
    >
      <div 
        class="news-modal-content"
        @click.stop
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button 
          class="news-modal-close"
          @click="closeModal"
          aria-label="關閉"
        >
          ×
        </button>
        <div 
          class="news-modal-body"
          v-html="currentContent"
        ></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useMarqueeTicker } from '@/composables/useMarqueeTicker';
import { useHomePageState } from '@/composables/homePageState';
import { useNewsPage } from '@/composables/useNewsPage';
import '@/styles/home.css';
import '@/styles/news.css';

// 資料 & 基本頁面資料 (改用合併後的 homePageState)
const { news, base: baseFromState } = useHomePageState();

// 新聞頁面功能
const { 
  base: newsBase, 
  newsBanners,
  reversedNewsBanners, 
  showModal, 
  currentContent, 
  openModal, 
  closeModal 
} = useNewsPage();

// Ticker
const tickerMessages = computed(()=> news.value.map(n => `[${n.tag}] ${n.date} - ${n.title}`));
const { viewportRef, rowRef, marqueeItems, pauseTicker, resumeTicker } = useMarqueeTicker(()=> tickerMessages.value, { speed:70 });

const base = baseFromState || newsBase;

const showBadge = ref(false);

// ESC 鍵關閉彈出視窗
function handleEscape(event) {
  if (event.key === 'Escape' && showModal.value) {
    closeModal();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  // 確保在組件卸載時恢復滾動
  document.body.style.overflow = '';
});
</script>

<!-- 樣式與邏輯已分離：樣式在 src/styles/home.css，邏輯在 composables 中 -->

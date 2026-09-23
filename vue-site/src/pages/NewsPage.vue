<template>
  <!-- 全幅封面（背景左右滿版） -->
  <section
      class="cover-frame cover-frame-library"
      :style="{ '--cover-img': 'url(' + base + '/images/events/events_banner_v2.webp)' }"
    >
      <div class="cover-frame-inner">
        <div class="lib-switch-btns">
          <button
            class="lib-switch-btn"
            :class="{ active: currentView==='event' }"
            @click="currentView='event'"
            aria-label="顯示活動介紹">
            <img
              :src="base + '/images/library/' + (currentView==='event' ? 'gallery_btn_active.webp' : 'gallery_btn.webp')"
              alt="活動介紹"
              draggable="false" />
            <span class="lib-switch-label">活動介紹</span>
          </button>
          <button
            class="lib-switch-btn"
            :class="{ active: currentView==='board' }"
            @click="currentView='board'"
            aria-label="顯示留言板">
            <img
              :src="base + '/images/library/' + (currentView==='board' ? 'gallery_btn_active.webp' : 'gallery_btn.webp')"
              alt="留言板"
              draggable="false" />
            <span class="lib-switch-label">留言板</span>
          </button>
        </div>
    </div>
  </section>

  <!-- ============ 活動介紹 ============ -->
  <template v-if="currentView==='event'">
    <!-- 載入狀態 -->
    <section v-if="loading" class="news-loading container my-5">
      <div class="loading-spinner">載入中...</div>
    </section>

    <!-- 錯誤狀態 -->
    <section v-else-if="error" class="news-error container my-5">
      <div class="error-message">資料載入失敗：{{ error }}</div>
    </section>

    <!-- 新聞橫幅區塊 -->
    <section v-else class="news-banners-section container my-5">
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
            :src="banner.image && banner.image.startsWith('http') ? banner.image : base + (banner.image || '')"
            :alt="banner.title || `新聞橫幅 ${banner.id}`"
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

  <!-- ============ 留言板 ============ -->
  <section v-else class="board-page-section">
    <div class="board-page-container">
      <div v-if="boardsLoading" class="board-loading">載入中...</div>

      <!-- 沒有指定 slug：顯示所有留言板列表 -->
      <template v-else-if="!slug">
        <h1 class="board-page-title">留言板</h1>

        <div v-if="boards.length === 0" class="board-empty">
          目前尚無留言板
        </div>

        <ul v-else class="board-list">
          <li v-for="board in boards" :key="board.id" class="board-list-item">
            <RouterLink :to="`/board/${board.slug}`" class="board-list-link">
              <img
                v-if="board.imageUrl"
                :src="board.imageUrl"
                :alt="board.title"
                class="board-list-image"
                loading="lazy"
              />
              <div class="board-list-text">
                <h2 class="board-list-title">{{ board.title }}</h2>
                <p v-if="board.description" class="board-list-desc">{{ board.description }}</p>
              </div>
            </RouterLink>
          </li>
        </ul>
      </template>

      <!-- 有指定 slug 但找不到對應留言板 -->
      <template v-else-if="!currentBoard">
        <h1 class="board-page-title">找不到這個留言板</h1>
        <RouterLink to="/board" class="board-back-link">← 回留言板列表</RouterLink>
      </template>

      <!-- 顯示指定留言板的討論串 -->
      <template v-else>
        <RouterLink to="/board" class="board-back-link">← 回留言板列表</RouterLink>
        <img
          v-if="currentBoard.imageUrl"
          :src="currentBoard.imageUrl"
          :alt="currentBoard.title"
          class="board-page-image"
        />
        <h1 class="board-page-title">{{ currentBoard.title }}</h1>
        <p v-if="currentBoard.description" class="board-page-desc">{{ currentBoard.description }}</p>
        <DisqusThread
          shortname="inukoiku"
          :identifier="`board-${currentBoard.slug}`"
          :url="pageUrl"
          :title="currentBoard.title"
        />
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMarqueeTicker } from '@/composables/useMarqueeTicker';
import { useHomePageState } from '@/composables/homePageState';
import { useNewsPage } from '@/composables/useNewsPage';
import { useFirestore } from '@/composables/useFirestore';
import DisqusThread from '@/components/DisqusThread.vue';
import '@/styles/home.css';
import '@/styles/news.css';
import '@/styles/library.css';

const route = useRoute();

// 資料 & 基本頁面資料 (改用合併後的 homePageState)
const { news, base: baseFromState } = useHomePageState();

// 新聞頁面功能
const {
  base: newsBase,
  loading,
  error,
  newsBanners,
  reversedNewsBanners,
  fetchNewsItems,
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

// 活動 / 留言板 切換
const currentView = ref(route.path.startsWith('/board') ? 'board' : 'event');

watch(() => route.path, (newPath) => {
  currentView.value = newPath.startsWith('/board') ? 'board' : 'event';
});

// 留言板功能
const { loading: boardsLoading, getBoards } = useFirestore();

const boards = ref([]);
const slug = computed(() => route.params.slug || '');
const currentBoard = computed(() => boards.value.find((b) => b.slug === slug.value) || null);
const pageUrl = computed(() => window.location.href);

async function fetchBoards() {
  boards.value = await getBoards();
}

watch(() => route.params.slug, fetchBoards);

// ESC 鍵關閉彈出視窗
function handleEscape(event) {
  if (event.key === 'Escape' && showModal.value) {
    closeModal();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
  fetchNewsItems(); // 從 Firestore 取得新聞資料
  fetchBoards(); // 從 Firestore 取得留言板列表
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  // 確保在組件卸載時恢復滾動
  document.body.style.overflow = '';
});
</script>

<style scoped>
.lib-switch-label {
  display: block;
  text-align: center;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: inherit;
}

.board-page-section {
  padding: 2.5rem 1rem 4rem;
}

.board-page-container {
  max-width: 900px;
  margin: 0 auto;
}

.board-page-title {
  text-align: center;
  margin-bottom: 1.5rem;
}

.board-page-desc {
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
}

.board-loading,
.board-empty {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

.board-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.board-list-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.board-list-link:hover {
  border-color: #bbb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.board-list-image {
  width: 72px;
  height: 72px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.board-list-text {
  flex: 1;
  min-width: 0;
}

.board-page-image {
  display: block;
  max-width: 100%;
  max-height: 280px;
  object-fit: cover;
  border-radius: 8px;
  margin: 0 auto 1.5rem;
}

.board-list-title {
  margin: 0 0 0.35rem;
  font-size: 1.1rem;
}

.board-list-desc {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.board-back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: inherit;
  text-decoration: none;
}

.board-back-link:hover {
  text-decoration: underline;
}
</style>

<!-- 樣式與邏輯已分離：樣式在 src/styles/home.css、news.css，邏輯在 composables 中 -->

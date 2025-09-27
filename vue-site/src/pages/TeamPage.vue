<template>
  <div>
    <!-- Hero / Breadcrumb -->
    <!-- 全幅封面（背景左右滿版） -->
    <section
      class="cover-frame cover-frame-library"
      :style="{ '--cover-img': 'url(' + base + '/images/members/member_banner.png)' }"
    >
      <div class="cover-frame-inner">
    </div>
    </section>

    <!-- About style block -->
    <!-- <section class="container mb-5">
      <div class="row g-4 align-items-center">
        <div class="col-md-6">
          <div class="about-block h-100">
            <h3>Our Mission</h3>
            <h2 class="h3">關於 Pup High School</h2>
            <p class="mb-3">我們專注於提供學生所需的一切資源與商品，結合教育服務與校園周邊，打造完整的支持系統。</p>
            <p class="mb-0">團隊成員具備多元背景，從課程設計、產品開發到品牌行銷，共同推動校園創新。</p>
            <div class="about-icon-box">
              <div>
                <h4 class="h6 mb-2">Think Out Of The Box</h4>
                <p class="small mb-2">持續探索更好的學習與商品體驗，接受挑戰並快速迭代。</p>
                <div class="social">
                  <i class="fab fa-facebook-f"></i>
                  <i class="fab fa-twitter"></i>
                  <i class="fab fa-instagram"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="testimonial-box">
            <h3>“Best Design Quality”</h3>
            <p class="mb-0 small lh-lg">我們的服務與周邊產品設計以使用者需求為核心，透過持續回饋改善細節，提供穩定、實用且具吸引力的體驗。</p>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Timeline section (簡化無 h-tl-card) -->
    <!-- <section class="container py-4">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="h5 mb-0">活動歷程</h2>
        <div class="tl-nav">
          <button class="btn btn-sm btn-outline-primary me-2" @click="scroll(-1)" aria-label="往左">‹</button>
          <button class="btn btn-sm btn-outline-primary" @click="scroll(1)" aria-label="往右">›</button>
        </div>
      </div>
      <div class="mini-tl-wrap" ref="miniRef">
        <ol class="mini-tl">
          <li
            v-for="(e,i) in reversedTimeline"
            :key="e.id"
            :class="['mini-item', { active:i===0 }]"
            :title="e.title + ' - ' + e.date"
          >
            <span class="mini-point"></span>
            <h6 class="mini-title">{{ e.title }}</h6>
            <p class="mini-date">{{ e.date }}</p>
            <span v-if="i===0" class="badge bg-success small">最新</span>
          </li>
        </ol>
      </div>
    </section> -->

    <!-- Team grid -->
    <!-- <section class="container mb-5">
      <div class="team-section-heading text-center mb-4">
        <p>Our Team</p>
        <h3 class="h3 mb-0">Awesome Members</h3>
      </div>
      <div class="row g-4">
        <div v-for="m in members" :key="m.id" class="col-6 col-md-4 col-lg-3">
          <div class="member-card shadow-sm">
            <img :src="base + m.photo" :alt="m.name" />
            <div class="member-overlay">
              <h4>{{ m.name }}</h4>
              <p>{{ m.roleLabel }}</p>
              <div class="member-social">
                <i class="fab fa-facebook-f"></i>
                <i class="fab fa-twitter"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- 新增：團隊圖集切換區塊 -->
    <section 
      class="team-gallery-switch container mb-5"
      :style="{ '--team-gallery-bg': 'url(' + base + '/images/members/member_bk.png)' }"
    >
      <!-- 圖片按鈕列 -->
      <div class="tg-btn-container">
        <!-- 左箭頭 -->
        <button 
          class="tg-scroll-btn tg-scroll-left" 
          @click="scrollGallery(-1)"
          :disabled="!canScrollLeft || isScrolling"
          aria-label="向左滾動"
        >
          ‹
        </button>
        
        <!-- 按鈕滾動區域 -->
        <div class="tg-btn-row" ref="galleryBtnRow" @scroll="updateScrollState">
          <button
            v-for="g in teamGallery"
            :key="g.id"
            class="tg-btn"
            :class="{ active: activeGallery === g.id }"
            @click="activeGallery = g.id"
            @mouseenter="hoverButton = g.id"
            @mouseleave="hoverButton = null"
            :aria-label="g.label"
          >
            <img 
              :src="base + getButtonImage(g)" 
              :alt="g.label" 
              loading="lazy"
              @error="handleImageError"
              @load="handleImageLoad"
            />
          </button>
        </div>
        
        <!-- 右箭頭 -->
        <button 
          class="tg-scroll-btn tg-scroll-right" 
          @click="scrollGallery(1)"
          :disabled="!canScrollRight || isScrolling"
          aria-label="向右滾動"
        >
          ›
        </button>
      </div>

      <!-- 顯示區 -->
      <div class="tg-display">
        <transition name="tg-fade" mode="out-in">
          <figure
            :key="activeGallery"
            class="tg-figure"
          >
            <img 
              :src="base + currentGalleryItem.image" 
              :alt="currentGalleryItem.label" 
              loading="lazy" 
            />
            <figcaption v-if="currentGalleryItem.caption">
              {{ currentGalleryItem.caption }}
            </figcaption>
          </figure>
        </transition>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useTeamPage } from '@/composables/useTeamPage';
import '@/styles/team.css';

import { onMounted, nextTick } from 'vue';

const { 
  members, 
  timeline, 
  base,
  teamGallery,
  activeGallery,
  hoverButton,
  currentGalleryItem,
  getButtonImage,
  preloadImages,
  reversedTimeline,
  miniRef,
  scroll,
  galleryBtnRow,
  scrollGallery,
  canScrollLeft,
  canScrollRight,
  updateScrollState,
  initScrollState,
  isScrolling
} = useTeamPage();

// 圖片載入錯誤處理
function handleImageError(event) {
  console.warn('Image failed to load:', event.target.src);
  // 可以設置一個預設圖片
  // event.target.src = base + '/images/common/placeholder.png';
}

function handleImageLoad(event) {
  // 圖片載入成功的處理
  // console.log('Image loaded successfully:', event.target.src);
}

// 初始化滾動狀態和預載圖片
onMounted(async () => {
  await nextTick(); // 確保 DOM 完全渲染
  preloadImages(); // 預載所有圖片
  initScrollState();
});
</script>

<style scoped>

</style>

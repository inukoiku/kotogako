<template>
  <!-- 全幅封面（背景左右滿版） -->
  <!-- <section class="cover-frame" :style="{ '--cover-img': 'url(' + base + '/images/home/summer_welcome_with_name.png)' }"> -->
    <!-- <div class="cover-frame-inner"> -->
      <!-- 封面徽章 (若要啟用取消註解)
      <img v-if="showBadge" class="cover-badge" :src="base + 'images/mainboy.png'" alt="封面裝飾" />
      -->
    <!-- </div> -->
  <!-- </section> -->
   <section
      class="cover-frame cover-frame-library home-cover"
      :style="{ '--cover-img': 'url(' + base + '/images/home/summer_welcome_with_name.png)' }"
    >
      <div class="cover-frame-inner">
    </div>
  </section>

  <!-- Hero Carousel -->
  <div class="hero-carousel mb-5" @mouseenter="stopAuto" @mouseleave="startAuto">
    <div
      class="hero-slide"
      v-for="(s,i) in heroSlides"
      :key="s.id"
      :class="{
        active: i === currentSlide, 
        prev: i === prevSlideIndex, 
        next: i === nextSlideIndex,
        [s.cssClasses]: s.cssClasses
      }"
      :style="{
        backgroundImage: 'url(' + s.image + ')',
        backgroundPosition: s.bgPosition || 'center center',
        backgroundSize: s.bgSize || 'cover'
      }"
      @click="navigateToSlide(s)"
      role="button"
      tabindex="0"
      :aria-label="`跳轉到 ${s.title}`"
      @keydown.enter="navigateToSlide(s)"
      @keydown.space="navigateToSlide(s)"
    >
      <!-- <div class="hero-layer"></div> -->
      <!-- <div class="container hero-inner"> -->
        <!-- <h1 class="display-5 fw-bold mb-3">{{ s.title }}</h1> -->
        <!-- <p class="lead mb-4">{{ s.subtitle }}</p> -->
        <!-- <RouterLink v-if="s.cta" :to="s.cta.to" class="btn btn-primary btn-lg px-4">{{ s.cta.label }}</RouterLink> -->
      <!-- </div> -->
    </div>
    <button class="hero-control prev" @click="prevSlide" aria-label="上一張">‹</button>
    <button class="hero-control next" @click="nextSlide" aria-label="下一張">›</button>
    <div class="hero-dots">
      <button
        v-for="(s,i) in heroSlides"
        :key="s.id"
        @click="goTo(i)"
        :class="{active: i===currentSlide}"
        :aria-label="'跳到第'+(i+1)+'張'"
      ></button>
    </div>
  </div>

  <!-- 媒體展示區 (左圖 / 右背景 + YouTube) -->
  <section
    class="home-media-section"
    :style="{ '--media-bg': 'url(' + base + '/images/home/home_bk.png)' }"
  >
    <div class="container home-media-inner">
      <div class="row g-4 align-items-stretch">
        <!-- 左側圖片 -->
        <div class="col-lg-6">
          <div class="media-image-wrap">
            <img
              :src="base + '/images/home/home_words.png'"
              alt="媒體展示圖"
              class="media-main-img"
              loading="lazy"
              draggable="false"
            />
          </div>
        </div>
        <!-- 右側背景 + YouTube -->
    <div class="col-lg-6">
      <div class="media-video-panel size-lg bg-contain" :style="{ '--panel-bg': 'url(' + base + '/images/home/gold_frame.png)', '--video-scale':'1' }">
              <div class="ratio ratio-16x9 media-video-ratio">
                <iframe
                  :src="resolvedYoutubeUrl"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                  loading="lazy"
                  referrerpolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>
            </div>
        </div>
      </div>
    </div>
  </section>

  
</template>

<script setup>
// 分離後只留下導入與解構
import '@/styles/home.css';
import { useHomePageState } from '../composables/homePageState';

const {
  base,
  heroSlides,
  currentSlide,
  prevSlideIndex,
  nextSlideIndex,
  nextSlide,
  prevSlide,
  goTo,
  startAuto,
  stopAuto,
  navigateToSlide,
  newsTop3,
  // 若之後啟用跑馬燈可用以下：
  viewportRef,
  rowRef,
  marqueeItems,
  pauseTicker,
  resumeTicker,
  showBadge,
  youtubeEmbedUrl
} = useHomePageState();

// YouTube URL 處理
const resolvedYoutubeUrl = youtubeEmbedUrl || 'https://www.youtube.com/embed/eBnZL9OEQow?rel=0';
</script>

<!-- 樣式與邏輯已分離：樣式在 src/styles/home.css，邏輯在 composables 中 -->

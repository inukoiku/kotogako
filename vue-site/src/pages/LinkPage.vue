<template>
  <!-- 全幅封面（背景左右滿版） -->
  <section
      class="cover-frame cover-frame-library"
      :style="{ '--cover-img': 'url(' + base + '/images/linkspage/link_banner.png)' }"
    >
      <div class="cover-frame-inner">
    </div>
  </section>

  <!-- 連結圖片區塊 -->
  <section class="links-gallery-section">
    <div class="links-gallery-container">
      <div class="links-grid">
        <div 
          v-for="link in linkImages" 
          :key="link.id"
          class="link-item"
          @click="openLink(link.url)"
          @keydown.enter="openLink(link.url)"
          tabindex="0"
          role="button"
          :aria-label="`開啟 ${link.title}`"
        >
          <div class="link-image-container">
            <img 
              :src="link.image" 
              :alt="link.title"
              class="link-image"
              loading="lazy"
            />
            <div class="link-overlay">
              <div class="link-content">
                <h3 class="link-title">{{ link.title }}</h3>
                <p class="link-description">{{ link.description }}</p>
                <span class="link-action">點擊前往</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useMarqueeTicker } from '@/composables/useMarqueeTicker';
import { useHomePageState } from '@/composables/homePageState';
import { useLinkPage } from '@/composables/useLinkPage';
import '@/styles/home.css';
import '@/styles/links.css';

// 資料 & 基本頁面資料 (改用合併後 composable)
const { news, base: baseFromState } = useHomePageState();

// LinkPage 功能
const { base: linkBase, linkImages, openLink } = useLinkPage();

// Ticker
const tickerMessages = computed(()=> news.value.map(n => `[${n.tag}] ${n.date} - ${n.title}`));
const { viewportRef, rowRef, marqueeItems, pauseTicker, resumeTicker } = useMarqueeTicker(()=> tickerMessages.value, { speed:70 });

const base = baseFromState || linkBase;

const showBadge = ref(false);

</script>

<!-- 樣式與邏輯已分離：樣式在 src/styles/home.css，邏輯在 composables 中 -->

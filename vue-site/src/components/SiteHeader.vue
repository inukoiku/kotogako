<template>
  <header class="site-header-nav shadow-sm">
    <!-- 手機版漢堡按鈕 -->
    <button 
      class="mobile-menu-toggle" 
      @click="toggleMobileMenu"
      :class="{ active: isMobileMenuOpen }"
      aria-label="切換選單"
    >
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>

    <!-- 手機版背景遮罩 -->
    <div 
      v-if="isMobileMenuOpen" 
      class="mobile-overlay" 
      @click="closeMobileMenu"
    ></div>

    <nav 
      class="nav-grid" 
      :class="{ 'mobile-open': isMobileMenuOpen }"
      aria-label="主選單"
    >
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="nav-cell"
        :class="{ active: route.path === item.to }"
        @click="closeMobileMenu"
      >
        <div class="nav-img-wrap">
          <img
            class="img img-a"
            :src="base + item.imgA"
            :alt="item.label + ' 圖片 A'"
            loading="lazy"
            draggable="false"
          />
          <img
            class="img img-b"
            :src="base + item.imgB"
            :alt="item.label + ' 圖片 B'"
            loading="lazy"
            draggable="false"
          />
        </div>
        <span class="nav-label">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useSiteHeaderNav } from '@/composables/useSiteHeaderNav';
import '@/styles/siteHeader.css';

const { route, base, items } = useSiteHeaderNav();

// 手機選單狀態
const isMobileMenuOpen = ref(false);

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

// 監聽螢幕尺寸變化，大螢幕時自動關閉手機選單
function handleResize() {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
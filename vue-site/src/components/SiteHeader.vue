<template>
  <header class="site-header-nav shadow-sm">
    <nav class="nav-grid" aria-label="主選單">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="nav-cell"
        :class="{ active: route.path === item.to }"
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
import { useSiteHeaderNav } from '@/composables/useSiteHeaderNav';
import '@/styles/siteHeader.css';

const { route, base, items } = useSiteHeaderNav();
</script>
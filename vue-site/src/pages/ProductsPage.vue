<template>
  <section
      class="cover-frame cover-frame-library"
      :style="{ '--cover-img': 'url(' + base + '/images/products/product_banner.png)' }"
    >
      <div class="cover-frame-inner">
    </div>
  </section>
  <!-- 背景圖片區域 -->
  <section 
    class="products-section"
  >
    <img
      class="products-bg-img"
      :src="backgroundSection.backgroundImage"
      alt="背景圖片"
      loading="lazy"
      draggable="false"
    />
  
    
  </section>
</template>
<script setup>
import { ref } from 'vue';
import { useProductsPage } from '@/composables/useProductsPage';
import '@/styles/products.css';

// 使用 ProductsPage composable
const { base, products, backgroundSection } = useProductsPage();

const news = ref([
  { id:1, name:'校園背包', price:1200 },
  { id:2, name:'運動外套', price:1800 },
  { id:3, name:'紀念水壺', price:350 }
]);
</script>

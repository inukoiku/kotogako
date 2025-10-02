<template>
  <!-- 全幅封面（背景左右滿版） -->
  <section
    class="cover-frame cover-frame-library"
    :style="{ '--cover-img': 'url(' + base + '/images/products/product_banner.png)' }"
  >
    <div class="cover-frame-inner">
    </div>
  </section>

  <!-- <img
      class="products-bg-img"
      :src="backgroundSection.backgroundImage"
      alt="背景圖片"
      loading="lazy"
      draggable="false"
    /> -->

  <!-- 商品展示區塊 -->
  <section class="products-banners-section container my-5">
    <div class="products-banners-container">
      <div 
        v-for="product in products" 
        :key="product.id"
        class="product-banner-item"
        @click="openModal(product)"
        @keydown.enter="openModal(product)"
        tabindex="0"
        role="button"
        :aria-label="`查看商品詳情 ${product.id}`"
      >
        <img 
          :src="product.image.startsWith('http') ? product.image : base + product.image" 
          :alt="`商品圖片 ${product.id}`"
          class="product-banner-image"
          loading="lazy"
        />
        <div class="product-banner-overlay">
          <span class="view-details">點擊查看詳情</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 彈出視窗 -->
  <Teleport to="body">
    <div 
      v-if="showModal" 
      class="product-modal-overlay"
      @click="closeModal"
    >
      <div 
        class="product-modal-content"
        @click.stop
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button 
          class="product-modal-close"
          @click="closeModal"
          aria-label="關閉"
        >
          ×
        </button>
        <div 
          class="product-modal-body"
          v-html="currentContent"
        ></div>
      </div>
    </div>
  </Teleport>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useProductsPage } from '@/composables/useProductsPage';
import '@/styles/products.css';

// 使用 ProductsPage composable
const { base, products, backgroundSection } = useProductsPage();

// 彈出視窗相關狀態
const showModal = ref(false);
const currentContent = ref('');

// 開啟彈出視窗
function openModal(product) {
  currentContent.value = product.htmlContent;
  showModal.value = true;
  // 防止背景滾動
  document.body.style.overflow = 'hidden';
}

// 關閉彈出視窗
function closeModal() {
  showModal.value = false;
  currentContent.value = '';
  // 恢復背景滾動
  document.body.style.overflow = '';
}

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

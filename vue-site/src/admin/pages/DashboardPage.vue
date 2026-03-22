<template>
  <div class="dashboard-page">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🖼️</div>
        <div class="stat-info">
          <span class="stat-value">{{ heroSlidesCount }}</span>
          <span class="stat-label">首頁輪播</span>
        </div>
        <router-link to="/admin/hero-slides" class="stat-link">管理 →</router-link>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🎬</div>
        <div class="stat-info">
          <span class="stat-value">1</span>
          <span class="stat-label">首頁影片</span>
        </div>
        <router-link to="/admin/home-video" class="stat-link">管理 →</router-link>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-info">
          <span class="stat-value">{{ productsCount }}</span>
          <span class="stat-label">產品項目</span>
        </div>
        <router-link to="/admin/products" class="stat-link">管理 →</router-link>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📰</div>
        <div class="stat-info">
          <span class="stat-value">{{ eventsCount }}</span>
          <span class="stat-label">活動項目</span>
        </div>
        <router-link to="/admin/events" class="stat-link">管理 →</router-link>
      </div>
    </div>

    <div class="quick-actions">
      <h2>快速操作</h2>
      <div class="actions-grid">
        <router-link to="/admin/hero-slides" class="action-card">
          <span class="action-icon">➕</span>
          <span>新增輪播圖片</span>
        </router-link>
        <router-link to="/admin/products" class="action-card">
          <span class="action-icon">➕</span>
          <span>新增產品</span>
        </router-link>
        <router-link to="/admin/events" class="action-card">
          <span class="action-icon">➕</span>
          <span>新增活動</span>
        </router-link>
        <a href="/" target="_blank" class="action-card">
          <span class="action-icon">👁️</span>
          <span>預覽網站</span>
        </a>
      </div>
    </div>

    <div class="info-section">
      <h2>系統資訊</h2>
      <div class="info-card">
        <div class="info-row">
          <span class="info-label">登入帳號</span>
          <span class="info-value">{{ adminData?.email }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">帳號角色</span>
          <span class="info-value">{{ adminData?.role === 'super_admin' ? '超級管理員' : '編輯者' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">最後登入</span>
          <span class="info-value">{{ formatDate(adminData?.lastLoginAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useAdminFirestore } from '@/composables/useAdminFirestore';

const { adminData } = useAuth();
const { getAll } = useAdminFirestore();

const heroSlidesCount = ref(0);
const productsCount = ref(0);
const eventsCount = ref(0);

onMounted(async () => {
  // 取得各項目數量
  const heroSlides = await getAll('pages/homepage/carouselItems');
  heroSlidesCount.value = heroSlides.length;

  const products = await getAll('pages/productpage/productItems');
  productsCount.value = products.length;

  const events = await getAll('pages/eventpage/eventItems');
  eventsCount.value = events.length;
});

function formatDate(timestamp) {
  if (!timestamp) return '未知';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString('zh-TW');
}
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
}

.stat-icon {
  font-size: 40px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  border-radius: 12px;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-link {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
}

.stat-link:hover {
  text-decoration: underline;
}

.quick-actions h2,
.info-section h2 {
  font-size: 18px;
  color: #1a1a2e;
  margin-bottom: 16px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: white;
  border-radius: 10px;
  text-decoration: none;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-icon {
  font-size: 24px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
  font-size: 14px;
}

.info-value {
  color: #1a1a2e;
  font-weight: 500;
}
</style>

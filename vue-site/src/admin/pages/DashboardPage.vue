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
        <router-link to="/" class="action-card" target="_blank">
          <span class="action-icon">👁️</span>
          <span>預覽網站</span>
        </router-link>
      
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
import { useDashboardPage } from '@/admin/composables/useDashboardPage';
import '@/admin/styles/dashboard.css';

const {
  adminData,
  heroSlidesCount,
  productsCount,
  eventsCount,
  formatDate
} = useDashboardPage();
</script>


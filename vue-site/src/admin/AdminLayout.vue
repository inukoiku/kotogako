<template>
  <div class="admin-layout">
    <!-- 側邊欄 -->
    <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <h2 v-if="!sidebarCollapsed">後台管理</h2>
        <button class="toggle-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          {{ sidebarCollapsed ? '→' : '←' }}
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="nav-item">
          <span class="nav-icon">📊</span>
          <span v-if="!sidebarCollapsed" class="nav-text">儀表板</span>
        </router-link>
        <router-link to="/admin/hero-slides" class="nav-item">
          <span class="nav-icon">🖼️</span>
          <span v-if="!sidebarCollapsed" class="nav-text">首頁輪播</span>
        </router-link>
        <router-link to="/admin/home-video" class="nav-item">
          <span class="nav-icon">🎬</span>
          <span v-if="!sidebarCollapsed" class="nav-text">首頁影片</span>
        </router-link>
        <router-link to="/admin/products" class="nav-item">
          <span class="nav-icon">📦</span>
          <span v-if="!sidebarCollapsed" class="nav-text">產品管理</span>
        </router-link>
        <router-link to="/admin/events" class="nav-item">
          <span class="nav-icon">📰</span>
          <span v-if="!sidebarCollapsed" class="nav-text">活動管理</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div v-if="!sidebarCollapsed" class="user-info">
          <span class="user-email">{{ adminData?.email }}</span>
          <span class="user-role">{{ adminData?.role === 'super_admin' ? '超級管理員' : '編輯者' }}</span>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <span class="nav-icon">🚪</span>
          <span v-if="!sidebarCollapsed">登出</span>
        </button>
      </div>
    </aside>

    <!-- 主內容區 -->
    <main class="admin-main">
      <header class="admin-header">
        <div class="header-left">
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="header-right">
          <router-link to="/" class="back-to-site" target="_blank">
            查看網站 ↗
          </router-link>
        </div>
      </header>

      <div class="admin-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const route = useRoute();
const router = useRouter();
const { adminData, logout } = useAuth();

const sidebarCollapsed = ref(false);

const pageTitle = computed(() => {
  const titles = {
    '/admin/dashboard': '儀表板',
    '/admin/hero-slides': '首頁輪播管理',
    '/admin/home-video': '首頁影片管理',
    '/admin/products': '產品管理',
    '/admin/events': '活動管理'
  };
  return titles[route.path] || '後台管理';
});

async function handleLogout() {
  await logout();
  router.push('/admin/login');
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

/* 側邊欄 */
.admin-sidebar {
  width: 260px;
  background: #1a1a2e;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

.admin-sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  font-size: 18px;
  margin: 0;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.sidebar-nav {
  flex: 1;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.router-link-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-email {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 11px;
  color: #667eea;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: rgba(220, 38, 38, 0.5);
}

/* 主內容區 */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.admin-header h1 {
  font-size: 24px;
  color: #1a1a2e;
  margin: 0;
}

.back-to-site {
  padding: 8px 16px;
  background: #f0f0f0;
  color: #333;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  transition: background 0.2s;
}

.back-to-site:hover {
  background: #e0e0e0;
}

.admin-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

/* RWD */
@media (max-width: 768px) {
  .admin-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    transform: translateX(-100%);
  }

  .admin-sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .admin-main {
    width: 100%;
  }
}
</style>

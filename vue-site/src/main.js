import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './global.css';
import './theme.css';
import '@/styles/ageGate.css';
import App from './App.vue';
import HomePage from './pages/HomePage.vue';
import TeamPage from './pages/TeamPage.vue';
import ProductsPage from './pages/ProductsPage.vue';
import NewsPage from './pages/NewsPage.vue';
import LibraryPage from './pages/LibraryPage.vue';
import LinkPage from './pages/LinkPage.vue';
import AgeGate from '@/pages/AgeGate.vue';
import { useAgeGate } from '@/composables/useAgeGate';

// Admin imports
import AdminLayout from '@/admin/AdminLayout.vue';
import AdminLoginPage from '@/admin/pages/LoginPage.vue';
import AdminDashboard from '@/admin/pages/DashboardPage.vue';
import HeroSlidesEditor from '@/admin/pages/HeroSlidesEditor.vue';
import HomeVideoEditor from '@/admin/pages/HomeVideoEditor.vue';
import ProductsEditor from '@/admin/pages/ProductsEditor.vue';
import EventsEditor from '@/admin/pages/EventsEditor.vue';

const routes = [
  { path: '/', component: HomePage },
  // 若 deploy 在 /kotogako/ 子路徑，不需要再額外定義 /kotogako 路由，保持單一根路由
  { path: '/team', component: TeamPage },
  { path: '/products', component: ProductsPage },
  { path: '/news', component: NewsPage },
  { path: '/library', component: LibraryPage },
  { path: '/link', component: LinkPage },
  { path: '/age-gate', name: 'AgeGate', component: AgeGate },
  
  // Admin routes
  { path: '/admin/login', name: 'AdminLogin', component: AdminLoginPage, meta: { isAdminPage: true, requiresAuth: false } },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { isAdminPage: true, requiresAuth: true },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'hero-slides', name: 'HeroSlidesEditor', component: HeroSlidesEditor },
      { path: 'home-video', name: 'HomeVideoEditor', component: HomeVideoEditor },
      { path: 'products', name: 'ProductsEditor', component: ProductsEditor },
      { path: 'events', name: 'EventsEditor', component: EventsEditor }
    ]
  }
];

// 使用 base 確保 GitHub Pages 子路徑正常 (vite.config.js 已設 base:'/kotogako/')
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// 路由守衛
router.beforeEach(async (to, from, next) => {
  const { isAccepted } = useAgeGate();
  
  // Admin 路由處理
  if (to.meta.isAdminPage) {
    // 動態導入 useAuth 避免循環依賴
    const { useAuth } = await import('@/composables/useAuth');
    const { isAdmin, loading } = useAuth();
    
    // 等待認證狀態載入完成
    if (loading.value) {
      // 等待認證初始化
      await new Promise(resolve => {
        const checkAuth = setInterval(() => {
          if (!loading.value) {
            clearInterval(checkAuth);
            resolve();
          }
        }, 50);
      });
    }
    
    // 已登入且要去登入頁 -> 導向 dashboard
    if (to.name === 'AdminLogin' && isAdmin.value) {
      return next('/admin/dashboard');
    }
    
    // 需要認證但未登入 -> 導向登入頁
    if (to.meta.requiresAuth && !isAdmin.value) {
      return next('/admin/login');
    }
    
    return next();
  }
  
  // 前台 AgeGate 邏輯
  const atAgeGate = to.name === 'AgeGate';
  if (isAccepted()) return next();
  if (atAgeGate) return next();
  next({ name: 'AgeGate', query: { redirect: to.fullPath.startsWith('/age-gate') ? '/' : to.fullPath } });
});

createApp(App).use(router).mount('#app');

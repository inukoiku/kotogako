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

const routes = [
  { path: '/', component: HomePage },
  // 若 deploy 在 /kotogako/ 子路徑，不需要再額外定義 /kotogako 路由，保持單一根路由
  { path: '/team', component: TeamPage },
  { path: '/products', component: ProductsPage },
  { path: '/news', component: NewsPage },
  { path: '/library', component: LibraryPage },
  { path: '/link', component: LinkPage },
  { path: '/age-gate', name: 'AgeGate', component: AgeGate }
];

// 使用 base 確保 GitHub Pages 子路徑正常 (vite.config.js 已設 base:'/kotogako/')
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// 防止重整時 redirect 參數被不斷嵌套
router.beforeEach((to, from, next) => {
  const { isAccepted } = useAgeGate();
  const atAgeGate = to.name === 'AgeGate';
  if (isAccepted()) return next();
  if (atAgeGate) return next(); // 已在 /age-gate 不再加入 redirect
  // 只在第一次導向時帶入目標路徑；不帶 /age-gate 自己
  next({ name: 'AgeGate', query: { redirect: to.fullPath.startsWith('/age-gate') ? '/' : to.fullPath } });
});

createApp(App).use(router).mount('#app');

import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

// 合併原 useHomepageData 與 homePageState：集中首頁資料 + 狀態
export function useHomePageState() {
  const base = import.meta.env.BASE_URL || '/';
  const router = useRouter();

  /* ========== 響應式螢幕大小檢測 ========== */
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  // 根據螢幕大小決定背景尺寸模式
  const isDesktop = computed(() => windowWidth.value >= 992); // 992px 以上為桌面
  const responsiveBgSize = computed(() => isDesktop.value ? 'cover' : 'contain');
  
  // 監聽視窗大小變化
  function updateWindowWidth() {
    windowWidth.value = window.innerWidth;
  }

  /* ========== 原 useHomepageData 靜態資料 ========== */
  const heroSlides = computed(() => [
    { 
      id: 1, 
      image: `${base}/images/home/bk_mid.jpg`, 
      title: '歡迎來到 犬高育', 
      subtitle: '一起學習・一起成長・一起創造價值', 
      cta: { label: '查看商品', to: '/products' },
      // 響應式配置 - 根據螢幕大小動態調整
      bgPosition: 'center center',
      bgSize: responsiveBgSize.value, // 桌面用 cover，平板手機用 contain
      cssClasses: responsiveBgSize.value === 'cover' ? 'bg-cover' : 'bg-contain'
    },
    { 
      id: 2, 
      image: `${base}/images/home/highschoolmainbk_2.jpg`, 
      title: 'FB粉絲團', 
      subtitle: '犬高育粉絲團持續更新，歡迎追蹤', 
      cta: { label: '犬高育FB粉絲團', to: 'https://www.facebook.com/profile.php?id=61560013116714' },
      // 響應式配置 - 根據螢幕大小動態調整
      bgPosition: 'center center',
      bgSize: responsiveBgSize.value, // 桌面用 cover，平板手機用 contain
      cssClasses: responsiveBgSize.value === 'cover' ? 'bg-cover' : 'bg-contain'
    },
    { 
      id: 3, 
      image: `${base}/images/home/towel.png`, 
      title: '犬力以赴毛巾', 
      subtitle: '犬高育官方授權商品', 
      cta: { label: '犬力以赴毛巾', to: 'https://www.facebook.com/profile.php?id=61560013116714' },
      // 響應式配置 - 根據螢幕大小動態調整
      bgPosition: 'center center',
      bgSize: responsiveBgSize.value, // 桌面用 cover，平板手機用 contain
      cssClasses: responsiveBgSize.value === 'cover' ? 'bg-cover' : 'bg-contain'
    },
    { 
      id: 3, 
      image: `${base}/images/home/product_student.jpg`, 
      title: '犬高育學蘭服學生吊飾', 
      subtitle: '犬高育學蘭服學生吊飾', 
      cta: { label: '犬高育學蘭服學生吊飾', to: 'https://docs.google.com/forms/d/1tdrL6OFC3p3D9BuX3P9nXuBjB9_b0xZQ9ZaP13dXNuc/edit' },
      // 響應式配置 - 根據螢幕大小動態調整
      bgPosition: 'center center',
      bgSize: responsiveBgSize.value, // 桌面用 cover，平板手機用 contain
      cssClasses: responsiveBgSize.value === 'cover' ? 'bg-cover' : 'bg-contain'
    },
  ]);

  const news = ref([
    { id:1, date:'2025-07-20', title:'犬高育line官方開啟', tag:'公告' },
    { id:2, date:'2025-08-21', title:'2025遊行名牌開始', tag:'商品' },
    { id:3, date:'2025-09-01', title:'混血犬部粉絲團更名犬高育', tag:'活動' },
    { id:4, date:'2025-09-10', title:'2025新學期學生證開放', tag:'商品' },
    { id:5, date:'2025-09-15', title:'犬力以赴毛巾開放', tag:'商品' },
    { id:6, date:'2025-09-16', title:'犬高育官方網站上線', tag:'公告' }
  ]);

  const youtubeId = 'eBnZL9OEQow';
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeId}?rel=0`;

  /* ========== Hero Carousel ========== */
  const currentSlide = ref(0);
  const intervalMs = 6000;
  const transitioning = ref(false);
  let timer = null;

  const slideCount = computed(() => heroSlides.value.length);
  const prevSlideIndex = computed(() =>
    (currentSlide.value - 1 + slideCount.value) % slideCount.value
  );
  const nextSlideIndex = computed(() =>
    (currentSlide.value + 1) % slideCount.value
  );

  function goTo(i) {
    if (!slideCount.value) return;
    currentSlide.value = (i + slideCount.value) % slideCount.value;
  }
  function nextSlide() {
    if (!slideCount.value) return;
    transitioning.value = true;
    currentSlide.value = nextSlideIndex.value;
    endTransitionSoon();
  }
  function prevSlide() {
    if (!slideCount.value) return;
    transitioning.value = true;
    currentSlide.value = prevSlideIndex.value;
    endTransitionSoon();
  }
  function endTransitionSoon() {
    setTimeout(() => (transitioning.value = false), 450);
  }
  function startAuto() {
    stopAuto();
    if (slideCount.value > 1) {
      timer = setInterval(nextSlide, intervalMs);
    }
  }
  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // 點擊輪播圖片導航函數
  function navigateToSlide(slide) {
    if (slide.cta && slide.cta.to) {
      // 檢查是否為外部 URL（以 http 或 https 開頭）
      if (slide.cta.to.startsWith('http://') || slide.cta.to.startsWith('https://')) {
        // 外部 URL - 在新視窗開啟
        window.open(slide.cta.to, '_blank', 'noopener,noreferrer');
      } else {
        // 內部路由 - 使用 Vue Router
        router.push(slide.cta.to);
      }
    }
  }

  onMounted(() => {
    startAuto();
    // 監聽視窗大小變化
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateWindowWidth);
      // 初始設置當前視窗大小
      updateWindowWidth();
    }
    setTimeout(() => (showBadge.value = true), 300);
  });
  
  onBeforeUnmount(() => {
    stopAuto();
    // 移除視窗大小監聽器
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateWindowWidth);
    }
  });

  /* ========== 首頁新聞：倒序並只取前三 ========== */
  const newsDesc = computed(() => [...news.value].reverse());
  const newsTop3 = computed(() => newsDesc.value.slice(0, 3));

  /* ========== 封面徽章 (可選) ========== */
  const showBadge = ref(false);

  return {
    base,
    heroSlides,
    currentSlide,
    prevSlideIndex,
    nextSlideIndex,
    nextSlide,
    prevSlide,
    goTo,
    startAuto,
    stopAuto,
    transitioning,
    navigateToSlide,
    news: newsDesc, // 倒序全量
    newsTop3,   // 首頁前三
    showBadge,
    youtubeEmbedUrl,
    // 新增響應式相關
    isDesktop,
    responsiveBgSize
  };
}
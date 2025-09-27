import { ref, computed } from 'vue';

export function useTeamPage() {
  const base = import.meta.env.BASE_URL || '/';
  const members = ref([
    { id:1, name:'瑋瑋', role:'創辦人', roleLabel:'FOUNDER', photo:'images/instructor1.jpg' },
    { id:2, name:'喆喆', role:'教學主任', roleLabel:'DIRECTOR', photo:'images/instructor2.jpg' },
    { id:3, name:'汪小雷', role:'教學主任', roleLabel:'DIRECTOR', photo:'images/instructor2.jpg' },
    { id:4, name:'小林風', role:'商品經理', roleLabel:'PRODUCT', photo:'images/instructor3.jpg' },
    { id:5, name:'恩仔', role:'行銷專員', roleLabel:'MARKETING', photo:'images/instructor4.jpg' },
    { id:6, name:'米飛', role:'行銷專員', roleLabel:'MARKETING', photo:'images/instructor4.jpg' },
    { id:7, name:'結狗', role:'行銷專員', roleLabel:'MARKETING', photo:'images/instructor4.jpg' },
    { id:8, name:'呱', role:'行銷專員', roleLabel:'MARKETING', photo:'images/instructor4.jpg' },
    { id:9, name:'阿西', role:'行銷專員', roleLabel:'MARKETING', photo:'images/instructor4.jpg' }
  ]);
  // 直接在此定義 timeline，移除對 useHomepageData 的依賴
  const timeline = ref([
    { id:1, date:'2022-02-10', title:'第一次悠遊卡', desc:'第一次狗勾悠遊卡製作' },
    { id:2, date:'2022-03-15', title:'行動代號汪 名牌製作', desc:'製作遊行名牌' },
    { id:3, date:'2022-04-18', title:'ENFINITY成立', desc:'初步規劃與團隊組建ENFINITY' },
    { id:4, date:'2022-05-20', title:'契約成立 悠遊卡製作', desc:'呈現主犬風格的悠遊卡製作' },
    { id:5, date:'2022-06-01', title:'日式阩杯製作', desc:'嘗試製作日式風格產品' },
    { id:6, date:'2022-07-01', title:'春遊糖果狗 悠遊卡製作', desc:'符合春天節慶風格悠遊卡製作' },
    { id:7, date:'2022-08-01', title:'專門特製狗勾棒球服製作', desc:'特製推出專屬每隻狗勾的棒球服' },
    { id:8, date:'2022-09-01', title:'遊行名牌製作 流明石', desc:'為了遊行製作的名牌活動' },
    { id:9, date:'2022-10-01', title:'混血犬部成立', desc:'混血犬部粉絲團成立' },
    { id:10, date:'2022-11-01', title:'犬高育學生證亮相', desc:'犬高育概念初步展現' },
    { id:11, date:'2022-12-01', title:'狗勾職業吊飾', desc:'呈現不同風格和遊戲結合的可愛狗勾吊飾' },
    { id:12, date:'2023-01-01', title:'倖存者悠遊卡', desc:'倖存者風格悠遊卡製作' },
    { id:13, date:'2023-02-01', title:'狗勾夏日杯套', desc:'呈現狗勾在夏天遊玩風格的實用杯套' },
    { id:14, date:'2023-03-01', title:'犬高育官方line成立', desc:'犬高育官方line成立' },
    { id:15, date:'2023-04-01', title:'馬拉灣專車', desc:'第一次號召馬拉灣專車' },
    { id:16, date:'2023-05-01', title:'狗勾飯友', desc:'吃飯不方便戴頭套拍照，狗勾飯友幫你解決' },
    { id:17, date:'2023-06-01', title:'狗勾領巾', desc:'可愛的狗勾一定要有領巾!' },
    { id:18, date:'2025-08-22', title:'極密檔案汪 遊行名牌', desc:'2025年同志大遊行名牌!' }
  ]);

  // 團隊圖集資料
  const teamGallery = ref([
    {
      id: 'g1',
      label: 'member_1',
      buttonA: '/images/members/wei_btn.png',        // 默認圖片
      buttonB: '/images/members/wei_btn_active.png', // 激活/hover圖片
      image: '/images/members/member_wei.png',
      caption: ''
    },
    {
      id: 'g2',
      label: 'member_2',
      buttonA: '/images/members/en_btn.png',
      buttonB: '/images/members/en_btn_active.png',
      image: '/images/members/member_en.png',
      caption: ''
    },
    {
      id: 'g3',
      label: 'member_3',
      buttonA: '/images/members/c_btn.png',
      buttonB: '/images/members/c_btn_active.png',
      image: '/images/members/member_c.png',
      caption: ''
    },
    {
      id: 'g4',
      label: 'member_4',
      buttonA: '/images/members/lei_btn.png',
      buttonB: '/images/members/lei_btn_active.png',
      image: '/images/members/member_lei.png',
      caption: ''
    },
    {
      id: 'g5',
      label: 'member_5',
      buttonA: '/images/members/kaza_btn.png',
      buttonB: '/images/members/kaza_btn_active.png',
      image: '/images/members/member_kaza.png',
      caption: ''
    },
    {
      id: 'g6',
      label: 'member_6',
      buttonA: '/images/members/zhe_btn.png',
      buttonB: '/images/members/zhe_btn_active.png',
      image: '/images/members/member_zhe.png',
      caption: ''
    },
    {
      id: 'g7',
      label: 'member_7',
      buttonA: '/images/members/miffy_btn.png',
      buttonB: '/images/members/miffy_btn_active.png',
      image: '/images/members/member_miffy.png',
      caption: ''
    },
    {
      id: 'g8',
      label: 'member_8',
      buttonA: '/images/members/jay_btn.png',
      buttonB: '/images/members/jay_btn_active.png',
      image: '/images/members/member_jay.png',
      caption: ''
    },
    // {
    //   id: 'g9',
    //   label: 'member_9',
    //   buttonA: '/images/members/en_btn.png',
    //   buttonB: '/images/members/en_btn_active.png',
    //   image: '/images/members/member_gua.png',
    //   caption: ''
    // }
  ]);

  const activeGallery = ref('g1');
  const hoverButton = ref(null);

  // 當前顯示的圖集項目
  const currentGalleryItem = computed(() => {
    return teamGallery.value.find(g => g.id === activeGallery.value) || teamGallery.value[0];
  });

  // 獲取按鈕圖片：激活或hover時顯示B圖，否則顯示A圖
  function getButtonImage(item) {
    const imagePath = (activeGallery.value === item.id || hoverButton.value === item.id) 
      ? item.buttonB 
      : item.buttonA;
    
    // 確保路徑正確，避免 iOS Safari 載入問題
    return imagePath.startsWith('/') ? imagePath : '/' + imagePath;
  }

  // 圖片預載功能，減少 iOS Safari 載入問題
  function preloadImages() {
    const imageUrls = [];
    teamGallery.value.forEach(item => {
      imageUrls.push(base + item.buttonA);
      imageUrls.push(base + item.buttonB);
      imageUrls.push(base + item.image);
    });
    
    let loadedCount = 0;
    const totalImages = imageUrls.length;
    
    imageUrls.forEach(url => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        // 當所有圖片載入完成後，更新滾動狀態
        if (loadedCount === totalImages) {
          console.log('All images loaded, updating scroll state');
          setTimeout(() => {
            updateScrollState();
          }, 100);
        }
      };
      img.onerror = () => {
        console.warn(`Failed to preload image: ${url}`);
        loadedCount++;
        // 即使失敗也要計數，避免卡住
        if (loadedCount === totalImages) {
          setTimeout(() => {
            updateScrollState();
          }, 100);
        }
      };
      img.src = url;
    });
  }

  // 倒序時間軸
  const reversedTimeline = computed(() => [...timeline.value].reverse());

  // 滾動函數
  const miniRef = ref(null);
  function scroll(dir) {
    const el = miniRef.value;
    if (!el) return;
    el.scrollBy({ left: dir * 400, behavior: 'smooth' });
  }

  // 圖集按鈕滾動功能
  const galleryBtnRow = ref(null);
  const canScrollLeft = ref(false);
  const canScrollRight = ref(false); // 初始設為 false，等 DOM 渲染完成後再計算
  const isScrolling = ref(false); // 防止重複滾動

  function scrollGallery(dir) {
    const el = galleryBtnRow.value;
    if (!el || isScrolling.value) return; // 防止重複滾動
    
    isScrolling.value = true;
    
    // 考慮重疊效果，每次滾動約一個按鈕的有效寬度
    const scrollAmount = 190 - 39; // 按鈕寬度減去重疊部分
    
    // 使用 requestAnimationFrame 來優化滾動
    const startTime = performance.now();
    const startScrollLeft = el.scrollLeft;
    const targetScrollLeft = Math.max(0, Math.min(
      el.scrollWidth - el.clientWidth,
      startScrollLeft + (dir * scrollAmount)
    )); // 確保滾動範圍在有效範圍內
    const duration = 300; // 縮短動畫時間讓感覺更敏捷
    
    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用 easeOutQuart 緩動函數，讓結尾更平滑
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentScrollLeft = startScrollLeft + (targetScrollLeft - startScrollLeft) * easeOutQuart;
      el.scrollLeft = currentScrollLeft;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 動畫完成後更新滾動狀態
        isScrolling.value = false;
        updateScrollState();
      }
    }
    
    requestAnimationFrame(animate);
  }

  function updateScrollState() {
    const el = galleryBtnRow.value;
    if (!el) return;
    
    // 確保元素已經完全渲染
    const scrollLeft = Math.round(el.scrollLeft);
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;
    
    // 線上環境偵錯資訊
    console.log('Scroll State Debug:', {
      scrollLeft,
      scrollWidth,
      clientWidth,
      hasScrollableContent: scrollWidth > clientWidth,
      canScrollRightCalc: scrollWidth > clientWidth && scrollLeft < (scrollWidth - clientWidth - 2)
    });
    
    canScrollLeft.value = scrollLeft > 2; // 增加容差值
    // 增加容差值，避免浮點數精度問題
    canScrollRight.value = scrollWidth > clientWidth && scrollLeft < (scrollWidth - clientWidth - 2);
    
    console.log('Button States:', {
      canScrollLeft: canScrollLeft.value,
      canScrollRight: canScrollRight.value
    });
  }

  // 初始化滾動狀態
  function initScrollState() {
    let attempts = 0;
    const maxAttempts = 15; // 稍微增加嘗試次數應對線上環境
    
    const checkAndInit = () => {
      attempts++;
      const el = galleryBtnRow.value;
      
      if (!el) {
        console.log(`Attempt ${attempts}: Element not found test`);
        if (attempts < maxAttempts) {
          setTimeout(checkAndInit, 100); // 線上環境需要更多時間
        }
        return;
      }
      
      // 檢查圖片是否載入完成
      const images = el.querySelectorAll('img');
      let imagesLoaded = true;
      images.forEach(img => {
        if (!img.complete || img.naturalHeight === 0) {
          imagesLoaded = false;
        }
      });
      
      // 等待元素完全渲染且圖片載入完成
      if (el.scrollWidth === 0 || el.clientWidth === 0 || !imagesLoaded) {
        // console.log(`Attempt ${attempts}: Element/Images not ready`, {
        //   scrollWidth: el.scrollWidth,
        //   clientWidth: el.clientWidth,
        //   imagesLoaded: imagesLoaded
        // });
        if (attempts < maxAttempts) {
          setTimeout(checkAndInit, 100);
        }
        return;
      }
      
      console.log(`Attempt ${attempts}: Element ready, initializing...`);
      
      // 確保初始位置在最左邊
      el.scrollLeft = 0;
      
      // 立即更新狀態
      updateScrollState();
      
      // 額外檢查確保準確性，線上環境需要稍微多等一下
      setTimeout(() => {
        updateScrollState();
      }, 100);
      
      // 再做一次最終檢查
      setTimeout(() => {
        updateScrollState();
      }, 200);
    };
    
    checkAndInit();
  }

  // 監聽視窗大小變化和元素尺寸變化
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      setTimeout(updateScrollState, 50); // 減少延遲
    });
    
    // 使用 ResizeObserver 監聽滾動容器尺寸變化
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        setTimeout(updateScrollState, 25); // 減少延遲
      });
      
      // 當 galleryBtnRow 可用時開始觀察
      const observeElement = () => {
        if (galleryBtnRow.value) {
          resizeObserver.observe(galleryBtnRow.value);
        } else {
          setTimeout(observeElement, 50); // 減少延遲
        }
      };
      observeElement();
    }
  }

  return { 
    members, 
    timeline, 
    base,
    teamGallery,
    activeGallery,
    hoverButton,
    currentGalleryItem,
    getButtonImage,
    preloadImages,
    reversedTimeline,
    miniRef,
    scroll,
    galleryBtnRow,
    scrollGallery,
    canScrollLeft,
    canScrollRight,
    updateScrollState,
    initScrollState,
    isScrolling
  };
}
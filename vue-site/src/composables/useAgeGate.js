import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const KEY = 'phs_age_ok';

export function useAgeGate() {
  const isAccepted = () => {
  // 改用 sessionStorage：關閉瀏覽器（非分頁刷新）後會失效
  try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; }
  };
  const setAccepted = () => {
  try { sessionStorage.setItem(KEY, '1'); } catch {}
  };
  return { isAccepted, setAccepted };
}

// 合併原 useAgeGatePage 功能：提供按鈕圖、hover 與導向邏輯
export function useAgeGatePage(){
  const router = useRouter();
  const route = useRoute();
  const { setAccepted } = useAgeGate();
  const base = import.meta.env.BASE_URL || '/';
  const baseWithSlash = base.endsWith('/') ? base : base + '/';
  const imgRoot = baseWithSlash + 'images/common/';
  const yesBtnSrc = imgRoot + 'rules_agree.png';
  const yesBtnHoverSrc = imgRoot + 'rules_agree_active.png';
  const exitBtnSrc = imgRoot + 'rules_leave.png';
  const exitBtnHoverSrc = imgRoot + 'rules_leave_active.png';

  const isYesHover = ref(false);
  const isExitHover = ref(false);

  // 位置調整相關的狀態
  const panelRef = ref(null);
  const bottomRef = ref(null);
  const bgImageLoaded = ref(false);
  const bgImageDimensions = ref({ width: 650, height: 866 }); // 預設值

  // 計算背景圖片的實際顯示區域並調整底部位置
  function adjustBottomPosition() {
    if (!panelRef.value || !bottomRef.value || !bgImageLoaded.value) return;
    
    const panel = panelRef.value;
    const bottom = bottomRef.value;
    
    // 使用實際檢測到的圖片尺寸
    const { width: bgImageWidth, height: bgImageHeight } = bgImageDimensions.value;
    
    // 獲取 panel 的實際尺寸
    const panelWidth = panel.offsetWidth;
    const panelHeight = panel.offsetHeight;
    
    // 計算背景圖片在 contain 模式下的實際顯示尺寸
    const scaleX = panelWidth / bgImageWidth;
    const scaleY = panelHeight / bgImageHeight;
    const scale = Math.min(scaleX, scaleY);
    
    const displayedImageWidth = bgImageWidth * scale;
    const displayedImageHeight = bgImageHeight * scale;
    
    // 計算圖片在容器中的垂直偏移和位置
    const verticalOffset = (panelHeight - displayedImageHeight) / 2;
    const imageBottom = panelHeight - verticalOffset;
    
    // 設置底部區域的位置，讓它對齊到背景圖片的底部
    const bottomHeight = bottom.offsetHeight;
    var padding = displayedImageHeight/6; // 距離圖片底部的間距
    // var dis = 0;
    // console.log('scaleY:',scaleY);
    // if(scaleY<1){
    //   dis = 50;
    //   padding = padding*scaleY;
    // }
    const targetTop = imageBottom-padding ;
    
    // 確保不會超出容器範圍
    // const finalTop = Math.max(padding, Math.min(targetTop, panelHeight - bottomHeight-padding));

    bottom.style.position = 'absolute';
    bottom.style.top = `${targetTop}px`;
    bottom.style.left = '50%';
    bottom.style.transform = 'translateX(-50%)';
  }

  // 節流函數
  function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  const throttledAdjust = throttle(adjustBottomPosition, 100);

  // 初始化位置調整功能
  function initPositionAdjustment() {
    onMounted(() => {
      // 載入背景圖片並獲取實際尺寸
      const bgImage = new Image();
      bgImage.onload = () => {
        bgImageDimensions.value = {
          width: bgImage.naturalWidth,
          height: bgImage.naturalHeight
        };
        bgImageLoaded.value = true;
        
        // 圖片載入完成後調整位置
        setTimeout(adjustBottomPosition, 50);
      };
      bgImage.onerror = () => {
        // 圖片載入失敗時使用預設尺寸
        console.warn('背景圖片載入失敗，使用預設尺寸');
        bgImageLoaded.value = true;
        setTimeout(adjustBottomPosition, 50);
      };
      bgImage.src = '/images/common/rules.png';
      
      // 初始調整（防止圖片載入過快）
      setTimeout(adjustBottomPosition, 100);
      
      // 監聽視窗大小變化
      window.addEventListener('resize', throttledAdjust);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', throttledAdjust);
    });
  }

  function agree(){
    setAccepted();
    router.replace(route.query.redirect && !String(route.query.redirect).startsWith('/age-gate')
      ? route.query.redirect
      : '/');
  }
  function leave(){ window.location.href = 'https://www.google.com/'; }
  function onImgError(e,type){
    const el = e.target;
    if(type==='yes' && el.src.includes('rules_agree_active')) el.src = yesBtnSrc;
    if(type==='exit' && el.src.includes('rules_leave_active')) el.src = exitBtnSrc;
  }

  // 自動初始化位置調整
  initPositionAdjustment();

  return { 
    yesBtnSrc, 
    yesBtnHoverSrc, 
    exitBtnSrc, 
    exitBtnHoverSrc, 
    isYesHover, 
    isExitHover, 
    agree, 
    leave, 
    onImgError,
    // 位置調整相關
    panelRef,
    bottomRef,
    adjustBottomPosition
  };
}
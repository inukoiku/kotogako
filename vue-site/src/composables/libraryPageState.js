import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';

export function useLibraryPageState() {
  let base = import.meta.env.BASE_URL || '/';
  try {
    if(base.endsWith('/kotogako/')){
      base = base.slice(0,-1);
    }
  } catch {}

  const currentBlock = ref('A');

  // 響應式佈局控制 - 在手機和平板上使用 grid 佈局
  const windowWidth = ref(window.innerWidth);
  const useResponsiveLayout = computed(() => windowWidth.value <= 991.98);

  const btnA        = '/images/library/vault_btn.png';
  const btnAActive  = '/images/library/vault_btn_active.png';
  const btnAHover   = '/images/library/vault_btn_active.png';
  const btnB        = '/images/library/gallery_btn.png';
  const btnBActive  = '/images/library/gallery_btn_active.png';
  const btnBHover   = '/images/library/gallery_btn_active.png';

  // Block A 照片資料 (Vault)
  const photosA = ref([
        { type:'single', autoLayout:true, absolute:true, src:'/images/library/about_vault.png', alt:'Gallery圖 1', caption:'', rawScale:0.7, cellScale:1, cellZ:3, itemScale:0.7, itemDX:-10, itemDY:-150, tweakX:0, tweakY:0 },
    { type:'framed', autoLayout:true, absolute:true, frameSrc:'/images/library/gold_frame.png', innerSrc:'/images/library/vault_1.jpg', alt:'Gallery圖 2', caption:'', scale:0.8, cellScale:0.8, cellZ:4, itemScale:0.8, itemDX:40, itemDY:-60, tweakX:0, tweakY:0,paddingleft:15,paddingtop:0,paddingright:0,paddingbottom:23 },
    { type:'framed', autoLayout:true, absolute:true, frameSrc:'/images/library/gold_frame.png', innerSrc:'/images/library/vault_2.jpg', alt:'Gallery圖 3', caption:'', scale:0.85, cellScale:1, cellZ:2, itemScale:0.9, itemDX:0, itemDY:-435, tweakX:0, tweakY:0,paddingleft:15,paddingtop:0,paddingright:0,paddingbottom:23 },
    { type:'framed', autoLayout:true, absolute:true, frameSrc:'/images/library/gold_frame.png', innerSrc:'/images/library/vault_3.jpg', alt:'Gallery圖 4', caption:'', scale:0.92, cellScale:1, cellZ:5, itemScale:0.8, itemDX:-25, itemDY:-180, tweakX:0, tweakY:0,paddingleft:15,paddingtop:0,paddingright:0,paddingbottom:23 },
    { type:'framed', autoLayout:true, absolute:true, frameSrc:'/images/library/gold_frame.png', innerSrc:'/images/library/vault_4.jpg', alt:'Gallery圖 5', caption:'', scale:0.95, cellScale:1, cellZ:1, itemScale:0.8, itemDX:20, itemDY:-540, tweakX:0, tweakY:0,paddingleft:15,paddingtop:0,paddingright:0,paddingbottom:23 },
    { type:'framed', autoLayout:true, absolute:true, frameSrc:'/images/library/gold_frame.png', innerSrc:'/images/library/vault_5.jpg', alt:'Gallery圖 6', caption:'', scale:0.88, cellScale:1, cellZ:6, itemScale:0.7, itemDX:45, itemDY:-340, tweakX:0, tweakY:0 ,paddingleft:15,paddingtop:0,paddingright:0,paddingbottom:23 },
    { type:'framed', autoLayout:true, absolute:true, frameSrc:'/images/library/gold_frame.png', innerSrc:'/images/library/vault_6.jpg', alt:'Gallery圖 6', caption:'', scale:0.88, cellScale:1, cellZ:6, itemScale:0.7, itemDX:45, itemDY:-340, tweakX:0, tweakY:0 ,paddingleft:15,paddingtop:0,paddingright:0,paddingbottom:23 },
    { type:'framed', autoLayout:true, absolute:true, frameSrc:'/images/library/gold_frame.png', innerSrc:'/images/library/vault_7.jpg', alt:'Gallery圖 6', caption:'', scale:0.88, cellScale:1, cellZ:6, itemScale:0.7, itemDX:45, itemDY:-340, tweakX:0, tweakY:0 ,paddingleft:15,paddingtop:0,paddingright:0,paddingbottom:23 }
  ]);

  // Block B 照片資料 (Gallery) - 保持原有設定
  const photosB = ref([
    { type:'single', autoLayout:true, absolute:true, src:'/images/library/left_worlds.png', alt:'Gallery圖 1', caption:'', rawScale:0.7, cellScale:1, cellZ:3, itemScale:0.7, itemDX:-10, itemDY:-150, tweakX:0, tweakY:0 },
    { type:'framed', autoLayout:true, absolute:true, frameSrc:'/images/library/frame.png', innerSrc:'/images/library/gallery_img_1.JPG', alt:'Gallery圖 2', caption:'', scale:0.8, cellScale:0.8, cellZ:4, itemScale:0.8, itemDX:40, itemDY:-60, tweakX:0, tweakY:0,paddingleft:16,paddingtop:0,paddingright:12,paddingbottom:23 },
    { type:'framed', autoLayout:true, absolute:true, frameSrc:'/images/library/frame.png', innerSrc:'/images/library/gallery_img_2.JPG', alt:'Gallery圖 3', caption:'', scale:0.85, cellScale:1, cellZ:2, itemScale:0.9, itemDX:0, itemDY:-435, tweakX:0, tweakY:0,paddingleft:6,paddingtop:0,paddingright:0,paddingbottom:27 },
    { type:'framed', autoLayout:true, absolute:true, frameSrc:'/images/library/frame.png', innerSrc:'/images/library/gallery_img_3.JPG', alt:'Gallery圖 4', caption:'', scale:0.92, cellScale:1, cellZ:5, itemScale:0.8, itemDX:-25, itemDY:-180, tweakX:0, tweakY:0,paddingleft:15,paddingtop:0,paddingright:11,paddingbottom:23 },
    { type:'framed', autoLayout:true, absolute:true, frameSrc:'/images/library/frame.png', innerSrc:'/images/library/gallery_img_4.JPG', alt:'Gallery圖 5', caption:'', scale:0.95, cellScale:1, cellZ:1, itemScale:0.8, itemDX:20, itemDY:-540, tweakX:0, tweakY:0,paddingleft:7,paddingtop:0,paddingright:0,paddingbottom:27 },
    { type:'framed', autoLayout:true, absolute:true, frameSrc:'/images/library/frame.png', innerSrc:'/images/library/gallery_img_5.PNG', alt:'Gallery圖 6', caption:'', scale:0.88, cellScale:1, cellZ:6, itemScale:0.7, itemDX:45, itemDY:-340, tweakX:0, tweakY:0 ,paddingleft:9,paddingtop:0,paddingright:0,paddingbottom:27 }
  ]);

  const hover = ref('');
  const gridRefA = ref(null);
  const gridRefB = ref(null);
  const blockARef = ref(null);
  const blockBRef = ref(null);
  const librarySectionRef = ref(null);

  // 圖片放大功能
  const showImageModal = ref(false);
  const modalImageSrc = ref('');
  const modalImageAlt = ref('');
  const modalImage = ref(null);

  // 處理圖片載入時的動態縮放
  function handleImageLoad() {
    if (!modalImage.value) return;
    
    const img = modalImage.value;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // 根據螢幕大小調整預留空間
    const isMobile = windowWidth <= 768;
    const widthRatio = isMobile ? 0.95 : 0.9;
    const heightRatio = isMobile ? 0.9 : 0.9;
    const padding = isMobile ? 10 : 30; // 額外預留關閉按鈕空間
    
    // 計算可用空間
    const maxWidth = windowWidth * widthRatio;
    const maxHeight = (windowHeight * heightRatio) - padding;
    
    // 獲取圖片原始尺寸
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    
    if (imgWidth && imgHeight) {
      // 計算縮放比例
      const scaleX = maxWidth / imgWidth;
      const scaleY = maxHeight / imgHeight;
      const scale = Math.min(scaleX, scaleY, 1); // 取最小值，且不超過 1（不放大）
      
      // 應用計算後的尺寸
      const finalWidth = imgWidth * scale;
      const finalHeight = imgHeight * scale;
      
      // 設定圖片尺寸
      img.style.width = `${finalWidth}px`;
      img.style.height = `${finalHeight}px`;
      img.style.maxWidth = 'none';
      img.style.maxHeight = 'none';
      
      console.log(`圖片縮放: ${imgWidth}x${imgHeight} → ${finalWidth.toFixed(0)}x${finalHeight.toFixed(0)} (比例: ${scale.toFixed(2)})`);
    }
  }

  // 處理圖片點擊事件
  function handleImageClick(photo) {
    const imageSrc = base + photo.innerSrc;
    openImageModal(imageSrc, photo.alt);
    
    // 重置圖片樣式，等待新圖片載入
    setTimeout(() => {
      if (modalImage.value) {
        modalImage.value.style.width = '';
        modalImage.value.style.height = '';
        modalImage.value.style.maxWidth = '';
        modalImage.value.style.maxHeight = '';
      }
    }, 50);
  }

  // ESC 鍵關閉彈出視窗
  function handleEscape(event) {
    if (event.key === 'Escape' && showImageModal.value) {
      closeImageModal();
    }
  }

  // 窗口大小改變時重新計算圖片尺寸
  function handleResize() {
    windowWidth.value = window.innerWidth;
    if (showImageModal.value && modalImage.value) {
      handleImageLoad();
    }
  }

  // 開啟圖片放大視窗
  function openImageModal(imageSrc, imageAlt = '') {
    modalImageSrc.value = imageSrc;
    modalImageAlt.value = imageAlt;
    showImageModal.value = true;
    // 防止背景滾動
    document.body.style.overflow = 'hidden';
  }

  // 關閉圖片放大視窗
  function closeImageModal() {
    showImageModal.value = false;
    modalImageSrc.value = '';
    modalImageAlt.value = '';
    // 恢復背景滾動
    document.body.style.overflow = '';
  }

  function onImgErr(e){ e.target.removeAttribute('src'); }
  function onPhotoErr(e, isSingle){
    e.target.onerror = null;
    e.target.src = base + (isSingle ? '/images/library/left_worlds.png'
                                    : '/images/common/mainboy.png');
  }

  // 佈局函式 - 通用
  function applyLayoutToBlock(photos, blockEl, gridEl) {
    if(!blockEl || !gridEl) return;
    const cols = 2;
    const gapX = 18, gapY = 18;
    const maxGridWidth = 1200;
    const maxHeight = 1600;
    const gridWidth = Math.min(blockEl.clientWidth, maxGridWidth);
    const shrink = 100;
    const cellW = Math.round(gridWidth/cols - shrink);
    const autoItems = photos.value.filter(p=>p.autoLayout);
    let row=0, col=0, maxBottom=0;
    
    autoItems.forEach(p=>{
      const aspect = p.type==='single' ? (4/5) : (7/10);
      const cellH = Math.round(cellW / aspect);
      p.sizeW = cellW;
      p.sizeH = cellH;
      p.absX = col * (cellW + gapX);
      p.absY = row * (cellH + gapY);
      const bottom = p.absY + cellH;
      if(bottom>maxBottom) maxBottom = bottom;
      col++;
      if(col>=cols){ col=0; row++; }
    });
    
    const gridHeight = Math.min(maxBottom, maxHeight);
    gridEl.style.width = gridWidth + 'px';
    gridEl.style.height = gridHeight + 'px';
  }

  function adjustSectionHeight(){
    const section = librarySectionRef.value;
    const activeGrid = currentBlock.value === 'A' ? gridRefA.value : gridRefB.value;
    if(!section || !activeGrid) return;
    
    const items = activeGrid.querySelectorAll('.lib-photo-item');
    if(!items.length) return;
    
    let maxBottom = 0;
    items.forEach(el => {
      const r = el.getBoundingClientRect();
      if(r.bottom > maxBottom) maxBottom = r.bottom;
    });
    
    const sectionRect = section.getBoundingClientRect();
    const needed = Math.ceil(maxBottom - sectionRect.top) + 40;
    if(needed > section.offsetHeight){
      section.style.minHeight = needed + 'px';
    }
  }

  function recalcBlockBounds(){
    // Block A 已改用純 CSS grid，不再套用絕對定位計算
    // Block B 在響應式模式下也不再使用絕對定位計算
    if(currentBlock.value === 'B' && !useResponsiveLayout.value) {
      applyLayoutToBlock(photosB, blockBRef.value, gridRefB.value);
    }
    adjustSectionHeight();
  }

  function scheduleRecalc(){
    nextTick(() => requestAnimationFrame(recalcBlockBounds));
  }

  onMounted(() => {
    scheduleRecalc();
    window.addEventListener('resize', scheduleRecalc);
    // 添加鍵盤和視窗調整事件監聽器
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('resize', handleResize);
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', scheduleRecalc);
    // 移除事件監聽器
    document.removeEventListener('keydown', handleEscape);
    window.removeEventListener('resize', handleResize);
    // 確保在組件卸載時恢復滾動
    document.body.style.overflow = '';
  });

  // Block A 改為純 CSS grid，不需再監聽計算
  // Block B 在響應式模式下也不需要監聽計算
  watch(photosB, ()=>{ 
    if(currentBlock.value==='B' && !useResponsiveLayout.value) {
      scheduleRecalc(); 
    }
  }, { deep:true });
  watch(currentBlock, scheduleRecalc);
  
  // 響應式佈局變化時重新計算
  watch(useResponsiveLayout, scheduleRecalc);

  // 樣式函式
  function createItemStyle(p) {
    // 如果是響應式佈局模式，不使用絕對定位
    if(useResponsiveLayout.value) {
      return {
        '--frame-offset-x': (p.offsetX||0)+'px',
        '--frame-offset-y': (p.offsetY||0)+'px',
        '--frame-scale': (p.scale||p.frameScale||1)
      };
    }
    
    if(p.absolute){
      return {
        position:'absolute',
        left:(p.absX||0)+'px',
        top:(p.absY||0)+'px',
        width: (p.sizeW? p.sizeW+'px':'auto'),
        height:(p.sizeH? p.sizeH+'px':'auto'),
        transform:`translate(${p.itemDX||0}px, ${p.itemDY||0}px) scale(${p.itemScale||1})`,
        zIndex:p.cellZ||1,
        '--frame-offset-x': (p.offsetX||0)+'px',
        '--frame-offset-y': (p.offsetY||0)+'px',
        '--frame-scale': (p.scale||p.frameScale||1)
      };
    }
    return {
      '--frame-offset-x': (p.offsetX||0)+'px',
      '--frame-offset-y': (p.offsetY||0)+'px',
      '--frame-scale': (p.scale||p.frameScale||1)
    };
  }

  function imgStyleB(p) {
    if(p){
      return {
        paddingLeft:(p.paddingleft||0)+'px',
        paddingTop:(p.paddingtop||0)+'px',
        paddingRight:(p.paddingright||0)+'px',
        paddingBottom:(p.paddingbottom||0)+'px',
      };
    }
  }

  const itemStyleA = createItemStyle;
  const itemStyleB = createItemStyle;

  function setPhotoTweak(index, dx, dy){
    if(photos.value[index]){
      photos.value[index].tweakX = dx;
      photos.value[index].tweakY = dy;
      scheduleRecalc();
    }
  }

  function setItemTransform(index, { scale, moveX, moveY }){
    const p = photos.value[index];
    if(p){
      if(scale !== undefined) p.itemScale = scale;
      if(moveX !== undefined) p.itemDX = moveX;
      if(moveY !== undefined) p.itemDY = moveY;
      scheduleRecalc();
    }
  }

  return {
    base,
    currentBlock,
    btnA, btnAActive, btnAHover,
    btnB, btnBActive, btnBHover,
    hover,
    photosA,
    photosB,
    onImgErr,
    onPhotoErr,
    gridRefA,
    gridRefB,
    blockARef,
    blockBRef,
    librarySectionRef,
    itemStyleA,
    itemStyleB,
    setPhotoTweak,
    setItemTransform,
    scheduleRecalc,
    imgStyleB,
    useResponsiveLayout,
    // 圖片放大功能
    showImageModal,
    modalImageSrc,
    modalImageAlt,
    modalImage,
    openImageModal,
    closeImageModal,
    handleImageLoad,
    handleImageClick,
    handleEscape,
    handleResize
  };
}
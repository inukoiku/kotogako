import { ref, computed } from 'vue';
import { useFirestore } from './useFirestore';

export function useNewsPage() {
  const base = import.meta.env.BASE_URL || '/';
  const { loading, error, getNewsItems } = useFirestore();
  
  // 新聞橫幅資料（從 Firestore 取得）
  const newsBanners = ref([]);

  /**
   * 從 Firestore 獲取新聞資料
   */
  async function fetchNewsItems() {
    const items = await getNewsItems();
    
    if (items && items.length > 0) {
      newsBanners.value = items.map(item => ({
        id: item.id,
        image: item.imageUrl || '',
        htmlContent: item.htmlContent || '',
        title: item.title || '',
        order: item.order || 0
      }));
    }
  }

  // 彈出視窗狀態
  const showModal = ref(false);
  const currentContent = ref('');

  // 倒序顯示的新聞橫幅（最新的在最上方）
  const reversedNewsBanners = computed(() => {
    return [...newsBanners.value].reverse();
  });

  // 開啟彈出視窗
  function openModal(banner) {
    currentContent.value = banner.htmlContent;
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

  return {
    base,
    loading,
    error,
    newsBanners,
    reversedNewsBanners,
    fetchNewsItems,
    showModal,
    currentContent,
    openModal,
    closeModal
  };
}

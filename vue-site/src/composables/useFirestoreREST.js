import { ref } from 'vue';

/**
 * 使用 Firestore REST API 而非 SDK
 * 這樣可以避免 SDK 的離線狀態檢測問題
 */
export function useFirestoreREST() {
  const loading = ref(false);
  const error = ref(null);
  
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

  /**
   * 獲取 heroSlides 資料
   */
  async function getHeroSlides() {
    loading.value = true;
    error.value = null;

    try {
      const url = `${baseUrl}/pages/homepage/carouselItems`;
      console.log('🌐 Fetching hero slides via REST API:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.documents) {
        console.warn('No carousel documents found');
        return [];
      }

      // 轉換 Firestore REST API 格式到我們需要的格式
      const slides = data.documents
        .map(doc => {
          const fields = doc.fields;
          return {
            id: doc.name.split('/').pop(),
            imageUrl: fields.imageUrl?.stringValue || '',
            title: fields.title?.stringValue || '',
            description: fields.description?.stringValue || '',
            linkUrl: fields.linkUrl?.stringValue || '',
            altText: fields.altText?.stringValue || '',
            isActive: fields.isActive?.booleanValue ?? false,
            order: fields.order?.integerValue || 0
          };
        })
        .filter(slide => slide.isActive)
        .sort((a, b) => a.order - b.order);

      console.log(`✅ Fetched ${slides.length} hero slides via REST API`);
      return slides;
    } catch (err) {
      console.error('❌ Error fetching hero slides via REST:', err);
      error.value = err.message;
      return [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * 獲取首頁 YouTube 影片 ID
   */
  async function getHomeVideo() {
    loading.value = true;
    error.value = null;

    try {
      const url = `${baseUrl}/pages/homepage`;
      console.log('🌐 Fetching home video via REST API:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const videoId = data.fields?.homevideo?.stringValue || '';
      
      console.log(`✅ Fetched home video ID via REST API: ${videoId}`);
      return videoId;
    } catch (err) {
      console.error('❌ Error fetching home video via REST:', err);
      error.value = err.message;
      return '';
    } finally {
      loading.value = false;
    }
  }

  /**
   * 獲取產品頁面資料
   */
  async function getProducts() {
    loading.value = true;
    error.value = null;

    try {
      const url = `${baseUrl}/pages/productpage/productItems`;
      console.log('🌐 Fetching products via REST API:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.documents) {
        console.warn('No product documents found');
        return [];
      }

      // 轉換格式
      const products = data.documents
        .map(doc => {
          const fields = doc.fields;
          return {
            id: doc.name.split('/').pop(),
            imageUrl: fields.imageUrl?.stringValue || '',
            title: fields.title?.stringValue || '',
            htmlContent: fields.htmlContent?.stringValue || '',
            active: fields.active?.booleanValue ?? false,
            order: fields.order?.integerValue || 0
          };
        })
        .filter(product => product.active)
        .sort((a, b) => a.order - b.order);

      console.log(`✅ Fetched ${products.length} products via REST API`);
      return products;
    } catch (err) {
      console.error('❌ Error fetching products via REST:', err);
      error.value = err.message;
      return [];
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    getHeroSlides,
    getHomeVideo,
    getProducts
  };
}

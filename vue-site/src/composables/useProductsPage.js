import { ref, onMounted } from 'vue';
import { useFirestore } from './useFirestore';
import { USE_FALLBACK_DATA } from '../firebase/config';

export function useProductsPage() {
  const base = import.meta.env.BASE_URL || '/';
  const { getProducts, loading, error } = useFirestore();
  
  // 商品資料（從 Firestore 載入）
  const products = ref([]);
  
  // 備用靜態資料（Firestore 載入失敗時使用）
  const fallbackProducts = [
    {
      order: 1,
      image: '/images/products/towel.webp',
      htmlContent: `
        <div class="news-content">
          <h2>人型游步，犬力以赴毛巾</h2>
          <p class="news-date">最新推出</p>
          <img data-type="image" src="${base || ''}/images/products/towel.webp" style="width:100%">

          <div class="news-body">
            <p>犬高育官方推出理念毛巾！</p>
            <h3>商品特色：</h3>
            <ul>
              <li>獨家設計：犬高育理念核心毛巾</li>
              <li>實用功能：優良材質</li>
              <li>限量發行：數量有限，售完為止</li>
              <li>精美包裝：適合收藏或送禮</li>
              <li>本商品屬於個人衛生用品: 為確保衛生安全，此商品一經拆封便不接受退貨。有疑問請聯繫我們官方LINE</li>
            </ul>
            <p>購買方式請洽<a href="https://myship.7-11.com.tw/general/detail/GM2510015953636" target="_blank" rel="noopener">這裡</a>。</p>
          </div>
        </div>
      `
    },
    {
      order: 2,
      image: '/images/products/badge_banner.webp',
      htmlContent: `
        <div class="news-content">
          <h2>犬高育犬生必備迴紋針小徽章</h2>
          <p class="news-date">最新推出</p>
          <img data-type="image" src="${base || ''}/images/products/badge_banner.webp" style="width:100%">

          <div class="news-body">
            <p>犬高育犬生必備迴紋針小徽章</p>
            <h3>商品特色：</h3>
            <ul>
              <li>迴紋針小徽章</li>
              <li>獨立包裝</li>
              <li>3.2cmØ</li>
            </ul>
            <p>購買方式請洽<a href="https://myship.7-11.com.tw/general/detail/GM2512230689645" target="_blank" rel="noopener">這裡</a>。</p>
          </div>
        </div>
      `
    },
    {
      order: 3,
      image: '/images/products/banner-02.webp',
      htmlContent: `
        <div class="news-content">
          <h2>犬力一擊 ✢ 無袖運動服</h2>
          <p class="news-date">最新推出</p>
          <img data-type="image" src="${base || ''}/images/products/banner-02.webp" style="width:100%">

          <div class="news-body">
            <p>犬力一擊 ✢ 無袖運動服</p>
            <h3>商品特色：</h3>
            <ul>
              <li>無袖設計</li>
              <li>透氣材質</li>
              <li>多種尺寸</li>
              <li>狗狗特色,主人也有!</li>
            </ul>
            <p>購買方式請洽<a href="https://docs.google.com/forms/d/e/1FAIpQLSeb9I1401w4ueSVh0mLhmwDSs-zoAgtWXg790c54fN55hbmjw/viewform" target="_blank" rel="noopener">這裡</a>。</p>
          </div>
        </div>
      `
    }
  ];

  // 背景區域設定
  const backgroundSection = ref({
    title: '學校商品專區',
    subtitle: '精選校園周邊商品',
    backgroundImage: `${base}/images/products/construction.webp`
  });

  /**
   * 從 Firestore 載入產品資料
   */
  async function loadProducts() {
    // 如果開啟 fallback 模式，直接使用本地資料
    if (USE_FALLBACK_DATA) {
      console.log('[Products] Using fallback data (USE_FALLBACK_DATA=true)');
      products.value = fallbackProducts;
      return;
    }

    try {
      const firestoreProducts = await getProducts();
      
      if (firestoreProducts && firestoreProducts.length > 0) {
        // 轉換 Firestore 資料格式
        products.value = firestoreProducts.map(product => ({
          id: product.id,
          // imageUrl 已包含前導斜杠，移除以避免重複 base 路徑
          image: product.imageUrl,
          title: product.title,
          htmlContent: product.htmlContent
        }));
      } else {
        // 如果 Firestore 沒有資料，使用備用資料
        console.warn('No products found in Firestore, using fallback data');
        products.value = fallbackProducts;
      }
    } catch (err) {
      // 載入失敗時使用備用資料
      console.error('Failed to load products from Firestore:', err);
      products.value = fallbackProducts;
    }
  }

  onMounted(async () => {
    // 載入 Firestore 資料
    await loadProducts();
  });

  return {
    base,
    products,
    backgroundSection,
    loading,
    error
  };
}
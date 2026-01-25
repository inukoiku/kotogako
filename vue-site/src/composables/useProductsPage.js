import { ref, onMounted } from 'vue';
import { useFirestore } from './useFirestore';

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
      image: '/images/products/card_season2.webp',
      htmlContent: `
        <div class="news-content">
          <h2>犬高育學生證2026</h2>
          <p class="news-date">最新推出</p>
          <img data-type="image" src="${base || ''}/images/products/card_season2.webp" style="width:100%">

          <div class="news-body">
            <p>犬高育第二學期學生證！</p>
            <h3>商品特色：</h3>
            <ul>
              <li>獨家設計：犬高育學生證</li>
              <li>實用功能：一卡通或悠遊卡功能</li>
              <li>限量發行：季節限定，數量有限，售完為止</li>
              <li>精美設計：不論自已使用或是當名片都很適合</li>
              <li>本商品屬於訂製商品，此商品不接受退貨。有疑問請聯繫我們官方LINE</li>
            </ul>
            <p>購買方式請洽<a href="https://forms.gle/7JrYQEwubbuXEpVKA" target="_blank" rel="noopener">這裡</a>。</p>
          </div>
        </div>
      `
    },
    {
      order: 3,
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
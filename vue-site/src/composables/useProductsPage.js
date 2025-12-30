import { ref } from 'vue';

export function useProductsPage() {
  const base = import.meta.env.BASE_URL || '/';
  
  // 商品資料
  const products = ref([
    {
      id: 1,
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
      id: 2,
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
    }
  ]);

  // 背景區域設定
  const backgroundSection = ref({
    title: '學校商品專區',
    subtitle: '精選校園周邊商品',
    backgroundImage: `${base}/images/products/construction.webp`
  });

  return {
    base,
    products,
    backgroundSection
  };
}
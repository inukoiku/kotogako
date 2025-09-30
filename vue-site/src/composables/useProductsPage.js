import { ref } from 'vue';

export function useProductsPage() {
  const base = import.meta.env.BASE_URL || '/';
  
  // 商品資料
  const products = ref([
    {
      id: 1,
      image: '/images/products/towel.png',
      htmlContent: `
        <div class="news-content">
          <h2>人型游步，犬力以赴毛巾</h2>
          <p class="news-date">最新推出</p>
          <img data-type="image" src="${base || ''}/images/products/towel.png" style="width:100%">

          <div class="news-body">
            <p>犬高育官方推出理念毛巾！</p>
            <h3>商品特色：</h3>
            <ul>
              <li>獨家設計：犬高育理念核心毛巾</li>
              <li>實用功能：優良材質</li>
              <li>限量發行：數量有限，售完為止</li>
              <li>精美包裝：適合收藏或送禮</li>
            </ul>
            <p>購買方式請洽詢學務處或關注官方社群媒體公告。</p>
          </div>
        </div>
      `
    }
  ]);

  // 背景區域設定
  const backgroundSection = ref({
    title: '學校商品專區',
    subtitle: '精選校園周邊商品',
    backgroundImage: `${base}/images/products/construction.png`
  });

  return {
    base,
    products,
    backgroundSection
  };
}
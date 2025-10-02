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
    },
    {
      id: 2,
      image: '/images/products/product_student.jpg',
      htmlContent: `
        <div class="news-content">
          <h2>學蘭狗勾入學去</h2>
          <p class="news-date">最新推出</p>
          <img data-type="image" src="${base || ''}/images/products/product_student.jpg" style="width:100%">

          <div class="news-body">
            <p>犬高育狗勾壓克力鑰匙圈！</p>
            <h3>商品特色：</h3>
            <ul>
              <li>起因 : 自己想要實體化。</li>
              <li>犬高育狗勾壓克力鑰匙圈 <8cm></li>
              <li>鑰匙圈金額成分為 : 8cm壓克力成本+扣環+客製製作&校稿 = 220+5+25 (元)</li>
              <li>因為每一個壓克力圖案不同, 故每一件都以單件製作計算</li>
            </ul>
            <p>購買方式請洽<a href="https://docs.google.com/forms/d/1tdrL6OFC3p3D9BuX3P9nXuBjB9_b0xZQ9ZaP13dXNuc/edit" target="_blank" rel="noopener">這裡</a>。</p>
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
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
            <p>購買方式請洽<a href="https://docs.google.com/forms/d/e/1FAIpQLSd6nnQNdEir0L_Rzby3tf80FupYD227yQAMtrPzd3HmOCVADA/viewform" target="_blank" rel="noopener">這裡</a>。</p>
            <p>訂單狀況查詢請洽<a href="https://inukoiku.blogspot.com/2025/10/blog-post.html" target="_blank" rel="noopener">這裡</a>。</p>
          </div>
        </div>
      `
    },
    {
      id: 2,
      image: '/images/products/product_student.webp',
      htmlContent: `
        <div class="news-content">
          <h2>學蘭狗勾入學去</h2>
          <p class="news-date">最新推出</p>
          <img data-type="image" src="${base || ''}/images/products/product_student.webp" style="width:100%">

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
    },
    {
      id: 3,
      image: '/images/products/fusion_market.webp',
      htmlContent: `
        <div class="news-content">
          <h2>Fusion Taiwan 2025－DEEP INSIDE</h2>
          <p class="news-date">最新推出</p>
          <img data-type="image" src="${base || ''}/images/products/fusion_market.webp" style="width:100%">

          <div class="news-body">
            <p>Fusion Taiwan 2025－DEEP INSIDE</p>
            <h3>活動特色：</h3>
            <ul>
              <li>2025/10/26（日）18:00-22:00｜La Fin Taipei</li>
              <li> PRIDE TOGETHER · PARTY UNDERGROUND</li>
              <li>當夜色覆蓋台北信義區，FUSION 帶你下潛，深入慾望的心臟地帶。</li>
              <li>這不是逃避現實的派對，而是一場穿透表象、直面真實自我的沈浸儀式。</li>
            </ul>
            <p>詳細內容和購買方式請洽<a href="https://lafin.kktix.cc/events/0aaf41a8?fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExaXBFbTJ2cDBkcmxmUEVJdwEeNoXTR2a6W0w6cd1-grcMFBAc6SsMseMH2dGuq386YMMBTTdw3no3F4dD7Oc_aem_FfbqAUVRabGomYc35FpXvA" target="_blank" rel="noopener">這裡</a>。</p>
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
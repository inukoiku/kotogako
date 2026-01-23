# Firestore Products 資料設定指南

## 問題說明
網站上線後無法顯示商品資料，因為 Firestore 資料庫中尚未建立商品資料。

## 解決步驟

### 1. 前往 Firebase Console
訪問：https://console.firebase.google.com/project/inukoikudb/firestore

### 2. 建立資料結構

#### 路徑：`pages/productpage/productItems`

你需要建立以下層級結構：

```
pages (集合 Collection)
  └── productpage (文檔 Document)
      └── productItems (子集合 SubCollection)
          └── product1 (文檔)
          └── product2 (文檔)
          └── product3 (文檔)
```

### 3. 新增商品資料

點擊「開始集合」或「新增文檔」，按照以下步驟：

#### 商品 1：人型游步，犬力以赴毛巾

```
文檔 ID: (自動產生) 或 towel2026
欄位：
- active (boolean): true
- order (number): 1
- image (string): /images/products/towel.webp
- htmlContent (string): 
  <div class="news-content">
    <h2>人型游步，犬力以赴毛巾</h2>
    <p class="news-date">最新推出</p>
    <img data-type="image" src="/kotogako/images/products/towel.webp" style="width:100%">
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
```

#### 商品 2：犬高育學生證2026

```
文檔 ID: (自動產生) 或 card_season2
欄位：
- active (boolean): true
- order (number): 2
- image (string): /images/products/card_season2.webp
- htmlContent (string):
  <div class="news-content">
    <h2>犬高育學生證2026</h2>
    <p class="news-date">最新推出</p>
    <img data-type="image" src="/kotogako/images/products/card_season2.webp" style="width:100%">
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
```

#### 商品 3：犬高育犬生必備迴紋針小徽章

```
文檔 ID: (自動產生) 或 badge
欄位：
- active (boolean): true
- order (number): 3
- image (string): /images/products/badge_banner.webp
- htmlContent (string):
  <div class="news-content">
    <h2>犬高育犬生必備迴紋針小徽章</h2>
    <p class="news-date">最新推出</p>
    <img data-type="image" src="/kotogako/images/products/badge_banner.webp" style="width:100%">
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
```

### 4. 更新安全規則（建議）

在 Firestore 的「規則」分頁，更新為以下內容（避免 2月12日到期）：

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;      // 允許所有人讀取
      allow write: if false;    // 禁止公開寫入
    }
  }
}
```

點擊「發布」儲存規則。

### 5. 驗證

完成後：
1. 重新整理網頁：https://inukoiku.github.io/kotogako/products
2. 開啟瀏覽器開發者工具（F12）
3. 檢查 Console，應該不會再顯示 "No products found in Firestore"
4. 商品應該正常顯示

## 欄位說明

- **active** (boolean): 控制商品是否顯示（true=顯示，false=隱藏）
- **order** (number): 商品排序順序（數字越小越前面）
- **image** (string): 商品圖片路徑
- **htmlContent** (string): 商品詳細內容（HTML 格式）

## 注意事項

1. 所有圖片路徑記得加上 `/kotogako` 前綴（配合 GitHub Pages 路徑）
2. 新增商品時記得設定 `active: true` 和 `order` 欄位
3. 安全規則務必更新，避免到期後無法讀取資料

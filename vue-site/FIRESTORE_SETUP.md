# Firestore 整合完成 🎉

## ✅ 已完成的工作

### 1. Firebase SDK 安裝
- ✓ 已安裝 `firebase` 套件

### 2. Firebase 配置檔案
- ✓ `src/firebase/config.js` - Firebase 初始化
- ✓ `src/composables/useFirestore.js` - Firestore 資料獲取 composable

### 3. 環境變數設定
- ✓ `.env.local` - Firebase 配置（需填入你的專案資訊）
- ✓ `.gitignore` - 已加入環境變數檔案保護

### 4. 整合到 HomePage
- ✓ `homePageState.js` - 從 Firestore 載入 heroSlides
- ✓ `HomePage.vue` - 新增 loading/error 狀態顯示
- ✓ `home.css` - 新增 loading/error 樣式

---

## 🔧 接下來你需要做的事

### 1. 填寫 Firebase 配置

編輯 `vue-site/.env.local`，填入你的 Firebase 專案資訊：

\`\`\`env
VITE_FIREBASE_API_KEY=你的_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=你的專案ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=你的專案ID
VITE_FIREBASE_STORAGE_BUCKET=你的專案ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=你的_SENDER_ID
VITE_FIREBASE_APP_ID=你的_APP_ID
\`\`\`

> 💡 在 Firebase Console > Project Settings > General > Your apps 中可以找到這些資訊

### 2. 建立 Firestore 索引（重要！）

在 Firebase Console > Firestore Database > Indexes，建立複合索引：

- Collection ID: `heroSlides`
- Fields to index:
  - `isActive` (Ascending)
  - `order` (Ascending)

### 3. 測試運行

\`\`\`bash
cd vue-site
npm run dev
\`\`\`

---

## 📊 資料流程

1. **頁面載入** → HomePage.vue
2. **onMounted** → homePageState.js 的 `loadHeroSlides()`
3. **Firestore 查詢** → useFirestore.js 的 `getHeroSlides()`
4. **資料轉換** → Firestore 資料 → heroSlides 格式
5. **顯示** → 輪播圖渲染

---

## 🛡️ 錯誤處理機制

- **Firestore 連線失敗** → 自動使用備用資料（原本的靜態資料）
- **查詢無結果** → 自動使用備用資料
- **載入中** → 顯示 spinner
- **錯誤發生** → 顯示警告訊息

---

## 🎯 目前的實作特點

### ✅ 已實現
- 從 Firestore 動態載入 heroSlides
- Loading 狀態顯示
- Error 狀態處理
- 備用資料機制（Fallback）
- 響應式背景大小適配

### 🔮 未來可擴展
- 新聞資料也從 Firestore 載入（目前仍是靜態）
- 使用 `onSnapshot` 實現即時更新
- 新增後台管理介面
- 圖片快取優化

---

## 📝 注意事項

1. **環境變數**：修改 `.env.local` 後需要重啟開發伺服器
2. **Collection 名稱**：確認 Firestore 中的 collection 名稱為 `heroSlides`
3. **圖片路徑**：Firestore 的 `imageUrl` 應為 `/images/home/xxx.webp` 格式
4. **Firestore 規則**：確保 Firestore Security Rules 允許讀取（開發階段可設為公開讀取）

---

需要我幫你處理其他部分嗎？例如：
- 新聞資料也整合 Firestore
- 建立後台管理介面
- 優化載入效能

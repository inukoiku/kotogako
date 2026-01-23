import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

// Firebase 配置（從環境變數讀取）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Firestore（禁用離線持久化以避免連線問題）
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  // 關閉實驗性的自動資料同步，可能導致連線問題
  experimentalForceLongPolling: false,
  experimentalAutoDetectLongPolling: true
});

export default app;

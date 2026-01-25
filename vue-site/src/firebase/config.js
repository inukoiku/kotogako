import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Fallback 配置（當環境變數未載入時使用）
const fallbackConfig = {
  apiKey: 'AIzaSyBUlDEb-F0CApudmR9Y-H5pPuaBgk-7Vh8',
  authDomain: 'inukoikudb.firebaseapp.com',
  projectId: 'inukoikudb',
  storageBucket: 'inukoikudb.firebasestorage.app',
  messagingSenderId: '426581946359',
  appId: '1:426581946359:web:d6b85169580702661bc8f2'
};

// Firebase 配置（從環境變數讀取，若失敗則使用 fallback）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId
};

// 檢查環境變數是否載入成功
const usingFallback = !import.meta.env.VITE_FIREBASE_API_KEY;
console.log('🔧 Firebase Config Check:');
console.log('- Source:', usingFallback ? '⚠️  Using Fallback Config' : '✅ Using .env File');
console.log('- Project ID:', firebaseConfig.projectId);
console.log('- Auth Domain:', firebaseConfig.authDomain);

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Firestore
export const db = getFirestore(app);

export default app;

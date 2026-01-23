import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

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

// 偵測環境
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

console.log(`🔧 Environment: ${isProduction ? 'Production' : 'Development'}`);

// 初始化 Firestore - Production 禁用快取並強制 long-polling
export const db = initializeFirestore(app, {
  localCache: isProduction 
    ? undefined 
    : persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  experimentalForceLongPolling: isProduction,
  experimentalAutoDetectLongPolling: !isProduction
});

console.log(`✅ Firestore initialized - Mode: ${isProduction ? 'Production (long-polling, no cache)' : 'Development (auto, cached)'}`);

export default app;

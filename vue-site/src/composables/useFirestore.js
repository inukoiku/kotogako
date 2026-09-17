import { ref } from 'vue';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * 通用 Firestore 資料獲取 composable
 */
export function useFirestore() {
  const loading = ref(false);
  const error = ref(null);

  /**
   * 獲取 heroSlides 資料
   * @returns {Promise<Array>} 輪播資料陣列
   */
  async function getHeroSlides() {
    loading.value = true;
    error.value = null;

    try {
      const q = query(
        collection(db, 'pages', 'homepage', 'carouselItems'),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const slides = [];

      querySnapshot.forEach((doc) => {
        slides.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return slides;
    } catch (err) {
      console.error('Error fetching hero slides:', err);
      error.value = err.message;
      return [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * 獲取最新消息資料
   * @returns {Promise<Array>} 新聞資料陣列
   */
  // async function getNews() {
  //   loading.value = true;
  //   error.value = null;

  //   try {
  //     const q = query(
  //       collection(db, 'news'),
  //       orderBy('date', 'desc')
  //     );

  //     const querySnapshot = await getDocs(q);
  //     const newsItems = [];

  //     querySnapshot.forEach((doc) => {
  //       newsItems.push({
  //         id: doc.id,
  //         ...doc.data()
  //       });
  //     });

  //     return newsItems;
  //   } catch (err) {
  //     console.error('Error fetching news:', err);
  //     error.value = err.message;
  //     return [];
  //   } finally {
  //     loading.value = false;
  //   }
  // }

  /**
   * 獲取首頁 YouTube 影片 ID
   * @returns {Promise<string>} YouTube 影片 ID
   */
  async function getHomeVideo() {
    loading.value = true;
    error.value = null;

    try {
      // 直接讀取 pages/homepage 文檔中的 homevideo 字段
      const docRef = doc(db, 'pages', 'homepage');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.homevideo || '';
      }
      
      return '';
    } catch (err) {
      console.error('Error fetching home video:', err);
      error.value = err.message;
      return '';
    } finally {
      loading.value = false;
    }
  }

  /**
   * 獲取產品頁面資料
   * @returns {Promise<Array>} 產品資料陣列
   */
  async function getProducts() {
    loading.value = true;
    error.value = null;

    try {
      const q = query(
        collection(db, 'pages', 'productpage', 'productItems'),
        where('active', '==', true),
        orderBy('order', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const productItems = [];

      querySnapshot.forEach((doc) => {
        productItems.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return productItems;
    } catch (err) {
      console.error('Error fetching products:', err);
      error.value = err.message;
      return [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * 獲取新聞頁面資料
   * @returns {Promise<Array>} 新聞資料陣列
   */
  async function getNewsItems() {
    loading.value = true;
    error.value = null;

    try {
      const q = query(
        collection(db, 'pages', 'eventpage', 'eventItems'),
        where('active', '==', true),
        orderBy('order', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const newsItems = [];

      querySnapshot.forEach((doc) => {
        newsItems.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return newsItems;
    } catch (err) {
      console.error('Error fetching news items:', err);
      error.value = err.message;
      return [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * 獲取電子書雜誌列表（書櫃），後台可維護 title、kicker、coverUrl、order、active 欄位
   * @returns {Promise<Array>} 啟用中的雜誌列表
   */
  async function getMagazines() {
    loading.value = true;
    error.value = null;

    try {
      const q = query(
        collection(db, 'pages', 'librarypage', 'magazines'),
        where('active', '==', true),
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs
        .map((magazineDoc) => ({ id: magazineDoc.id, ...magazineDoc.data() }))
        .filter((magazine) => typeof magazine.coverUrl === 'string' && magazine.coverUrl.trim());
    } catch (err) {
      console.error('Error fetching magazines:', err);
      error.value = err.message;
      return [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * 獲取單一雜誌的頁面，後台可維護 imageUrl、alt、order、active 欄位
   * @param {string} magazineId 雜誌文件 ID
   * @returns {Promise<Array>} 該雜誌啟用中的頁面
   */
  async function getMagazinePages(magazineId) {
    loading.value = true;
    error.value = null;

    try {
      const q = query(
        collection(db, 'pages', 'librarypage', 'magazines', magazineId, 'pages'),
        where('active', '==', true),
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs
        .map((pageDoc) => ({ id: pageDoc.id, ...pageDoc.data() }))
        .filter((page) => typeof page.imageUrl === 'string' && page.imageUrl.trim());
    } catch (err) {
      console.error('Error fetching magazine pages:', err);
      error.value = err.message;
      return [];
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    getHeroSlides,
    getHomeVideo,
    getProducts,
    getNewsItems,
    getMagazines,
    getMagazinePages
  };
}

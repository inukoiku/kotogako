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
      
      console.log('Fetched home video data from Firestore');
      if (docSnap.exists()) {
        console.log('Homepage document found');
        const data = docSnap.data();
        console.log('homevideo field:', data.homevideo);
        return data.homevideo || '';
      } else {
        console.warn('Homepage document does not exist');
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

  return {
    loading,
    error,
    getHeroSlides,
    getHomeVideo,
    getProducts
  };
}

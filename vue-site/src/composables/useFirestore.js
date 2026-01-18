import { ref } from 'vue';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
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
  async function getNews() {
    loading.value = true;
    error.value = null;

    try {
      const q = query(
        collection(db, 'news'),
        orderBy('date', 'desc')
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
      console.error('Error fetching news:', err);
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
    getNews
  };
}

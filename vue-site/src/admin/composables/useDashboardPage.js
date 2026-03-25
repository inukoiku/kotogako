import { ref, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useAdminFirestore } from '@/composables/useAdminFirestore';

export function useDashboardPage() {
  const { adminData } = useAuth();
  const { getAll } = useAdminFirestore();

  const heroSlidesCount = ref(0);
  const productsCount = ref(0);
  const eventsCount = ref(0);

  onMounted(async () => {
    const heroSlides = await getAll('pages/homepage/carouselItems');
    heroSlidesCount.value = heroSlides.length;

    const products = await getAll('pages/productpage/productItems');
    productsCount.value = products.length;

    const events = await getAll('pages/eventpage/eventItems');
    eventsCount.value = events.length;
  });

  function formatDate(timestamp) {
    if (!timestamp) return '未知';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('zh-TW');
  }

  return {
    // State
    adminData,
    heroSlidesCount,
    productsCount,
    eventsCount,
    // Methods
    formatDate
  };
}

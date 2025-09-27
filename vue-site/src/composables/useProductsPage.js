import { ref } from 'vue';

export function useProductsPage() {
  const base = import.meta.env.BASE_URL || '/';
  
  // 商品資料
  const products = ref([
    { id: 1, name: '校園背包', price: 1200 },
    { id: 2, name: '運動外套', price: 1800 },
    { id: 3, name: '紀念水壺', price: 350 }
  ]);

  // 背景區域設定
  const backgroundSection = ref({
    title: '學校商品專區',
    subtitle: '精選校園周邊商品',
    backgroundImage: `${base}/images/products/construction.png`
  });

  return {
    base,
    products,
    backgroundSection
  };
}
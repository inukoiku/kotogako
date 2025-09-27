import { useRoute } from 'vue-router';

export function useSiteHeaderNav() {
  const route = useRoute();
  const base = import.meta.env.BASE_URL || '/';
  const items = [
    { label:'首頁',       to:'/',    imgA:'/images/header_footer/homepage.png',          imgB:'/images/header_footer/homepage_active.png' },
    { label:'關於我們',   to:'/team',           imgA:'/images/header_footer/gardenshow.png',        imgB:'/images/header_footer/gardenshow_active.png' },
    { label:'活動介紹',     to:'/news',  imgA:'/images/header_footer/news.png',       imgB:'/images/header_footer/news_active.png' },
    { label:'作品集',     to:'/library', imgA:'/images/header_footer/library.png',      imgB:'/images/header_footer/library_active.png' },
    { label:'汪汪商城',     to:'/products',            imgA:'/images/header_footer/store.png',         imgB:'/images/header_footer/store_active.png' },
    { label:'友善連結',   to:'/link',    imgA:'/images/header_footer/learning.png',     imgB:'/images/header_footer/learning_active.png' },
  ];
  return { route, base, items };
}
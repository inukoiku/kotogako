import { ref } from 'vue';

export function useLinkPage() {
  const base = import.meta.env.BASE_URL || '/';
  
  // 連結圖片資料 - 2張一排的圖片區塊
  const linkImages = ref([
    {
      id: 1,
      image: `${base}/images/linkspage/link_1.png`,
      title: '海報教練',
      description: '海報教練',
      url: 'https://www.instagram.com/seal.coach?igsh=eDJ3M3JoZGZoZWhl'
    },
    {
      id: 2,
      image: `${base}/images/linkspage/link_3.png`,
      title: 'FUSION',
      description: 'FUSION',
      url: 'https://www.facebook.com/share/1B6UUV833H/?mibextid=wwXIfr'
    },
    {
      id: 3,
      image: `${base}/images/linkspage/link_2.png`,
      title: '汪汪雜貨舖',
      description: '汪汪雜貨舖',
      url: 'https://www.instagram.com/wang2zahuopu?igsh=MTU3ZXQ2ZmRlcGJwbQ=='
    },
    {
      id: 4,
      image: `${base}/images/linkspage/link_4.png`,
      title: '好色喔!禁羈相談室',
      description: '好色喔!禁羈相談室',
      url: 'https://www.instagram.com/hsokinky_2024?igsh=MWUzcWpoaTk0OHZraw=='
    },
    {
      id: 5,
      image: `${base}/images/linkspage/link_5.png`,
      title: '頂頂 頂你個吠',
      description: '頂頂 頂你個吠',
      url: 'https://www.dingdingwoof.com/'
    }
  ]);

  // 點擊圖片開啟連結
  function openLink(url) {
    window.open(url, '_blank');
  }

  return {
    base,
    linkImages,
    openLink
  };
}
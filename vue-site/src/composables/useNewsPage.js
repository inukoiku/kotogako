import { ref, computed } from 'vue';

export function useNewsPage() {
  const base = import.meta.env.BASE_URL || '/';
  
  // 新聞橫幅資料
  const newsBanners = ref([
    {
      id: 1,
      image: '/images/events/event2.webp',
      htmlContent: `
        <div class="news-content">
          <h2>《夏日大作戰～決戰馬拉灣》(已結束)</h2>
          <p class="news-date">2025年7月5日</p>
          <img class=""  data-type="image" src="${base}/images/events/2025_summer.webp" style="width:100%">

          <div class="news-body">
            <p>夏日馬拉灣活動又來啦!!</p>
            <h3>活動詳情：</h3>
            <ul>
              <li>時間：7月5日</li>
              <li>地點：台中麗寶樂園</li>
              <li>項目：水上活動</li>
            </ul>
            <p>報名截止日期為6月12日，請各班導師協助學生報名。</p>
          </div>
        </div>
      `
    },
    {
      id: 2,
      image: '/images/events/event1.webp',
      htmlContent: `
        <div class="news-content">
          <h2>2025台北同志大遊行(已結束)</h2>
          <p class="news-date">2025年10月25日</p>
          <div class="news-body">
            <div class="sqs-block-content">
              <div class="sqs-html-content" data-sqsp-text-block-content="">
                <img class="thumb-image sqs-gallery-design-strip-slide sqs-active-slide loaded" elementtiming="system-gallery-block-slider" data-src="https://images.squarespace-cdn.com/content/v1/5d0e1103633ebd0001fed7e1/1754302000452-5KT14R4JI8E55AUTYPMV/2025+Taiwan+Pride+-+Social_1420x687px.jpg" data-image="https://images.squarespace-cdn.com/content/v1/5d0e1103633ebd0001fed7e1/1754302000452-5KT14R4JI8E55AUTYPMV/2025+Taiwan+Pride+-+Social_1420x687px.jpg" data-image-dimensions="1420x687" data-image-focal-point="0.5,0.5" data-load="false" data-image-id="6890862e4a08101ae3b08d81" data-type="image" id="yui_3_17_2_1_1757953751107_230" aria-current="true" alt="2025 Taiwan Pride - Social_1420x687px.jpg" data-image-resolution="1500w" src="https://images.squarespace-cdn.com/content/v1/5d0e1103633ebd0001fed7e1/1754302000452-5KT14R4JI8E55AUTYPMV/2025+Taiwan+Pride+-+Social_1420x687px.jpg?format=1500w" style="width:100%">
                <ul>
                  <li><img class=""  data-type="image" src="${base}/images/events/2025TaipeiPride.jpg" style="width:100%"></li>
                  <li><img class=""  data-type="image" src="${base}/images/events/PrideCar.JPG" style="width:100%"></li>
                </ul>
                  </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 3,
      image: '/images/events/event3.webp',
      htmlContent: `
        <div class="news-content">
          <h2>2025 高雄同志大遊行(已結束)</h2>
          <p class="news-date">2025年11月29日</p>
          <img class=""  data-type="image" src="${base}/images/events/kaoshung_pride2025.webp" style="width:100%">

          <div class="news-body">
            <ul>
              <li><img class=""  data-type="image" src="${base}/images/events/pride_kaohsiung.webp" style="width:100%"></li>
            </ul>
          </div>
        </div>
      `
    }
  ]);

  // 彈出視窗狀態
  const showModal = ref(false);
  const currentContent = ref('');

  // 倒序顯示的新聞橫幅（最新的在最上方）
  const reversedNewsBanners = computed(() => {
    return [...newsBanners.value].reverse();
  });

  // 開啟彈出視窗
  function openModal(banner) {
    currentContent.value = banner.htmlContent;
    showModal.value = true;
    // 防止背景滾動
    document.body.style.overflow = 'hidden';
  }

  // 關閉彈出視窗
  function closeModal() {
    showModal.value = false;
    currentContent.value = '';
    // 恢復背景滾動
    document.body.style.overflow = '';
  }

  return {
    base,
    newsBanners,
    reversedNewsBanners,
    showModal,
    currentContent,
    openModal,
    closeModal
  };
}

import { ref, computed } from 'vue';

export function useNewsPage() {
  const base = import.meta.env.BASE_URL || '/';
  
  // 新聞橫幅資料
  const newsBanners = ref([
    {
      id: 1,
      image: '/images/events/event2.png',
      htmlContent: `
        <div class="news-content">
          <h2>《夏日大作戰～決戰馬拉灣》(已結束)</h2>
          <p class="news-date">2025年7月5日</p>
          <img class=""  data-type="image" src="${base}/images/events/2025_summer.jpg" style="width:100%">

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
      image: '/images/events/event1.png',
      htmlContent: `
        <div class="news-content">
          <h2>2025台北同志大遊行</h2>
          <p class="news-date">2025年10月25日</p>
          <div class="news-body">
            <div class="sqs-block-content">
              <div class="sqs-html-content" data-sqsp-text-block-content="">
                <img class="thumb-image sqs-gallery-design-strip-slide sqs-active-slide loaded" elementtiming="system-gallery-block-slider" data-src="https://images.squarespace-cdn.com/content/v1/5d0e1103633ebd0001fed7e1/1754302000452-5KT14R4JI8E55AUTYPMV/2025+Taiwan+Pride+-+Social_1420x687px.jpg" data-image="https://images.squarespace-cdn.com/content/v1/5d0e1103633ebd0001fed7e1/1754302000452-5KT14R4JI8E55AUTYPMV/2025+Taiwan+Pride+-+Social_1420x687px.jpg" data-image-dimensions="1420x687" data-image-focal-point="0.5,0.5" data-load="false" data-image-id="6890862e4a08101ae3b08d81" data-type="image" id="yui_3_17_2_1_1757953751107_230" aria-current="true" alt="2025 Taiwan Pride - Social_1420x687px.jpg" data-image-resolution="1500w" src="https://images.squarespace-cdn.com/content/v1/5d0e1103633ebd0001fed7e1/1754302000452-5KT14R4JI8E55AUTYPMV/2025+Taiwan+Pride+-+Social_1420x687px.jpg?format=1500w" style="width:100%">
                <h1 style="text-align:center;white-space:pre-wrap;"><strong>臺灣同志遊行參與及合作</strong></h1><p class="" style="white-space:pre-wrap;">臺灣同志遊行由社團法人臺灣彩虹公民行動協會（下稱臺彩協會）主辦，每年於 10 月最後一個星期六舉辦。不僅是臺灣最大的同志遊行，也是東亞最大的同志遊行活動。有近二十萬的民眾以及超過二百個團體與我們走上街頭，為平權發聲。亦有近二十個協辦團體參與，共同打造 10 月同志驕傲月。</p><h2 style="white-space:pre-wrap;">成為志工</h2><p class="" style="white-space:pre-wrap;">每年臺灣同志遊行會有超過五百人的志工需求，志工類型分為遊行籌備志工以及活動當日的現場志工，每年視需求調整籌備組別，分別於 4 月及 9 月進行招募，敬請關注 <a href="https://www.facebook.com/Taiwan.LGBT.Pride" target="_blank">Facebook 粉絲專頁</a> 與 <a href="https://www.instagram.com/taiwanlgbtpride/" target="_blank">官方 Instagram</a> 頁面。</p><p class="" style="white-space:pre-wrap;">志工相關問題歡迎洽詢志工報名信箱：rec2025@taiwanpride.lgbt</p><h2 style="white-space:pre-wrap;">參與遊行</h2><h3 style="white-space:pre-wrap;">民眾如何參與遊行</h3><p class="" style="white-space:pre-wrap;">一般民眾無須報名，遊行當天直接到現場加入遊行隊伍即可！每年遊行地點、路線會在 10 月初公告，歡迎所有支持 LGBT+ 社群的朋友，無論是精心裝扮或設計標語，我們歡迎你以最舒服、自在的方式參與遊行，加入我們的行列，為遊行帶來專屬於你的色彩。</p><h3 style="white-space:pre-wrap;">How can I participate in Taiwan LGBT+ Pride?</h3><p class="" style="white-space:pre-wrap;">No registration is required. Just meet us at the designated spot and join the parade!  Each year, the parade location and route will be announced in early October.  We warmly invite you to join us.</p><p class="" style="white-space:pre-wrap;">Everyone is welcome to participate in their own unique way, so please come dressed comfortably and add your personal touch to the parade.</p><h3 style="white-space:pre-wrap;">團體如何參與遊行</h3><p class="" style="white-space:pre-wrap;">臺灣同志遊行開放 NGO、友善企業、政黨、各級學校及社團等團體免費報名參加。團體報名於每年 9 月中開放報名，參與隊伍名單將在遊行前夕公布於官網。每個顏色大隊皆有人數限制，敬請及早報名。若報名額滿，將提前截止報名。未成功報名的隊伍仍可直接加入遊行，惟無法在官方平台中露出。</p><p class="" style="white-space:pre-wrap;">團體報名歡迎洽詢團體報名信箱：group_regist@taiwanpride.lgbt</p><h3 style="white-space:pre-wrap;">協辦團體</h3><p class="" style="white-space:pre-wrap;">每年的協辦團體由臺彩協會邀請，以性別相關團體為主。</p><h3 style="white-space:pre-wrap;">想要更認識遊行</h3><p class="" style="white-space:pre-wrap;">歡迎購買臺彩協會於 2024 年發行的專刊《為改變而走：臺灣同志遊行走過的 21 年》。</p>
                <p>更多資訊請參考 <a href="https://www.taiwanpride.lgbt/" target="_blank">臺灣同志遊行官網</a>。</p>
                </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 3,
      image: '/images/events/event3.png',
      htmlContent: `
        <div class="news-content">
          <h2>2025 高雄同志大遊行</h2>
          <p class="news-date">2025年11月29日</p>
          <img class=""  data-type="image" src="https://scontent.ftpe20-1.fna.fbcdn.net/v/t39.30808-6/498328243_1002300008764822_6690007618856316007_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=HATmKDUhIqMQ7kNvwGAo5fv&_nc_oc=Adk0q7wsdklFYUdAxwImqbxwiA29s2CONDLKL1bez23dUfeZEKnoVsHTebhRcI_iPIA&_nc_zt=23&_nc_ht=scontent.ftpe20-1.fna&_nc_gid=9CTq-3eTY8bk8jyGCbWYRw&oh=00_AfZ-6HRB5WfAoRjcClMqQcFzPOHodCF4mQ21XvUcW5qlZA&oe=68DB24C2" style="width:100%">

          <div class="news-body">
            <ul>
              <li>11/15（六）志工訓練會（高雄交通便捷處，實際時間、地點待通知）</li>
              <li>11/29 （六）第十六屆高雄同志大遊行當日！！</li>
            </ul>
            <p>詳細資訊請參考 <a href="https://www.facebook.com/KaohsiungPRIDE/?locale=zh_TW" target="_blank">活動頁面</a>。</p>
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

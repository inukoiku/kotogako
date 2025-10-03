import { ref } from 'vue';

export function useSocialShare() {
  const siteUrl = 'https://inukoiku.github.io/kotogako';
  const siteName = '犬神高度育造高等學校';
  const description = '犬神高度育造高等學校官方網站，提供校園資訊、活動公告、學習資源等服務。';

  // 分享到 Facebook
  function shareToFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  }

  // 分享到 LINE
  function shareToLine() {
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(siteUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  }

  // 複製連結
  function copyLink() {
    navigator.clipboard.writeText(siteUrl).then(() => {
      alert('網站連結已複製到剪貼簿！');
    });
  }

  return {
    siteUrl,
    siteName,
    description,
    shareToFacebook,
    shareToLine,
    copyLink
  };
}
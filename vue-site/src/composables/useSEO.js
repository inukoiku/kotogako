import { seoConfig } from '@/config/seo.js';

export function useSEO() {
  
  // 設定頁面標題
  function setPageTitle(title) {
    if (typeof document !== 'undefined') {
      document.title = title ? `${title} | ${seoConfig.siteName}` : seoConfig.siteName;
    }
  }
  
  // 設定 meta description
  function setMetaDescription(description) {
    if (typeof document !== 'undefined') {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
  }
  
  // 設定 Open Graph 標籤
  function setOpenGraph(data) {
    if (typeof document !== 'undefined') {
      const { title, description, image, url } = data;
      
      // OG Title
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title);
      
      // OG Description  
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);
      
      // OG Image
      if (image) {
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) ogImage.setAttribute('content', image);
      }
      
      // OG URL
      if (url) {
        let ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', url);
      }
    }
  }
  
  // 加入結構化資料
  function addStructuredData(data) {
    if (typeof document !== 'undefined') {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    }
  }
  
  // 初始化基本結構化資料
  function initBasicStructuredData() {
    addStructuredData(seoConfig.organization);
  }
  
  return {
    setPageTitle,
    setMetaDescription,
    setOpenGraph,
    addStructuredData,
    initBasicStructuredData,
    seoConfig
  };
}
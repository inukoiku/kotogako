// Google Analytics 和 SEO 設定
export const seoConfig = {
  // 網站基本資訊
  siteName: '犬神高度育造高等學校',
  siteUrl: 'https://inukoiku.github.io/kotogako',
  description: '犬神高度育造高等學校官方網站，提供校園資訊、活動公告、學習資源、商品販售等服務。',
  
  // Google Analytics ID (請申請 Google Analytics 並替換)
  googleAnalyticsId: 'G-XXXXXXXXXX',
  
  // Google Search Console 驗證碼 (可選)
  googleSiteVerification: 'your-verification-code',
  
  // 社群媒體
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61560013116714',
    instagram: 'https://www.instagram.com/inukoiku.tw/',
    line: 'https://line.me/R/ti/p/@950wjjeb'
  },
  
  // 結構化資料
  organization: {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    'name': '犬神高度育造高等學校',
    'url': 'https://inukoiku.github.io/kotogako',
    'logo': 'https://inukoiku.github.io/kotogako/images/logo.png',
    'sameAs': [
      'https://www.facebook.com/profile.php?id=61560013116714',
      'https://www.instagram.com/inukoiku.tw/',
      'https://line.me/R/ti/p/@950wjjeb'
    ]
  }
};
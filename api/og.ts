import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.url || '/';
  const userAgent = req.headers['user-agent'] || '';
  
  // 소셜 미디어 크롤러인지 확인
  const isSocialCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|SkypeUriPreview|Applebot|Googlebot/i.test(userAgent);
  
  if (!isSocialCrawler) {
    // 일반 사용자는 404 또는 기본 HTML로 리다이렉트
    return res.redirect(301, '/');
  }

  // 경로에서 ID 추출
  const trendsMatch = path.match(/\/trends\/([^\/]+)/);
  const eventsMatch = path.match(/\/events\/([^\/]+)/);
  const popupsMatch = path.match(/\/popups\/([^\/]+)/);

  const siteOrigin = process.env.VITE_SITE_URL || 'https://kor-aid.com';
  
  let metaTags = {
    title: 'koraid - Explore Korea without barriers',
    description: 'Weekly trend reports, K-culture events and a personalised phrasebook crafted for global travellers. Explore Korea without barriers with koraid.',
    image: `${siteOrigin}/main1.jpg`,
    type: 'website',
    url: `${siteOrigin}${path}`
  };

  // 여기서는 기본 메타 태그만 반환
  // 실제로는 Firestore에서 데이터를 가져와야 하지만,
  // 서버리스 함수에서 Firestore를 사용하려면 추가 설정이 필요합니다
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${metaTags.title}</title>
  <meta name="description" content="${metaTags.description}" />
  <link rel="canonical" href="${metaTags.url}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${metaTags.type}" />
  <meta property="og:url" content="${metaTags.url}" />
  <meta property="og:title" content="${metaTags.title}" />
  <meta property="og:description" content="${metaTags.description}" />
  <meta property="og:image" content="${metaTags.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${metaTags.title}" />
  <meta property="og:site_name" content="koraid" />
  <meta property="og:locale" content="en_US" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${metaTags.url}" />
  <meta name="twitter:title" content="${metaTags.title}" />
  <meta name="twitter:description" content="${metaTags.description}" />
  <meta name="twitter:image" content="${metaTags.image}" />
  <meta name="twitter:image:alt" content="${metaTags.title}" />
  
  <script>
    window.location.href = '${metaTags.url}';
  </script>
</head>
<body>
  <p>Redirecting to <a href="${metaTags.url}">${metaTags.url}</a></p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.send(html);
}

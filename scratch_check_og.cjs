const https = require('https');

https.get('https://www.classgrid.in/blog/maharashtra-education-digital-infrastructure-2025', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const canonical = data.match(/<link[^>]*rel="canonical"[^>]*>/g);
    const ogUrl = data.match(/<meta[^>]*property="og:url"[^>]*>/g);
    
    console.log("Canonical:", canonical);
    console.log("OG URL:", ogUrl);
  });
}).on('error', console.error);

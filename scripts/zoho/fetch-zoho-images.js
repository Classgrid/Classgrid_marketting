const https = require('https');
const fs = require('fs');
const path = require('path');

// We are going to fetch the main CSS file of Zoho ERP to find the background images for the stack
const cssUrl = 'https://www.zoho.com/erp/styles/index/index.css?v=4';

https.get(cssUrl, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Regex to find image URLs in the CSS
    const urlRegex = /url\(['"]?([^'"\)]+\.(png|svg|webp|jpg))['"]?\)/g;
    let match;
    const urls = [];
    while ((match = urlRegex.exec(data)) !== null) {
      if (match[1].includes('stack') || match[1].includes('layer') || match[1].includes('plate')) {
         urls.push(match[1]);
      }
    }
    
    // If not found by name, just get all images and print them
    if (urls.length === 0) {
      const allUrls = [];
      let m;
      const allRegex = /url\(['"]?([^'"\)]+\.(png|svg|webp|jpg))['"]?\)/g;
      while ((m = allRegex.exec(data)) !== null) {
        allUrls.push(m[1]);
      }
      console.log("No explicit 'layer' names found. Found these images instead:");
      console.log(allUrls.filter(u => u.includes('erp')).slice(0, 20));
    } else {
      console.log("Found layer images:");
      console.log(urls);
    }
  });
}).on('error', err => {
  console.error("Error:", err.message);
});

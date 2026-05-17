const fs = require('fs');
const path = require('path');

// 1. Remove from BlogClient.tsx (listing page)
const listingPath = path.join(__dirname, '..', 'app', 'blog', 'BlogClient.tsx');
let listing = fs.readFileSync(listingPath, 'utf8');

const videoStart = listing.indexOf('{/* FEATURED VIDEO */}');
const filterStart = listing.indexOf('      <section className="flex flex-col items-start justify-between');

if (videoStart !== -1 && filterStart !== -1) {
  listing = listing.substring(0, videoStart) + listing.substring(filterStart);
  fs.writeFileSync(listingPath, listing, 'utf8');
  console.log('REMOVED from blog listing page. videoStart=' + videoStart + ' filterStart=' + filterStart);
} else {
  console.log('Not found - videoStart=' + videoStart + ' filterStart=' + filterStart);
}

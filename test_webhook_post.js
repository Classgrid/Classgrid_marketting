const crypto = require('crypto');
const secret = 'classgrid_blog_webhook_2024_secret';
const payload = JSON.stringify({
  _id: 'post-test',
  _type: 'post',
  title: 'Blog Post',
  slug: 'blog'
});
const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64');

fetch('https://www.classgrid.in/api/blog/webhook/sanity', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'sanity-webhook-signature': `t=${Date.now()},v1=${signature}`
  },
  body: payload
}).then(async r => {
  console.log(r.status, await r.text());
}).catch(console.error);

require('dotenv').config({ path: '.env.local' });
const Redis = require('ioredis');
const fs = require('fs');

async function downloadChat() {
  console.log('Connecting to Redis...');
  const redis = new Redis(process.env.REDIS_URL);
  
  try {
    const keys = await redis.keys('*');
    console.log(Found  + keys.length +  keys in Redis database.);
    
    const data = {};
    for (const key of keys) {
      const type = await redis.type(key);
      if (type === 'string') {
        data[key] = await redis.get(key);
      } else if (type === 'list') {
        data[key] = await redis.lrange(key, 0, -1);
      } else if (type === 'hash') {
        data[key] = await redis.hgetall(key);
      } else {
        data[key] = [Unsupported type: ];
      }
    }
    
    fs.writeFileSync('redis-chat-history.json', JSON.stringify(data, null, 2));
    console.log('? Successfully downloaded all chat history to: redis-chat-history.json');
  } catch (err) {
    console.error('Error downloading chat:', err);
  } finally {
    redis.disconnect();
  }
}

downloadChat();

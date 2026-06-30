require('dotenv').config({path: '.env.local'});
const Redis = require('ioredis');

const url = process.env.REDIS_URL;
if (!url) {
  console.log('No REDIS_URL found in .env.local!');
  process.exit(1);
}

const client = new Redis(url);

client.on('connect', async () => {
  try {
    const keys = await client.keys('ai:chat:session:*');
    console.log(`Found ${keys.length} active chat sessions in Redis.`);
    
    if (keys.length > 0) {
      // Pick the most recent/first one and show its history
      const firstKey = keys[0];
      const messages = await client.lrange(firstKey, 0, -1);
      
      console.log(`\n--- Chat History for ${firstKey} ---`);
      messages.forEach((msg, index) => {
        const parsed = JSON.parse(msg);
        console.log(`[Message ${index + 1}] ${parsed.role.toUpperCase()}: ${parsed.content.substring(0, 80)}...`);
      });
      console.log('-------------------------------------');
    }
    
    process.exit(0);
  } catch (e) {
    console.error('Failed to read chat memory:', e);
    process.exit(1);
  }
});

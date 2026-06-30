require('dotenv').config({path: '.env.local'});
const Redis = require('ioredis');

const url = process.env.REDIS_URL;

if (!url) {
  console.log('No REDIS_URL found in .env.local!');
  process.exit(1);
}

const client = new Redis(url, {
  connectTimeout: 5000,
  maxRetriesPerRequest: 1
});

client.on('error', (err) => {
  console.error('Redis Connection Error:', err.message);
  process.exit(1);
});

client.on('connect', async () => {
  console.log('Successfully connected to Redis!');
  try {
    await client.set('test_ping', 'pong');
    const val = await client.get('test_ping');
    console.log('Read test value:', val);
    console.log('Redis is fully operational!');
    process.exit(0);
  } catch (e) {
    console.error('Failed to read/write:', e);
    process.exit(1);
  }
});

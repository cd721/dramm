import redis from 'redis';

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1', // Defaults to localhost if REDIS_HOST is not set
    port: 6379,
    connectTimeout: 50000,
  },
});

client.on('error', (err) => console.error('Redis Client Error:', err));
client.on('connect', () => console.log('Connected to Redis!'));

await client.connect();

export default client;
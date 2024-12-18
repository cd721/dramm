import redis from 'redis';

const client = redis.createClient({
  socket: {
    host: "cache", // cache since Redis is running in Docker Compose
    port: 6379,
    connectTimeout: 50000,
  },
});

client.on('error', (err) => console.error('Redis Client Error:', err));
client.on('connect', () => console.log('Connected to Redis'));

await client.connect();

export default client;

import Redis from 'ioredis';

let redis: Redis;

if (process.env.NODE_ENV === 'production') {
  redis = new Redis(process.env.UPSTASH_REDIS_REST_URL!, {
    password: process.env.UPSTASH_REDIS_REST_TOKEN,
    tls: {} // Upstash nécessite TLS en production
  });
} else {
  // Développement local : suppose que Redis tourne sur localhost:6379
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  redis.on('error', (err) => {
    console.error('Redis error:', err);
  });
}

export default redis;

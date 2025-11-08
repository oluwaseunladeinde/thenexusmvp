import { Redis } from '@upstash/redis';
import { createClient } from 'redis';

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const LOCAL_REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redis: Redis | ReturnType<typeof createClient>;

if (REDIS_URL && REDIS_TOKEN) {
    // Use Upstash Redis if available
    redis = new Redis({
        url: REDIS_URL,
        token: REDIS_TOKEN,
    });
} else {
    // Fallback to local Redis
    console.warn('Upstash Redis not configured, falling back to local Redis');
    redis = createClient({ url: LOCAL_REDIS_URL });

    redis.on('error', (err) => {
        console.error('Local Redis connection error:', err);
    });

    redis.on('connect', () => {
        console.log('Connected to local Redis');
    });

    // Connect to local Redis
    redis.connect().catch((err) => {
        console.error('Failed to connect to local Redis:', err);
    });
}

export { redis };

// Cache keys
export const CACHE_KEYS = {
    STATES: 'states',
    CITIES: (stateId: string) => `cities:${stateId}`,
    INDUSTRIES: 'industries',
} as const;

// Cache TTL in seconds (24 hours)
export const CACHE_TTL = {
    STATES: 24 * 60 * 60,
    CITIES: 24 * 60 * 60,
    INDUSTRIES: 24 * 60 * 60,
} as const;

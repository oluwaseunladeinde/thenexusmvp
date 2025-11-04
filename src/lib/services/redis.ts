import { Redis } from '@upstash/redis';

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!REDIS_URL || !REDIS_TOKEN) {
    throw new Error(
        'Missing required Redis configuration: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be defined'
    );
}

export const redis = new Redis({
    url: REDIS_URL,
    token: REDIS_TOKEN,
});

// Cache keys
export const CACHE_KEYS = {
    STATES: 'states',
    CITIES: (stateId: string) => `cities:${stateId}`,
} as const;

// Cache TTL in seconds (24 hours)
export const CACHE_TTL = {
    STATES: 24 * 60 * 60,
    CITIES: 24 * 60 * 60,
} as const;
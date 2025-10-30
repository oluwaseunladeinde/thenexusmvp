import { Redis } from '@upstash/redis';

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
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
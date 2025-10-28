import { createClient, RedisClientType } from 'redis';

const redis: RedisClientType = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
redis.connect().catch(console.error);

export interface CacheOptions {
    ttl?: number; // Time to live in seconds
}

export class CacheService {
    private redis: RedisClientType;

    constructor() {
        this.redis = redis;
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await this.redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
        try {
            const { ttl } = options;
            const serializedValue = JSON.stringify(value);

            if (ttl) {
                await this.redis.setEx(key, ttl, serializedValue);
            } else {
                await this.redis.set(key, serializedValue);
            }
        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.redis.del(key);
        } catch (error) {
            console.error('Cache delete error:', error);
        }
    }

    async exists(key: string): Promise<boolean> {
        try {
            const result = await this.redis.exists(key);
            return result === 1;
        } catch (error) {
            console.error('Cache exists error:', error);
            return false;
        }
    }

    async clear(): Promise<void> {
        try {
            await this.redis.flushAll();
        } catch (error) {
            console.error('Cache clear error:', error);
        }
    }
}

export const cacheService = new CacheService();

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

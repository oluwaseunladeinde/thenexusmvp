import "server-only";
import { cache } from 'react';
import { Redis } from '@upstash/redis';

export interface CacheOptions {
    ttl?: number; // Time to live in seconds
}

export class CacheService {
    private redis: Redis;

    constructor() {
        if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
            throw new Error('Missing required environment variables: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN');
        }
        this.redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await this.redis.get<string>(key);
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
                await this.redis.setex(key, ttl, serializedValue);
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
            await this.redis.flushall();
        } catch (error) {
            console.error('Cache clear error:', error);
        }
    }
}

export const cacheService = new CacheService();

// Re-export cache keys and TTL from services
export { CACHE_KEYS, CACHE_TTL } from '@/lib/services';

const resolveApiUrl = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL;
    if (!baseUrl) {
        throw new Error('Missing base URL for server-side API fetches');
    }
    return new URL(path, baseUrl).toString();
};

export const getIndustries = cache(async () => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const response = await fetch(`${baseUrl}/api/v1/industries`);
        if (!response.ok) throw new Error('Failed to fetch industries');
        return await response.json();
    } catch (error) {
        console.error('Error fetching industries:', error);
        return [];
    }
});

export const getStates = cache(async () => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const response = await fetch(`${baseUrl}/api/v1/states`);
        if (!response.ok) throw new Error('Failed to fetch states');
        return await response.json();
    } catch (error) {
        console.error('Error fetching states:', error);
        return [];
    }
});

export const getCitiesByState = cache(async (stateId: string) => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const response = await fetch(`${baseUrl}/api/v1/states/${stateId}/cities`);
        if (!response.ok) throw new Error('Failed to fetch cities');
        return await response.json();
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
});

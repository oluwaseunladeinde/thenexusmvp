import 'server-only';
import { Redis as UpstashRedis } from '@upstash/redis';
import { createClient, RedisClientType } from 'redis';

// Environment variables
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const LOCAL_REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

/**
 * Unified Redis adapter interface
 */
interface RedisAdapter {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, options?: { ex?: number }): Promise<string | null>;
    del(key: string): Promise<number>;
}

/**
 * Adapter implementation for Upstash Redis
 */
class UpstashRedisAdapter implements RedisAdapter {
    private client: UpstashRedis;

    constructor(url: string, token: string) {
        this.client = new UpstashRedis({ url, token });
    }

    async get(key: string) {
        return await this.client.get<string>(key);
    }

    async set(key: string, value: string, options?: { ex?: number }) {
        if (options?.ex) {
            return await this.client.set(key, value, { ex: options.ex });
        } else {
            return await this.client.set(key, value);
        }
    }

    async del(key: string) {
        return await this.client.del(key);
    }
}

/**
 * Adapter implementation for local Redis
 */
class LocalRedisAdapter implements RedisAdapter {
    private client: RedisClientType;

    constructor(url: string) {
        this.client = createClient({ url });
        this.client.on('error', (err) => console.error('Local Redis error:', err));
        this.client.connect().catch((err) =>
            console.error('Failed to connect to local Redis:', err)
        );
    }

    async get(key: string) {
        return await this.client.get(key);
    }

    async set(key: string, value: string, options?: { ex?: number }) {
        if (options?.ex) {
            return await this.client.set(key, value, { EX: options.ex });
        } else {
            return await this.client.set(key, value);
        }
    }

    async del(key: string) {
        return await this.client.del(key);
    }
}

/**
 * Lazy Redis client initialization
 */
let redisInstance: RedisAdapter | null = null;

function getRedisClient(): RedisAdapter {
    if (!redisInstance) {
        if (REDIS_URL && REDIS_TOKEN) {
            console.log('Using Upstash Redis');
            redisInstance = new UpstashRedisAdapter(REDIS_URL, REDIS_TOKEN);
        } else {
            console.warn('Upstash Redis not configured, falling back to local Redis');
            redisInstance = new LocalRedisAdapter(LOCAL_REDIS_URL);
        }
    }
    return redisInstance;
}

export const redis = {
    get: (key: string) => getRedisClient().get(key),
    set: (key: string, value: string, options?: { ex?: number }) => getRedisClient().set(key, value, options),
    del: (key: string) => getRedisClient().del(key),
};

/**
 * Cache keys and TTL constants
 */
export const CACHE_KEYS = {
    STATES: 'states',
    CITIES: (stateId: string) => `cities:${stateId}`,
    INDUSTRIES: 'industries',
} as const;

export const CACHE_TTL = {
    STATES: 24 * 60 * 60,
    CITIES: 24 * 60 * 60,
    INDUSTRIES: 24 * 60 * 60,
} as const;

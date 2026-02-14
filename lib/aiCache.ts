import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'ai_cache_';
const DEFAULT_TTL = 30 * 60 * 1000; // 30 dakika

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

class AICache {
    async get<T>(key: string): Promise<T | null> {
        try {
            const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
            if (!raw) return null;

            const entry: CacheEntry<T> = JSON.parse(raw);
            const now = Date.now();

            if (now - entry.timestamp > entry.ttl) {
                // Expired
                await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
                return null;
            }

            return entry.data;
        } catch {
            return null;
        }
    }

    async set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): Promise<void> {
        try {
            const entry: CacheEntry<T> = {
                data,
                timestamp: Date.now(),
                ttl,
            };
            await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
        } catch {
            // Sessiz hata — cache kritik değil
        }
    }

    async invalidate(key: string): Promise<void> {
        await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`).catch(() => { });
    }

    async clearAll(): Promise<void> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter((k: string) => k.startsWith(CACHE_PREFIX));
            if (cacheKeys.length > 0) {
                await AsyncStorage.multiRemove(cacheKeys);
            }
        } catch {
            // Sessiz
        }
    }

    // Hash fonksiyonu — basit string hash
    makeKey(...parts: (string | number | undefined)[]): string {
        return parts
            .filter(Boolean)
            .map(String)
            .join('_')
            .replace(/[^a-zA-Z0-9_]/g, '')
            .slice(0, 64);
    }
}

export const aiCache = new AICache();

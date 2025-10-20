import {LRUCache} from 'lru-cache';

const lruCache = new LRUCache<string, string>({
    // 缓存多少个页面
    max: 100,
    ttl: 30 * 60 * 1000,
    updateAgeOnGet: true,
    updateAgeOnHas: true,
});

export {
    lruCache,
};

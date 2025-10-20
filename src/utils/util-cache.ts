
interface CacheOption {
    // 缓存时间  单位ms
    expireTime?: number;
}
interface MapItem {
    value: unknown;
    expireTime?: number;
}
export class Cache {
    cacheMap: Map<string, MapItem> = new Map();
    option = {
        expireTime: 60 * 1000,
    };
    constructor(option: CacheOption) {
        this.option = Object.assign({}, this.option, option);
    }

    set(key: string, value: unknown) {
        this.cacheMap.set(key, {
            expireTime: Date.now(),
            value,
        });
    }

    get(key: string) {
        const item = this.cacheMap.get(key);
        if (item) {
            // 如果时间小于缓存时间，则返回
            if (item.expireTime + this.option.expireTime > Date.now()) {
                return item.value;
            }
            // 过期删除
            this.cacheMap.delete(key);
        }
        return undefined;
    }
}

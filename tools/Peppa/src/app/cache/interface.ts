export interface ICache {
    /** value */
    v: any;
    /** expire timestamp，`0` means never expires */
    e: number;
}

export interface ICacheStore {
    get(key: string): ICache;

    set(key: string, value: ICache): boolean;

    remove(key: string);
}

export type CacheNotifyType = 'set' | 'remove' | 'expire';

export interface CacheNotifyResult {
    type: CacheNotifyType;
    value?: any;
}

export type CacheType = 'memory' | 'storage';

export interface CacheOption {
    type?: CacheType;
    expire?: number;
}

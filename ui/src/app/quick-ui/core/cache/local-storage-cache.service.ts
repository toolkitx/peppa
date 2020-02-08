import { InjectionToken } from '@angular/core';
import { ICache, ICacheStore } from './interface';

export const QUI_STORE_STORAGE_TOKEN = new InjectionToken<ICacheStore>('QUI_STORE_STORAGE_TOKEN', {
    providedIn: 'root',
    factory: QUI_STORE_STORAGE_TOKEN_FACTORY,
});

export function QUI_STORE_STORAGE_TOKEN_FACTORY() {
    return new LocalStorageCacheService();
}

export class LocalStorageCacheService implements ICacheStore {
    get(key: string): ICache {
        return JSON.parse(localStorage.getItem(key) || 'null') || null;
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

    set(key: string, value: ICache): boolean {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }

}

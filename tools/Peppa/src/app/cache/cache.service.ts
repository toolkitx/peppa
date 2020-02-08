import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { addSeconds } from 'date-fns';

import { CacheConfig } from './cache.config';
import { QUI_STORE_STORAGE_TOKEN } from './local-storage-cache.service';
import { CacheNotifyResult, CacheNotifyType, CacheOption, ICache, ICacheStore } from './interface';

@Injectable({
    providedIn: 'root'
})
export class CacheService implements OnDestroy {
    private freqTick = 3000;
    private freqTimer;
    private cog = <CacheConfig>{};
    private readonly memory: Map<string, ICache> = new Map<string, ICache>();
    private readonly notifyBuffer: Map<string, BehaviorSubject<CacheNotifyResult>> = new Map<string, BehaviorSubject<CacheNotifyResult>>();
    // all the keys cached in storage, do not contain keys in memory
    private meta: Set<string> = new Set<string>();

    constructor(config: CacheConfig, @Inject(QUI_STORE_STORAGE_TOKEN) private store: ICacheStore) {
        Object.assign(this.cog, {...new CacheConfig(), ...config});
        this.loadMeta();
        this.startExpireNotify();
    }

    ngOnDestroy(): void {
        this.memory.clear();
        this.abortExpireNotify();
        this.clearNotify();
    }

    /** is cache `key` */
    has(key: string): boolean {
        return this.memory.has(key) || this.meta.has(key);
    }

    set(key: string, data: any, options: CacheOption = {}) {
        let expire = options.expire ? options.expire : 0;
        if (expire) {
            expire = addSeconds(new Date(), options.expire).valueOf();
        }
        // use memory cache by default
        const type = options.type ? options.type : 'memory';
        const value: ICache = {v: data, e: expire};
        if (type === 'memory') {
            this.memory.set(key, value);
        } else {
            this.store.set(this.getStoreKey(key), value);
            this.pushMeta(key);
        }
        this.runNotify(key, 'set');
    }

    get<T>(key: string): T {
        const value: ICache = this.memory.has(key) ? this.memory.get(key) : this.store.get(this.getStoreKey(key));
        if (!value || (value.e && value.e > 0 && value.e < new Date().valueOf())) {
            return null;
        }
        return value.v;
    }

    /** notify and remove cache by single key */
    remove(key: string, needNotify = true) {
        if (!this.has(key)) {
            return;
        }
        if (this.memory.has(key)) {
            this.memory.delete(key);
        } else {
            this.store.remove(this.getStoreKey(key));
            this.removeMeta(key);
        }
        if (needNotify) {
            this.runNotify(key, 'remove');
        }
    }

    /** notify and remove all cached data from storage */
    clear() {
        // remove from storage
        this.meta.forEach(key => this.store.remove(this.getStoreKey(key)));
        this.meta.clear();
        // clear memory cache
        this.memory.clear();
        // send notification
        this.notifyBuffer.forEach((_v, k) => this.runNotify(k, 'remove'));
        // clear subscription
        this.clearNotify();
        // save meta data
        this.saveMeta();
    }

    notify(key: string): Observable<CacheNotifyResult> {
        if (!this.notifyBuffer.has(key)) {
            const change$ = new BehaviorSubject<CacheNotifyResult>({type: null, value: this.get(key)});
            this.notifyBuffer.set(key, change$);
        }
        return this.notifyBuffer.get(key)!.asObservable();
    }

    /**
     *  unsubscribe `key`
     */
    cancelNotify(key: string): void {
        if (!this.notifyBuffer.has(key)) {
            return;
        }
        this.notifyBuffer.get(key)!.unsubscribe();
        this.notifyBuffer.delete(key);
    }

    /** check subscribe `key` */
    hasNotify(key: string): boolean {
        return this.notifyBuffer.has(key);
    }

    /** clear all `key` */
    clearNotify(): void {
        this.notifyBuffer.forEach(v => v.unsubscribe());
        this.notifyBuffer.clear();
    }

    set freq(value: number) {
        this.freqTick = Math.max(20, value);
        this.abortExpireNotify();
        this.startExpireNotify();
    }

    private startExpireNotify() {
        this.checkExpireNotify();
        this.runExpireNotify();
    }

    private runExpireNotify() {
        this.freqTimer = setTimeout(() => {
            this.checkExpireNotify();
            this.runExpireNotify();
        }, this.freqTick);
    }

    private checkExpireNotify() {
        const removed: string[] = [];
        this.notifyBuffer.forEach((_v, key) => {
            if (this.has(key) && this.get(key) === null) {
                removed.push(key);
            }
        });
        removed.forEach(key => {
            this.remove(key, false);
            this.runNotify(key, 'expire');
        });
    }

    private abortExpireNotify() {
        clearTimeout(this.freqTimer);
    }

    private runNotify(key: string, type: CacheNotifyType) {
        if (!this.notifyBuffer.has(key)) {
            return;
        }
        this.notifyBuffer.get(key)!.next({type, value: this.get(key)});
    }

    private getStoreKey(key: string) {
        return this.cog.prefix + key;
    }

    // #region meta

    private pushMeta(key: string) {
        if (this.meta.has(key)) {
            return;
        }
        this.meta.add(key);
        this.saveMeta();
    }

    private removeMeta(key: string) {
        if (!this.meta.has(key)) {
            return;
        }
        this.meta.delete(key);
        this.saveMeta();
    }

    private loadMeta() {
        const ret = this.store.get(this.cog.meta_key!);
        if (ret && ret.v) {
            (ret.v as string[]).forEach(key => this.meta.add(key));
        }
    }

    private saveMeta() {
        const metaData: string[] = [];
        this.meta.forEach(key => metaData.push(key));
        this.store.set(this.cog.meta_key!, {v: metaData, e: 0});
    }

    // #endregion
}

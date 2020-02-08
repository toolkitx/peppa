import { Injectable } from '@angular/core';
import { GlobalConfig, RegionConfig } from './interface';
import { CacheService } from '../cache/cache.service';
import { CONSTANT_GLOBAL_CONFIGURATION } from '../global';
import { CACHE_KEY_CURRENT_REGION_NAME } from '../global/cache-keys';

@Injectable({
    providedIn: 'root'
})
export class GlobalConfigService implements GlobalConfig {
    _aadClientId: string;
    _regions: RegionConfig[] = [];
    private currentRegion: RegionConfig;

    constructor(private cacheService: CacheService) {
    }

    get aadClientId() {
        if (!this._aadClientId) {
            this.initSettings();
        }
        return this._aadClientId;
    }

    set aadClientId(val: string) {
        this._aadClientId = val;
    }

    get regions(): RegionConfig[] {
        if (!this._regions.length) {
            this.initSettings();
        }
        return this._regions;
    }

    set regions(val: RegionConfig[]) {
        this._regions = val;
    }

    getEndpoint(url: string) {
        url = url.replace(/^\//, '');
        return `${this.apiBaseUrl}/${url}`;
    }

    get currentRegionConfig() {
        return this.currentRegion;
    }

    private get apiBaseUrl() {
        const regionName = this.cacheService.get(CACHE_KEY_CURRENT_REGION_NAME) || this.regions[0].name;
        if (!this.currentRegion || this.currentRegion.name !== regionName) {
            this.currentRegion = this.regions.find(x => x.name === regionName);
            this.setRegion(this.currentRegion.name);
        }
        return this.currentRegion.apiBaseUrl.replace(/\/$/g, '');
    }

    setRegion(val: string) {
        this.cacheService.set(CACHE_KEY_CURRENT_REGION_NAME, val, {type: 'storage'});
    }

    private initSettings() {
        Object.assign(this, this.cacheService.get(CONSTANT_GLOBAL_CONFIGURATION));
    }
}

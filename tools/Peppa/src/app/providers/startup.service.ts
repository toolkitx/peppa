import { Injectable } from '@angular/core';
import { JsonLoaderService } from './json-loader.service';
import { PeppaSettings } from '../modals/peppa-settings';
import { CacheService } from '../cache/cache.service';
import { CONST_PEPPA_SETTINGS_KEY } from '../constants';

export function StartupServiceFactory(startupService: StartupService) {
    return () => startupService.load();
}

@Injectable()
export class StartupService {

    constructor(private jsonLoader: JsonLoaderService, private cacheService: CacheService) {
    }

    load(): Promise<any> {
        return this.loadConfigs();
    }

    private loadConfigs() {
        return new Promise<void>((resolve, reject) => {
            this.jsonLoader.get('https://odgmpeppastudio.blob.core.windows.net/peppa-studio-config/peppa-settings.json')
                .subscribe((data: PeppaSettings) => {
                    console.log(data);
                    this.cacheService.set(CONST_PEPPA_SETTINGS_KEY, data);
                    resolve();
                })
        });
    }
}

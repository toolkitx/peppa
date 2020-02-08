import { Injectable } from '@angular/core';
import * as MessageFormatIns from 'messageformat';
import { CacheService } from '../cache/cache.service';
import { CONSTANT_I18N_CONFIGURATION } from '../global';

const MessageFormat = MessageFormatIns;

@Injectable({
    providedIn: 'root'
})
export class TranslateService {
    private data: {[key: string]: string};

    constructor(private cacheService: CacheService) {
    }

    public translate(key: string, params?: any) {
        if (!this.data) {
            this.data = this.cacheService.get<{[key: string]: string}>(CONSTANT_I18N_CONFIGURATION) || {};
        }
        const translation = this.data[key];
        if (!translation) {
            return key;
        }
        if (!params) {
            return translation;
        }
        const msg = new MessageFormat().compile(translation);
        return msg(params);
    }
}

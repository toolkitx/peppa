import { Injectable } from '@angular/core';
import { JsonLoaderService } from '../../core/service/json-loader.service';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

    constructor(private jsonLoader: JsonLoaderService) {
    }

    getVersion() {
        return this.jsonLoader.get('/assets/version.json');
    }

    getThirdPartyComponents() {
        return this.jsonLoader.get('/assets/third-party-components.json');
    }
}

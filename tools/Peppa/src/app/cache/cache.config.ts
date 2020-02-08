import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class CacheConfig {
    prefix = '__qui_';
    meta_key = '__qui_cache_meta';
}

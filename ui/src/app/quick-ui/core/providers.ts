import { InjectionToken } from '@angular/core';
import { CACHE_KEY_AUTH_TOKEN, CACHE_KEY_DIRECTORY_ID, CACHE_KEY_ORGANIZATION_ID } from './global/cache-keys';

export const DEFAULT_LOGIN_VIEW_NAME = new InjectionToken<string>('Login view name, will redirect to this view if need auth.');
export const DEFAULT_VIEW_AFTER_LOGIN = new InjectionToken<string>('The view name which will be redirected after login.');
export const DEFAULT_HEADER_KEYS = new InjectionToken<{key: string; value: string}[]>
('Default headers to send to the api along with http request.');

export const QUI_PROVIDERS = [
    {provide: DEFAULT_LOGIN_VIEW_NAME, useValue: 'login'},
    {provide: DEFAULT_VIEW_AFTER_LOGIN, useValue: 'home'},
    {
        provide: DEFAULT_HEADER_KEYS, useValue: [
            {key: 'Authorization', value: `Bearer $cache(${CACHE_KEY_AUTH_TOKEN})`},
            {key: 'organization-id', value: `$cache(${CACHE_KEY_ORGANIZATION_ID})`},
            {key: 'directory-id', value: `$cache(${CACHE_KEY_DIRECTORY_ID})`}
        ]
    }
];

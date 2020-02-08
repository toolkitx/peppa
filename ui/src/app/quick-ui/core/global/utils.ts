import { UiConfigurationService } from '../render/ui-configuration.service';
import { CacheService } from '../cache/cache.service';
import { CONSTANT_ADMIN_ROLE, CONSTANT_ANONYMOUS_ROLE, CONSTANT_GENERAL_ROLE } from './constants';
import { CACHE_KEY_AUTH_TOKEN } from './cache-keys';
import * as JWT from 'jwt-decode';
import { SessionData } from '../modals';

export function hasPermission(permissions: string[] = [CONSTANT_GENERAL_ROLE],
                              uiConfigService: UiConfigurationService,
                              cacheService: CacheService) {
    if (isAnonymousAllowed(permissions)) {
        return true;
    }
    if (permissions.includes(CONSTANT_GENERAL_ROLE)) {
        return !!cacheService.get(CACHE_KEY_AUTH_TOKEN);
    }
    if (permissions.includes(CONSTANT_ADMIN_ROLE)) {
        const token = cacheService.get<string>(CACHE_KEY_AUTH_TOKEN);
        const decoded = decodeJwt<SessionData>(token);
        if (decoded && decoded.securityRole === CONSTANT_ADMIN_ROLE) {
            return true;
        }
    }
    return false;
}

export function isAnonymousAllowed(permissions: string[]) {
    return permissions && permissions.includes(CONSTANT_ANONYMOUS_ROLE) || false;
}

export function decodeJwt<T>(token: string) {
    if (!token) {
        return {} as T;
    }
    try {
        return JWT(token) as T;
    } catch {
        return {} as T;
    }
}

import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationExtras, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UiConfigurationService } from '../render/ui-configuration.service';
import { CONSTANT_REDIRECT_FROM_QUERY_KEY, CONSTANT_VIEW_NAME_PARAM_KEY } from '../global';
import { CacheService } from '../cache/cache.service';
import { decodeJwt, hasPermission, isAnonymousAllowed } from '../global/utils';
import { DEFAULT_LOGIN_VIEW_NAME } from '../providers';
import { MessageService } from '../service/message.service';
import { SessionData } from '../modals';
import {
    CACHE_KEY_AUTH_TOKEN, CACHE_KEY_DIRECTORY_ID, CACHE_KEY_ORGANIZATION_ID, CACHE_KEY_REDIRECT_FROM, CACHE_KEY_USER_SESSION
} from '../global/cache-keys';

@Injectable({
    providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
    constructor(private uiConfigService: UiConfigurationService,
                private router: Router,
                @Inject(DEFAULT_LOGIN_VIEW_NAME) private loginViewName: string,
                private messageService: MessageService,
                private cacheService: CacheService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const viewName = next.paramMap.get(CONSTANT_VIEW_NAME_PARAM_KEY);
        const view = this.uiConfigService.getView(viewName);
        if (!view) {
            this.messageService.error('View not found.');
            return false;
        }

        if (isAnonymousAllowed(view.permissions)) {
            return true;
        } else if (this.checkSessionState() && hasPermission(view.permissions, this.uiConfigService, this.cacheService)) {
            return true;
        } else {
            // cache url for 5 mins
            this.cacheService.set(CACHE_KEY_REDIRECT_FROM, viewName, {type: 'storage', expire: 5 * 60});
            this.router.navigate([this.loginViewName]);
        }
    }

    private checkSessionState() {
        let session = this.cacheService.get<SessionData>(CACHE_KEY_USER_SESSION);
        if (!session) {
            const token = this.cacheService.get<string>(CACHE_KEY_AUTH_TOKEN);
            if (token) {
                session = decodeJwt<SessionData>(token);
                this.cacheService.set(CACHE_KEY_USER_SESSION, session);
                this.cacheService.set(CACHE_KEY_ORGANIZATION_ID, session.organizationId);
                this.cacheService.set(CACHE_KEY_DIRECTORY_ID, session.directoryId);
                return true;
            } else {
                this.cacheService.set(CACHE_KEY_USER_SESSION, null);
                return false;
            }
        } else {
            return true;
        }
    }
}

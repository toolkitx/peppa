import { Injectable } from '@angular/core';
import { GlobalConfigService } from './global-config.service';
import * as microsoftTeams from '@microsoft/teams-js';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

declare const AuthenticationContext: any;

const defaultScope = 'openid+profile';
const defaultResource = 'https://graph.microsoft.com';

@Injectable({
    providedIn: 'root'
})
export class AdalService {

    get resource() {
        return defaultResource;
    }

    get aadClientId() {
        return this.globalConfigSvc ? this.globalConfigSvc.aadClientId : null;
    }

    constructor(private globalConfigSvc: GlobalConfigService) {
    }

    getTeamContext() {
        return new Observable((obs) => {
            microsoftTeams.getContext((ctx: microsoftTeams.Context) => {
                obs.next(ctx);
                obs.complete();
            });
        });
    }

    getAuthContext(redirectUri?: string) {
        return this.getTeamContext().pipe(switchMap(({tid, loginHint, userObjectId}) => {
            const extParams = [`scope=${defaultScope}`];
            if (loginHint) {
                extParams.push(`login_hint=${encodeURIComponent(loginHint)}`);
            }
            const conf = {
                tenant: tid,
                clientId: this.globalConfigSvc.aadClientId,
                redirectUri: redirectUri || `${window.location.origin}/login`,
                cacheLocation: 'localStorage',
                navigateToLoginRequestUrl: true,
                extraQueryParameter: extParams.join('&')
            };
            const authContext = new AuthenticationContext(conf);
            const user = authContext.getCachedUser();
            if (user) {
                if (user.profile.oid !== userObjectId) {
                    // User doesn't match, clear the cache
                    authContext.clearCache();
                }
            }
            return of(authContext);
        }));
    }

    authDialog(url: string, defaultErr = 'FailedToLogin'): Observable<string> {
        return new Observable((obs) => {
            microsoftTeams.authentication.authenticate({
                url,
                width: 440,
                height: 560,
                successCallback: (token) => {
                    if (token) {
                        obs.next(token);
                        obs.complete();
                    } else {
                        obs.error(defaultErr);
                        obs.complete();
                    }
                },
                failureCallback: (reason) => {
                    obs.error(reason);
                    obs.complete();
                }
            });
        });
    }

    getCachedToken() {
        return this.aadClientId ? this.getAuthContext().pipe(switchMap((authContext: any) => {
            const token = authContext.getCachedToken(this.aadClientId);
            return of(token);
        })) : of(null);
    }

    grantAdminConsent(consentView = 'do-admin-consent'): Observable<string> {
        const url = `${window.location.hash}/display/${consentView}`;
        return this.authDialog(url, 'FailToGrantAdminConsent');
    }

    isAdminConsentCallback(hash: string) {
        return /id_token=(.*?)&/.test(hash);
    }

    handleAdminConsentCallback(hash: string, defaultErr = 'FailToGrantAdminConsent') {
        const match = /id_token=(.*?)&/.exec(hash);
        const token = match[1];
        if (token) {
            microsoftTeams.authentication.notifySuccess(token);
        } else {
            microsoftTeams.authentication.notifyFailure(defaultErr);
        }

    }
}

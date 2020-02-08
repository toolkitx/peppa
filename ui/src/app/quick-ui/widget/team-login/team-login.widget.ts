import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import * as microsoftTeams from '@microsoft/teams-js';
import { Context } from '@microsoft/teams-js';

import { BaseWidget } from '../../core/render';
import { Widget } from '../../core/decorators';
import { TeamLoginSlotConf } from './team-login-slot-conf';
import { DEFAULT_VIEW_AFTER_LOGIN } from '../../core/providers';
import { GlobalConfigService } from '../../core/service/global-config.service';
import { CACHE_KEY_AUTH_TOKEN, CACHE_KEY_REDIRECT_FROM } from '../../core/global/cache-keys';

declare const AuthenticationContext: any;

@Widget({
    type: 'TeamLogin',
    version: 'latest',
    slotConfClass: TeamLoginSlotConf
})
@Component({
    selector: 'qui-team-login',
    templateUrl: './team-login.widget.html',
    styleUrls: ['./team-login.widget.less']
})
export class TeamLoginWidget extends BaseWidget implements OnInit {
    @Input() conf: TeamLoginSlotConf;
    token: string;
    targetRegion: string;
    allRegions: string[];
    registerState = '';

    constructor(protected injector: Injector,
                @Inject(DEFAULT_VIEW_AFTER_LOGIN) private nextViewName: string,
                private globalConfig: GlobalConfigService) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    startInitWidget() {
        microsoftTeams.initialize();
        const authContext = new AuthenticationContext(this.getAdalConfig());
        if (authContext.isCallback(window.location.hash)) {
            authContext.handleWindowCallback(window.location.hash);
            // Only call notifySuccess or notifyFailure if this page is in the authentication popup
            if (window.opener) {
                if (authContext.getCachedUser()) {
                    microsoftTeams.authentication.notifySuccess();
                    this.getSession();
                } else {
                    microsoftTeams.authentication.notifyFailure(authContext.getLoginError());
                }
            }
        } else {
            this.getSession();
        }
    }

    private getSession() {
        microsoftTeams.getContext((ctx) => {
            this.getAADSession(ctx);
        });
    }

    private getAADSession(ctx: Context) {
        const config = this.getAdalConfig(ctx);
        config.displayCall = (urlNavigate: string) => {
            if (urlNavigate) {
                if (config.extraQueryParameters) {
                    urlNavigate += '&' + config.extraQueryParameters;
                }
                window.location.replace(urlNavigate);
            }
        };
        const authContext = new AuthenticationContext(config);
        // See if there's a cached user and it matches the expected user
        const user = authContext.getCachedUser();
        if (!user) {
            authContext.login();
        } else {
            this.token = authContext.getCachedToken(config.clientId);
            if (!this.token) {
                authContext._renewIdToken((err: any, idToken: any) => {
                    if (err) {
                        this.showError(err);
                        return;
                    }
                    this.token = idToken;
                    this.getS365Token();
                });
            } else {
                this.getS365Token();
            }
        }
    }

    private getAdalConfig(ctx?: Context): any {
        return {
            clientId: this.globalConfig.aadClientId,
            // redirectUri must be in the list of redirect URLs for the Azure AD app
            redirectUri: window.location.origin + '/login',
            cacheLocation: 'localStorage',
            navigateToLoginRequestUrl: false,
            extraQueryParameters: ctx && ctx.userPrincipalName
                ? 'scope=openid+profile&login_hint=' + encodeURIComponent(ctx.userPrincipalName) : 'scope=openid+profile'
        };
    }

    private getS365Token() {
        this.registerState = '';
        this.getRegions();
    }

    private getRegions() {
        const config = this.conf.config;
        const ctx = this.getCommandParams();
        const req = this.getCommandRequest(config.region.command, config.region.payload, ctx, ctx);
        this.runCommand(req).subscribe((rs: {region: string[]}) => {
            const data = rs.region;
            if (data && data.length) {
                this.allRegions = data;
                this.targetRegion = data[0];
                this.exchangeToken();
            } else {
                this.showError('Tenant not register, please create your account first.');
            }
        });
    }

    private getCommandParams() {
        return {region: this.targetRegion, token: this.token};
    }

    private exchangeToken() {
        this.globalConfig.setRegion(this.targetRegion);
        const config = this.conf.config;
        const ctx = this.getCommandParams();
        const req = this.getCommandRequest(config.token.command, config.token.payload, ctx, ctx);
        this.runCommand(req).subscribe((data: any) => {
            const idToken = data[config.tokenPropName];
            this.setCache(CACHE_KEY_AUTH_TOKEN, idToken);
            this.navigateTo(this.defaultNextView);
        });
    }

    protected showError(msg: string) {
        if (msg === 'FailedToGetOrganization') {
            // unregister
            this.registerState = 'unregistered';
            return;
        }
        super.showError(msg);
    }

    private get defaultNextView() {
        const cacheView = this.cacheService.get<string>(CACHE_KEY_REDIRECT_FROM);
        if (cacheView) {
            this.cacheService.remove(CACHE_KEY_REDIRECT_FROM);
            return cacheView;
        }
        return this.nextViewName;
    }

}

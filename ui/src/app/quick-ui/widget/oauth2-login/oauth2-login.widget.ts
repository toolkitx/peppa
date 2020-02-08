import { Component, Inject, Injector, Input, OnInit } from '@angular/core';

import { Widget } from '../../core/decorators';
import { Oauth2LoginSlotConf } from './oauth2-login-slot-conf';
import { BaseWidget } from '../../core/render';
import { OauthResponse } from './oauth-response';
import { DEFAULT_VIEW_AFTER_LOGIN } from '../../core/providers';
import { CACHE_KEY_AUTH_TOKEN, CACHE_KEY_REDIRECT_FROM } from '../../core/global/cache-keys';
import { GlobalConfigService } from '../../core/service/global-config.service';

@Widget({
    type: 'Oauth2Login',
    version: 'latest',
    slotConfClass: Oauth2LoginSlotConf
})
@Component({
    selector: 'qui-oauth2-login',
    templateUrl: './oauth2-login.widget.html',
    styleUrls: ['./oauth2-login.widget.less']
})
export class Oauth2LoginWidget extends BaseWidget implements OnInit {
    @Input() conf: Oauth2LoginSlotConf;
    isCallback = false;
    targetRegion: string;
    allRegions: string[];

    constructor(protected injector: Injector,
                @Inject(DEFAULT_VIEW_AFTER_LOGIN) private nextViewName: string,
                private globalConfig: GlobalConfigService) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.isCallback = this.checkCallback(this.url);
        if (this.isCallback) {
            const callbackResult = new OauthResponse(this.url);
            if (callbackResult.isSucceed) {
                this.getRegions();
            } else {
                this.showError(callbackResult.errorDescription);
            }
        }
    }

    login() {
        const config = this.conf.config;
        const req = this.getCommandRequest(config.authorize.command, config.authorize.payload, this.getCommandParams());
        this.runCommand(req).subscribe((data: any) => {
            const url = data[config.redirectUrlPropName];
            if (url) {
                window.location = url;
            }
        });
    }

    exchangeToken() {
        this.globalConfig.setRegion(this.targetRegion);
        const callbackResult = new OauthResponse(this.url);
        if (callbackResult.isSucceed) {
            const config = this.conf.config;
            const ctx = this.getCommandParams();
            const req = this.getCommandRequest(config.token.command, config.token.payload, ctx, ctx);
            this.runCommand(req).subscribe((data: any) => {
                const idToken = data[config.tokenPropName];
                this.setCache(CACHE_KEY_AUTH_TOKEN, idToken);
                this.navigateTo(this.defaultNextView);
            });
        }
    }

    get url() {
        return window.location.href;
    }

    protected showError(msg: string) {
        this.isCallback = false;
        if (msg === 'FailedToGetOrganization') {
            this.navigateTo('register');
        } else {
            this.router.navigate([], {replaceUrl: true});
        }
        super.showError(msg);
    }

    private checkCallback(url) {
        return OauthResponse.oauth2IdTokenCallbackRegex.test(url) || OauthResponse.oauth2ErrorRegex.test(url);
    }

    private checkCallbackFromO365(url) {
        return OauthResponse.oauth2IdTokenCallbackRegex.test(url);
    }

    private getRegions() {
        const config = this.conf.config;
        const req = this.getCommandRequest(config.region.command, config.region.payload, this.getCommandParams());
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
        return {region: this.targetRegion};
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

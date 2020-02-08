import { Component, Inject, Injector, Input, OnInit } from '@angular/core';

import { Widget } from '../../core/decorators';
import { SignUpSlotConf } from './sign-up-slot-conf';
import { BaseWidget } from '../../core/render';
import { DEFAULT_LOGIN_VIEW_NAME } from '../../core/providers';
import { OauthResponse } from '../oauth2-login/oauth-response';
import { GlobalConfigService } from '../../core/service/global-config.service';
import { RegionConfig } from '../../core/service/interface';

@Widget({
    type: 'SignUp',
    version: 'latest',
    slotConfClass: SignUpSlotConf
})
@Component({
    selector: 'qui-sign-up',
    templateUrl: './sign-up.widget.html',
    styleUrls: ['./sign-up.widget.less']
})
export class SignUpWidget extends BaseWidget implements OnInit {
    @Input() conf: SignUpSlotConf;
    isCallback = false;
    regions: RegionConfig[] = [];
    targetRegion: string;
    isSuccess = false;
    constructor(protected injector: Injector,
                @Inject(DEFAULT_LOGIN_VIEW_NAME) private loginViewName: string,
                private globalConfig: GlobalConfigService) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.isCallback = this.checkCallback(this.url);
        this.regions = this.globalConfig.regions;
        this.targetRegion = this.regions[0].name;
        if (this.isCallback && this.regions.length === 1) {
            this.register();
        }
    }

    grantConsent() {
        const config = this.conf.config;
        const req = this.getCommandRequest(config.authorize.command, config.authorize.payload, null);
        this.runCommand(req).subscribe((data: any) => {
            const url = data[config.redirectUrlPropName];
            if (url) {
                window.location = url;
            }
        });
    }

    register() {
        const callbackResult = new OauthResponse(this.url);
        if (callbackResult.isSucceed) {
            const config = this.conf.config;
            const ctx = {region: this.targetRegion};
            const req = this.getCommandRequest(config.register.command, config.register.payload, ctx, ctx);
            this.runCommand(req).subscribe(() => {
                this.isSuccess = true;
            }, () => {
                this.isCallback = false;
                this.router.navigate([], {replaceUrl: true});
            });
        } else {
            this.showError(callbackResult.errorDescription);
        }
    }

    redirectToLogin() {
        this.navigateTo(this.loginViewName);
    }

    get url(): string {
        return window.location.href;
    }

    private checkCallback(url) {
        return OauthResponse.oauth2CodeRegex.test(url) || OauthResponse.oauth2ErrorRegex.test(url);
    }

}

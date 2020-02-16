import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import * as microsoftTeams from '@microsoft/teams-js';

import { BaseWidget } from '../../core/render';
import { Widget } from '../../core/decorators';
import { TeamSlientLoginSlotConf } from './team-slient-login-slot-conf';
import { DEFAULT_VIEW_AFTER_LOGIN } from '../../core/providers';
import { GlobalConfigService } from '../../core/service/global-config.service';
import { CACHE_KEY_AUTH_TOKEN, CACHE_KEY_REDIRECT_FROM } from '../../core/global/cache-keys';
import { Subscription } from 'rxjs';
import { AdalService } from '../../core/service/adal.service';
import { Router, ActivatedRoute } from '@angular/router';

@Widget({
    type: 'TeamSlientLogin',
    version: 'latest',
    slotConfClass: TeamSlientLoginSlotConf
})
@Component({
    selector: 'qui-team-slient-login',
    templateUrl: './team-slient-login.widget.html',
    styleUrls: ['./team-slient-login.widget.less']
})
export class TeamSlientLoginWidget extends BaseWidget implements OnInit {
    @Input() conf: TeamSlientLoginSlotConf;

    subscriber: Subscription;
    silentLoginState: string;
    redirectUrl: string;
    
    constructor(protected injector: Injector,
                @Inject(DEFAULT_VIEW_AFTER_LOGIN) private nextViewName: string,
                private globalConfig: GlobalConfigService,
                private adalService: AdalService,
                private route: ActivatedRoute) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    startInitWidget() {
        this.subscriber = this.adalService.getAuthContext().subscribe((authContext: any) => {
            this.doLogin(authContext);
        });
    }

    private doLogin(authContext: any) {
        authContext._renewIdToken((err, token) => {
            if (token) {
                this.loginTeamSuccess(token);
            } else {
                const sent = this.uiConfigurationService.translateSentence(this.conf.config.doLoginUrl);
                const loginUrl = sent.value;
                this.adalService.authDialog(loginUrl).subscribe((token: string) => {
                    this.loginTeamSuccess(token);
                }, (err: string) => {
                    this.loginFail(err);
                });
            }
        });
    }

    private loginSuccess(token: string) {
        this.navigateTo(this.defaultNextView);
    }

    private loginTeamSuccess(teamToken: string) {
        this.exchangeToken(teamToken);
    }


    private loginFail(msg: string) {
        this.showError(msg);
    }

    private getContextObject(token: string) {
        return {token};
    }

    private exchangeToken(teamToken: string) {
        const config = this.conf.config;
        const ctx = this.getContextObject(teamToken);
        const req = this.getCommandRequest(config.token.command, config.token.payload, ctx, ctx);
        this.runCommand(req).subscribe((data: any) => {
            const idToken = data[config.tokenPropName];
            if (idToken) {
                this.setCache(CACHE_KEY_AUTH_TOKEN, idToken);
                this.loginSuccess(idToken);    
            } else {
                this.navigateTo('register');
            }        
        });
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

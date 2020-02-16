import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import * as microsoftTeams from '@microsoft/teams-js';

import { BaseWidget } from '../../core/render';
import { Widget } from '../../core/decorators';
import { TeamLoginSlotConf } from './team-login-slot-conf';
import { DEFAULT_VIEW_AFTER_LOGIN } from '../../core/providers';
import { GlobalConfigService } from '../../core/service/global-config.service';
import { CACHE_KEY_AUTH_TOKEN, CACHE_KEY_REDIRECT_FROM } from '../../core/global/cache-keys';
import { Subscription } from 'rxjs';
import { AdalService } from '../../core/service/adal.service';
import { Router, ActivatedRoute } from '@angular/router';

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
    subscriber: Subscription;

    constructor(protected injector: Injector,
                private adalService: AdalService) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    startInitWidget() {
        const sentence = this.uiConfigurationService.translateSentence(this.conf.config.redirectUrl);
        const redirectUrl = sentence.value;
        this.subscriber = this.adalService.getAuthContext(redirectUrl).subscribe((authContext: any) => {
            if (authContext.isCallback(window.location.hash)) {
                authContext.handleWindowCallback();
                if (window.opener && authContext.getCachedUser()) {
                    const token = authContext.getCachedToken(this.adalService.aadClientId);
                    microsoftTeams.authentication.notifySuccess(token);
                } else {
                    microsoftTeams.authentication.notifyFailure(authContext.getLoginError());
                }
            } else {
                authContext.login();
            }
        });
    }

    ngOnDestroy(): void {
        this.subscriber.unsubscribe();
        super.ngOnDestroy();
    }

}

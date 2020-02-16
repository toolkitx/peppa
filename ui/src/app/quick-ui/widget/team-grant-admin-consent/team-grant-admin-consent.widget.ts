import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import * as microsoftTeams from '@microsoft/teams-js';

import { BaseWidget } from '../../core/render';
import { Widget } from '../../core/decorators';
import { TeamGrantAdminConsentSlotConf } from './team-grant-admin-consent-slot-conf';
import { DEFAULT_VIEW_AFTER_LOGIN } from '../../core/providers';
import { GlobalConfigService } from '../../core/service/global-config.service';
import { CACHE_KEY_AUTH_TOKEN, CACHE_KEY_REDIRECT_FROM } from '../../core/global/cache-keys';
import { Subscription } from 'rxjs';
import { AdalService } from '../../core/service/adal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamSlientLoginSlotConf } from '../team-slient-login/team-slient-login-slot-conf';

@Widget({
    type: 'TeamGrantAdminConsent',
    version: 'latest',
    slotConfClass: TeamGrantAdminConsentSlotConf
})
@Component({
    selector: 'qui-team-grant-admin-consent',
    templateUrl: './team-grant-admin-consent.widget.html',
    styleUrls: ['./team-grant-admin-consent.widget.less']
})
export class TeamGrantAdminConsentWidget extends BaseWidget implements OnInit {
    @Input() conf: TeamGrantAdminConsentSlotConf;
    subscriber: Subscription;

    constructor(protected injector: Injector,
                private adalService: AdalService) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    startInitWidget() {
        this.subscriber = this.adalService.getTeamContext().subscribe(({tid}) => {
            if (this.adalService.isAdminConsentCallback(window.location.hash)) {
                this.adalService.handleAdminConsentCallback(window.location.hash);
            } else {
                this.grant(tid);
            }
        });
    }

    grant(tenantId: string) {
        const config = this.conf.config;
        const req = this.getCommandRequest(config.authorize.command, config.authorize.payload, null, {tenantId});
        this.runCommand(req).subscribe((data: any) => {
            const url = data[config.redirectUrlPropName];
            if (url) {
                window.location = url;
            }
        });
    }

    ngOnDestroy(): void {
        this.subscriber.unsubscribe();
        super.ngOnDestroy();
    }

}

import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseWidget } from '../../core/render/base-widget';
import { Widget } from '../../core/decorators';
import { HeaderSlotConf } from './header-slot-conf';
import { CONSTANT_GENERAL_ROLE } from '../../core/global';
import { DEFAULT_LOGIN_VIEW_NAME, DEFAULT_VIEW_AFTER_LOGIN } from '../../core/providers';
import {
    CACHE_KEY_AUTH_TOKEN, CACHE_KEY_CURRENT_REGION_NAME, CACHE_KEY_DIRECTORY_ID, CACHE_KEY_ORGANIZATION_ID, CACHE_KEY_USER_SESSION
} from '../../core/global/cache-keys';
import { SessionData } from '../../core/modals';
import { GlobalConfigService } from '../../core/service/global-config.service';

@Widget({
    type: 'Header',
    version: 'latest',
    slotConfClass: HeaderSlotConf
})
@Component({
    selector: 'qui-header',
    templateUrl: './header.widget.html',
    styleUrls: ['./header.widget.less']
})
export class HeaderWidget extends BaseWidget implements OnInit, AfterViewInit {
    @Input() conf: HeaderSlotConf;
    extendActionPermission = [CONSTANT_GENERAL_ROLE];
    session: SessionData = null;
    region = 'unknown';

    constructor(protected inject: Injector,
                private globalConfig: GlobalConfigService,
                private cdr: ChangeDetectorRef,
                @Inject(DEFAULT_LOGIN_VIEW_NAME) public loginViewName: string,
                @Inject(DEFAULT_VIEW_AFTER_LOGIN) public nextViewName: string) {
        super(inject);
    }

    startInitWidget() {
        super.startInitWidget();
    }

    logout() {
        this.removeCache(CACHE_KEY_AUTH_TOKEN);
        this.removeCache(CACHE_KEY_ORGANIZATION_ID);
        this.removeCache(CACHE_KEY_DIRECTORY_ID);
        window.location.reload();
    }

    ngAfterViewInit() {
        this.cacheService.notify(CACHE_KEY_USER_SESSION).subscribe((x) => {
            this.session = x.value;
            this.cdr.detectChanges();
        });
        this.cacheService.notify(CACHE_KEY_CURRENT_REGION_NAME).subscribe((x) => {
            this.region = 'unknown';
            if (x.value) {
                const currentRegion = this.globalConfig.regions.find(r => r.name === x.value);
                if (currentRegion) {
                    this.region = currentRegion.displayName;
                }
            }
            this.cdr.detectChanges();
        });
    }
}

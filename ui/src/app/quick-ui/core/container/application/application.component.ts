import { Component, OnInit } from '@angular/core';
import { CacheService } from '../../cache/cache.service';
import { SlotConfDef, UIConfiguration } from '../../render/modals/ui-configuration';
import { CONSTANT_UI_CONFIGURATION } from '../../global';

@Component({
    selector: 'qui-application',
    templateUrl: './application.component.html',
    styleUrls: ['./application.component.less']
})
export class ApplicationComponent implements OnInit {
    headerSlotConf: SlotConfDef;

    constructor(private cacheService: CacheService) {
    }

    ngOnInit() {
        const config = this.cacheService.get<UIConfiguration>(CONSTANT_UI_CONFIGURATION);
        this.createHeaderConf(config);
    }

    private createHeaderConf(config: UIConfiguration) {
        this.headerSlotConf = config.application.nav || config.application.name ? <SlotConfDef>{
            id: 'primary-menus',
            type: 'Header',
            config: {
                title: config.application.name,
                primaryMenus: config.application.nav,
                widgets: config.application.headWidgets
            }
        } : null;
    }

}

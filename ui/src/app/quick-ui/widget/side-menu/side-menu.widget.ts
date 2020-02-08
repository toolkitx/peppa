import { Component, Injector, Input, OnInit } from '@angular/core';
import { SideMenuSlotConf } from './side-menu-slot-conf';
import { BaseWidget } from '../../core/render';
import { Widget } from '../../core/decorators';
import { MenuDef } from '../../core/render/modals/ui-configuration';

@Widget({
    type: 'SideMenu',
    version: 'latest',
    slotConfClass: SideMenuSlotConf
})

@Component({
    selector: 'qui-side-menu',
    templateUrl: './side-menu.widget.html',
    styleUrls: ['./side-menu.widget.less']
})
export class SideMenuWidget extends BaseWidget implements OnInit {
    _conf: SideMenuSlotConf;
    get conf() {
        return this._conf;
    }

    @Input() set conf(val: SideMenuSlotConf) {
        this._conf = val;
        this.checkMenu();
    }

    currentSidebarName: string;
    menu: MenuDef[];

    constructor(protected inject: Injector) {
        super(inject);
    }

    private checkMenu() {
        if (this.conf && this.conf.config && this.conf.config.menu) {
            const menuName = this.conf.config.menu as string;
            if (menuName !== this.currentSidebarName) {
                this.menu = this.uiConfigurationService.getSidebar(menuName);
            }
        } else {
            this.menu = [];
        }
    }
}

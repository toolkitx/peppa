import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { QUI } from '../../global';
import { CONSTANT_VIEW_NAME_PARAM_KEY } from '../../global/constants';
import { Title } from '@angular/platform-browser';
import { UiConfigurationService } from '../ui-configuration.service';
import { MenuDef, SlotConfDef, ViewDef } from '../modals/ui-configuration';

@Component({
    selector: 'qui-view-generator',
    templateUrl: './view-generator.component.html',
    styleUrls: ['./view-generator.component.less']
})
export class ViewGeneratorComponent implements OnInit {
    renderError: {message: string; action?: string};
    sideMenu: string | MenuDef[];
    widgets: SlotConfDef[] = [];

    constructor(private route: ActivatedRoute,
                private uiConfigurationService: UiConfigurationService,
                private titleService: Title) {
    }


    ngOnInit(): void {
        this.subscribeParams();
    }

    get applicationDef() {
        return this.uiConfigurationService.setting.application;
    }

    private subscribeParams() {
        this.route.paramMap.subscribe((map: ParamMap) => {
            this.renderError = null;
            const command = map.get(CONSTANT_VIEW_NAME_PARAM_KEY);
            this.startInitView(command);
        });
    }

    private startInitView(viewName: string) {
        const viewDef = viewName ? this.uiConfigurationService.getView(viewName) : this.uiConfigurationService.getDefaultView();
        this.checkPermission();
        this.initView(viewName, viewDef);
    }

    private initView(viewName: string, viewDef: ViewDef) {
        if (!viewDef) {
            this.renderError = {message: `Fail to compile view: view [${viewName}] not found`};
            QUI.error(this.renderError.message);
            return;
        }
        this.titleService.setTitle(viewDef.title);
        this.sideMenu = this.getMenuData(viewDef);
        this.widgets = this.convertWrapper(viewDef.widgets || []);
    }

    private convertWrapper(data: SlotConfDef[]): SlotConfDef[] {
        data.map((i: SlotConfDef) => {
            if (!i.wrapper) {
                i.wrapper = <any>{};
            } else if (typeof i.wrapper === 'string') {
                i.wrapper = {type: i.wrapper};
            }
        });
        return data;
    }

    private checkPermission() {
    }

    private getMenuData(viewDef: ViewDef): string | MenuDef[] {
        if (viewDef.hasOwnProperty('sidebar')) {
            return viewDef.sidebar;
        }
        return null;
    }
}

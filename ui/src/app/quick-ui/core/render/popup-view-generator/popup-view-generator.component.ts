import { Component, Input, OnInit } from '@angular/core';
import { UiConfigurationService } from '../ui-configuration.service';
import { Sentence } from '../sentence';
import { SlotConfDef, ViewDef } from '../modals/ui-configuration';
import { QUI } from '../../global';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
    selector: 'qui-popup-view-generator',
    templateUrl: './popup-view-generator.component.html',
    styleUrls: ['./popup-view-generator.component.less']
})
export class PopupViewGeneratorComponent implements OnInit {
    @Input() action: Sentence;
    @Input() context: any;
    @Input() modal?: NzModalRef;
    renderError: {message: string; action?: string};
    widgets: SlotConfDef[] = [];

    constructor(private uiConfigurationService: UiConfigurationService) {
    }

    ngOnInit() {
        this.startInitView(this.action.view.name);
    }

    private startInitView(viewName: string) {
        const viewDef = this.uiConfigurationService.getView(viewName);
        this.initView(viewName, viewDef);
    }

    private initView(viewName: string, viewDef: ViewDef) {
        if (!viewDef) {
            this.renderError = {message: `Fail to compile view: view [${viewName}] not found`};
            QUI.error(this.renderError.message);
            return;
        }
        this.widgets = viewDef.widgets || [];
    }

}

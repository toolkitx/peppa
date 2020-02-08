import { Component, Injector, OnInit } from '@angular/core';
import { WidgetConfig } from '../../decorators';
import { WidgetConfigBaseComponent } from '../widget-config-base-component';
import { ConfirmActionPreviewSlotComponent } from './confirm-action-preview-slot/confirm-action-preview-slot.component';

@WidgetConfig({
    type: 'ConfirmAction',
    description: 'Confirm something with commands',
    tags: ['Component', 'Action', 'Confirm'],
    previewComponent: ConfirmActionPreviewSlotComponent,
    defaultConfig: {
        title: null,
        description: null,
        okText: null,
        cancelText: null,
        action: null,
        postAction: null,
        successMessage: null
    }
})
@Component({
    selector: 'app-confirm-action-config',
    templateUrl: './confirm-action-config.component.html',
    styleUrls: ['./confirm-action-config.component.less']
})
export class ConfirmActionConfigComponent extends WidgetConfigBaseComponent implements OnInit {

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        const configGroup = this.formBuilder.group({
            title: [null],
            description: [null],
            okText: [null],
            cancelText: [null],
            action: [null],
            postAction: [null],
            successMessage: [null]
        });
        this.createForm(configGroup);
    }

}

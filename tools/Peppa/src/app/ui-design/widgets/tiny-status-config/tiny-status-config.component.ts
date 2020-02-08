import { Component, Injector, OnChanges, OnInit } from '@angular/core';
import { WidgetConfig } from '../../decorators';
import { WidgetConfigBaseComponent } from '../widget-config-base-component';
import { Validators } from '@angular/forms';
import { TinyStatusPreviewSlotComponent } from './tiny-status-preview-slot/tiny-status-preview-slot.component';

@WidgetConfig({
    type: 'TinyStatus',
    description: 'Tiny Status',
    tags: ['Data Display', 'Tiny'],
    previewComponent: TinyStatusPreviewSlotComponent,
    defaultConfig: {
        name: null,
        defs: null
    }
})
@Component({
    selector: 'app-tiny-status-config',
    templateUrl: './tiny-status-config.component.html',
    styleUrls: ['./tiny-status-config.component.less']
})
export class TinyStatusConfigComponent extends WidgetConfigBaseComponent implements OnInit, OnChanges {

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        const configGroup = this.formBuilder.group({
            name: [null, [Validators.required]],
            defs: [null]
        });
        this.createForm(configGroup);
    }
}

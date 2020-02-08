import { Component, Injector, OnChanges, OnInit } from '@angular/core';
import { WidgetConfig } from '../../decorators';
import { WidgetConfigBaseComponent } from '../widget-config-base-component';
import { RowBlockPreviewSlotComponent } from './row-block-preview-slot/row-block-preview-slot.component';

@WidgetConfig({
    type: 'RowBlock',
    description: 'Row container',
    tags: ['Component', 'Container'],
    previewComponent: RowBlockPreviewSlotComponent,
    defaultConfig: {
        gutter: 8,
        columns: []
    }
})
@Component({
    selector: 'app-row-block-config',
    templateUrl: './row-block-config.component.html',
    styleUrls: ['./row-block-config.component.less']
})
export class RowBlockConfigComponent extends WidgetConfigBaseComponent implements OnInit, OnChanges {

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        const configGroup = this.formBuilder.group({
            gutter: [null],
            columns: [null]
        });
        this.createForm(configGroup);
    }

}

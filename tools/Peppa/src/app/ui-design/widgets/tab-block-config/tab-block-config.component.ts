import { Component, Injector, OnChanges, OnInit } from '@angular/core';
import { WidgetConfig } from '../../decorators';
import { WidgetConfigBaseComponent } from '../widget-config-base-component';
import { Validators } from '@angular/forms';
import { TabBlockPreviewSlotComponent } from './tab-block-preview-slot/tab-block-preview-slot.component';

@WidgetConfig({
    type: 'TabBlock',
    description: 'TabBlock container',
    tags: ['Component', 'Container'],
    previewComponent: TabBlockPreviewSlotComponent,
    defaultConfig: {
        title: null,
        description: null,
        styles: null,
        actions: null,
        tabs: []
    }
})
@Component({
    selector: 'app-tab-block-config',
    templateUrl: './tab-block-config.component.html',
    styleUrls: ['./tab-block-config.component.less']
})
export class TabBlockConfigComponent extends WidgetConfigBaseComponent implements OnInit, OnChanges {

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        const configGroup = this.formBuilder.group({
            title: [null, [Validators.required]],
            description: [null],
            styles: [null],
            actions: [null],
            tabs: [null]
        });
        this.createForm(configGroup);
    }

}

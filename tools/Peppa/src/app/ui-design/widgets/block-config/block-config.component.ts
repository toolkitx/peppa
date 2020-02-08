import { Component, Injector, OnChanges, OnInit } from '@angular/core';
import { WidgetConfig } from '../../decorators';
import { WidgetConfigBaseComponent } from '../widget-config-base-component';
import { BlockPreviewSlotComponent } from './block-preview-slot/block-preview-slot.component';

@WidgetConfig({
    type: 'Block',
    description: 'Block container',
    tags: ['Component', 'Container'],
    previewComponent: BlockPreviewSlotComponent,
    defaultConfig: {
        title: null,
        description: null,
        styles: null,
        actions: null,
        widgets: null
    }
})
@Component({
    selector: 'app-block-config',
    templateUrl: './block-config.component.html',
    styleUrls: ['./block-config.component.less']
})
export class BlockConfigComponent extends WidgetConfigBaseComponent implements OnInit, OnChanges {

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        const configGroup = this.formBuilder.group({
            title: [null],
            description: [null],
            styles: [null],
            actions: [null],
            widgets: [null]
        });
        this.createForm(configGroup);
    }

}

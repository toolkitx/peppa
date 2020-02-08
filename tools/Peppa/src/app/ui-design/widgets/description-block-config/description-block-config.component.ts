import { Component, Injector, OnChanges, OnInit } from '@angular/core';
import { WidgetConfig } from '../../decorators';
import { WidgetConfigBaseComponent } from '../widget-config-base-component';
import { Validators } from '@angular/forms';
import { DescriptionBlockPreviewSlotComponent } from './description-block-preview-slot/description-block-preview-slot.component';

@WidgetConfig({
    type: 'DescriptionBlock',
    description: 'Description Block',
    tags: ['Component'],
    previewComponent: DescriptionBlockPreviewSlotComponent,
    defaultConfig: {
        title: null,
        description: null,
        styles: null,
        actions: null,
        column: 2,
        command: null,
        fields: null
    }
})
@Component({
    selector: 'app-description-block-config',
    templateUrl: './description-block-config.component.html',
    styleUrls: ['./description-block-config.component.less']
})
export class DescriptionBlockConfigComponent extends WidgetConfigBaseComponent implements OnInit, OnChanges {

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
            column: [2],
            command: [null],
            fields: [null]
        });
        this.createForm(configGroup);
    }

}

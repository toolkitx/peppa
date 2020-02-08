import { Component, Injector, OnChanges, OnInit } from '@angular/core';
import { WidgetConfig } from '../../decorators';
import { WidgetConfigBaseComponent } from '../widget-config-base-component';
import { CustomPreviewSlotComponent } from './custom-preview-slot/custom-preview-slot.component';

@WidgetConfig({
    type: 'Custom',
    description: 'Development Widget',
    tags: ['Dev'],
    previewComponent: CustomPreviewSlotComponent,
    defaultConfig: {}
})
@Component({
    selector: 'app-custom-config',
    templateUrl: './custom-config.component.html',
    styleUrls: ['./custom-config.component.less']
})
export class CustomConfigComponent extends WidgetConfigBaseComponent implements OnInit, OnChanges {

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        const configGroup = this.formBuilder.group({});
        this.createForm(configGroup);
    }

}

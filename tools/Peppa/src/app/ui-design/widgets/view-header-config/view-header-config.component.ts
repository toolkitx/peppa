import { Component, Injector, OnChanges, OnInit } from '@angular/core';
import { WidgetConfig } from '../../decorators';
import { WidgetConfigBaseComponent } from '../widget-config-base-component';
import { Validators } from '@angular/forms';
import { ViewHeaderPreviewSlotComponent } from './view-header-preview-slot/view-header-preview-slot.component';

@WidgetConfig({
    type: 'ViewHeader',
    description: 'View Header',
    tags: ['Component'],
    previewComponent: ViewHeaderPreviewSlotComponent,
    defaultConfig: {
        title: null,
        description: null,
        styles: null,
        actions: null,
        backIcon: false
    }
})
@Component({
    selector: 'app-view-header-config',
    templateUrl: './view-header-config.component.html',
    styleUrls: ['./view-header-config.component.less']
})
export class ViewHeaderConfigComponent extends WidgetConfigBaseComponent implements OnInit, OnChanges {

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
            backIcon: [null]
        });
        // Migrate
        const migrationItems = [
            {property: 'backIcon', defaultValue: false}
        ];
        migrationItems.map((x) => {
            if (!this.conf.config.hasOwnProperty(x.property)) {
                this.conf.config[x.property] = x.defaultValue;
            }
        });
        this.createForm(configGroup);
    }

}

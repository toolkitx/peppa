import { EventEmitter, Injector, OnChanges, OnInit, Output } from '@angular/core';
import { WidgetConfigBaseComponent } from './widget-config-base-component';
import { SlotConfDef } from '../../modals/ui-configuration';

export class WidgetPreviewSlotBaseComponent extends WidgetConfigBaseComponent implements OnInit, OnChanges {
    // For container to emit selected sub widgets to config it on the right hand side
    @Output() subWidgetSelect = new EventEmitter<SlotConfDef>();

    constructor(injector: Injector) {
        super(injector);
    }

    addWidget(widget: SlotConfDef) {
        if (this.conf.config && !this.conf.config.widgets) {
            this.conf.config.widgets = [];
        }
        this.conf.config.widgets.push(widget);
    }

}

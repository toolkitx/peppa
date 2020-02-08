import { Component, Injector, OnInit } from '@angular/core';
import { WidgetPreviewSlotBaseComponent } from '../../widget-preview-slot-base-component';

@Component({
    selector: 'app-custom-form-preview-slot',
    templateUrl: './custom-form-preview-slot.component.html',
    styleUrls: ['./custom-form-preview-slot.component.less']
})
export class CustomFormPreviewSlotComponent extends WidgetPreviewSlotBaseComponent implements OnInit {

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
    }

}

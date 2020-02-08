import { Component, Injector, OnInit } from '@angular/core';
import { WidgetPreviewSlotBaseComponent } from '../../widget-preview-slot-base-component';

@Component({
    selector: 'app-custom-preview-slot',
    templateUrl: './custom-preview-slot.component.html',
    styleUrls: ['./custom-preview-slot.component.less']
})
export class CustomPreviewSlotComponent extends WidgetPreviewSlotBaseComponent implements OnInit {

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
    }

}

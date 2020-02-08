import { Component, Injector, OnInit } from '@angular/core';
import { WidgetPreviewSlotBaseComponent } from '../../widget-preview-slot-base-component';

@Component({
    selector: 'app-block-preview-slot',
    templateUrl: './block-preview-slot.component.html',
    styleUrls: ['./block-preview-slot.component.less']
})
export class BlockPreviewSlotComponent extends WidgetPreviewSlotBaseComponent implements OnInit {

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
    }

}

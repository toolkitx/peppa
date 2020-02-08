import { Component, Injector, OnInit } from '@angular/core';
import { WidgetPreviewSlotBaseComponent } from '../../widget-preview-slot-base-component';

@Component({
  selector: 'app-description-block-preview-slot',
  templateUrl: './description-block-preview-slot.component.html',
  styleUrls: ['./description-block-preview-slot.component.less']
})
export class DescriptionBlockPreviewSlotComponent extends WidgetPreviewSlotBaseComponent implements OnInit {

    constructor(protected injector: Injector) {
        super(injector);
    }

  ngOnInit() {
  }

}

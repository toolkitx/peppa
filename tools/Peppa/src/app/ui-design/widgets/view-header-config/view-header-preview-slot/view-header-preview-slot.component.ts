import { Component, Injector, OnInit } from '@angular/core';
import { WidgetPreviewSlotBaseComponent } from '../../widget-preview-slot-base-component';

@Component({
  selector: 'app-view-header-preview-slot',
  templateUrl: './view-header-preview-slot.component.html',
  styleUrls: ['./view-header-preview-slot.component.less']
})
export class ViewHeaderPreviewSlotComponent extends WidgetPreviewSlotBaseComponent implements OnInit {

    constructor(protected injector: Injector) {
        super(injector);
    }

  ngOnInit() {
  }

}

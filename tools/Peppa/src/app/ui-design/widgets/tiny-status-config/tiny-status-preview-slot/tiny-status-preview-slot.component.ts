import { Component, Injector, OnInit } from '@angular/core';
import { WidgetPreviewSlotBaseComponent } from '../../widget-preview-slot-base-component';

@Component({
  selector: 'app-tiny-status-preview-slot',
  templateUrl: './tiny-status-preview-slot.component.html',
  styleUrls: ['./tiny-status-preview-slot.component.less']
})
export class TinyStatusPreviewSlotComponent extends WidgetPreviewSlotBaseComponent implements OnInit {

    constructor(protected injector: Injector) {
        super(injector);
    }

  ngOnInit() {
  }

}

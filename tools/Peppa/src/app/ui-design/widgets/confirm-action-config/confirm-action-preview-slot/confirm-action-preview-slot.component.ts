import { Component, Injector, OnInit } from '@angular/core';
import { WidgetPreviewSlotBaseComponent } from '../../widget-preview-slot-base-component';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-confirm-action-preview-slot',
    templateUrl: './confirm-action-preview-slot.component.html',
    styleUrls: ['./confirm-action-preview-slot.component.less']
})
export class ConfirmActionPreviewSlotComponent extends WidgetPreviewSlotBaseComponent implements OnInit {

    constructor(protected injector: Injector, private messageService: NzMessageService) {
        super(injector);
    }

    ngOnInit() {
    }

    showSuccessMessage(msg: string) {
        this.messageService.success(msg);
    }

}

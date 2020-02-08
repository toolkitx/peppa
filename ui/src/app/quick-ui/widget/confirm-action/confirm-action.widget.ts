import { Component, Injector, Input, OnInit } from '@angular/core';
import { ConfirmActionSlotConf } from './confirm-action-slot-conf';
import { Widget } from '../../core/decorators';
import { BasePopupWidget } from '../../core/render/base-popup-widget';

@Widget({
    type: 'ConfirmAction',
    version: 'latest',
    slotConfClass: ConfirmActionSlotConf
})
@Component({
    selector: 'qui-confirm-action',
    templateUrl: './confirm-action.widget.html',
    styleUrls: ['./confirm-action.widget.less']
})
export class ConfirmActionWidget extends BasePopupWidget implements OnInit {
    @Input() conf: ConfirmActionSlotConf;

    constructor(protected injector: Injector) {
        super(injector);
    }

    cancel() {
        this.closeModal('cancel');
    }

    ok() {
        const commandRequest = this.getCommandRequest(this.conf.config.action.command, this.conf.config.action.payload, null, this.context);
        this.runCommand(commandRequest).subscribe(() => {
            this.showSuccess(this.conf.config.successMessage);
            this.closeModal('ok');
        });
    }

}

import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseWidget } from '../../core/render';
import { SimpleCardActionSlotConf } from './simple-card-action-slot-conf';
import { Widget } from '../../core/decorators';

@Widget({
    type: 'SimpleCardAction',
    version: 'latest',
    slotConfClass: SimpleCardActionSlotConf
})
@Component({
    selector: 'qui-simple-card-action',
    templateUrl: './simple-card-action.widget.html',
    styleUrls: ['./simple-card-action.widget.less']
})
export class SimpleCardActionWidget extends BaseWidget implements OnInit {
    @Input() conf: SimpleCardActionSlotConf;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
    }

}

import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseWidget } from '../../core/render';
import { RowBlockSlotConf } from './row-block-slot-conf';
import { Widget } from '../../core/decorators';

@Widget({
    type: 'RowBlock',
    version: 'latest',
    slotConfClass: RowBlockSlotConf
})
@Component({
    selector: 'qui-row-block',
    templateUrl: './row-block.widget.html',
    styleUrls: ['./row-block.widget.less']
})
export class RowBlockWidget extends BaseWidget implements OnInit {
    @Input() conf: RowBlockSlotConf;

    constructor(protected injector: Injector) {
        super(injector);
    }

}

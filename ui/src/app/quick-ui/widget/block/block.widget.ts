import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseWidget } from '../../core/render';
import { BlockSlotConf } from './block-slot-conf';
import { Widget } from '../../core/decorators';

@Widget({
    type: 'Block',
    version: 'latest',
    slotConfClass: BlockSlotConf
})
@Component({
    selector: 'qui-block',
    templateUrl: './block.widget.html',
    styleUrls: ['./block.widget.less']
})
export class BlockWidget extends BaseWidget implements OnInit {
    @Input() conf: BlockSlotConf;

    constructor(protected injector: Injector) {
        super(injector);
    }

}

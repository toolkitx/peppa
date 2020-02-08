import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseWidget } from '../../core/render';
import { ViewHeaderSlotConf } from './view-header-slot-conf';
import { Widget } from '../../core/decorators';

@Widget({
    type: 'ViewHeader',
    version: 'latest',
    slotConfClass: ViewHeaderSlotConf
})
@Component({
    selector: 'qui-view-header',
    templateUrl: './view-header.widget.html',
    styleUrls: ['./view-header.widget.less']
})
export class ViewHeaderWidget extends BaseWidget implements OnInit {
    @Input() conf: ViewHeaderSlotConf;

    constructor(protected injector: Injector) {
        super(injector);
    }
}

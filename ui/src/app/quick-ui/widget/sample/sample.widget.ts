import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseWidget } from '../../core/render';
import { SampleSlotConf } from './sample-slot-conf';
import { Widget } from '../../core/decorators';

@Widget({
    type: 'Sample',
    version: 'latest',
    slotConfClass: SampleSlotConf
})
@Component({
    selector: 'qui-sample',
    templateUrl: './sample.widget.html',
    styleUrls: ['./sample.widget.less']
})
export class SampleWidget extends BaseWidget implements OnInit {
    @Input() conf: SampleSlotConf;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
    }

}

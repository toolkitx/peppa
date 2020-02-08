import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseWidget } from '../../core/render';
import { TabBlockSlotConf } from './tab-block-slot-conf';
import { Widget } from '../../core/decorators';

@Widget({
    type: 'TabBlock',
    version: 'latest',
    slotConfClass: TabBlockSlotConf
})
@Component({
    selector: 'qui-tab-block',
    templateUrl: './tab-block.widget.html',
    styleUrls: ['./tab-block.widget.less']
})
export class TabBlockWidget extends BaseWidget implements OnInit {
    @Input() conf: TabBlockSlotConf;

    constructor(protected injector: Injector) {
        super(injector);
    }

    get hasHeader() {
        return this.conf && this.conf.config && (this.conf.config.title || this.conf.config.description || this.conf.config.actions);
    }

}

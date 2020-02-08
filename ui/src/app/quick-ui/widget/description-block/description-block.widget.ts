import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseWidget } from '../../core/render';
import { DescriptionBlockSlotConf } from './description-block-slot-conf';
import { Widget } from '../../core/decorators';
// TODO support translate title and description
@Widget({
    type: 'DescriptionBlock',
    version: 'latest',
    slotConfClass: DescriptionBlockSlotConf
})
@Component({
    selector: 'qui-description-block',
    templateUrl: './description-block.widget.html',
    styleUrls: ['./description-block.widget.less']
})
export class DescriptionBlockWidget extends BaseWidget implements OnInit {
    @Input() conf: DescriptionBlockSlotConf;
    values: {[key: string]: any} = {};
    keys: string[] = [];
    constructor(protected injector: Injector) {
        super(injector);
    }

    startInitWidget() {
        if (!this.conf.config.command) {
            return;
        }
        this.loadData();
    }

    private loadData() {
        this.runCommand(this.conf.config.command).subscribe((data: any) => {
            this.values = data;
        });
    }

}

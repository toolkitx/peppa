import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseWidget } from '../../core/render';
import { TinyStatusSlotConf } from './tiny-status-slot-conf';
import { Widget } from '../../core/decorators';

interface WidgetStausConf {
    status: string;
    color: string;
    text: string;
}

@Widget({
    type: 'TinyStatus',
    version: 'latest',
    slotConfClass: TinyStatusSlotConf
})
@Component({
    selector: 'qui-tiny-status',
    templateUrl: './tiny-status.widget.html',
    styleUrls: ['./tiny-status.widget.less']
})
export class TinyStatusWidget extends BaseWidget implements OnInit {
    @Input() conf: TinyStatusSlotConf;
    statusConf: WidgetStausConf;

    constructor(protected injector: Injector) {
        super(injector);
    }

    startInitWidget() {
        let tmpResult: WidgetStausConf = {
            status: 'default',
            color: null,
            text: this.conf.config.name
        };
        const statusName = this.uiConfigurationService.translateSentence(this.conf.config.name, null, this.context);
        if (statusName.valid) {
            const def = this.conf.config.defs.find(x => x.name === statusName.value);
            if (def) {
                tmpResult = {
                    status: def.status,
                    color: null,
                    text: def.text
                };
            }
        }
        this.statusConf = tmpResult;
    }

}

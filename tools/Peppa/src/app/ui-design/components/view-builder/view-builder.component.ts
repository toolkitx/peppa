import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SlotConfDef, ViewDef } from '../../../modals/ui-configuration';
import { NzModalService } from 'ng-zorro-antd';
import { CacheService } from '../../../cache/cache.service';
import { CONST_SELECT_WIDGET_CACHE_KEY } from '../../../constants';
import { isDevWidget } from '../../widget-config-store';

@Component({
    selector: 'app-view-builder',
    templateUrl: './view-builder.component.html',
    styleUrls: ['./view-builder.component.less']
})
export class ViewBuilderComponent implements OnInit, OnChanges {
    @Input() view: ViewDef;

    selectedWidget: SlotConfDef;

    constructor(private nzModalService: NzModalService, private cacheService: CacheService) {
    }

    ngOnInit() {
        this.cacheService.notify(CONST_SELECT_WIDGET_CACHE_KEY).subscribe(({value}) => {
           this.selectWidget(value);
        });
    }

    selectWidget(data: SlotConfDef) {
        this.selectedWidget = data;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.selectedWidget = null;
    }


    confChange(value: SlotConfDef) {
        this.selectedWidget.config = Object.assign(this.selectedWidget.config, value);
    }

    addWidget(widget: SlotConfDef) {
        this.view.widgets.push(widget);
    }

    devMode(type: string) {
       return isDevWidget(type);
    }

    devModeConfigChange(val: SlotConfDef) {
        this.selectedWidget.id = val.id;
        this.selectedWidget.wrapper = val.wrapper;
        this.selectedWidget.type = val.type;
        this.selectedWidget.config = val.config;
    }
}

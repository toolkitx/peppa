import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WidgetStore } from '../../widget-config-store';
import { WidgetConfigMeta } from '../../widget-config-meta';
import { SlotConfDef } from '../../../modals/ui-configuration';
import { newWidgetId } from '../../../util';

@Component({
    selector: 'app-widget-selector',
    templateUrl: './widget-selector.component.html',
    styleUrls: ['./widget-selector.component.less']
})
export class WidgetSelectorComponent implements OnInit {
    @Output() select = new EventEmitter<SlotConfDef>();
    selectedTag = null;
    widgetList = WidgetStore;
    isVisible = false;
    selected: WidgetConfigMeta;

    tags: string[] = [];

    constructor() {
    }

    toggleVisible() {
        this.isVisible = !this.isVisible;
        this.selected = null;
    }

    ngOnInit() {

        let rs: string[] = [];
        this.widgetList.map((item) => {
            if (item.tags) {
                rs = rs.concat(item.tags);
            }
        });
        this.tags = [...new Set(rs)];
    }

    handleOk() {
        const rs = <SlotConfDef> {
            id: newWidgetId(),
            type: this.selected.type,
            wrapper: 'None',
            config: {...this.selected.defaultConfig}
        };
        this.select.emit(rs);
        this.toggleVisible();
    }

    checkWidget(val: WidgetConfigMeta) {
        this.selected = val;
    }

    handleCancel() {
        this.toggleVisible();
    }
}

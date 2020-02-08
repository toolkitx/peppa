import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SlotConfDef } from '../../../modals/ui-configuration';
import { NzModalService } from 'ng-zorro-antd';
import { newWidgetId } from '../../../util';
import { getWidgetConfigByType, isDevWidget } from '../../widget-config-store';
import { CacheService } from '../../../cache/cache.service';
import { CONST_SELECT_WIDGET_CACHE_KEY } from '../../../constants';
import _ from 'lodash';

@Component({
    selector: 'app-widget-preview-list',
    templateUrl: './widget-preview-list.component.html',
    styleUrls: ['./widget-preview-list.component.less']
})
export class WidgetPreviewListComponent implements OnInit {
    @Input() widgets: SlotConfDef[];
    @Input() showEmptyMessage = true;
    @Output() valueChange = new EventEmitter<SlotConfDef[]>();
    selectedWidget: SlotConfDef;

    constructor(private nzModalService: NzModalService, private cacheService: CacheService) {
    }

    ngOnInit() {
        this.cacheService.notify(CONST_SELECT_WIDGET_CACHE_KEY).subscribe(({value}) => {
            this.selectedWidget = value;
        });
    }

    selectWidget(data: SlotConfDef) {
        this.cacheService.set(CONST_SELECT_WIDGET_CACHE_KEY, data);
    }

    hasPreviewSlotDefined(type: string) {
        const wcm = getWidgetConfigByType(type);
        return wcm && wcm.previewComponent;
    }

    drop(event: CdkDragDrop<SlotConfDef[]>) {
        moveItemInArray(this.widgets, event.previousIndex, event.currentIndex);
    }

    removeWidget(widget: SlotConfDef) {
        this.nzModalService.confirm({
            nzTitle: 'Removing widget',
            nzContent: 'Are you sure to remove this widget?',
            nzOnOk: () => {
                if (this.selectedWidget && widget.id === this.selectedWidget.id) {
                    this.selectWidget(null);
                }
                this.valueChange.emit(this.widgets.filter(x => x.id !== widget.id));
            }
        });
    }

    duplicateWidget(widget: SlotConfDef) {
        const newWidget = _.cloneDeep(widget);
        newWidget.id = newWidgetId();
        this.widgets.push(newWidget);
    }

    addWidget(widget: SlotConfDef) {
        if (!this.widgets) {
            this.widgets = [];
        }
        this.widgets.push( _.cloneDeep(widget));
        this.valueChange.emit(this.widgets);
    }

    devMode(type: string) {
        return isDevWidget(type);
    }

    getPreviewType(type: string) {
        return this.devMode(type) ? 'Custom' : type;
    }

}

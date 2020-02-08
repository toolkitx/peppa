import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomDefControl } from '../custom-def-control';
import { SlotConfDef, ViewDef } from '../../../modals/ui-configuration';
import { NzModalService } from 'ng-zorro-antd';
import { ViewBuilderComponent } from '../../components/view-builder/view-builder.component';
import _ from 'lodash';
import { CONST_SELECT_WIDGET_CACHE_KEY } from '../../../constants';

@Component({
    selector: 'app-single-widget-def-control',
    templateUrl: './single-widget-def-control.component.html',
    styleUrls: ['./single-widget-def-control.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SingleWidgetDefControlComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => SingleWidgetDefControlComponent),
        multi: true
    }]
})
export class SingleWidgetDefControlComponent extends CustomDefControl<SlotConfDef> implements OnInit {
    @Input() title: string;

    constructor(protected injector: Injector, private nzModalService: NzModalService) {
        super(injector);
    }

    ngOnInit() {
        this.clearCache();
    }

    toggleVisible() {
        const modal = this.nzModalService.create({
            nzTitle: 'Widget Settings',
            nzContent: ViewBuilderComponent,
            nzWidth: '80%',
            nzMaskClosable: false,
            nzComponentParams: {
                view: <ViewDef> {name: this.title, widgets: this.instanceValue ? [this.instanceValue] : []}
            },
            nzFooter: [
                {
                    label: 'Save',
                    type: 'primary',
                    onClick: (comp: ViewBuilderComponent) => {
                        this.instanceValue = _.cloneDeep(comp.view.widgets[0]);
                        this.onChangeCallback(this.instanceValue);
                        this.clearCache();
                        modal.close();
                    }
                },
                {
                    label: 'Cancel',
                    onClick: () => {
                        this.clearCache();
                        modal.close();
                    }
                }
            ]
        });
    }

    private clearCache() {
        // this.cacheService.remove(CONST_SELECT_WIDGET_CACHE_KEY);
    }
}

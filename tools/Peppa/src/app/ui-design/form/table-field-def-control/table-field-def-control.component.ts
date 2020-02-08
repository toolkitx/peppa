import { ChangeDetectorRef, Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { CustomDefControl } from '../custom-def-control';
import { NzModalService } from 'ng-zorro-antd';
import { FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TableCellConf } from '../../../modals/widget-slot-conf';
import { TableFieldDefModelComponent } from './table-field-def-model/table-field-def-model.component';

@Component({
    selector: 'app-table-field-def-control',
    templateUrl: './table-field-def-control.component.html',
    styleUrls: ['./table-field-def-control.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TableFieldDefControlComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => TableFieldDefControlComponent),
        multi: true
    }]
})
export class TableFieldDefControlComponent extends CustomDefControl<TableCellConf[]> implements OnInit {
    @Input() command: string;
    @Input() allowMenu = false;

    constructor(protected injector: Injector,
                private nzModalService: NzModalService,
                private cdr: ChangeDetectorRef,
                private fb: FormBuilder) {
        super(injector);
    }

    ngOnInit() {
    }

    toggleVisible() {
        const modal = this.nzModalService.create({
            nzTitle: 'Edit columns',
            nzContent: TableFieldDefModelComponent,
            nzWidth: '60%',
            nzComponentParams: {
                data: this.instanceValue ? [...this.instanceValue] : this.instanceValue,
                command: this.command,
                allowMenu: this.allowMenu
            },
            nzFooter: [
                {
                    label: 'Save',
                    type: 'primary',
                    onClick: (comp: TableFieldDefModelComponent) => {
                        this.instanceValue = [...comp.value];
                        this.onChangeCallback(this.instanceValue);
                        modal.close();
                    }
                },
                {
                    label: 'Cancel',
                    onClick: () => {
                        modal.close();
                    }
                }
            ]
        });
    }

}


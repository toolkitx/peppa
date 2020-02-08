import { ChangeDetectorRef, Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomDefControl } from '../custom-def-control';
import { NzModalService } from 'ng-zorro-antd';
import { KeyValueDefModalComponent } from '../../modals/key-value-def-modal/key-value-def-modal.component';

@Component({
    selector: 'app-key-value-def-control',
    templateUrl: './key-value-def-control.component.html',
    styleUrls: ['./key-value-def-control.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => KeyValueDefControlComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => KeyValueDefControlComponent),
        multi: true
    }]
})
export class KeyValueDefControlComponent extends CustomDefControl<string> implements OnInit {
    @Input() valueType: 'string' | 'json' = 'string';
    @Input() preview = true;
    constructor(protected injector: Injector, private nzModalService: NzModalService, private cdr: ChangeDetectorRef) {
        super(injector);
    }

    ngOnInit() {
    }

    toggleVisible() {
        const modal = this.nzModalService.create({
            nzTitle: 'Edit Key Value',
            nzContent: KeyValueDefModalComponent,
            nzComponentParams: {
                data: Object.assign({}, this.instanceValue),
                valueType: this.valueType
            },
            nzFooter: [
                {
                    label: 'Save',
                    type: 'primary',
                    onClick: (comp: KeyValueDefModalComponent) => {
                        this.instanceValue = comp.value;
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

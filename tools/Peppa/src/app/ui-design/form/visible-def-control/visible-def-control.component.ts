import { ChangeDetectorRef, Component, forwardRef, Injector, OnInit } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomDefControl } from '../custom-def-control';
import { NzModalService } from 'ng-zorro-antd';
import { AsyncValidatorDef, VisibleValidatorDef } from '../../../modals/ui-configuration';

@Component({
    selector: 'app-visible-def-control',
    templateUrl: './visible-def-control.component.html',
    styleUrls: ['./visible-def-control.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => VisibleDefControlComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => VisibleDefControlComponent),
        multi: true
    }]
})
export class VisibleDefControlComponent extends CustomDefControl<VisibleValidatorDef | AsyncValidatorDef | boolean> implements OnInit {
    visibleType = 'disabled';

    constructor(protected injector: Injector, private nzModalService: NzModalService, private cdr: ChangeDetectorRef) {
        super(injector);
    }

    ngOnInit() {
    }

    writeValue(obj: any): void {
        super.writeValue(obj);
        if (typeof obj === 'boolean') {
            this.visibleType = 'boolean';
        } else if (obj) {
            const def = this.instanceValue as AsyncValidatorDef;
            this.visibleType = def.hasOwnProperty('command') ? 'remote' : 'local';
        }
    }

    visibleTypeChange(type: string) {
        if (!this.firstVisual) {
            return;
        }
        this.visibleType = type;
        if (this.visibleType === 'boolean') {
            this.instanceValue = false;
            this.onChangeCallback(this.instanceValue);
        } else if (this.visibleType === 'disabled') {
            this.instanceValue = null;
            this.onChangeCallback(this.instanceValue);
        } else {
            this.instanceValue = null;
        }
    }

    remoteValueChange(cmdReqDef: AsyncValidatorDef) {
        this.instanceValue = cmdReqDef;
        this.onChangeCallback(this.instanceValue);
    }

    localValueChange(cmdReqDef: VisibleValidatorDef) {
        this.instanceValue = cmdReqDef;
        this.onChangeCallback(this.instanceValue);
    }
}

import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { CustomDefControl } from '../custom-def-control';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-action-def-control',
    templateUrl: './action-def-control.component.html',
    styleUrls: ['./action-def-control.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ActionDefControlComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => ActionDefControlComponent),
        multi: true
    }]
})
export class ActionDefControlComponent extends CustomDefControl<string> implements OnInit {
    value: string;
    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
    }

    writeValue(obj: any): void {
        super.writeValue(obj);
        this.value = obj;
    }

    modelChange(val: string) {
        this.value = val;
        this.instanceValue = this.value;
        this.onChangeCallback(this.instanceValue);
    }

}

import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { FormArray, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { CustomDefControl } from '../../../form/custom-def-control';

interface TinyStatusState {
    name: string;
    status: string;
    text: string;
};

@Component({
    selector: 'app-tiny-status-state-def-control',
    templateUrl: './tiny-status-state-def-control.component.html',
    styleUrls: ['./tiny-status-state-def-control.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TinyStatusStateDefControlComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => TinyStatusStateDefControlComponent),
        multi: true
    }]
})
export class TinyStatusStateDefControlComponent extends CustomDefControl<TinyStatusState[]> implements OnInit {
    form: FormArray;
    allNzStatus = ['default', 'success', 'processing', 'error', 'warning'];

    constructor(protected injector: Injector, private formBuilder: FormBuilder) {
        super(injector);
    }

    ngOnInit() {

    }

    writeValue(obj: any): void {
        super.writeValue(obj);
        this.createForm();
    }

    createForm() {
        const arrForm = this.formBuilder.array([]);
        if (this.instanceValue) {
            this.instanceValue.map((item) => {
                arrForm.push(this.getFormGroup(item.name, item.status, item.text));
            });
        }
        this.form = arrForm;
        this.form.valueChanges.subscribe(() => {
            const items = this.form.controls.filter(x => x.valid).map(x => x.value);
            this.onChangeCallback(items.length ? items : null);
        });
    }

    appendItem() {
        this.form.push(this.getFormGroup(null, null, null));
    }

    removeItem(i: number) {
        this.form.removeAt(i);
    }

    private getFormGroup(name: string, status: string, text: string) {
        const fg = this.formBuilder.group({});
        fg.addControl('name', this.formBuilder.control(name, [Validators.required]));
        fg.addControl('status', this.formBuilder.control(status, [Validators.required]));
        fg.addControl('text', this.formBuilder.control(text, [Validators.required]));
        return fg;
    }


}

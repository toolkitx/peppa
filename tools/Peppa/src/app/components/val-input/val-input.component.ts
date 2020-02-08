import { AfterViewInit, Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

@Component({
    selector: 'app-val-input',
    templateUrl: './val-input.component.html',
    styleUrls: ['./val-input.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ValInputComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => ValInputComponent),
        multi: true
    }]
})
export class ValInputComponent implements ControlValueAccessor, Validator, OnDestroy, AfterViewInit {
    @Input() dataType: string;
    @Input() height?: string;
    firstVisual = false;
    _instanceValue: any;
    isDisabled = false;
    error = '';

    set instanceValue(val: any | null) {
        this._instanceValue = val;
    }

    get instanceValue() {
        return this._instanceValue;
    }

    ngOnDestroy() {

    }

    ngAfterViewInit(): void {
        this.firstVisual = true;
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    writeValue(obj: any): void {
        this.instanceValue = obj && this.isObject() ? JSON.stringify(obj, null, '\t') : obj;
    }

    registerOnValidatorChange(fn: () => void): void {
    }

    validate(control: AbstractControl): ValidationErrors | null {
        return undefined;
    }

    protected onTouchedCallback() {
    }

    protected onChangeCallback(_: any) {
    }


    inputChange(val: any) {
        this.error = '';
        try {
            const obj = val && this.isObject() ? JSON.parse(val) : val;
            this.instanceValue = val;
            this.onChangeCallback(obj);
            this.onTouchedCallback();
        } catch (e) {
            this.error = 'Invalid value';
        }
    }

    private isObject() {
        return this.dataType === 'object' || this.dataType === 'array';
    }
}

import { AbstractControl, ControlValueAccessor, NgControl, ValidationErrors, Validator } from '@angular/forms';
import { AfterViewInit, EventEmitter, Injector, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { CacheService } from '../../cache/cache.service';

export class CustomDefControl<T> implements ControlValueAccessor, Validator, AfterViewInit, OnDestroy {
    @Output() valueChange = new EventEmitter<T>();
    stateChanges = new Subject<T>();
    innerValue: T;
    firstVisual = false;
    isDisabled = false;
    cacheService: CacheService;
    constructor(injector: Injector) {
        this.cacheService = injector.get(CacheService);
    }

    set instanceValue(val: any | null) {
        this.innerValue = val;
        this.stateChanges.next(this.innerValue);
        if (this.firstVisual) {
            this.valueChange.emit(this.innerValue);
        }
    }

    get instanceValue() {
        return this.innerValue;
    }

    ngOnDestroy() {
        this.stateChanges.complete();
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
        this.instanceValue = obj;
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

}

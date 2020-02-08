import { AbstractControl, ControlValueAccessor, FormGroup, ValidationErrors, Validator } from '@angular/forms';
import { AfterViewInit, Input, OnDestroy } from '@angular/core';
import { CommandRequestDef, SchemaDef, SchemaUiDef } from './modals/ui-configuration';
import { Subject, Subscription } from 'rxjs';
import { Sentence } from './sentence';

export class CustomFormControlWidget implements ControlValueAccessor, Validator, AfterViewInit, OnDestroy {
    @Input() schema: SchemaDef;
    @Input() ui?: SchemaUiDef;
    @Input() form?: FormGroup;
    _instanceValue: any;
    firstVisual = false;
    isDisabled = false;
    stateChanges = new Subject<void>();
    private linkageFieldSubscriptions: Subscription[] = [];
    private controlMonitorFields: string[] = [];
    private filledMonitorFields: string[] = [];

    set instanceValue(val: any | null) {
        this._instanceValue = val;
        this.stateChanges.next();
    }

    get instanceValue() {
        return this._instanceValue;
    }

    get monitorFields() {
        return this.controlMonitorFields;
    }

    ngOnDestroy() {
        this.stateChanges.complete();
        this.linkageFieldSubscriptions.map(x => x.unsubscribe());
    }

    ngAfterViewInit(): void {
        this.firstVisual = true;
        if (this.isRemoteDataSource) {
            this.linkageFieldSubscriptions = [];
            this.initMonitorFields(this.ui.dataSource);
            if (this.controlMonitorFields.length) {
                this.controlMonitorFields.map((key: string) => {
                    const subscribe = this.subscribeFormControlValueChanges(key);
                    if (subscribe) {
                        this.linkageFieldSubscriptions.push(subscribe);
                    }
                });
            }
        }
        this.controlInit();
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

    private subscribeFormControlValueChanges(controlKey: string) {
        const ctrl = this.form ? this.form.get(controlKey) : null;
        if (!ctrl) {
            return null;
        }
        return ctrl.valueChanges.subscribe((x) => {
            if (x) {
                if (!this.filledMonitorFields.includes(controlKey)) {
                    this.filledMonitorFields.push(controlKey);
                }
            } else {
                this.filledMonitorFields = this.filledMonitorFields.filter(i => i !== controlKey);
            }
            this.linkageFieldChanges(controlKey, x);
        });
    }

    protected get linkageFieldReady() {
        return this.monitorFields.length === 0 || this.filledMonitorFields.length === this.monitorFields.length;
    }

    // control init life hook
    protected controlInit() {
    }

    // monitor field changes
    protected linkageFieldChanges(key: string, value: string) {

    }

    protected onTouchedCallback() {
    }

    protected onChangeCallback(_: any) {
    }

    get isRemoteDataSource() {
        return this.ui && !!this.ui.dataSource;
    }

    private initMonitorFields(commandRequestDef: CommandRequestDef) {
        this.controlMonitorFields = [];
        if (!commandRequestDef.payload) {
            return;
        }

        Object.keys(commandRequestDef.payload).map((x) => {
            const field = this.detectFieldKeys(commandRequestDef.payload[x]);
            if (field) {
                this.controlMonitorFields.push(field);
            }
        });
    }

    private detectFieldKeys(val: string) {
        try {
            if (val) {
                const matches = Sentence.formFieldRegexp.exec(val);
                if (matches) {
                    return matches[1];
                }
            }
        } catch {
        }
        return null;
    }

}

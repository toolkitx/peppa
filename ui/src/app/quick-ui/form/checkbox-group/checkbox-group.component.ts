import { ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { CustomFormControlWidget } from '../../core/render/custom-form-control-widget';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { ArraySchemaDef } from '../../core/render/modals/ui-configuration';

@Component({
    selector: 'qui-checkbox-group',
    templateUrl: './checkbox-group.component.html',
    styleUrls: ['./checkbox-group.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CheckboxGroupComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => CheckboxGroupComponent),
        multi: true
    }]
})
export class CheckboxGroupComponent extends CustomFormControlWidget {
    @Input() schema: ArraySchemaDef;

    constructor(private cdr: ChangeDetectorRef) {
        super();
    }

    valueChange(value: string[]) {
        this.onChangeCallback(value);
        this.onTouchedCallback();
    }

    validate(control: AbstractControl): ValidationErrors | null {
        const val = <string[]>control.value;
        if (this.schema.minItems && val!.length < this.schema.minItems) {
            return {minItems: true};
        }
        if (this.schema.maxItems && val!.length > this.schema.maxItems) {
            return {maxItems: true};
        }
        this.cdr.markForCheck();
        return null;
    }
}

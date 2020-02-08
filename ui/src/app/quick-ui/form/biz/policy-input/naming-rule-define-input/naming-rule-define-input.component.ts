import { Component, EventEmitter, forwardRef, OnInit, Output } from '@angular/core';
import { CustomFormControlWidget } from '../../../../core/render/custom-form-control-widget';
import { FormArray, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RuleColumn } from '../models';

@Component({
    selector: 'qui-naming-rule-define-input',
    templateUrl: './naming-rule-define-input.component.html',
    styleUrls: ['./naming-rule-define-input.component.less'],
    exportAs: 'quiNamingRuleDefineInput',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NamingRuleDefineInputComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => NamingRuleDefineInputComponent),
        multi: true
    }]
})
export class NamingRuleDefineInputComponent extends CustomFormControlWidget implements OnInit {
    @Output() visibleChange = new EventEmitter<boolean>();
    hidden = true;
    dataTypes: any[] = [
        {type: 'Enumeration', displayName: 'Enumeration'},
        {type: 'UserAttribute', displayName: 'User attribute'},
        {type: 'FlexibleText', displayName: 'Flexible text'},
        {type: 'FixedField', displayName: 'Fixed field'},
        {type: 'Connector', displayName: 'Connector'}
    ];
    formArray: FormArray;
    userAttributes: {value: string; displayName: string;}[] = [
        {value: 'firstName', displayName: 'First Name'},
        {value: 'lastName', displayName: 'Last Name'}
    ];
    namingRuleConnectors: {value: string; displayName: string;}[] = [
        {value: '.', displayName: '.'},
        {value: '-', displayName: '-'},
        {value: '_', displayName: '_'}
    ];

    constructor(private fb: FormBuilder) {
        super();
    }

    ngOnInit() {
        if (!this.hidden) {
            this.initForm();
        }
    }

    get shown() {
        return !this.hidden;
    }

    initForm() {
        const data: RuleColumn[] = this.instanceValue ? JSON.parse(this.instanceValue) : [];
        this.formArray = this.fb.array([]);
        if (data.length) {
            data.map(x => {
                this.formArray.push(this.getFormGroup(x));
            });
        } else {
            this.appendItem();
        }
    }

    appendItem() {
        this.formArray.push(this.getFormGroup(<RuleColumn>{
            description: '',
            dataType: 'FlexibleText',
            value: null
        }));
    }

    removeItem(i: number) {
        this.formArray.removeAt(i);
    }

    drop(event: CdkDragDrop<RuleColumn[]>) {
        moveItemInArray(this.formArray.controls, event.previousIndex, event.currentIndex);
        moveItemInArray(this.formArray.value, event.previousIndex, event.currentIndex);
    }

    dataTypeChange(t: string, formGroup: FormGroup) {
        let defaultValue = null;
        formGroup.get('description').enable();
        const ctrl = formGroup.get('value');
        if (t === 'Enumeration') {
            ctrl.setValidators([Validators.required]);
        } else if (t === 'UserAttribute') {
            defaultValue = this.userAttributes[0].value;
        } else if (t === 'Connector') {
            formGroup.get('description').setValue('Connector');
            formGroup.get('description').disable();
            defaultValue = this.namingRuleConnectors[0].value;
        } else if (t === 'FlexibleText') {
            ctrl.setValidators([]);
        } else if (t === 'FixedField') {
            ctrl.setValidators([Validators.required, Validators.pattern(/^[A-za-z0-9]+$/)]);
        }
        ctrl.setValue(defaultValue);
    }

    save() {
        this.instanceValue = JSON.stringify(this.formArray.value);
        this.onChangeCallback(this.instanceValue);
        this.hide();
    }

    hide() {
        this.hidden = true;
        this.visibleChange.emit(!this.hidden);
    }

    show() {
        this.hidden = false;
        this.visibleChange.emit(!this.hidden);
        this.initForm();
    }

    private getFormGroup(data: RuleColumn) {
        const fg = this.fb.group({});
        const ctrl = data.dataType !== 'Connector'
            ? this.fb.control(data.description, [Validators.required])
            : this.fb.control({value: 'Connector', disabled: true});
        fg.addControl('description', ctrl);
        fg.addControl('dataType', this.fb.control(data.dataType || 'FlexibleText'));
        fg.addControl('value', this.fb.control(data.value));
        return fg;
    }

}

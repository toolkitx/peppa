import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { PolicyDefinition, PolicyFormItemDefinition } from '../models';
import { NamingRuleDefineInputComponent } from '../naming-rule-define-input/naming-rule-define-input.component';

@Component({
    selector: 'qui-policy-template-modal',
    templateUrl: './policy-template-modal.component.html',
    styleUrls: ['./policy-template-modal.component.less']
})
export class PolicyTemplateModalComponent implements OnInit, OnDestroy {
    @Input() data: PolicyDefinition[];
    @Input() templates: PolicyDefinition[];
    @ViewChild(NamingRuleDefineInputComponent, {static: false}) namingRuleInput: NamingRuleDefineInputComponent;
    displayTemplates: PolicyFormItemDefinition[] = [];
    form: FormArray;
    namingRuleInputVisible = false;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        if (this.templates) {
            this.initDisplayData();
        }
    }

    ngOnDestroy(): void {

    }

    get value() {
        const items: any[] = this.form.value;
        if (!items) {
            return null;
        }
        const rs = [];
        items.filter(x => x.enable).map((x) => {
            rs.push({name: x.name, value: x.value !== null ? x.value.toString() : x.value});
        });
        return rs;
    }

    toggleNamingRuleInput(visible: boolean) {
        if (!this.namingRuleInput) {
            return;
        }
        this.namingRuleInputVisible = visible;
        if (visible) {
            this.namingRuleInput.show();
        } else {
            this.namingRuleInput.hide();
        }
    }

    private initDisplayData() {
        const grouped = {};
        const rs: PolicyFormItemDefinition[] = [];
        this.templates.sort((a, b) => a.code.localeCompare(b.code)).map(x => {
            const item: PolicyFormItemDefinition = {...x};
            if (!grouped.hasOwnProperty(x.code)) {
                item.sectionTitle = `${x.code} ${x.codeName}`;
                item.sectionDescription = x.description;
                grouped[x.code] = true;
            }
            item.value = this.convertValueType(item.targetAttributeType, item.value);
            item.targetAttributeDefaultValue = this.convertValueType(item.targetAttributeType, item.targetAttributeDefaultValue);
            rs.push(item);
        });
        this.displayTemplates = rs;
        this.initForm();
    }

    private convertValueType(targetAttributeType: string, value: string) {
        if (!value) {
            return value;
        }
        switch (targetAttributeType) {
            case 'TargetBoolean':
                return value.toLowerCase() === 'true';
            case 'TargetInteger':
                return Number(value);
            default:
                return value;
        }
    }

    private initForm() {
        const arrForm = this.fb.array([]);
        this.displayTemplates.map(x => {
            arrForm.push(this.getFormGroup(x));
        });
        this.form = arrForm;
    }

    private getFormGroup(def: PolicyFormItemDefinition) {
        const instance = this.getPolicyInstance(def.name);
        const fg = this.fb.group({});
        const val: any = instance && instance.hasOwnProperty('value')
            ? this.convertValueType(instance.targetAttributeType, instance.value)
            : this.convertValueType(def.targetAttributeType, def.targetAttributeDefaultValue);
        fg.addControl('enable', this.fb.control(!!instance));
        fg.addControl('name', this.fb.control(def.name));
        fg.addControl('value', this.fb.control(val));
        Object.defineProperty(fg, 'raw', {value: def, writable: false});
        return fg;
    }

    private getPolicyInstance(name: string) {
        if (!this.data) {
            return null;
        }
        return this.data.find(x => x.name === name);
    }
}

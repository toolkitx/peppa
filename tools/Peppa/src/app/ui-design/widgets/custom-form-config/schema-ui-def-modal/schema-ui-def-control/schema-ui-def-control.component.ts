import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomDefControl } from '../../../../form/custom-def-control';
import { SchemaUiDef } from '../../../../../modals/ui-configuration';

@Component({
    selector: 'app-schema-ui-def-control',
    templateUrl: './schema-ui-def-control.component.html',
    styleUrls: ['./schema-ui-def-control.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SchemaUiDefControlComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => SchemaUiDefControlComponent),
        multi: true
    }]
})
export class SchemaUiDefControlComponent extends CustomDefControl<SchemaUiDef> implements OnInit {
    supportedFormControls = {
        OnDemand: [],
        SSP: [
            'Text', 'Textarea', 'Number', 'Switch', 'Time', 'Date', 'DateTime', 'DateRange', 'Rate', 'Checkbox',
            'CheckboxGroup', 'Select', 'RadioGroup', 'PolicyInput', 'ApprovalProcessInput', 'NamingRuleInput',
            'BizTeamTemplateInput', 'BizTeamRulesInput'
        ]
    };

    isSection: boolean;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {

    }

    writeValue(obj: any): void {
        super.writeValue(obj);
        if (obj) {
            this.isSection = !!this.instanceValue.section;
        }
    }

    widgetTypeChange(widget: string) {
        if (widget !== 'Checkbox') {
            delete this.instanceValue.label;
        }
        if (widget !== 'Select') {
            delete this.instanceValue.mode;
        } else {
            this.instanceValue.mode = this.instanceValue.mode || 'default';
        }
    }

    sectionSwitch(enable: boolean) {
        if (enable) {
            this.instanceValue.section = {title: null};
        } else {
            delete this.instanceValue.section;
        }
    }
}

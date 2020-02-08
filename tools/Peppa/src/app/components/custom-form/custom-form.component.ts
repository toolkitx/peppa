import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ObjectSchemaDef, SchemaDef } from '../../modals/ui-configuration';
import { CustomForm, RequiredProps, SchemaProps, SchemaTypes } from './custom-form';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-custom-form',
    templateUrl: './custom-form.component.html',
    styleUrls: ['./custom-form.component.less']
})
export class CustomFormComponent implements OnInit, OnChanges {
    @Input() data: SchemaDef;
    @Input() autoUpdate = false;
    @Output() apply = new EventEmitter();
    form: CustomForm;
    types = SchemaTypes;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.data) {
            this.form = new CustomForm(this.formBuilder, this.data);
            if (this.autoUpdate) {
                this.form.instance.valueChanges.subscribe(() => {
                    if (this.form.valid) {
                        this.apply.emit(this.form.instance.value);
                    }
                });
            }

        } else {
            this.form = null;
        }
    }

    get keywords() {
        if (!this.data) {
            return [];
        }
        const types = SchemaProps[this.data.type];
        if (this.form) {
            const exists = this.form.keys;
            return types.filter(x => !exists.includes(x));
        }
        return types;
    }

    addProp(prop: string) {
        this.form.addControl(prop);
    }

    removeProp(prop: string) {
        if (this.form.instance.contains(prop)) {
            this.form.removeControl(prop);
        }
    }

    typeChange(type: string) {
        console.log(type);
    }

    isRequired(key: string) {
        return RequiredProps.includes(key);
    }

    get requiredOptions() {
        return this.data && this.data.type === 'object' ? Object.keys((<ObjectSchemaDef> this.data).properties) : [];
    }

}

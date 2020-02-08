import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchemaDef } from '../../modals/ui-configuration';

export const SchemaTypes = ['string', 'object', 'array', 'boolean', 'number', 'integer'];

const basicProps = ['type', 'title', 'description', 'default', 'enum'];

export const RequiredProps = ['type'];

export const SchemaProps: {[key: string]: string[]} = {
    'string': [...basicProps, 'minLength', 'maxLength', 'pattern'],
    'object': [...basicProps, 'properties', 'required'],
    'array': [...basicProps, 'minItems', 'maxItems', 'uniqueItems', 'items'],
    'boolean': [...basicProps, 'minLength', 'maxLength', 'pattern'],
    'number': [...basicProps, 'minimum', 'maximum'],
    'integer': [...basicProps, 'minimum', 'maximum']
};

export const  HiddenProps = ['properties', 'items'];

export const SchemaPropDataType: {[key: string]: string} = {
    type: 'typeSelect',
    minLength: 'number',
    maxLength: 'number',
    minItems: 'number',
    maxItems: 'number',
    minimum: 'number',
    maximum: 'number',
    uniqueItems: 'boolean'
};

export class CustomForm {
    _form: FormGroup;

    constructor(private formBuilder: FormBuilder, private data: SchemaDef) {
        this.generateForm();
        if (this.data) {
            this._form.setValue(this.data);
        }
    }

    get controls() {
        return this._form && this._form.controls || [];
    }

    get valid(): boolean {
        return this._form.valid;
    }

    get instance() {
        return this._form;
    }

    get keys() {
        return this._form && this._form.value ? Object.keys(this._form.value) : [];
    }

    addControl(prop: string, value?: any) {
        this.createItem(this._form, prop);
    }

    removeControl(prop: string) {
        this._form.removeControl(prop);
    }

    private generateForm() {
        const fg = this.formBuilder.group({});
        const keys = Object.keys(this.data);
        keys.map((key: string) => {
            this.createItem(fg, key);
        });
        this._form = fg;
    }

    private createItem(fg: FormGroup, key: string) {
        const validator = !['required', 'properties'].includes(key) ? [Validators.required] : [];
        const ctrl = this.formBuilder.control(null, validator);
        const dataType = SchemaPropDataType[key] || 'text';
        Object.defineProperty(ctrl, 'dataType', {value: dataType, writable: false});
        if (HiddenProps.includes(key)) {
            Object.defineProperty(ctrl, 'hidden', {value: true, writable: false});
        }
        fg.addControl(key, ctrl);
    }
}

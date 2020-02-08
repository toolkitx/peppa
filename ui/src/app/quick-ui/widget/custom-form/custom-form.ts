import {
    ArraySchemaDef, AsyncValidatorResult, FormUiDef, NumberSchemaDef, ObjectSchemaDef, SchemaDef, SchemaUiDef, StringSchemaDef
} from '../../core/render/modals/ui-configuration';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CommandService } from '../../core/service/command.service';
import { debounceTime, distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UiConfigurationService } from '../../core/render/ui-configuration.service';

export class CustomForm {
    private _form: FormGroup;
    private validators: {[key: string]: any} = {};
    private asyncValidators: {[key: string]: any} = {};

    constructor(private schema: ObjectSchemaDef,
                private formUiDef: FormUiDef,
                private formBuilder: FormBuilder,
                private uiConfigurationService: UiConfigurationService,
                private commandService: CommandService,
                private data: any,
                private context?: any
    ) {
        if (this.schema.type !== 'object') {
            throw new Error('Root type must be `object`.');
        }
        if (!this.schema.properties) {
            throw new Error('Properties must be defined.');
        }
        this.setDefault();
        this.generateForm();
        if (this.data) {
            const keys = Object.keys(this.schema.properties);
            const payload = {};
            keys.map(x => payload[x] = this.data.hasOwnProperty(x) ? this.data[x] : null);
            this._form.setValue(payload);
        }
    }

    get title(): string {
        return this.schema.title;
    }

    get description(): string {
        return this.schema.description;
    }

    get controls() {
        return this._form.controls;
    }

    get valid(): boolean {
        return this._form.valid;
    }

    get instance() {
        return this._form;
    }

    get value() {
        return this._form.value;
    }

    get messages() {
        return this.formUiDef.messages || {success: null, error: null};
    }

    get $context() {
        return this.context;
    }

    getValidators(key: string) {
        return this.validators[key] || [];
    }

    getAsyncValidators(key: string) {
        return this.asyncValidators[key] || [];
    }

    isRequired(key: string) {
        return this.schema && this.schema.required && this.schema.required.includes(key);
    }

    private generateForm() {
        this._form = this.generateFormGroup(this.schema);
    }

    // - generate form
    // ---- generate form group
    // -------- generate form array or form control
    private generateFormGroup(def: ObjectSchemaDef, name?: string) {
        const fg = this.formBuilder.group({});
        const propertyKeys = Object.keys(def.properties);
        propertyKeys.map((key: string) => {
            this.createFormControl(fg, def.properties[key], key);
        });
        def.keys = Object.keys(fg.controls);
        this.addRawSchema(fg, def, name);
        return fg;
    }

    private createFormControl(form: FormGroup, schema: SchemaDef, name: string) {
        schema.ui = this.formUiDef.fields && this.formUiDef.fields[name] || {};
        switch (schema.type) {
            case 'array':
                this.generateFormArray(form, <ArraySchemaDef>schema, name);
                break;
            // TODO support sub object
            // case 'object':
            //     form.addControl(name, this.generateFormGroup(<ObjectSchemaDef>schema, name));
            //     break;
            default:
                this.generateFormItem(form, schema, name);
                break;
        }
    }

    private generateFormArray(form: FormGroup, schema: ArraySchemaDef, name: string) {
        const validators = [];
        if (this.isRequired(name)) {
            validators.push(Validators.required);
        }
        const defaultValue = this.getDefaultValue(schema);
        const ctrl = this.formBuilder.control(defaultValue, validators);
        form.addControl(name, ctrl);
        this.addRawSchema(ctrl, schema, name);
    }

    private generateFormItem(form: FormGroup, schema: NumberSchemaDef | StringSchemaDef | SchemaDef, name: string) {
        const validators = [];
        const asyncValidators = [];

        if (this.isRequired(name)) {
            validators.push(Validators.required);
        }
        if (schema.type === 'number') {
            const numberSchema = <NumberSchemaDef>schema;
            if (numberSchema.minimum) {
                validators.push(Validators.min(numberSchema.minimum));
            }
            if (numberSchema.maximum) {
                validators.push(Validators.max(numberSchema.maximum));
            }
        }
        if (schema.type === 'string') {
            const stringSchema = <StringSchemaDef>schema;
            if (stringSchema.minLength) {
                validators.push(Validators.minLength(stringSchema.minLength));
            }

            if (stringSchema.maxLength) {
                validators.push(Validators.maxLength(stringSchema.maxLength));
            }

            if (stringSchema.pattern) {
                validators.push(Validators.pattern(stringSchema.pattern));
            }
        }
        const uiDef = schema.ui as SchemaUiDef;
        const defaultValue = this.getDefaultValue(schema);
        if (uiDef && uiDef.validator && uiDef.validator.command) {
            asyncValidators.push(Validators.composeAsync([this.createAsyncValidator(uiDef)]));
        }
        const ctrl = this.formBuilder.control(defaultValue, validators, asyncValidators);

        form.addControl(name, ctrl);
        this.addRawSchema(ctrl, schema, name);

        this.validators[name] = validators;
        this.asyncValidators[name] = asyncValidators;
    }

    private getDefaultValue(schema: NumberSchemaDef | StringSchemaDef | SchemaDef | ArraySchemaDef) {
        let defaultValue = schema.default || null;
        const uiDef = schema.ui as SchemaUiDef;
        if (uiDef && uiDef.visible === false && uiDef.value) {
            const val = this.uiConfigurationService.translateSentence(uiDef.value, null, this.$context, this.instanceValue);
            if (val.valid) {
                defaultValue = val.value;
            }
        }
        return defaultValue;
    }

    private addRawSchema(ctrl: any, schemaDef: SchemaDef, name?: string) {
        Object.defineProperty(ctrl, 'rawSchema', {value: schemaDef, writable: false});
        if (name) {
            const uiDef = this.getFieldUiDef(name);
            Object.defineProperty(ctrl, 'rawUiDef', {value: uiDef, writable: false});
        }
    }

    private createAsyncValidator(def: SchemaUiDef): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (!control.valueChanges || control.pristine) {
                return of(null);
            }
            return control.valueChanges!.pipe(
                debounceTime(500),
                distinctUntilChanged(),
                take(1),
                switchMap((val: any) => {
                    const command = this.uiConfigurationService.getCommand(def.validator.command);
                    const payload = this.uiConfigurationService
                        .getCommandInputPayload(val, command.inputSchema, def.validator.payload, this.$context, this.instanceValue);
                    const params = {command: command.name, payload: payload};
                    return this.commandService.run(params);
                }),
                map((data: AsyncValidatorResult) => {
                    const exists = data.result;
                    if (exists) {
                        const rs: ValidationErrors = {};
                        rs[def.validator.command] = true;
                        return rs;
                    } else {
                        return null;
                    }
                })
            );
        };
    }

    private get instanceValue() {
        return this.instance ? this.instance.value : null;
    }

    private setDefault() {
        const defaultValue = <FormUiDef>{messages: {}};
        this.formUiDef = Object.assign(defaultValue, this.formUiDef);
    }

    private getFieldUiDef(name: string) {
        const def = this.formUiDef && this.formUiDef.fields && this.formUiDef.fields[name] || null;
        return Object.assign({placeholder: ''}, def);
    }
}

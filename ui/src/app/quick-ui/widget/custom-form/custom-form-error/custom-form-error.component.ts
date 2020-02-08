import { Component, Input, OnChanges } from '@angular/core';
import { SchemaDef } from '../../../core/render/modals/ui-configuration';

@Component({
    selector: 'qui-custom-form-error',
    templateUrl: './custom-form-error.component.html',
    styleUrls: ['./custom-form-error.component.less']
})
export class CustomFormErrorComponent implements OnChanges {
    @Input() data: {[key: string]: any};
    @Input() def: SchemaDef;

    defaultErrorDef: {[key: string]: string} = {
        required: 'The value cannot be empty',
        minimum: 'The value should be higher than a certain number',
        maximum: 'The value should be lower than a certain number',
        minLength: 'The value should contain a minimum amount of characters',
        maxLength: 'The value should contain a maximum amount of characters',
        pattern: 'Incorrect format',
        minItems: 'The value should contain a minimum amount of items',
        maxItems: 'The value should contain a maximum amount of characters',
        uniqueItems: 'Each of the items should be unique'
    };

    errorMessages: string[];

    ngOnChanges(): void {
        this.errorMessages = [];
        if (this.data) {
            this.updateError();
        }
    }

    get errorDef() {
        return this.def.ui && this.def.ui.errors || {};
    }

    updateError() {
        const msg: string[] = [];
        const keys = Object.keys(this.data);
        keys.map((key: string) => {
            const content = this.getPropIgnoreCase(key, this.errorDef)
                || this.getPropIgnoreCase(key, this.defaultErrorDef) || `error:${key}`;
            msg.push(content);
        });
        this.errorMessages = msg;
    }

    getPropIgnoreCase(key: string, obj: {[key: string]: any}): string {
        const objKey = Object.keys(obj).find(x => x.toLowerCase() === key.toLowerCase());
        return obj[objKey];
    }
}

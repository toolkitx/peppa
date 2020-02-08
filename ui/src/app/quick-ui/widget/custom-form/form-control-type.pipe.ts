import { Pipe, PipeTransform } from '@angular/core';
import { SchemaDef, SchemaUiDef } from '../../core/render/modals/ui-configuration';

@Pipe({
    name: 'formControlType'
})
export class FormControlTypePipe implements PipeTransform {
    defaultTypes = {
        'string': 'Text',
        'number': 'Number',
        'boolean': 'Switch'
    };

    unsupportedType = 'Unknown';

    transform(schemaDef: SchemaDef, ui: SchemaUiDef): string {
        if (!schemaDef) {
            return this.unsupportedType;
        }
        if (ui && ui.widget) {
            return ui.widget;
        }
        if (schemaDef!.type === 'array' && (!ui || !ui.widget)) {
            throw new Error('Form control type of array is required.');
            return this.unsupportedType;
        }
        return this.defaultTypes[schemaDef!.type] || this.unsupportedType;
    }

}

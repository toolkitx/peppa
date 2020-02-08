import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomDefControl } from '../../../form/custom-def-control';
import { CommandDef, ObjectSchemaDef, SchemaUiDef } from '../../../../modals/ui-configuration';
import { KeysPipe } from '../../../../pipes/keys.pipe';

interface FieldUiDef {
    name: string;
    enable: boolean;
    expand: boolean;
    def: SchemaUiDef;
}

@Component({
    selector: 'app-schema-ui-def-modal',
    templateUrl: './schema-ui-def-modal.component.html',
    styleUrls: ['./schema-ui-def-modal.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SchemaUiDefModalComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => SchemaUiDefModalComponent),
        multi: true
    }]
})
export class SchemaUiDefModalComponent extends CustomDefControl<{[key: string]: SchemaUiDef}> implements OnInit {
    @Input() commandDef: CommandDef;
    isVisible = false;
    fieldUiDefs: FieldUiDef[] = [];

    constructor(protected injector: Injector, private keysPipe: KeysPipe) {
        super(injector);
    }

    toggleVisible() {
        this.isVisible = !this.isVisible;
        if (this.isVisible) {
            this.initModal();
        }
    }

    ngOnInit() {
    }

    handleOk() {
        this.toggleVisible();
        const defs = this.fieldUiDefs.filter(x => x.enable);
        const rs = {};
        defs.map((item) => {
            rs[item.name] = item.def;
        });
        this.instanceValue = rs;
        this.onChangeCallback(rs);
    }

    handleCancel() {
        this.toggleVisible();
    }

    initModal() {
        if (this.commandDef && this.commandDef.inputSchema) {
            const output = this.commandDef.inputSchema as ObjectSchemaDef;
            if (output.type === 'object') {
                const items = this.keysPipe.transform(output.properties);
                const rs: FieldUiDef[] = [];
                items.map((item) => {
                    const def = this.getDef(item.key);
                    const copy = Object.assign({}, def);
                    rs.push({name: item.key, enable: !!def, expand: false, def: copy || <SchemaUiDef> {widget: 'Text', size: 'default'}});
                });
                this.fieldUiDefs = rs;
                return;
            }
        }
        this.fieldUiDefs = [];
    }

    private getDef(key: string) {
        return this.instanceValue && this.instanceValue[key];
    }

}

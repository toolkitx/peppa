import { Component, Input, OnInit } from '@angular/core';
import { ObjectSchemaDef, SchemaDef } from '../../../../modals/ui-configuration';
import { SchemaTypes } from '../../../../components/custom-form/custom-form';
import _ from 'lodash';
import { FormBuilder } from '@angular/forms';
import { newSchemaDef } from '../../../util';

@Component({
    selector: 'app-create-property-modal',
    templateUrl: './create-property-modal.component.html',
    styleUrls: ['./create-property-modal.component.less']
})
export class CreatePropertyModalComponent implements OnInit {
    @Input() schemaDef: SchemaDef;
    types = SchemaTypes;
    newPropertyDef: any = {};
    addAnother = false;
    existsKeys: string[] = [];

    constructor(private fb: FormBuilder) {
    }

    get value() {
        const obj = _.cloneDeep(this.newPropertyDef);
        const {type, name, itemType} = obj;
        const def: SchemaDef = newSchemaDef(type, itemType);
        return {def, name};
    }

    get isValid() {
        return this.isNewPropertyValid(this.newPropertyDef.name);
    }

    appendNewKeys(key: string) {
        this.newPropertyDef.name = null;
        this.existsKeys.push(key);
    }

    createNewPropertyDef() {
        return {
            type: 'string',
            name: null,
            itemType: 'string'
        };
    }

    ngOnInit() {
        this.newPropertyDef = this.createNewPropertyDef();
        this.existsKeys = Object.keys((this.schemaDef as ObjectSchemaDef).properties);
    }

    isNewPropertyValid(name: string) {
        const reg = /^[a-z][A-Za-z0-9]+$/g;
        if (name && reg.test(name)) {
            const def = this.schemaDef;
            if (def.type === 'object' && def.properties) {
                return !this.isPropertyExists(name);
            } else {
                // const raw = this.contextTargetNode.parentNode.origin.raw;
                // return this.isPropertyExists(name, (raw as ObjectSchemaDef).properties);
            }
        }
        return false;
    }

    private isPropertyExists(name: string) {
        return this.existsKeys.includes(name);
    }

}

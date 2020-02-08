import { Component, OnInit } from '@angular/core';
import { SchemaDef } from '../../../../modals/ui-configuration';
import { newSchemaDef } from '../../../util';
import { SchemaTypes } from '../../../../components/custom-form/custom-form';

@Component({
    selector: 'app-init-schema-modal',
    templateUrl: './init-schema-modal.component.html',
    styleUrls: ['./init-schema-modal.component.less']
})
export class InitSchemaModalComponent implements OnInit {
    initType = 'string';
    initItemType = 'string';
    initTemplate = 'Custom';
    types = SchemaTypes;

    schemaTemplates: {name: string; template: any}[] = [
        {name: 'Custom', template: null},
        {
            name: 'Paging Input', template: {
                type: 'object',
                properties: {
                    skip: {
                        type: 'integer'
                    },
                    take: {
                        type: 'integer'
                    },
                    filter: {
                        type: 'string'
                    }
                }
            }
        },
        {
            name: 'Paging Output', template: {
                type: 'object',
                properties: {
                    total: {
                        type: 'integer'
                    },
                    results: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {}
                        }
                    }
                }
            }
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

    get value() {
        let def: SchemaDef;
        if (this.initTemplate === 'Custom') {
            def = newSchemaDef(this.initType, this.initItemType);
        } else {
            def = this.schemaTemplates.find(x => x.name === this.initTemplate).template;
        }
        this.initType = 'string';
        this.initItemType = 'string';
        this.initTemplate = 'Custom';
        return def;
    }

}

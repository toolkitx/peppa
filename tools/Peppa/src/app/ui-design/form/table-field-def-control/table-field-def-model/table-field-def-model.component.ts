import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ArraySchemaDef, CommandDef, ObjectSchemaDef, SchemaDef, SlotConfDef } from '../../../../modals/ui-configuration';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CacheService } from '../../../../cache/cache.service';
import { TableCellConf } from '../../../../modals/widget-slot-conf';
import { CONST_COMMAND_DEF_CACHE_KEY } from '../../../../constants';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NzModalService } from 'ng-zorro-antd';

@Component({
    selector: 'app-table-field-def-model',
    templateUrl: './table-field-def-model.component.html',
    styleUrls: ['./table-field-def-model.component.less']
})
export class TableFieldDefModelComponent implements OnInit, AfterViewInit {
    @Input() command: string;
    @Input() allowMenu: boolean;
    @Input() data: TableCellConf[];
    props: string[] = [];
    propType = 'Text';
    dataTypes = ['Text', 'Date', 'Action', 'Widget'];
    menuDataType = 'Menu';
    commandDefs: CommandDef[];
    form: FormArray;
    firstVisual = false;

    constructor(private cacheService: CacheService, private fb: FormBuilder, private messageService: NzModalService) {
    }

    get value() {
        return this.form.value;
    }

    ngOnInit() {
        if (this.allowMenu) {
            this.dataTypes.push(this.menuDataType);
        }
        this.commandDefs = this.cacheService.get<CommandDef[]>(CONST_COMMAND_DEF_CACHE_KEY);
        if (this.commandDefs) {
            const cmdDef = this.commandDefs.find(x => x.name === this.command);
            if (cmdDef) {
                // array schema
                const schemaDef = cmdDef.outputSchema as SchemaDef;
                let properties: any = {};
                if (schemaDef.type === 'array') {
                    properties = ((<ArraySchemaDef> schemaDef).items as ObjectSchemaDef).properties;
                } else if (schemaDef.type === 'object') {
                    const objSchemaDef = <ObjectSchemaDef> schemaDef;
                    // check paging output
                    if (objSchemaDef.properties && objSchemaDef.properties.hasOwnProperty('total')
                        && objSchemaDef.properties.hasOwnProperty('results')) {
                        const itemSchemaDef = objSchemaDef.properties.results as ArraySchemaDef;
                        properties = (itemSchemaDef.items as ObjectSchemaDef).properties;
                    } else {
                        // for object, description block
                        properties = objSchemaDef.properties;
                    }
                } else {
                    // command not support
                }
                // if (schemaDef && schemaDef.items) {
                //     const objDef = schemaDef.items as ObjectSchemaDef;
                //     if (objDef && objDef.properties) {
                //         this.props = Object.keys(objDef.properties);
                //     }
                // }
                this.props = Object.keys(properties);
            }
        }
        this.createForm();
    }

    createForm() {
        const arrForm = this.fb.array([]);
        if (this.data) {
            this.data.map(x => {
                arrForm.push(this.getFormGroup(x.key, x.displayName, x.dataType, x.action));
            });
        }
        this.form = arrForm;
    }

    ngAfterViewInit(): void {
        this.firstVisual = true;
    }

    appendItem(prop: string, propType: string) {
        this.form.push(this.getFormGroup(prop, prop, propType, null));
    }

    appendMenuItem() {
        this.form.push(this.getFormGroup('#', 'Actions', this.menuDataType, null));
    }

    removeItem(i: number) {
        this.form.removeAt(i);
    }

    drop(event: CdkDragDrop<SlotConfDef[]>) {
        moveItemInArray(this.form.controls, event.previousIndex, event.currentIndex);
        moveItemInArray(this.form.value, event.previousIndex, event.currentIndex);
    }

    dateTypeChange(val: string, fg: FormGroup) {
        if (this.firstVisual && val !== 'Action' && val !== 'Widget') {
            fg.get('action').setValue(null);
        }
    }

    private getFormGroup(key: string, displayName: string, dataType: string, action: string) {
        const fg = this.fb.group({});
        fg.addControl('key', this.fb.control(key));
        fg.addControl('displayName', this.fb.control(displayName));
        fg.addControl('dataType', this.fb.control(dataType));
        fg.addControl('action', this.fb.control(action));
        return fg;
    }

}

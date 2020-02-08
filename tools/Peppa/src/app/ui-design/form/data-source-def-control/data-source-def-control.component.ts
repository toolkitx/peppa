import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomDefControl } from '../custom-def-control';
import { AsyncDataSourceDef, CommandDef, CommandRequestDef, ObjectSchemaDef, SchemaDef } from '../../../modals/ui-configuration';
import { CONST_COMMAND_DEF_CACHE_KEY } from '../../../constants';

@Component({
    selector: 'app-data-source-def-control',
    templateUrl: './data-source-def-control.component.html',
    styleUrls: ['./data-source-def-control.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DataSourceDefControlComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => DataSourceDefControlComponent),
        multi: true
    }]
})
export class DataSourceDefControlComponent extends CustomDefControl<AsyncDataSourceDef> implements OnInit {
    commandDefs: CommandDef[] = [];
    props: string[] = [];
    label: string;
    value: string;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.commandDefs = this.cacheService.get<CommandDef[]>(CONST_COMMAND_DEF_CACHE_KEY);
    }

    writeValue(obj: any): void {
        if (!obj) {
            return;
        }
        super.writeValue(obj);
        this.commandChange(this.instanceValue);
        this.label = this.instanceValue.label;
        this.value = this.instanceValue.value;
    }

    commandChange(cmdReqDef: CommandRequestDef) {
        this.props = [];
        if (cmdReqDef) {
            const cmd = this.commandDefs.find(x => x.name === cmdReqDef.command);
            if (cmd) {
                const arrDef = cmd.outputSchema as SchemaDef;
                if (arrDef.items) {
                    const objDef = arrDef.items as ObjectSchemaDef;
                    const keys = Object.keys(objDef.properties);
                    this.props = keys;
                } else if (arrDef.properties && arrDef.properties.hasOwnProperty('results') && arrDef.properties.results.items) {
                    const objDef = arrDef.properties.results.items as ObjectSchemaDef;
                    const keys = Object.keys(objDef.properties);
                    this.props = keys;
                }
                this.instanceValue = cmdReqDef;
            }
        } else {
            this.instanceValue = null;
        }
        this.onChangeCallback(this.instanceValue);
    }

    bindKeyChange(prop: string, val: string) {
        this.instanceValue[prop] = val;
        this.onChangeCallback(this.instanceValue);
    }

}

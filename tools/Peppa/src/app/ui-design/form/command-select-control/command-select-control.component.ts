import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { CommandDef } from '../../../modals/ui-configuration';
import { CONST_COMMAND_DEF_CACHE_KEY } from '../../../constants';
import { CustomDefControl } from '../custom-def-control';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-command-select-control',
    templateUrl: './command-select-control.component.html',
    styleUrls: ['./command-select-control.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CommandSelectControlComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => CommandSelectControlComponent),
        multi: true
    }]
})
export class CommandSelectControlComponent extends CustomDefControl<string> implements OnInit {
    commandDefs: CommandDef[] = [];
    commandName: string = null;

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
        this.commandName = this.instanceValue;
    }

    commandChange(name: string) {
        this.instanceValue = name;
        this.onChangeCallback(this.instanceValue);
    }
}

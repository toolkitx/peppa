import { ChangeDetectorRef, Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { CustomDefControl } from '../custom-def-control';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommandDef, CommandRequestDef, PayloadDef } from '../../../modals/ui-configuration';
import { CONST_COMMAND_DEF_CACHE_KEY } from '../../../constants';
import { NzModalService } from 'ng-zorro-antd';
import { CommandPayloadComponent } from '../../modals/command-payload/command-payload.component';

@Component({
    selector: 'app-command-def-control',
    templateUrl: './command-def-control.component.html',
    styleUrls: ['./command-def-control.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CommandDefControlComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => CommandDefControlComponent),
        multi: true
    }]
})
export class CommandDefControlComponent extends CustomDefControl<CommandRequestDef> implements OnInit {
    @Input() allowClear = false;
    commandDefs: CommandDef[] = [];
    commandName: string = null;

    constructor(protected injector: Injector, private nzModalService: NzModalService, private cdr: ChangeDetectorRef) {
        super(injector);
    }

    toggleVisible() {
        const modal = this.nzModalService.create({
            nzTitle: 'Edit payload',
            nzContent: CommandPayloadComponent,
            nzComponentParams: {
                data: Object.assign({}, this.instanceValue)
            },
            nzFooter: [
                {
                    label: 'Save',
                    type: 'primary',
                    onClick: (comp: CommandPayloadComponent) => {
                        this.instanceValue = {...this.instanceValue, payload: comp.value};
                        this.onChangeCallback(this.instanceValue);
                        modal.close();
                    }
                },
                {
                    label: 'Cancel',
                    onClick: () => {
                        modal.close();
                    }
                },
                {
                    label: 'Help',
                    type: 'link',
                    onClick: (comp: CommandPayloadComponent) => {
                        comp.showHelp();
                    }
                }
            ]
        });
    }

    ngOnInit() {
        this.commandDefs = this.cacheService.get<CommandDef[]>(CONST_COMMAND_DEF_CACHE_KEY);
    }

    writeValue(obj: any): void {
        if (!obj) {
            return;
        }
        super.writeValue(obj);
        this.commandName = this.instanceValue.command;
    }

    commandChange(name: string) {
        if (!name) {
            this.instanceValue = null;
        } else {
            this.instanceValue = {
                command: name,
                payload: <PayloadDef> {}
            };
        }
        this.onChangeCallback(this.instanceValue);
    }
}

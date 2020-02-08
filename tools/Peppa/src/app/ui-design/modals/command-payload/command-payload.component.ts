import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommandDef, CommandRequestDef, ObjectSchemaDef } from '../../../modals/ui-configuration';
import { CONST_COMMAND_DEF_CACHE_KEY } from '../../../constants';
import { CacheService } from '../../../cache/cache.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { KeysPipe } from '../../../pipes/keys.pipe';

@Component({
    selector: 'app-command-payload',
    templateUrl: './command-payload.component.html',
    styleUrls: ['./command-payload.component.less']
})
export class CommandPayloadComponent implements OnInit, OnChanges {
    @Input() data: CommandRequestDef;

    commandDefs: CommandDef[] = [];
    commandDef: CommandDef;
    form: FormGroup;
    isHelpVisible = false;

    get value() {
        return this.form.value;
    }

    constructor(private cacheService: CacheService, private fb: FormBuilder, private keysPipe: KeysPipe) {
        this.commandDefs = this.cacheService.get<CommandDef[]>(CONST_COMMAND_DEF_CACHE_KEY);
    }

    ngOnInit() {
        if (this.data) {
            this.commandDef = this.commandDefs.find(x => x.name === this.data.command);
            if (this.commandDef && this.commandDef.inputSchema && this.commandDef.inputSchema.type === 'object') {
                this.createForm();
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    createForm() {
        const keys: string[] = this.keysPipe.transform((<ObjectSchemaDef> this.commandDef.inputSchema).properties).map(x => x.key);
        const fg = this.fb.group({});
        keys.map(x => {
            fg.addControl(x, this.fb.control(null));
        });

        if (this.data.payload) {
            // deep copy
            const payload = {...this.data.payload};
            keys.map((k) => {
                if (!payload.hasOwnProperty(k)) {
                    payload[k] = null;
                }
            });
            fg.setValue(payload);
        }
        this.form = fg;
    }

    handleHelpCancel() {
        this.isHelpVisible = false;
    }

    showHelp() {
        this.isHelpVisible = true;
    }


}

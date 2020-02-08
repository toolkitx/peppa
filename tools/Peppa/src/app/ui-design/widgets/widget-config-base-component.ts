import { ArraySchemaDef, CommandDef, ObjectSchemaDef, SlotConfDef } from '../../modals/ui-configuration';
import { EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CacheService } from '../../cache/cache.service';
import { CONST_COMMAND_DEF_CACHE_KEY } from '../../constants';

export class WidgetConfigBaseComponent implements OnInit, OnChanges {
    @Input() conf: SlotConfDef;
    @Output() change = new EventEmitter<SlotConfDef>();

    formBuilder: FormBuilder;
    form: FormGroup;
    commandDefs: CommandDef[] = [];
    cacheService: CacheService;

    constructor(injector: Injector) {
        this.formBuilder = injector.get(FormBuilder);
        this.cacheService = injector.get(CacheService);
    }

    ngOnInit(): void {
        this.commandDefs = this.cacheService.get<CommandDef[]>(CONST_COMMAND_DEF_CACHE_KEY);
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    createForm(configFormGroup: FormGroup) {
        this.form = configFormGroup;

        if (this.conf) {
            this.form.setValue(this.conf.config);
        }

        this.form.valueChanges.subscribe(() => {
            if (this.form.valid) {
                console.log('value changed');
                this.change.emit(this.form.value);
            }
        });
    }

    getCommandDefByName(name: string): CommandDef {
        return this.commandDefs.find(x => x.name === name);
    }

    getCommandOutputKeys(name: string): string[] {
        const cmd = this.getCommandDefByName(name);
        if (cmd) {
            const output = cmd.outputSchema;
            if (output.type === 'object') {
                const pagingResponse = (output as ObjectSchemaDef).properties;
                if (pagingResponse.hasOwnProperty('total') && pagingResponse.hasOwnProperty('results')) {
                    const itemDef = (pagingResponse.results as ArraySchemaDef).items as ObjectSchemaDef;
                    return Object.keys(itemDef.properties);
                }
            }
        }
        return [];
    }
}

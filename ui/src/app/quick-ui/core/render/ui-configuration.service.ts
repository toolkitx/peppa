import { Injectable, Injector } from '@angular/core';
import { CacheService } from '../cache/cache.service';
import {
    ArraySchemaDef, CommandDef, MenuDef, ObjectSchemaDef, PayloadDef, SchemaDef, UIConfiguration, ViewDef
} from './modals/ui-configuration';
import { CONSTANT_COMMANDS_CONFIGURATION, CONSTANT_UI_CONFIGURATION } from '../global';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Sentence } from './sentence';

@Injectable({
    providedIn: 'root'
})
export class UiConfigurationService {
    private commands: CommandDef[];

    get setting(): UIConfiguration {
        return this.cacheService.get<UIConfiguration>(CONSTANT_UI_CONFIGURATION);
    }

    constructor(private cacheService: CacheService,
                private injector: Injector,
                private location: Location,
                private route: ActivatedRoute) {
    }

    getView(viewName: string): ViewDef {
        return this.setting && this.setting!.application.views.find(x => x.name === viewName) || null;
    }

    getDefaultView(): ViewDef {
        return this.setting && this.setting!.application.views.find(x => x.default) || null;
    }

    getCommand(commandName: string): CommandDef {
        if (!this.commands) {
            this.commands = this.cacheService.get<CommandDef[]>(CONSTANT_COMMANDS_CONFIGURATION) || <CommandDef[]>[];
        }
        return this.commands.find(x => x.name === commandName);
    }

    getSidebar(name: string): MenuDef[] {
        if (!this.setting.application.sidebarDefs) {
            return [];
        }
        const def = this.setting.application.sidebarDefs.find(x => x.name === name);
        return def && def.items ? def.items : [];
    }

    getCommandInputPayload(
        currentValue: any,
        inputSchema: SchemaDef,
        payloadMapping: PayloadDef = <any>{},
        context?: any,
        formValueObject?: any) {
        if (!inputSchema) {
            return null;
        }

        const commandValue = (input: string, ctx?: any) => {
            // if (input === '$value') {
            //     return currentValue;
            // }
            // return this.translateValue(input);
            const val = new Sentence(this.injector, input, currentValue, ctx, formValueObject);
            return val.value;
        };

        const rs: {[key: string]: string} = {};
        const keys = Object.keys((<ObjectSchemaDef>inputSchema).properties);
        keys.map((key: string) => {
            const def = (<ObjectSchemaDef>inputSchema).properties[key];
            if (def.type === 'string') {
                const whereDef = payloadMapping[key];
                // get mapping from data source definition
                if (whereDef) {
                    rs[key] = commandValue(whereDef, context);
                } else if (def.default) { // can not get data source definition but have default value
                    rs[key] = def.default;
                }
            } else if (def.type === 'array') {
                const subDef = (<ArraySchemaDef>def).items as SchemaDef;
                if (subDef && subDef.type === 'string') {
                    const whereDef = payloadMapping[key];
                    // get mapping from data source definition
                    if (whereDef) {
                        rs[key] = commandValue(whereDef, context);
                    } else if (def.default) { // can not get data source definition but have default value
                        rs[key] = def.default;
                    }
                }
            }

        });
        return rs;
    }

    translateSentence(input: string, params?: {[key: string]: any} | string, context?: any, formValueObject?: any): Sentence {
        const val = new Sentence(this.injector, input, params, context, formValueObject);
        return val;
    }
}

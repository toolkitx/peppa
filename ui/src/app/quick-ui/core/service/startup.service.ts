import { Inject, Injectable } from '@angular/core';
import { JsonLoaderService } from './json-loader.service';
import { CacheService } from '../cache/cache.service';
import {
    CONSTANT_COMMANDS_CONFIGURATION, CONSTANT_GLOBAL_CONFIGURATION, CONSTANT_I18N_CONFIGURATION, CONSTANT_UI_CONFIGURATION
} from '../global';
import { forkJoin, of } from 'rxjs';
import { CommandService } from './command.service';
import { switchMap } from 'rxjs/operators';
import { NZ_I18N, NzI18nInterface } from 'ng-zorro-antd';

export function StartupServiceFactory(startupService: StartupService) {
    return () => startupService.load();
}

@Injectable()
export class StartupService {

    constructor(private jsonLoader: JsonLoaderService,
                private cacheService: CacheService,
                private commandService: CommandService,
                @Inject(NZ_I18N) private i18n: NzI18nInterface) {
    }

    load(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.loadGlobalConfig().subscribe((gc: any) => {
                this.cacheService.set(CONSTANT_GLOBAL_CONFIGURATION, gc);
                const resources = [CONSTANT_UI_CONFIGURATION, CONSTANT_COMMANDS_CONFIGURATION, CONSTANT_I18N_CONFIGURATION];
                const obs = [this.loadUiConfiguration(), this.loadPublicCommands(), this.loadI18nConfig()];
                forkJoin(obs).subscribe((results: any[]) => {
                    resources.map((res: string, i: number) => {
                        this.cacheService.set(res, results[i]);
                    });
                    resolve();
                }, (err) => {
                    reject(err);
                });
            });
        });
    }


    private loadUiConfiguration() {
        return this.jsonLoader.get(CONSTANT_UI_CONFIGURATION)
            .pipe(switchMap((data: {output: {moduleInfo: {moduleName: string; uiDefinition: any}[]}}) => {
                return of(data.output.moduleInfo[0].uiDefinition);
            }));
    }

    private loadPublicCommands() {
        return this.jsonLoader.get(CONSTANT_COMMANDS_CONFIGURATION)
            .pipe(switchMap((data: {output: {commandInfo: {commandName: string; commandDefinition: any}[]}}) => {
                const rs = [];
                data.output.commandInfo.map(x => rs.push(x.commandDefinition));
                return of(rs);
            }));
    }

    private loadGlobalConfig() {
        return this.jsonLoader.get(CONSTANT_GLOBAL_CONFIGURATION);
    }

    private loadI18nConfig() {
        const url = CONSTANT_I18N_CONFIGURATION.replace('{lang}', this.i18n.locale);
        return this.jsonLoader.get(url);
    }
}

import { Injectable } from '@angular/core';
import { NativeService } from './native.service';
import { ElectronService } from './electron.service';
import { CommandDef, ServiceConfiguration, ServiceDef, UIConfiguration } from '../modals/ui-configuration';
import { NativeMessage } from '../modals/native-message';
import { filter, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

const PeppaProjectFile = 'peppa.json';
const UIConfigurationFile = 'ui.json';

@Injectable({
    providedIn: 'root'
})
export class PeppaService {
    private message$ = new BehaviorSubject<NativeMessage>(null);

    constructor(private nativeService: NativeService, private electron: ElectronService) {
    }

    dispatchMessage(msg: NativeMessage) {
        this.message$.next(msg);
    }

    subscribeMessageByType(channel: string): Observable<any> {
        return this.message$.pipe(filter(x => x && x.channel === channel), map(x => x.payload));
    }

    sendNativeMessage(msg: NativeMessage) {
        this.electron.ipcRenderer.send('message-from-render', msg);
    }

    async generateCommandProject(dir: string, settings: ServiceConfiguration) {
        if (!settings.services) {
            return;
        }
        await this.nativeService.emptyDirectory(dir, /ui\.json$/);
        await Promise.all(settings.services.map(async (svc: ServiceDef) => {
            const serviceFolder = `${dir}/${svc.name}`;
            await this.nativeService.createFolder(serviceFolder);
            svc.commands.map(async (cmd: CommandDef) => {
                const jsonPath = `${serviceFolder}/${cmd.name}.json`;
                await this.nativeService.saveJson(jsonPath, cmd);
            });
        }));
        const projectFile = this.getProjectFile(dir);
        delete settings.services;
        await this.nativeService.saveJson(projectFile, settings);
    }

    async openCommandProject(dir: string) {
        const projectFile = this.getProjectFile(dir);
        const isPeppaProject = await this.nativeService.isFileExists(projectFile);
        if (!isPeppaProject) {
            throw new Error('This is not a Peppa project.');
        }
        const svcConfig: ServiceConfiguration = await this.nativeService.readJson(projectFile);
        svcConfig.services = [];
        const serviceNames = await this.nativeService.getDirectories(dir);
        await Promise.all(serviceNames.map(async (svcName: string) => {
            const svcPath = this.electron.path.join(dir, svcName);
            const jsonFiles = await this.nativeService.getFiles(svcPath);
            const serviceDef = <ServiceDef> {
                name: svcName,
                commands: []
            };
            await Promise.all(jsonFiles.map(async (cmdFile: string) => {
                const cmdPath = this.electron.path.join(svcPath, cmdFile);
                const cmd = await this.nativeService.readJson(cmdPath);
                serviceDef.commands.push(cmd);
            }));
            svcConfig.services.push(serviceDef);
        }));
        return svcConfig;
    }

    async openUIProject(dir: string, file?: string) {
        const uiFile = this.getUIConfigurationFilePath(dir, file);
        const isUIExist = await this.nativeService.isFileExists(uiFile);
        if (!isUIExist) {
            throw new Error('UIConfigurationNotExist');
        }
        const svcConfig = await this.openCommandProject(dir);
        const uiConfig = await this.nativeService.readJson(this.getUIConfigurationFilePath(dir, file));
        return {command: svcConfig, ui: uiConfig};
    }

    async getAllCommands(moduleDir: string) {
        const parentDir = this.electron.path.join(moduleDir, '..');
        const modules: string[] = await this.nativeService.getDirectories(parentDir);
        if (!modules) {
            return <CommandDef[]> [];
        }
        const rs: CommandDef[] = [];
        await Promise.all(modules.map(async (moduleFolderName: string) => {
            const mdir = this.electron.path.join(moduleDir, '..', moduleFolderName);
            const svcConfig = await this.openCommandProject(mdir);
            if (svcConfig) {
                svcConfig.services.map((svc) => {
                    svc.commands.map(c => {
                        rs.push(c);
                    });
                });
            }
        }));
        return rs;
    }

    getProjectFile(dir: string) {
        return this.electron.path.join(dir, PeppaProjectFile);
    }

    getUIConfigurationFilePath(dir: string, file = UIConfigurationFile) {
        return this.electron.path.join(dir, file);
    }

    async isUIConfigurationExists(dir: string, file = UIConfigurationFile) {
        return await this.nativeService.isFileExists(this.getUIConfigurationFilePath(dir, file));
    }
}

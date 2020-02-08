import { Component, OnInit } from '@angular/core';
import { EditorStateService } from '../../providers/editor-state.service';
import { CacheService } from '../../cache/cache.service';
import { NzContextMenuService, NzDropdownMenuComponent, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ElectronService } from '../../providers/electron.service';
import { PeppaService } from '../../providers/peppa.service';
import { NativeService } from '../../providers/native.service';
import { PeppaSettings } from '../../modals/peppa-settings';
import { CONST_PEPPA_SETTINGS_KEY } from '../../constants';
import { CommandDef, SchemaDef, ServiceConfiguration, ServiceDef } from '../../modals/ui-configuration';
import _ from 'lodash';
import { CreateCommandModalComponent } from './create-command-modal/create-command-modal.component';
import { DuplicateCommandModalComponent } from './duplicate-command-modal/duplicate-command-modal.component';
import { CreateServiceModalComponent } from './create-service-modal/create-service-modal.component';

@Component({
    selector: 'app-command-editor2',
    templateUrl: './command-editor2.component.html',
    styleUrls: ['./command-editor2.component.less']
})
export class CommandEditor2Component implements OnInit {
    data: ServiceConfiguration;
    currentCommandDef: CommandDef;
    currentCommandDefCopy: CommandDef;
    currentServiceName: string;
    menuTargetService: ServiceDef;
    menuTargetCommand: CommandDef;

    private featureList: string[] = [];
    private defaultFeature: string;

    constructor(private editorService: EditorStateService,
                private cacheService: CacheService,
                private nzDropdownService: NzContextMenuService,
                private electronService: ElectronService,
                private peppaService: PeppaService,
                private nativeService: NativeService,
                private message: NzMessageService,
                private nzContextMenuService: NzContextMenuService,
                private modalService: NzModalService) {
    }

    get currentDirectory() {
        return this.editorService.currentDirectory;
    }

    ngOnInit() {
        this.editorService.clearClipboard();
        const peppaSettings = this.cacheService.get<PeppaSettings>(CONST_PEPPA_SETTINGS_KEY);
        if (peppaSettings) {
            this.defaultFeature = peppaSettings.feature.default;
            this.featureList = peppaSettings.feature.available;
        }
        this.data = this.editorService.getData<ServiceConfiguration>();
        if (this.data) {
            this.initFeatureList();
        }
    }

    selectCommand(cmd: CommandDef, svcName: string) {
        this.currentCommandDef = cmd ? _.cloneDeep(cmd) : cmd;
        this.currentCommandDefCopy = cmd ? _.cloneDeep(this.currentCommandDef) : cmd;
        this.currentServiceName = svcName;
    }

    serviceMenu($event: MouseEvent, menu: NzDropdownMenuComponent, svc: ServiceDef): void {
        this.nzContextMenuService.create($event, menu);
        this.menuTargetService = svc;
    }

    commandMenu($event: MouseEvent, menu: NzDropdownMenuComponent, cmd: CommandDef, svc: ServiceDef): void {
        this.nzContextMenuService.create($event, menu);
        this.menuTargetCommand = cmd;
        this.menuTargetService = svc;
    }

    // changes from schema editor, update code editor
    schemaChange(prop: string, data: SchemaDef) {
        this.currentCommandDefCopy[prop] = data;
        this.currentCommandDefCopy = _.cloneDeep(this.currentCommandDefCopy);
        const svc = this.data.services.find(x => x.name === this.currentServiceName);
        if (svc) {
            const cmd = svc.commands.find(x => x.name === this.currentCommandDef.name);
            if (cmd) {
                cmd[prop] = data;
            }
        }
    }

    // changes from code editor, update schema editor
    editorValueChange(data: CommandDef) {
        this.selectCommand(data, this.currentServiceName);
    }

    actionNewService() {
        const model = this.modalService.create({
            nzTitle: 'New Service',
            nzContent: CreateServiceModalComponent,
            nzComponentParams: {
                nameValidator: (obj) => {
                    return this.isServiceNameValid(obj);
                }
            },
            nzMaskClosable: false,
            nzClosable: false,
            nzFooter: [
                {
                    label: 'Create',
                    shape: 'primary',
                    disabled: (componentInstance: CreateServiceModalComponent) => {
                        return !componentInstance.isValid;
                    },
                    onClick: (componentInstance: CreateServiceModalComponent) => {
                        const svc: ServiceDef = componentInstance.value;
                        this.data.services.push(svc);
                        model.close();
                    }
                },
                {
                    label: 'Cancel',
                    shape: 'default',
                    onClick: () => {
                        model.close();
                    }
                }
            ]
        });
    }

    async generateProject() {
        const path = await this.nativeService.openFileDialog('Select directory to generate', [], 'openDirectory');
        if (!path) {
            return;
        }
        const id = this.message.loading('Generating...', {nzDuration: 0}).messageId;
        try {
            await this.peppaService.generateCommandProject(<string> path, this.getServiceConfig());
            this.message.success('Generated successfully.');
        } catch (e) {
            this.message.error('Fail to generate project. ' + e.message);
        }
        this.message.remove(id);
    }

    // async saveAs() {
    //     const path = await this.nativeService.showSaveDialog('Save as JSON...');
    //     if (path) {
    //         try {
    //             const id = this.message.loading('Saving...', {nzDuration: 0}).messageId;
    //             const content = this.getServiceConfig();
    //             await this.nativeService.saveJson(<string> path, content);
    //             this.message.remove(id);
    //             this.message.success('Saved successfully.');
    //         } catch (e) {
    //             this.message.error('Fail to save JSON. ' + e.message);
    //         }
    //     }
    // }

    async saveAsMock() {
        const path = await this.nativeService.showSaveDialog('Save as command.json...');
        if (path) {
            try {
                const id = this.message.loading('Saving...', {nzDuration: 0}).messageId;
                const content = this.getServiceConfig();
                const commandDefs: {commandName: string; commandDefinition: any;}[] = [];
                content.services.map((svc) => {
                    svc.commands.filter(cmd => cmd.type === 'Public').map((cmd) => {
                        commandDefs.push({commandName: cmd.name, commandDefinition: cmd});
                    });
                });
                await this.nativeService.saveJson(<string> path, {state: 'Completed', output: {commandInfo: commandDefs}});
                this.message.remove(id);
                this.message.success('Saved successfully.');
            } catch (e) {
                this.message.error('Fail to save JSON. ' + e.message);
            }
        }
    }

    private getServiceConfig() {
        return _.cloneDeep(this.data);
    }

    menuNewCommand() {
        const model = this.modalService.create({
            nzTitle: 'Create Command',
            nzContent: CreateCommandModalComponent,
            nzComponentParams: {
                moduleName: this.data.module.name,
                featureList: this.featureList,
                defaultFeature: this.defaultFeature,
                nameValidator: (obj) => {
                    return this.isCommandMameValidator(obj);
                }
            },
            nzMaskClosable: false,
            nzClosable: false,
            nzFooter: [
                {
                    label: 'Create',
                    shape: 'primary',
                    disabled: (componentInstance: CreateCommandModalComponent) => {
                        return !componentInstance.isValid;
                    },
                    onClick: (componentInstance: CreateCommandModalComponent) => {
                        const cmd = componentInstance.value;
                        this.menuTargetService.commands.push(cmd);
                        model.close();
                    }
                },
                {
                    label: 'Cancel',
                    shape: 'default',
                    onClick: () => {
                        model.close();
                    }
                }
            ]
        });
    }

    menuRemoveService() {
        this.modalService.confirm({
            nzTitle: 'Confirm',
            nzContent: `Are you sure to remove service [${this.menuTargetService.name}]?`,
            nzOkText: 'Yes',
            nzOkType: 'danger',
            nzOnOk: () => {
                const i = this.data.services.findIndex(x => x.name === this.menuTargetService.name);
                if (i > -1) {
                    this.data.services.splice(i, 1);
                }
                if (this.menuTargetService.name === this.currentServiceName) {
                    this.selectCommand(null, null);
                }
            },
            nzCancelText: 'No'
        });
    }

    menuEditCommand() {
        const model = this.modalService.create({
            nzTitle: `Edit Command [${this.menuTargetCommand.name}]`,
            nzContent: CreateCommandModalComponent,
            nzComponentParams: {
                data: this.menuTargetCommand,
                moduleName: this.data.module.name,
                featureList: this.featureList,
                defaultFeature: this.defaultFeature,
                nameValidator: (obj) => {
                    return this.isCommandMameValidator(obj);
                }
            },
            nzMaskClosable: false,
            nzClosable: false,
            nzFooter: [
                {
                    label: 'Save',
                    shape: 'primary',
                    onClick: (componentInstance: CreateCommandModalComponent) => {
                        const cmd = componentInstance.value;
                        const i = this.menuTargetService.commands.findIndex(x => x.name === this.menuTargetCommand.name);
                        if (i > -1) {
                            this.menuTargetService.commands[i] = cmd;
                            if (this.currentCommandDef && this.menuTargetCommand.name === this.currentCommandDef.name) {
                                this.selectCommand(cmd, this.currentServiceName);
                            }
                        }
                        model.close();
                    }
                },
                {
                    label: 'Cancel',
                    shape: 'default',
                    onClick: () => {
                        model.close();
                    }
                }
            ]
        });
    }

    menuDuplicateCommand() {
        const model = this.modalService.create({
            nzTitle: 'Duplicate Command',
            nzContent: DuplicateCommandModalComponent,
            nzComponentParams: {
                data: this.menuTargetCommand,
                moduleName: this.data.module.name,
                nameValidator: (obj) => {
                    return this.isCommandMameValidator(obj);
                }
            },
            nzMaskClosable: false,
            nzClosable: false,
            nzFooter: [
                {
                    label: 'Duplicate',
                    shape: 'primary',
                    disabled: (componentInstance: DuplicateCommandModalComponent) => {
                        return !componentInstance.isValid;
                    },
                    onClick: (componentInstance: DuplicateCommandModalComponent) => {
                        const cmd = componentInstance.value;
                        this.menuTargetService.commands.push(cmd);
                        model.close();
                    }
                },
                {
                    label: 'Cancel',
                    shape: 'default',
                    onClick: () => {
                        model.close();
                    }
                }
            ]
        });
    }

    menuRemoveCommand() {
        this.modalService.confirm({
            nzTitle: 'Confirm',
            nzContent: `Are you sure to remove command [${this.menuTargetCommand.name}]?`,
            nzOkText: 'Yes',
            nzOkType: 'danger',
            nzOnOk: () => {
                const i = this.menuTargetService.commands.findIndex(x => x.name === this.menuTargetCommand.name);
                if (i > -1) {
                    this.menuTargetService.commands.splice(i, 1);
                }
                if (this.currentCommandDef && this.menuTargetCommand.name === this.currentCommandDef.name) {
                    this.selectCommand(null, null);
                }
            },
            nzCancelText: 'No'
        });
    }

    private initFeatureList() {
        this.data.services.map((svc) => {
            svc.commands.map((cmd) => {
                if (!cmd.feature) {
                    cmd.feature = this.defaultFeature;
                }
            });
        });
    }

    private isCommandMameValidator({name, fullName}) {
        const reg = new RegExp(/^[A-Z][A-Za-z0-9]+$/, 'g');
        if (name && reg.test(name)) {
            let rs = true;
            this.data.services.map((s) => {
                if (s.commands.some(x => x.name === fullName)) {
                    rs = false;
                    return;
                }
            });
            return rs;
        }
        return false;
    }

    private isServiceNameValid(name: string) {
        const reg = new RegExp(/^[A-Z][A-Za-z0-9]+$/, 'g');
        if (name && reg.test(name)) {
            return !this.data.services.some(x => x.name === name);
        }
        return false;
    }

}

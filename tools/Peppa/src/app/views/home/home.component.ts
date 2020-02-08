import { Component, NgZone, OnInit, TemplateRef } from '@angular/core';
import { PeppaProject, ServiceConfiguration, UIConfiguration } from '../../modals/ui-configuration';
import { EditorStateService } from '../../providers/editor-state.service';
import { Router } from '@angular/router';
import { NativeService } from '../../providers/native.service';
import { PeppaService } from '../../providers/peppa.service';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { CacheService } from '../../cache/cache.service';
import { CONST_COMMAND_DEF_CACHE_KEY } from '../../constants';
import { UiConfigSelectModalComponent } from './ui-config-select-modal/ui-config-select-modal.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
    newModuleName: string;
    tplModal: NzModalRef;

    openingCommandProject = false;

    constructor(private nativeService: NativeService,
                private editState: EditorStateService,
                private messageService: NzMessageService,
                private peppaService: PeppaService,
                private cacheService: CacheService,
                private router: Router,
                private ngZone: NgZone,
                private modalService: NzModalService) {
    }

    ngOnInit() {
    }

    async openCommandProjectDialog() {
        const path = await this.nativeService.openFileDialog('Open Command Project', [], 'openDirectory');
        if (path) {
            try {
                const json = await this.peppaService.openCommandProject(<string> path);
                this.editState.currentDirectory = <string> path;
                this.openCallback(<PeppaProject> json);
            } catch ({message}) {
                this.messageService.error(message);
            }
        }
    }

    openCallback(data: PeppaProject) {
        if (this.isValidPeppaProject(data)) {
            this.editState.setData(data);
            this.goTo(data.type);
        } else {
            throw new Error('This project file is broken.');
        }
    }

    async openUIProjectDialog() {
        const path = await this.nativeService.openFileDialog('Open module UI', [], 'openDirectory');
        const selectedPath = <string> path;
        if (selectedPath) {
            await this.getUiConfigurationFiles(selectedPath);
        }
    }

    async getUiConfigurationFiles(dir: string) {
        const files = await this.nativeService.getFiles(dir, '.json');
        const uiFiles = files.filter(f => /ui\.json$/.test(f));
        if (uiFiles.length === 1) {
            await this.openSelectedUIProject(dir, uiFiles[0]);
        } else if (uiFiles.length > 1) {
            const modal = this.modalService.create({
                nzTitle: 'Select ui configuration',
                nzMaskClosable: false,
                nzContent: UiConfigSelectModalComponent,
                nzComponentParams: {
                    files: uiFiles
                },
                nzFooter: [
                    {
                        label: 'Ok',
                        type: 'primary',
                        onClick: async (comp: UiConfigSelectModalComponent) => {
                            const val = comp.value;
                            modal.close();
                            if (val) {
                                await this.openSelectedUIProject(dir, val);
                            }
                        }
                    },
                    {
                        label: 'Cancel',
                        onClick: () => {
                            modal.close();
                        }
                    }
                ]
            });
        }
    }

    private async openSelectedUIProject(selectedPath: string, file: string) {
        try {
            const {command, ui} = await this.peppaService.openUIProject(selectedPath, file);
            if (this.isValidPeppaProject(command) && this.isValidPeppaProject(ui)) {
                this.editState.currentDirectory = selectedPath;
                await this.setupDataForUiEditor(<ServiceConfiguration> command, <UIConfiguration> ui, selectedPath, file);
            } else {
                throw new Error('This project file is broken.');
            }
        } catch ({message}) {
            if (message === 'UIConfigurationNotExist') {
                this.modalService.confirm({
                    nzTitle: 'UI is not initialized',
                    nzContent: 'Do you want to init UI for this module?',
                    nzOnOk: async () => {
                        await this.newUiProject(selectedPath);
                    }
                });
            } else {
                this.messageService.error(message);
            }
        }
    }

    private isValidPeppaProject(data: PeppaProject) {
        const keys = Object.keys(data);
        return keys.includes('type') && keys.includes('studio') && keys.includes('version');
    }

    async selectModuleForUI() {
        const path = await this.nativeService.openFileDialog('Select Module', [], 'openDirectory');
        const selectedPath = <string> path;
        if (selectedPath) {
            try {
                const isExists = await this.peppaService.isUIConfigurationExists(selectedPath);
                if (isExists) {
                    throw new Error('UI has been initialized.');
                }
                await this.newUiProject(selectedPath);
            } catch ({message}) {
                this.messageService.error(message);
                this.destroyTplDialog();
            }
        }
    }


    showDialog(title: string, tpl: TemplateRef<{}>, footTpl: TemplateRef<{}>) {
        this.tplModal = this.modalService.create({
            nzTitle: title,
            nzContent: tpl,
            nzFooter: footTpl,
            nzMaskClosable: false,
            nzClosable: true,
        });
    }

    destroyTplDialog() {
        if (this.tplModal) {
            setTimeout(() => {
                this.tplModal.destroy();
            }, 100);
        }
    }

    newProject(type = 'Command') {
        const data = <PeppaProject> {
            type,
            module: {name: this.newModuleName},
            studio: {version: '0'},
            version: '0',
        };
        (<ServiceConfiguration> data).services = [];
        this.newModuleName = '';
        this.editState.setData(data);
        this.goTo(type);
        this.destroyTplDialog();
    }

    async newUiProject(modulePath: string) {
        const serviceConfiguration = await this.peppaService.openCommandProject(modulePath);
        if (!this.isValidPeppaProject(serviceConfiguration)) {
            throw new Error('This project file is broken.');
        }
        this.editState.currentDirectory = modulePath;
        const data = <UIConfiguration> {
            type: 'Ui',
            module: serviceConfiguration.module,
            studio: serviceConfiguration.studio,
            version: serviceConfiguration.version,
            application: {
                type: 'Module',
                name: serviceConfiguration.module.name,
                nav: null,
                sidebar: null,
                views: []
            }
        };
        await this.setupDataForUiEditor(serviceConfiguration, data, modulePath);
        this.destroyTplDialog();
    }

    async setupDataForUiEditor(serviceConfiguration: ServiceConfiguration, data: UIConfiguration, modulePath: string, fileName?: string) {
        const publicCommands = [];
        const allCommands = await this.peppaService.getAllCommands(modulePath);
        allCommands.map((x) => {
            if (x.type === 'Public') {
                publicCommands.push(x);
            }
        });
        this.cacheService.set(CONST_COMMAND_DEF_CACHE_KEY, publicCommands);
        this.editState.setData(data);
        this.editState.openedFile = fileName;
        this.goTo('Ui');
    }

    checkFirstChar() {
        if (!this.newModuleName) {
            return;
        }
        const reg = /^[A-Z].*$/g;
        if (reg.test(this.newModuleName)) {
            return;
        }
        this.newModuleName = this.newModuleName.charAt(0).toUpperCase() + this.newModuleName.slice(1);
    }

    isModuleNameValid(name: string) {
        const reg = /^[A-Z][a-z0-9]+$/g;
        return name && reg.test(name);
    }

    private goTo(type: string) {
        const route = [type === 'Command' ? 'command-editor2' : 'ui-editor'];
        this.ngZone.run(() => this.router.navigate(route).then());
    }

}

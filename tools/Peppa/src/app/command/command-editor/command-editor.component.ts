import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EditorStateService } from '../../providers/editor-state.service';
import { CommandDef, CommandSecurityRoles, SchemaDef, ServiceConfiguration, ServiceDef } from '../../modals/ui-configuration';
import {
    NzContextMenuService, NzDropdownMenuComponent, NzFormatEmitEvent, NzMessageService, NzModalRef, NzModalService, NzTreeComponent,
    NzTreeNode, NzTreeNodeOptions
} from 'ng-zorro-antd';
import { Command } from '@angular/cli/models/command';
import { ElectronService } from '../../providers/electron.service';
import { NativeService } from '../../providers/native.service';
import { PeppaService } from '../../providers/peppa.service';
import { CacheService } from '../../cache/cache.service';
import { CONST_PEPPA_SETTINGS_KEY } from '../../constants';
import { PeppaSettings } from '../../modals/peppa-settings';

@Component({
    selector: 'app-command-editor',
    templateUrl: './command-editor.component.html',
    styleUrls: ['./command-editor.component.less']
})
export class CommandEditorComponent implements OnInit {
    @ViewChild('tree', {static: true}) tree: NzTreeComponent;
    commandSecurityRoles = CommandSecurityRoles;
    newServiceName: string;
    duplicateName: string;
    data: ServiceConfiguration;
    selectedServiceName: string;
    selectedRaw: ServiceDef | CommandDef;
    selectedType: string;
    commandTree = [];
    activedTreeNode: NzTreeNode;
    contextTargetNode: NzTreeNode;
    contextTargetType: string;
    nodeKeyIndex = 0;
    tplModal: NzModalRef;
    newCommandDef: CommandDef;
    rawValue: ServiceDef[] = [];
    updatedCommandDef: CommandDef;
    searchKeyword: string;
    featureList: string[] = [];
    private defaultFeature: string;

    constructor(private editorService: EditorStateService,
                private cacheService: CacheService,
                private nzDropdownService: NzContextMenuService,
                private electronService: ElectronService,
                private peppaService: PeppaService,
                private nativeService: NativeService,
                private message: NzMessageService,
                private modalService: NzModalService) {
    }

    get currentDirectory() {
        return this.editorService.currentDirectory;
    }

    ngOnInit() {
        this.rawValue = [];
        this.editorService.clearClipboard();
        const peppaSettings = this.cacheService.get<PeppaSettings>(CONST_PEPPA_SETTINGS_KEY);
        if (peppaSettings) {
            this.defaultFeature = peppaSettings.feature.default;
            this.featureList = peppaSettings.feature.available;
        }
        this.data = this.editorService.getData<ServiceConfiguration>();
        if (this.data) {
            this.initFeatureList();
            this.convertToCommandTree();
        }
        setTimeout(() => {
            this.getValue();
        }, 300);
    }

    createDefaultCommandObject(def?: CommandDef) {
        this.newCommandDef = def ? {...def} : {
            name: null,
            type: 'Private',
            securityRole: 'GeneralUser',
            feature: this.defaultFeature,
            inputSchema: null,
            outputSchema: null
        };
    }

    contextMenu(node: NzTreeNode, $event: MouseEvent, template: NzDropdownMenuComponent): void {
        this.contextTargetNode = node;
        this.contextTargetType = node.origin.type;
        this.nzDropdownService.create($event, template);
    }

    activeNode(data: NzFormatEmitEvent): void {
        this.selectNode(data.node);
    }

    selectNode(node: NzTreeNode) {
        this.activedTreeNode = node;
        const type = node.origin.type;
        const raw = node.origin.raw;
        this.selectedType = type;
        this.selectedRaw = raw;
        this.updatedCommandDef = Object.assign({}, raw);
        if (type === 'Service') {
            this.selectedServiceName = this.activedTreeNode.title;
        }
        if (type === 'Command') {
            this.selectedServiceName = this.activedTreeNode.parentNode.title;
        }
    }

    deleteNode() {
        this.modalService.confirm({
            nzTitle: 'Confirm',
            nzContent: 'Are you sure to remove this command?',
            nzOkText: 'Yes',
            nzOkType: 'danger',
            nzOnOk: () => {
                if (this.contextTargetNode) {
                    this.contextTargetNode.remove();
                }
                this.contextTargetNode = null;
                this.getValue();
            },
            nzCancelText: 'No'
        });
    }

    newService(svc: ServiceDef) {
        const nodes = this.tree.getTreeNodes();
        if (!nodes) {
            return;
        }
        const serviceNode = this.getServiceNode(svc);
        if (svc.commands && svc.commands.length) {
            svc.commands.map((cmd: CommandDef) => {
                serviceNode.children.push(this.getCommandNode(cmd));
            });
        }
        const root = nodes[0];
        root.addChildren([serviceNode]);
        this.getValue();
    }

    newServiceByName(name: string) {
        this.newServiceName = null;
        const svc = {name, commands: []} as ServiceDef;
        this.newService(svc);
        this.destroyTplDialog();
    }

    newCommand(obj: CommandDef, serviceNode?: NzTreeNode) {
        obj.name = this.getFullCommandName(obj.name);
        serviceNode = serviceNode ? serviceNode : this.contextTargetType === 'Service'
            ? this.contextTargetNode : this.contextTargetNode.parentNode;
        const node = this.getCommandNode(obj);
        serviceNode.addChildren([node]);
        this.getValue();
        this.destroyTplDialog();
    }

    updateCommand(obj: CommandDef) {
        // update selected node
        if (this.activedTreeNode && this.activedTreeNode.origin.raw.name === obj.name) {
            this.updatedCommandDef = {...obj};
            this.applyCommand();
        } else {
            this.contextTargetNode.origin.raw = {...obj};
        }
        this.destroyTplDialog();
    }

    duplicate(name: string) {
        const raw = Object.assign({}, this.contextTargetNode.origin.raw);
        raw.name = name;
        if (this.contextTargetType === 'Command') {
            this.newCommand(raw, this.contextTargetNode.parentNode);
        }
        this.duplicateName = null;
    }

    showDialog(title: string, tpl: TemplateRef<{}>) {
        this.tplModal = this.modalService.create({
            nzTitle: title,
            nzContent: tpl,
            nzMaskClosable: false,
            nzClosable: false,
            nzFooter: null
        });
    }

    get moduleInfo(): any {
        return this.editorService.moduleInfo || {};
    }

    destroyTplDialog() {
        setTimeout(() => {
            return this.tplModal && this.tplModal.destroy();
        }, 100);
    }

    applyCommand() {
        this.activedTreeNode.origin.raw = Object.assign({}, this.updatedCommandDef);
        this.selectedRaw = this.updatedCommandDef;
        this.getValue();
    }

    schemaChange(prop: string, data: SchemaDef) {
        if (!this.updatedCommandDef) {
            this.updatedCommandDef = Object.assign({}, <CommandDef> this.selectedRaw);
        }
        this.updatedCommandDef[prop] = data;
    }

    async saveAs() {
        const path = await this.nativeService.showSaveDialog('Save as JSON...');
        if (path) {
            try {
                const id = this.message.loading('Saving...', {nzDuration: 0}).messageId;
                const content = this.getServiceConfig();
                await this.nativeService.saveJson(<string> path, content);
                this.message.remove(id);
                this.message.success('Saved successfully.');
            } catch (e) {
                this.message.error('Fail to save JSON. ' + e.message);
            }
        }
    }

    async saveAsMock() {
        const path = await this.nativeService.showSaveDialog('Save as command.json...');
        if (path) {
            try {
                const id = this.message.loading('Saving...', {nzDuration: 0}).messageId;
                const content = this.getServiceConfig();
                const commandDefs: {commandName: string; commandDefinition: any; }[] = [];
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

    switchCommandType() {
        const type = (<CommandDef> this.selectedRaw).type;
        const newType = type === 'Public' ? 'Private' : 'Public';
        this.activedTreeNode.origin.raw.type = newType;
        (<CommandDef> this.selectedRaw).type = newType;
        this.updatedCommandDef.type = newType;
        this.getValue();
    }

    isServiceNameValid(name: string) {
        const reg = /^[A-Z][A-Za-z0-9]+$/g;
        if (name && reg.test(name)) {
            return !this.rawValue.some(x => x.name === name);
        }
        return false;
    }

    isCommandNameValid(name: string) {
        const reg = /^[A-Z][A-Za-z0-9]+$/g;
        if (name && reg.test(name)) {
            let rs = true;
            name = this.getFullCommandName(name);
            this.rawValue.map((s) => {
                if (s.commands.some(x => x.name === name)) {
                    rs = false;
                    return;
                }
            });
            return rs;
        }
        return false;
    }

    getFullCommandName(name: string) {
        return `${this.moduleInfo.name}_${name}Command`;
    }

    checkFirstChar(type: 'new' | 'duplicate' | 'newService') {
        let val = type === 'new' ? this.newCommandDef.name : (type === 'duplicate' ? this.duplicateName : this.newServiceName);
        if (!val) {
            return;
        }
        const reg = /^[A-Z].*$/g;
        if (reg.test(val)) {
            return;
        }
        val = val.charAt(0).toUpperCase() + val.slice(1);
        if (type === 'new') {
            this.newCommandDef.name = val;
        } else if (type === 'duplicate') {
            this.duplicateName = val;
        } else {
            this.newServiceName = val;
        }
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

    private getServiceConfig() {
        this.getValue();
        this.data.services = this.rawValue;
        return this.data;
    }

    private convertToCommandTree() {
        const rootNode: NzTreeNodeOptions = {
            title: `${this.moduleInfo.name}`,
            selectable: false,
            expanded: true,
            key: `${this.nodeKeyIndex++}`,
            type: 'Module',
            children: []
        };
        this.data.services.map((svc: ServiceDef) => {
            const node: NzTreeNodeOptions = this.getServiceNode(svc);
            svc.commands.map((cmd: CommandDef) => {
                node.children.push(this.getCommandNode(cmd));
            });
            rootNode.children.push(node);
        });
        this.commandTree = [rootNode];
    }

    private getServiceNode(svc: ServiceDef) {
        const node: NzTreeNodeOptions = {
            title: svc.name,
            key: `${svc.name}.${this.nodeKeyIndex++}`,
            expanded: true,
            children: [],
            type: 'Service',
            raw: svc
        };
        return node;
    }

    private getCommandNode(cmd: CommandDef) {
        const node: NzTreeNodeOptions = {
            title: cmd.name,
            key: `${cmd.name}.${this.nodeKeyIndex++}`,
            isLeaf: true,
            type: 'Command',
            raw: cmd
        };
        return node;
    }

    private getValue() {
        const rs = this.getRaw();
        this.rawValue = rs;
    }

    private getRaw() {
        const nodes = this.tree.getTreeNodes();
        if (!nodes) {
            return [];
        }
        const rs: ServiceDef[] = [];
        nodes[0].children.map((svcNode: NzTreeNode) => {
            const raw = svcNode.origin.raw as ServiceDef;
            raw.commands = [];
            if (svcNode.children && svcNode.children.length) {
                svcNode.children.map((cmdNode: NzTreeNode) => {
                    raw.commands.push(cmdNode.origin.raw);
                });
            }
            rs.push(raw);
        });
        return rs;
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
}

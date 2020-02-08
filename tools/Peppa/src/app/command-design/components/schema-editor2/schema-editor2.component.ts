import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ArraySchemaDef, ObjectSchemaDef, SchemaDef } from '../../../modals/ui-configuration';
import {
    NzContextMenuService, NzDropdownMenuComponent, NzFormatBeforeDropEvent, NzFormatEmitEvent, NzMessageService, NzModalService,
    NzTreeComponent, NzTreeNode, NzTreeNodeOptions
} from 'ng-zorro-antd';
import { EditorStateService } from '../../../providers/editor-state.service';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { CreatePropertyModalComponent } from './create-property-modal/create-property-modal.component';
import { InitSchemaModalComponent } from './init-schema-modal/init-schema-modal.component';
import { RenamePropertyModalComponent } from './rename-property-modal/rename-property-modal.component';
import { DuplicatePropertyModalComponent } from './duplicate-property-modal/duplicate-property-modal.component';

@Component({
    selector: 'app-schema-editor2',
    templateUrl: './schema-editor2.component.html',
    styleUrls: ['./schema-editor2.component.less']
})
export class SchemaEditor2Component implements OnInit {
    editorState: any = {
        currentNode: null,
        currentNodeRaw: null,
        originCopy: null,
        currentValue: null, // entire tree
        tree: null,
        clipboardData: null,
        nodeIndex: 0
    };

    dropChecker = (confirm: NzFormatBeforeDropEvent): Observable<boolean> => {
        return new Observable((obs) => {
            return obs.next(true);
        });
    };

    @ViewChild('tree', {static: true}) tree: NzTreeComponent;

    @Input() set data(val: SchemaDef) {
        this.resetEditorState();
        this.editorState.originCopy = _.cloneDeep(val);
        this.editorState.currentValue = _.cloneDeep(val);
        this.initEditor();
    }

    @Output() apply = new EventEmitter<SchemaDef>();

    constructor(private nzDropdownService: NzContextMenuService,
                private modalService: NzModalService,
                private messageService: NzMessageService,
                private editorService: EditorStateService,
                private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.editorService.clipboard$.subscribe(x => {
            this.editorState.clipboardData = x;
        });
    }

    actionShowTreeContextMenu(node: NzTreeNode, $event: MouseEvent, template: NzDropdownMenuComponent): void {
        this.nzDropdownService.create($event, template);
        this.actionSelectNode(<NzFormatEmitEvent> {node}, false);
    }

    actionSelectNode(event: NzFormatEmitEvent, closeDropdown = true) {
        this.editorState.currentNode = event.node;
        this.editorState.currentNodeRaw = event.node.origin.raw;
        if (closeDropdown) {
            this.nzDropdownService.close();
        }
    }

    actionDropNode(event: NzFormatEmitEvent) {
        // console.log(event);
        this.getTreeValue();
    }

    menuCreate() {
        const model = this.modalService.create({
            nzTitle: 'Add property',
            nzContent: CreatePropertyModalComponent,
            nzComponentParams: {
                schemaDef: _.cloneDeep(this.editorState.currentNodeRaw)
            },
            nzMaskClosable: false,
            nzClosable: false,
            nzFooter: [
                {
                    label: 'Create',
                    shape: 'primary',
                    disabled: (componentInstance: CreatePropertyModalComponent) => {
                        return !componentInstance.isValid;
                    },
                    onClick: (componentInstance: CreatePropertyModalComponent) => {
                        const {def, name} = componentInstance.value;
                        const newNode = this.convertNode(def, name);
                        this.editorState.currentNode.addChildren([newNode]);
                        this.editorState.currentNode.origin.raw.properties[name] = def;
                        if (!componentInstance.addAnother) {
                            model.close();
                        } else {
                            componentInstance.appendNewKeys(name);
                        }
                        this.getTreeValue();
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

    menuRename() {
        const model = this.modalService.create({
            nzTitle: 'Rename property',
            nzContent: RenamePropertyModalComponent,
            nzComponentParams: {
                node: this.editorState.currentNode
            },
            nzMaskClosable: false,
            nzClosable: false,
            nzFooter: [
                {
                    label: 'Rename',
                    shape: 'primary',
                    disabled: (componentInstance: RenamePropertyModalComponent) => {
                        return !componentInstance.isValid;
                    },
                    onClick: (componentInstance: RenamePropertyModalComponent) => {
                        const newName = componentInstance.value;
                        const oldName = this.editorState.currentNode.title;
                        if (oldName === newName) {
                            return;
                        }
                        this.updateRequired(this.editorState.currentNode.parentNode.origin.raw as ObjectSchemaDef, newName, oldName);
                        const props = this.editorState.currentNode.parentNode.origin.raw.properties;
                        Object.defineProperty(props, newName, Object.getOwnPropertyDescriptor(props, oldName));
                        delete props[oldName];
                        this.editorState.currentNode.title = newName;
                        this.getTreeValue();
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

    menuDuplicate() {
        const model = this.modalService.create({
            nzTitle: 'Duplicate property',
            nzContent: DuplicatePropertyModalComponent,
            nzComponentParams: {
                node: this.editorState.currentNode
            },
            nzMaskClosable: false,
            nzClosable: false,
            nzFooter: [
                {
                    label: 'Duplicate',
                    shape: 'primary',
                    disabled: (componentInstance: DuplicatePropertyModalComponent) => {
                        return !componentInstance.isValid;
                    },
                    onClick: (componentInstance: DuplicatePropertyModalComponent) => {
                        const newName = componentInstance.value;
                        const newNodeRaw = _.cloneDeep(this.editorState.currentNode.origin.raw);
                        const props = this.editorState.currentNode.parentNode.origin.raw.properties;
                        const newNode = this.convertNode(newNodeRaw, newName);
                        this.editorState.currentNode.parentNode.addChildren([newNode]);
                        Object.defineProperty(props, newName, Object.getOwnPropertyDescriptor(this.editorState.currentNode.origin, 'raw'));
                        this.getTreeValue();
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

    menuDeleteProperty() {
        this.modalService.confirm({
            nzTitle: 'Confirm',
            nzContent: 'Are you sure to delete this property?',
            nzOkText: 'Yes',
            nzOkType: 'danger',
            nzOnOk: () => {
                const contextTargetNode = this.editorState.currentNode;
                const props = contextTargetNode.parentNode.origin.raw.properties;
                this.removeRequired(contextTargetNode.parentNode.origin.raw as ObjectSchemaDef, contextTargetNode.title);
                delete props[contextTargetNode.title];
                if (contextTargetNode) {
                    contextTargetNode.remove();
                }
                this.getTreeValue();
            },
            nzCancelText: 'No'
        });
    }

    menuDeleteSchema() {
        this.modalService.confirm({
            nzTitle: 'Confirm',
            nzContent: 'Are you sure to delete this schema?',
            nzOkText: 'Yes',
            nzOkType: 'danger',
            nzOnOk: () => {
                this.resetEditorState();
                this.cdr.markForCheck();
                this.getTreeValue();
            },
            nzCancelText: 'No'
        });
    }

    menuCopySchema() {
        const contextTargetNode = this.editorState.currentNode;
        const newNodeRaw = {name: contextTargetNode.origin.title, raw: _.cloneDeep(contextTargetNode.origin.raw)};
        const data = newNodeRaw;
        this.editorService.setClipboard(data);
    }

    menuPasteSchema(fromInit?: boolean) {
        const data: {name: string; raw: any} = this.editorService.getClipboard();
        const contextTargetNode: NzTreeNode = this.editorState.currentNode;
        const targetNodeRaw = fromInit ? null : contextTargetNode.origin.raw;
        if (fromInit || contextTargetNode && contextTargetNode.level === 0) {
            this.data = data.raw;
            this.editorService.clearClipboard();
            this.getTreeValue();
        } else  if (targetNodeRaw.type === 'object') {
            const existProps = Object.keys(contextTargetNode.origin.raw.properties);
            if (!existProps.includes(data.name)) {
                const newNode = this.convertNode(data.raw, data.name);
                contextTargetNode.addChildren([newNode]);
                contextTargetNode.origin.raw.properties[data.name] = data.raw;
                this.editorService.clearClipboard();
                this.getTreeValue();
            } else {
                this.messageService.error(`Property [${data.name}] exists.`);
            }
        } else if (targetNodeRaw.type === 'array' && data.name === 'items') {
            contextTargetNode.clearChildren();
            contextTargetNode.addChildren([this.convertNode(data.raw as any, 'items')]);
            this.editorService.clearClipboard();
            this.getTreeValue();
        } else {
            this.messageService.error('You can\'t paste it here.');
        }
    }

    actionInitSchema() {
        const model = this.modalService.create({
            nzTitle: 'Init Schema',
            nzContent: InitSchemaModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzFooter: [
                {
                    label: 'Init',
                    shape: 'primary',
                    onClick: (componentInstance: InitSchemaModalComponent) => {
                        const def = componentInstance.value;
                        this.data = def;
                        model.close();
                        this.getTreeValue();
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

    eventItemChanged(val: SchemaDef) {
        this.updateNode(val, this.editorState.currentNode);
        this.getTreeValue();
    }

    private updateNode(newRaw: SchemaDef, node: NzTreeNode) {
        const item = this.tree.getTreeNodeByKey(node.key);
        item.origin.raw = newRaw;
    }

    private resetEditorState() {
        this.editorState = {tree: null, nodeIndex: 0, clipboardData: this.editorService.getClipboard()};
    }

    private initEditor() {
        if (this.editorState.currentValue) {
            this.convertDataToTree();
        } else {
            this.editorState.tree = null;
        }
    }

    private convertDataToTree() {
        this.editorState.tree = [this.convertNode(this.editorState.currentValue)];
    }

    private convertNode(def: SchemaDef, nodeName = '#') {
        const nodeKey = `${this.editorState.nodeIndex++}`;
        const nodeTitle = `${nodeName}`;
        let rs: NzTreeNodeOptions;
        if (def.type === 'object') {
            const objDef = def as ObjectSchemaDef;
            const objNode: NzTreeNodeOptions = {
                title: nodeTitle,
                key: nodeKey
            };
            if (objDef.properties) {
                objNode.expanded = true;
                objNode.children = [];
                const keys = Object.keys(objDef.properties);
                keys.map((key: string) => {
                    const raw = objDef.properties[key];
                    objNode.children.push(this.convertNode(raw, key));
                });
            }
            rs = objNode;
        } else if (def.type === 'array') {
            const arrDef = def as ArraySchemaDef;
            const arrNode: NzTreeNodeOptions = {
                title: nodeTitle,
                key: nodeKey,
                isLeaf: false,
                expanded: true,
                children: []
            };
            arrNode.children.push(this.convertNode(arrDef.items as SchemaDef, 'items'));
            rs = arrNode;
        } else {
            const node: NzTreeNodeOptions = {
                title: nodeTitle,
                key: nodeKey,
                isLeaf: true
            };
            rs = node;
        }
        rs.raw = def;
        return rs;
    }

    private getTreeValue() {
        let rawValue;
        const nodes = this.editorState.tree ? this.tree.getTreeNodes() : null;
        if (nodes && nodes.length) {
            const node = nodes[0];
            const def = this.getSingleRaw(node);
            if (node.children && node.children.length) {
                this.getRaw(node.children, def);
            }
            rawValue = def;
        } else {
            rawValue = null;
        }
        this.editorState.currentValue = rawValue;
        this.apply.emit(rawValue);
    }

    private getRaw(nodes: NzTreeNode[], parent?: SchemaDef) {
        nodes.map((node: NzTreeNode) => {
            const raw = this.getSingleRaw(node);
            if (node.children && node.children.length) {
                this.getRaw(node.children, raw);
            }
            if (parent.type === 'object') {
                parent.properties[node.title] = raw;
            } else if (parent.type === 'array') {
                parent[node.title] = raw;
            } else {
                parent[node.title] = raw;
            }
        });
    }

    private getSingleRaw(node: NzTreeNode) {
        const def = node.origin.raw as SchemaDef;
        let subProp: string;
        if (def.type === 'object') {
            subProp = 'properties';
        } else if (def.type === 'array') {
            subProp = 'items';
        }
        if (subProp) {
            def[subProp] = {};
        }
        return def;
    }

    private removeRequired(raw: ObjectSchemaDef, key: string) {
        if (raw.required) {
            raw.required = raw.required.filter(x => x !== key);
        }
    }

    private updateRequired(raw: ObjectSchemaDef, key: string, oldKey: string) {
        if (raw.required && raw.required.includes(oldKey)) {
            this.removeRequired(raw, oldKey);
            raw.required.push(key);
        }
    }
}

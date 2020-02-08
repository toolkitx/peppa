import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ArraySchemaDef, ObjectSchemaDef, SchemaDef } from '../../modals/ui-configuration';
import {
    NzContextMenuService, NzDropdownMenuComponent, NzFormatEmitEvent, NzMessageService, NzModalRef, NzModalService, NzTreeComponent,
    NzTreeNode,
    NzTreeNodeOptions
} from 'ng-zorro-antd';
import { SchemaTypes } from '../custom-form/custom-form';
import { EditorStateService } from '../../providers/editor-state.service';
import _ from 'lodash';

@Component({
    selector: 'app-schema-editor',
    templateUrl: './schema-editor.component.html',
    styleUrls: ['./schema-editor.component.less']
})
export class SchemaEditorComponent implements OnInit, OnChanges {
    @Input() data: SchemaDef;
    @Output() change = new EventEmitter<SchemaDef>();
    @ViewChild('tree', {static: true}) tree: NzTreeComponent;
    newPropertyDef = {};
    duplicateName: string;
    schemaTreeOptions: NzTreeNodeOptions[];
    contextTargetNode: NzTreeNode;
    activedNode: NzTreeNode;
    activeRaw: SchemaDef;
    tplModal: NzModalRef;
    types = SchemaTypes;
    nodeIndex = 0;
    rawValue: SchemaDef;
    initType = 'string';
    initItemType = 'string';
    initTemplate = 'Custom';
    clipboardData: any;

    schemaTemplates: {name: string; template: any}[] = [
        {name: 'Custom', template: null},
        {
            name: 'Paging Input', template: {
                type: 'object',
                properties: {
                    skip: {
                        type: 'integer'
                    },
                    take: {
                        type: 'integer'
                    },
                    filter: {
                        type: 'string'
                    }
                }
            }
        },
        {
            name: 'Paging Output', template: {
                type: 'object',
                properties: {
                    total: {
                        type: 'integer'
                    },
                    results: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {}
                        }
                    }
                }
            }
        }
    ];

    constructor(private nzDropdownService: NzContextMenuService,
                private modalService: NzModalService,
                private messageService: NzMessageService,
                private editorService: EditorStateService,
                private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.editorService.clipboard$.subscribe(x => {
            this.clipboardData = x;
        });
    }

    createNewPropertyDef() {
        this.newPropertyDef = {
            type: 'string',
            name: null,
            itemType: 'string'
        };
    }

    activeNode(data: NzFormatEmitEvent): void {
        this.activedNode = data.node;
        this.activeRaw = data.node.origin.raw;
    }

    ngOnChanges() {
        this.schemaTreeOptions = null;
        this.rawValue = null;
        this.activedNode = null;
        this.activeRaw = null;
        if (this.data) {
            this.convertDataToTree(this.data);
        } else {
            // this.getValue();
        }
    }

    private convertDataToTree(data: SchemaDef) {
        this.schemaTreeOptions = [this.convertNode(data)];
        setTimeout(() => {
            this.getValue();
        }, 300);
    }

    contextMenu(node: NzTreeNode, $event: MouseEvent, template: NzDropdownMenuComponent): void {
        this.contextTargetNode = node;
        this.nzDropdownService.create($event, template);
    }

    itemChanged(newRaw: SchemaDef) {
        this.updateNode(newRaw, this.activedNode);
    }

    private convertNode(def: SchemaDef, nodeName = '#') {
        const nodeKey = `${this.nodeIndex++}`;
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

    private updateNode(newRaw: SchemaDef, node: NzTreeNode) {
        const item = this.tree.getTreeNodeByKey(node.key);
        item.origin.raw = newRaw;
        this.getValue();
    }

    removeNode() {
        this.modalService.confirm({
            nzTitle: 'Confirm',
            nzContent: 'Are you sure to remove this property?',
            nzOkText: 'Yes',
            nzOkType: 'danger',
            nzOnOk: () => {
                const props = this.contextTargetNode.parentNode.origin.raw.properties;
                this.removeRequired(this.contextTargetNode.parentNode.origin.raw as ObjectSchemaDef, this.contextTargetNode.title);
                delete props[this.contextTargetNode.title];
                if (this.contextTargetNode) {
                    this.contextTargetNode.remove();
                }
                if (this.activedNode && this.activedNode === this.contextTargetNode) {
                    this.activedNode = null;
                    this.activeRaw = null;
                }
                this.getValue();
            },
            nzCancelText: 'No'
        });
    }

    deleteSchema() {
        this.modalService.confirm({
            nzTitle: 'Confirm',
            nzContent: 'Are you sure to delete this schema?',
            nzOkText: 'Yes',
            nzOkType: 'danger',
            nzOnOk: () => {
                this.schemaTreeOptions = null;
                this.cdr.markForCheck();
                this.rawValue = null;
                this.activeRaw = null;
                this.activedNode = null;
                this.contextTargetNode = null;
                // emit value null directly
                this.change.emit(this.rawValue);
            },
            nzCancelText: 'No'
        });
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

    destroyTplDialog() {
        setTimeout(() => {
            this.tplModal.destroy();
        }, 100);
    }

    initSchema({initType, initItemType}) {
        let def: SchemaDef;
        if (this.initTemplate === 'Custom') {
            def = this.newSchemaDef(initType, initItemType);
        } else {
            def = this.schemaTemplates.find(x => x.name === this.initTemplate).template;
        }
        this.convertDataToTree(def);
        this.destroyTplDialog();
        this.initType = 'string';
        this.initItemType = 'string';
        this.initTemplate = 'Custom';
    }

    rename(newName: string) {
        const oldName = this.contextTargetNode.title;
        if (oldName === newName) {
            return;
        }
        this.updateRequired(this.contextTargetNode.parentNode.origin.raw as ObjectSchemaDef, newName, oldName);
        const props = this.contextTargetNode.parentNode.origin.raw.properties;
        Object.defineProperty(props, newName, Object.getOwnPropertyDescriptor(props, oldName));
        delete props[oldName];
        this.contextTargetNode.title = newName;
        this.getValue();
    }

    duplicate(newName: string) {
        const newNodeRaw = _.cloneDeep(this.contextTargetNode.origin.raw);
        const props = this.contextTargetNode.parentNode.origin.raw.properties;
        const newNode = this.convertNode(newNodeRaw, newName);
        this.contextTargetNode.parentNode.addChildren([newNode]);
        Object.defineProperty(props, newName, Object.getOwnPropertyDescriptor(this.contextTargetNode.origin, 'raw'));
        this.getValue();
        this.destroyTplDialog();
        this.duplicateName = '';
    }

    copyNode() {
        const newNodeRaw = {name: this.contextTargetNode.origin.title, raw: _.cloneDeep(this.contextTargetNode.origin.raw)};
        const data = newNodeRaw;
        this.editorService.setClipboard(data);
        console.log(newNodeRaw);
    }

    pasteNode() {
        const data: {name: string; raw: any} = this.editorService.getClipboard();
        const targetNodeRaw = this.contextTargetNode.origin.raw;
        console.log(targetNodeRaw);
        if (targetNodeRaw.type === 'object') {
            const existProps = Object.keys(this.contextTargetNode.origin.raw.properties);
            if (!existProps.includes(data.name)) {
                const newNode = this.convertNode(data.raw, data.name);
                this.contextTargetNode.addChildren([newNode]);
                this.contextTargetNode.origin.raw.properties[data.name] = data.raw;
                this.getValue();
                this.editorService.clearClipboard();
            } else {
                this.messageService.error(`Property [${data.name}] exists.`);
            }
        } else {
            this.messageService.error('You can\'t paste it here.');
        }
    }

    addNewProp(obj: any, addAnother = false) {
        const {type, name, itemType} = obj;
        const def: SchemaDef = this.newSchemaDef(type, itemType);
        const newNode = this.convertNode(def, name);
        this.contextTargetNode.addChildren([newNode]);
        this.contextTargetNode.origin.raw.properties[name] = def;
        this.getValue();
        if (!addAnother) {
            this.destroyTplDialog();
        } else {
            this.createNewPropertyDef();
        }
    }

    getValue() {
        const nodes = this.tree.getTreeNodes();
        if (nodes && nodes.length) {
            const node = nodes[0];
            const def = this.getSingleRaw(node);
            if (node.children && node.children.length) {
                this.getRaw(node.children, def);
            }
            this.rawValue = def;
        } else {
            this.rawValue = null;
        }

        this.change.emit(this.rawValue);
    }

    getRaw(nodes: NzTreeNode[], parent?: SchemaDef) {
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

    getSingleRaw(node: NzTreeNode) {
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

    isNewPropertyValid(name: string) {
        const reg = /^[a-z][A-Za-z0-9]+$/g;
        if (name && reg.test(name)) {
            const def = this.contextTargetNode.origin.raw as SchemaDef;
            if (def.type === 'object' && def.properties) {
                return this.isPropertyExists(name, (def as ObjectSchemaDef).properties);
            } else {
                const raw = this.contextTargetNode.parentNode.origin.raw;
                return this.isPropertyExists(name, (raw as ObjectSchemaDef).properties);
            }
        }
        return false;
    }

    private isPropertyExists(name: string, properties: any) {
        const keys = Object.keys(properties);
        return !keys.includes(name);
    }

    private newSchemaDef(type: any, itemType: any = 'string') {
        const def: SchemaDef = {type} as any;
        if (type === 'array') {
            def.items = {
                type: itemType
            };
            if (itemType === 'object') {
                def.items.properties = {
                    // p1: {type: 'string', title: 'p1'}
                };
            }
        } else if (type === 'object') {
            def.properties = {
                // p1: {type: 'string', title: 'p1'}
            };
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

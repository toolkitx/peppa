import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommandDef } from '../../../modals/ui-configuration';
import _ from 'lodash';
import { CodeEditorComponent } from '../../../components/code-editor/code-editor.component';

@Component({
    selector: 'app-command-json-editor',
    templateUrl: './command-json-editor.component.html',
    styleUrls: ['./command-json-editor.component.less']
})
export class CommandJsonEditorComponent implements OnInit {
    editorState = {
        invalid: false,
        originCopy: null,
        commandDef: null,
        currentDef: null
    };

    @Input() set data(val: CommandDef) {
        this.initEditor(val);
    }

    @Output() apply = new EventEmitter<CommandDef>();

    constructor() {
    }

    ngOnInit() {
    }

    codeEditorValChange(val: CommandDef) {
        this.editorState.invalid = !val;
        this.editorState.currentDef = val;
    }

    initEditor(def: CommandDef) {
        this.editorState.commandDef = _.cloneDeep(def);
        this.editorState.currentDef = _.cloneDeep(def);
        this.editorState.originCopy = _.cloneDeep(def);
    }

    actionReformat() {
        this.editorState.commandDef = _.cloneDeep(this.editorState.currentDef);
    }

    actionUndo(comp: CodeEditorComponent) {
        const mgr = comp.editor.getSession().getUndoManager();
        if (mgr.hasUndo()) {
            mgr.undo();
        }
    }

    actionRedo(comp: CodeEditorComponent) {
        const mgr = comp.editor.getSession().getUndoManager();
        if (mgr.hasRedo()) {
            mgr.redo();
        }
    }

    actionRestore() {
        this.initEditor(this.editorState.originCopy);
    }

    actionApply() {
        this.apply.emit(this.editorState.currentDef);
    }

}

import {
    AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Injector, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { CustomDefControl } from '../../ui-design/form/custom-def-control';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

declare const ace: any;

@Component({
    selector: 'app-code-editor',
    templateUrl: './code-editor.component.html',
    styleUrls: ['./code-editor.component.less'],
    exportAs: 'codeEditor',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CodeEditorComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => CodeEditorComponent),
        multi: true
    }]
})
export class CodeEditorComponent
    extends CustomDefControl<{[key: string]: string} | {[key: string]: string}[]> implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('editorContainer', {static: true}) editorContainer: ElementRef;
    @Output() change = new EventEmitter<string>();
    editorInstance: any;

    get editor() {
        return this.editorInstance;
    }

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
    }

    writeValue(obj: any): void {
        let value: any;
        if (obj) {
            value = JSON.stringify(obj, null, '\t');
        }
        super.writeValue(value);
        if (this.editorInstance) {
            this.editorInstance.setValue(this.instanceValue);
            this.editorInstance.clearSelection();
            this.editorInstance.getSession().getUndoManager().reset();
        }
    }

    ngAfterViewInit(): void {
        this.editorInstance = ace.edit(this.editorContainer.nativeElement);
        this.editorInstance.session.setMode('ace/mode/json');
        this.editorInstance.setTheme('ace/theme/github');
        this.editorInstance.on('change', () => {
            if (this.firstVisual) {
                this.editorValueChange(this.editorInstance.getValue());
            }
        });
        if (this.instanceValue) {
            this.editorInstance.setValue(this.instanceValue, 1);
            this.editorInstance.clearSelection();
        }
        this.editorInstance.resize();
        super.ngAfterViewInit();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        if (this.editorInstance) {
            this.editorInstance.destroy();
        }
    }

    private editorValueChange(val: string) {
        let rs: any;
        this.change.emit(val);
        try {
            rs = JSON.parse(val);
        } catch {
        }
        this.onChangeCallback(rs);
    }

}

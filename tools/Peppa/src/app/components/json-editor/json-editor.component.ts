import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';

// declare const JSONEditor: any;

@Component({
    selector: 'app-json-editor',
    templateUrl: './json-editor.component.html',
    styleUrls: [
        './json-editor.component.less'
    ]
})
export class JsonEditorComponent implements OnChanges, OnInit {
    @Input() data: any;
    displayData: string;
    jsonEditor: any;

    constructor(private elm: ElementRef, private cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
    }

    ngOnChanges() {
        if (this.data) {
            this.displayData = typeof this.data === 'string' ? JSON.parse(this.data) : this.data;
        } else {
            this.displayData = null;
        }
        this.cdr.markForCheck();
    }

}

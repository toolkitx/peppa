import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-editor-layout',
    templateUrl: './editor-layout.component.html',
    styleUrls: ['./editor-layout.component.less']
})
export class EditorLayoutComponent implements OnInit {
    @Input() name: string;
    keyword: string;
    @Output() filterChange = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
    }

    keywordChanged(value: string) {
        this.keyword = value;
        this.filterChange.emit(value);
    }

}

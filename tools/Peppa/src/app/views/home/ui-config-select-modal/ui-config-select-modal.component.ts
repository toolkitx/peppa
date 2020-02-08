import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-ui-config-select-modal',
    templateUrl: './ui-config-select-modal.component.html',
    styleUrls: ['./ui-config-select-modal.component.less']
})
export class UiConfigSelectModalComponent implements OnInit {
    @Input() files: string[];
    selectedFile: string;

    constructor() {
    }

    get value() {
        return this.selectedFile;
    }

    ngOnInit() {
    }

}

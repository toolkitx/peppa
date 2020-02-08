import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-prompt-modal',
    templateUrl: './prompt-modal.component.html',
    styleUrls: ['./prompt-modal.component.less']
})
export class PromptModalComponent implements OnInit {
    @Input() data: string;
    @Input() message: string;
    constructor() {
    }

    ngOnInit() {
    }

    get value() {
        return this.data;
    }


}

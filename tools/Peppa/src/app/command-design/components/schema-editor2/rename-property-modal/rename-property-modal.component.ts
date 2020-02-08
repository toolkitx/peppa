import { Component, Input, OnInit } from '@angular/core';
import { NzTreeNode } from 'ng-zorro-antd';
import { isNewPropertyValid } from '../../../util';

@Component({
    selector: 'app-rename-property-modal',
    templateUrl: './rename-property-modal.component.html',
    styleUrls: ['./rename-property-modal.component.less']
})
export class RenamePropertyModalComponent implements OnInit {
    @Input() node: NzTreeNode;
    newName: string;

    constructor() {
    }

    ngOnInit() {
    }

    get value() {
        return this.newName;
    }

    get isValid() {
        return isNewPropertyValid(this.newName, this.node);
    }

}

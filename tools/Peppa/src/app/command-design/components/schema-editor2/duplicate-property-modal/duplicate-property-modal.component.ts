import { Component, Input, OnInit } from '@angular/core';
import { NzTreeNode } from 'ng-zorro-antd';
import { isNewPropertyValid } from '../../../util';

@Component({
  selector: 'app-duplicate-property-modal',
  templateUrl: './duplicate-property-modal.component.html',
  styleUrls: ['./duplicate-property-modal.component.less']
})
export class DuplicatePropertyModalComponent implements OnInit {

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

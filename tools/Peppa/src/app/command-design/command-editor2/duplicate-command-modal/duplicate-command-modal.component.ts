import { Component, Input, OnInit } from '@angular/core';
import { CommandDef } from '../../../modals/ui-configuration';
import { checkFirstChar } from '../../util';
import _ from 'lodash';

@Component({
    selector: 'app-duplicate-command-modal',
    templateUrl: './duplicate-command-modal.component.html',
    styleUrls: ['./duplicate-command-modal.component.less']
})
export class DuplicateCommandModalComponent implements OnInit {
    @Input() data: CommandDef;
    @Input() moduleName: string;
    @Input() nameValidator: (name: {[key: string]: string}) => boolean;

    duplicateName = '';

    constructor() {
    }

    ngOnInit() {

    }

    get isValid() {
        return this.nameValidator({name: this.duplicateName, fullName: this.getFullCommandName()});
    }

    get value() {
        const cmd: CommandDef = _.cloneDeep(this.data);
        cmd.name = this.getFullCommandName();
        return cmd;
    }

    checkFirstCommandChar() {
        this.duplicateName = checkFirstChar(this.duplicateName);
    }

    private getFullCommandName() {
        return `${this.moduleName}_${this.duplicateName}Command`;
    }


}

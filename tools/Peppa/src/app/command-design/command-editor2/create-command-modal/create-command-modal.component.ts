import { Component, Input, OnInit } from '@angular/core';
import { CommandDef, CommandSecurityRoles } from '../../../modals/ui-configuration';
import { checkFirstChar, createDefaultCommandObject } from '../../util';
import _ from 'lodash';

@Component({
    selector: 'app-create-command-modal',
    templateUrl: './create-command-modal.component.html',
    styleUrls: ['./create-command-modal.component.less']
})
export class CreateCommandModalComponent implements OnInit {
    @Input() data: CommandDef;
    @Input() moduleName: string;
    @Input() defaultFeature: string;
    @Input() featureList: string[];
    @Input() nameValidator: (name: {[key: string]: string}) => boolean;
    commandSecurityRoles = CommandSecurityRoles;
    newCommandDef: CommandDef = <any> {};

    constructor() {
    }

    ngOnInit() {
        this.newCommandDef = createDefaultCommandObject(this.data, this.defaultFeature);
    }

    get isValid() {
        return !this.data ? this.nameValidator({name: this.newCommandDef.name, fullName: this.getFullCommandName()}) : true;
    }

    get value() {
        if (!this.data) {
            this.newCommandDef.name = this.getFullCommandName();
        }
        return _.cloneDeep(this.newCommandDef);
    }

    checkFirstCommandChar() {
        this.newCommandDef.name = checkFirstChar(this.newCommandDef.name);
    }

    private getFullCommandName() {
        return `${this.moduleName}_${this.newCommandDef.name}Command`;
    }

}

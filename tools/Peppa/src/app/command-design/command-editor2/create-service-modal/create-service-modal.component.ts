import { Component, Input, OnInit } from '@angular/core';
import { ServiceDef } from '../../../modals/ui-configuration';
import { checkFirstChar } from '../../util';

@Component({
    selector: 'app-create-service-modal',
    templateUrl: './create-service-modal.component.html',
    styleUrls: ['./create-service-modal.component.less']
})
export class CreateServiceModalComponent implements OnInit {
    @Input() nameValidator: (name: string) => boolean;
    name: string;

    constructor() {
    }

    ngOnInit() {
    }

    get isValid() {
        return this.nameValidator(this.name);
    }

    get value() {
        return <ServiceDef> {name: this.name, commands: []};
    }

    checkFirstServiceChar() {
        this.name = checkFirstChar(this.name);
    }

}

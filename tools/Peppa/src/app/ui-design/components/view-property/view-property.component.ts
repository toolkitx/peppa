import { Component, Input, OnInit } from '@angular/core';
import { SidebarDef, ViewDef, ViewSecurityRoles } from '../../../modals/ui-configuration';

@Component({
    selector: 'app-view-property',
    templateUrl: './view-property.component.html',
    styleUrls: ['./view-property.component.less']
})
export class ViewPropertyComponent implements OnInit {
    @Input() data: ViewDef;
    @Input() sidebars: SidebarDef[];
    viewSecurityRoles = ViewSecurityRoles;

    constructor() {
    }

    ngOnInit() {
    }

    nameChange(name: string) {
        this.data.name = name.toLowerCase();
    }

}

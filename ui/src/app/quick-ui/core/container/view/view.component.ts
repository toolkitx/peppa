import { Component, Input, OnInit } from '@angular/core';
import { MenuDef } from '../../render/modals/ui-configuration';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'qui-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.less'],
    animations: [
        trigger('sidebarToggle', [
            state('true', style({ opacity: 1})),
            state('void', style({ opacity: 0.8})),
            transition(':enter', animate('240ms ease-in-out')),
            transition(':leave', animate('0ms ease-in-out'))
        ])
    ]
})
export class ViewComponent implements OnInit {
    @Input() menu: string | MenuDef[];

    constructor() {
    }

    get hasSidebar() {
        return !!this.menu;
    }

    ngOnInit() {

    }

}

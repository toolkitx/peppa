import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SidebarDef } from '../../../modals/ui-configuration';
import { FormArray, FormBuilder } from '@angular/forms';
import { newUniqueName } from '../../../util';

@Component({
    selector: 'app-sidebar-defs-builder',
    templateUrl: './sidebar-defs-builder.component.html',
    styleUrls: ['./sidebar-defs-builder.component.less']
})
export class SidebarDefsBuilderComponent implements OnInit {
    @Input() data: SidebarDef[];
    @Output() valueChange = new EventEmitter<SidebarDef[]>();

    form: FormArray;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        const form = this.fb.array([]);
        if (this.data) {
            this.data.map((item: SidebarDef) => {
                form.push(this.getFormGroup(item));
            });
        }
        this.form = form;
        this.form.valueChanges.subscribe(() => {
            this.valueChange.emit(this.value);
        });
    }

    appendItem() {
        this.form.push(this.getFormGroup(<SidebarDef> {
            name: newUniqueName('sidebar'),
            items: []
        }));
    }

    private getFormGroup(def: SidebarDef) {
        const fg = this.fb.group({});
        fg.addControl('name', this.fb.control(def.name));
        fg.addControl('items', this.fb.control(def.items));
        return fg;
    }

    removeItem(i: number) {
        this.form.removeAt(i);
    }

    get value() {
        return this.form ? this.form.value : [];
    }


}

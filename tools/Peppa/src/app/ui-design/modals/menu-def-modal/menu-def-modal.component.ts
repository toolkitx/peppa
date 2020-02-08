import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { MenuDef, SlotConfDef, ViewSecurityRoles } from '../../../modals/ui-configuration';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { newUniqueName } from '../../../util';

@Component({
    selector: 'app-menu-def-modal',
    templateUrl: './menu-def-modal.component.html',
    styleUrls: ['./menu-def-modal.component.less']
})
export class MenuDefModalComponent implements OnInit {
    @Input() data: MenuDef[];
    @Input() icons: string[];
    @Input() allowGroup = true;
    form: FormArray;
    viewSecurityRoles = ViewSecurityRoles;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        const arrForm = this.fb.array([]);
        if (this.data) {
            this.data.map(x => {
                arrForm.push(this.getFormGroup(x));
            });
        }
        this.form = arrForm;
    }

    appendItem() {
        this.form.push(this.getFormGroup(<MenuDef> {
            id: newUniqueName('action'),
            name: 'ActionX',
            type: 'Link'
        }));
    }

    removeItem(i: number) {
        this.form.removeAt(i);
    }

    drop(event: CdkDragDrop<SlotConfDef[]>) {
        moveItemInArray(this.form.controls, event.previousIndex, event.currentIndex);
        moveItemInArray(this.form.value, event.previousIndex, event.currentIndex);
    }

    private getFormGroup(def: MenuDef) {
        const fg = this.fb.group({});
        fg.addControl('id', this.fb.control(def.id));
        fg.addControl('name', this.fb.control(def.name));
        fg.addControl('icon', this.fb.control(def.icon));
        fg.addControl('type', this.fb.control(def.type));
        fg.addControl('action', this.fb.control(def.action));
        fg.addControl('styles', this.fb.control(def.styles));
        fg.addControl('permissions', this.fb.control(def.permissions));
        fg.addControl('disabled', this.fb.control(def.disabled));
        fg.addControl('children', this.fb.control(def.children));
        return fg;
    }

    get value() {
        return this.form.value;
    }

    menuTypeChange(item: FormControl) {
        if (item.get('type').value === 'Link') {
            item.get('children').setValue(null);
        }
    }

}

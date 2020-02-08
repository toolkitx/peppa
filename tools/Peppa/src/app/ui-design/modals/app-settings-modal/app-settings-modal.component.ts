import { Component, Input, OnInit } from '@angular/core';
import { ApplicationDef } from '../../../modals/ui-configuration';
import { FormBuilder, FormGroup } from '@angular/forms';
import _ from 'lodash';

@Component({
    selector: 'app-app-settings-modal',
    templateUrl: './app-settings-modal.component.html',
    styleUrls: ['./app-settings-modal.component.less']
})
export class AppSettingsModalComponent implements OnInit {
    @Input() config: ApplicationDef;
    form: FormGroup;

    constructor(private fb: FormBuilder) {
    }

    get value() {
        const rs = this.form.value ? _.cloneDeep(this.form.value) : {};
        delete rs.enableNav;
        return rs;
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            name: [this.config.name || null],
            enableNav: [!!this.config && !!this.config.nav],
            nav: [this.config.nav || null],
            headWidgets: [this.config.headWidgets || null]
        });
    }

    enableNavChange() {
        if (!this.form.get('enableNav').value) {
            this.form.get('nav').setValue(null);
        }
    }

}

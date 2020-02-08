import { Component, OnInit } from '@angular/core';
import { UIConfiguration, ViewDef } from '../../../modals/ui-configuration';
import { JsonLoaderService } from '../../../providers/json-loader.service';
import { ApplicationViewTemplate } from '../../../modals/application-view-template';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EditorStateService } from '../../../providers/editor-state.service';

@Component({
    selector: 'app-new-view',
    templateUrl: './new-view.component.html',
    styleUrls: ['./new-view.component.less']
})
export class NewViewComponent implements OnInit {
    form: FormGroup;
    templates: ApplicationViewTemplate[];
    selectedTemplate: ViewDef;
    uiConfiguration: UIConfiguration;

    get data(): ViewDef {
        return Object.assign(this.selectedTemplate, this.form.value);
    }

    get isValid() {
        return this.form.valid;
    }

    constructor(private jsonLoader: JsonLoaderService, private editorService: EditorStateService, private fb: FormBuilder) {
    }

    async ngOnInit() {
        this.uiConfiguration = this.editorService.getData<UIConfiguration>();
        this.createForm();
        await this.jsonLoader.get('assets/application-view.tpl.json').subscribe((rs: ApplicationViewTemplate[]) => {
            this.templates = rs;
            this.selectedTemplate = rs[0].data;
        });
    }

    createForm() {
        this.form = this.fb.group({
            name: [null, [Validators.required, Validators.pattern(/^[a-z][a-z0-9_]+/), this.uniqueValidator]],
            title: [null, [Validators.required]]
        });
    }

    uniqueValidator = (control: FormControl): {[key: string]: boolean} => {
        if (!control.value) {
            return  {required: true};
        } else if (this.uiConfiguration && this.uiConfiguration.application.views.some(x => x.name === control.value)) {
            return {unique: true, error: true};
        }
        return {};
    }
}

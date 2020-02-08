import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormArray, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { CustomFormControlWidget } from '../../../core/render/custom-form-control-widget';
import { CommandService } from '../../../core/service/command.service';
import { PagingRequest, PagingResponse } from '../../../widget/shared-modals';
import { Subscription } from 'rxjs';
import { RuleColumn } from '../policy-input/models';
import { AsyncDataSourceDef, SchemaDef, SchemaUiDef } from '../../../core/render/modals/ui-configuration';

interface ApprovalDefinition {
    id: string;
    approvedBy: string;
    description: string;
    dataSource: string;
}

interface ApprovalStep {
    stepName: string;
    approvalId: string;
    approverId: string;
    approverName: string;
}

@Component({
    selector: 'qui-approval-process-input',
    templateUrl: './approval-process-input.component.html',
    styleUrls: ['./approval-process-input.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ApprovalProcessInputComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => ApprovalProcessInputComponent),
        multi: true
    }]
})
export class ApprovalProcessInputComponent extends CustomFormControlWidget implements OnInit, OnDestroy {
    isRunningCommand = false;
    requestParams: PagingRequest = {skip: 0, take: 10};
    requestSubscription = new Subscription();
    templates: ApprovalDefinition[] = [];
    formArray: FormArray;
    previewStepNames: {stepName: string; approvedBy: string; }[] = [];

    constructor(private commandService: CommandService, private fb: FormBuilder) {
        super();
    }

    ngOnInit() {
        this.getTemplates();
    }

    private getTemplates() {
        this.isRunningCommand = true;
        this.requestSubscription = this.commandService.run({command: this.ui.dataSource.command, payload: this.requestParams})
            .subscribe((data: PagingResponse<ApprovalDefinition>) => {
                this.templates = this.templates.concat(data.results);
                if (data.total > this.templates.length) {
                    this.requestParams = {skip: this.templates.length, take: data.total - this.templates.length};
                    this.getTemplates();
                } else if (data.total === this.templates.length) {
                    this.isRunningCommand = false;
                    if (this.instanceValue && this.instanceValue.length) {
                        this.initForm();
                    }
                }
            }, ({message}) => {
                this.isRunningCommand = false;
            });
    }

    appendItem() {
        this.formArray.push(this.getFormGroup(<ApprovalStep>{
            stepName: this.templates[0].approvedBy,
            approvalId: this.templates[0].id,
            approverId: '',
            approverName: ''
        }));
    }


    approvalChange(t: string, formGroup: FormGroup) {
        // TODO support select user
        const def = this.getApprovalDef(t);
        // const ctrl = formGroup.get('approverId');
        // ctrl.setValidators(def.dataSource ? [Validators.required] : []);
    }

    removeItem(i: number) {
        this.formArray.removeAt(i);
    }

    drop(event: CdkDragDrop<RuleColumn[]>) {
        moveItemInArray(this.formArray.controls, event.previousIndex, event.currentIndex);
        moveItemInArray(this.formArray.value, event.previousIndex, event.currentIndex);
        this.initPreviewText();
    }

    getApprovalDef(id: string) {
        return this.templates.find(x => x.id === id);
    }

    getUiDataSourceDef(id: string) {
        const def = this.getApprovalDef(id);
        return <SchemaUiDef>{
            dataSource: <AsyncDataSourceDef>{
                command: def.dataSource,
                payload: null,
                label: 'name',
                value: 'id'
            }
        };
    }

    getFormSchemaDef(id: string) {
        return <SchemaDef>{
            type: 'string'
        };
    }

    private initForm() {
        const data: ApprovalStep[] = this.instanceValue || [];
        const form = this.fb.array([]);
        if (data.length) {
            data.map(x => {
                form.push(this.getFormGroup(x));
            });
            this.formArray = form;
        } else {
            this.formArray = form;
            this.appendItem();
        }
        this.formArray.valueChanges.subscribe(() => {
            this.onChangeCallback(this.formArray.valid ? this.formArray.value : null);
            this.initPreviewText();
        });
        this.initPreviewText();
    }

    private initPreviewText() {
        const values = this.formArray.value as ApprovalStep[] || [];
        const rs = [];
        values.map((x: ApprovalStep) => {
            const def = this.getApprovalDef(x.approvalId);
            rs.push({
                stepName: x.stepName || 'Not set',
                approvedBy: def.approvedBy
            });
        });
        this.previewStepNames = rs;
    }

    private getFormGroup(data: ApprovalStep) {
        const fg = this.fb.group({});
        fg.addControl('stepName', this.fb.control(data.stepName, [Validators.required]));
        fg.addControl('approvalId', this.fb.control(data.approvalId, [Validators.required]));
        fg.addControl('approverId', this.fb.control(data.approverId));
        fg.addControl('approverName', this.fb.control(data.approverName));
        return fg;
    }

}

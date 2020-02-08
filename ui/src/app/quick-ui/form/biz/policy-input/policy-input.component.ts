import { ChangeDetectorRef, Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { CustomFormControlWidget } from '../../../core/render/custom-form-control-widget';
import { CommandService } from '../../../core/service/command.service';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { PolicyTemplateModalComponent } from './policy-template-modal/policy-template-modal.component';
import { PagingRequest, PagingResponse } from '../../../widget/shared-modals';
import { PolicyDefinition } from './models';
import { Subscription } from 'rxjs';

@Component({
    selector: 'qui-policy-input',
    templateUrl: './policy-input.component.html',
    styleUrls: ['./policy-input.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => PolicyInputComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => PolicyInputComponent),
        multi: true
    }]
})
export class PolicyInputComponent extends CustomFormControlWidget implements OnInit, OnDestroy {
    isRunningCommand = false;
    requestParams: PagingRequest = {skip: 0, take: 10};
    templates: PolicyDefinition[] = [];
    requestSubscription = new Subscription();
    _tempQuickMatch: {[key: string]: string} = {};

    constructor(private cdr: ChangeDetectorRef,
                private commandService: CommandService,
                private nzModalService: NzModalService) {
        super();
    }

    ngOnInit() {
        this.getPolicyTemplates();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.requestSubscription.unsubscribe();
    }

    toggleVisible() {
        const modal = this.nzModalService.create({
            nzTitle: 'Policy Settings',
            nzContent: PolicyTemplateModalComponent,
            nzMaskClosable: false,
            nzWidth: '800px',
            nzComponentParams: {
                data: this.instanceValue ? [...this.instanceValue] : this.instanceValue,
                templates: this.templates
            },
            nzFooter: [
                {
                    label: 'Save',
                    type: 'primary',
                    onClick: (comp: PolicyTemplateModalComponent) => {
                        this.instanceValue = [...comp.value];
                        this.onChangeCallback(this.instanceValue);
                        modal.close();
                    }
                },
                {
                    label: 'Cancel',
                    onClick: () => {
                        modal.close();
                    }
                }
            ]
        });
    }

    private getPolicyTemplates() {
        this.isRunningCommand = true;
        this.requestSubscription = this.commandService.run({command: this.ui.dataSource.command, payload: this.requestParams})
            .subscribe((data: PagingResponse<PolicyDefinition>) => {
                this.templates = this.templates.concat(data.results);
                if (data.total > this.templates.length) {
                    this.requestParams = {skip: this.templates.length, take: data.total - this.templates.length};
                    this.getPolicyTemplates();
                } else if (data.total === this.templates.length) {
                    this.isRunningCommand = false;
                    this.controlReady();
                }
            }, ({message}) => {
                this.isRunningCommand = false;
            });
    }

    private controlReady() {

    }

    getTargetAttributeType(name: string) {
        if (!this._tempQuickMatch[name]) {
            const item = this.templates.find(x => x.name === name);
            this._tempQuickMatch[name] = item ? item.targetAttributeType : null;
        }
        return this._tempQuickMatch[name];
    }
}

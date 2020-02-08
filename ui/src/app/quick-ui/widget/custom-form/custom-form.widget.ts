import { Component, Injector, Input, OnInit } from '@angular/core';
import { Widget } from '../../core/decorators';
import { CustomFormSlotConf } from './custom-form-slot-conf';
import { CommandDef, ObjectSchemaDef } from '../../core/render/modals/ui-configuration';
import { CustomForm } from './custom-form';
import { QUI } from '../../core/global';
import { FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { BasePopupWidget } from '../../core/render/base-popup-widget';

@Widget({
    type: 'CustomForm',
    version: 'latest',
    slotConfClass: CustomFormSlotConf
})
@Component({
    selector: 'qui-custom-form',
    templateUrl: './custom-form.widget.html',
    styleUrls: ['./custom-form.widget.less']
})
export class CustomFormWidget extends BasePopupWidget implements OnInit {
    @Input() conf: CustomFormSlotConf;
    commandDef: CommandDef;
    form: CustomForm;
    submitting = false;
    loadingData = true;
    contextData: any;

    constructor(protected inject: Injector,
                private formBuilder: FormBuilder) {
        super(inject);
    }

    async startInitWidget() {
        try {
            if (this.conf.config.data) {
                const data = await this.loadData();
                this.contextData = this.context ? {...this.context, ...data} : {...data};
                this.initForm(data);
            } else {
                this.initForm();
            }
            this.loadingData = false;
            if (this.conf.config.popup) {
                this.addClassToHost('popped');
            }
        } catch ({message}) {
            this.loadingData = false;
            this.runningCommand = false;
            this.showError(message);
        }
    }

    submit() {
        const payload = this.form.value;
        if (this.submitting) {
            return;
        }
        this.submitting = true;
        this.commandService.run({command: this.conf.config.command, payload: payload}).pipe(finalize(() => {
            this.submitting = false;
        })).subscribe((rs: any) => {
            this.showSuccess(this.form.messages.success || 'Submitted successfully.');
            this.goBack('ok');
            this.runningCommand = false;
        }, ({message}) => {
            this.runningCommand = false;
            this.showError(message || this.form.messages.error || 'Failed to submit, please try latest.');
        });
    }

    cancel() {
        this.goBack();
    }

    private goBack(result?: string) {
        if (this.conf.config.popup) {
            this.closeModal(result);
        } else {
            this.location.back();
        }
    }

    private initForm(data?: any) {
        this.commandDef = this.uiConfigurationService.getCommand(this.conf!.config.command);
        if (this.commandDef && this.commandDef.inputSchema) {
            this.form = new CustomForm(
                <ObjectSchemaDef>this.commandDef!.inputSchema,
                this.conf.config.ui,
                this.formBuilder,
                this.uiConfigurationService,
                this.commandService,
                data,
                this.context);
        } else {
            const message = `Input schema of command ${this.commandDef.name} not found, please check you ui configuration file.`;
            throw new Error(message);
            QUI.log(message);
        }
    }

    private async loadData() {
        const command = this.uiConfigurationService.getCommand(this.conf.config.data.command);
        const payload = this.uiConfigurationService.getCommandInputPayload(null, command.inputSchema, this.conf.config.data.payload);
        const params = {command: command.name, payload: payload};
        return await this.commandService.run(params).toPromise();
    }
}

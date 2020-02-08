import { Component, Injector, OnInit } from '@angular/core';
import { WidgetConfig } from '../../decorators';
import { WidgetConfigBaseComponent } from '../widget-config-base-component';
import { KeysPipe } from '../../../pipes/keys.pipe';
import { CommandDef } from '../../../modals/ui-configuration';
import { CustomFormPreviewSlotComponent } from './custom-form-preview-slot/custom-form-preview-slot.component';

@WidgetConfig({
    type: 'CustomForm',
    description: 'A simple way to create form',
    tags: ['Component', 'Data Input'],
    previewComponent: CustomFormPreviewSlotComponent,
    defaultConfig: {
        command: null,
        data: null,
        ui: {
            messages: {success: null, error: null},
            submitText: null,
            cancelText: null,
            title: null,
            description: null,
            fields: []
        },
        popup: false,
        postAction: null
    }
})
@Component({
    selector: 'app-custom-form-config',
    templateUrl: './custom-form-config.component.html',
    styleUrls: ['./custom-form-config.component.less']
})
export class CustomFormConfigComponent extends WidgetConfigBaseComponent implements OnInit {
    actionCommandDef: CommandDef;

    constructor(protected injector: Injector, private keysPipe: KeysPipe) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        const messagesConfigGroup = this.formBuilder.group({
            success: [null],
            error: [null]
        });
        const uiConfigGroup = this.formBuilder.group({
            messages: messagesConfigGroup,
            submitText: [null],
            cancelText: [null],
            title: [null],
            description: [null],
            fields: [null]
        });
        const configGroup = this.formBuilder.group({
            command: [null],
            data: [null],
            ui: uiConfigGroup,
            popup: [false],
            postAction: [null],
        });

        // Migrate
        const migrationItems = [
            {property: 'popup', defaultValue: false},
            {property: 'postAction', defaultValue: null},
        ];
        this.migrateConfig(this.conf.config, migrationItems);

        // ui Migrate
        const uiMigrationItems = [
            {property: 'title', defaultValue: null},
            {property: 'description', defaultValue: null},
            {property: 'submitText', defaultValue: null},
            {property: 'cancelText', defaultValue: null},
        ];
        this.migrateConfig(this.conf.config.ui, uiMigrationItems);

        this.createForm(configGroup);
        if (this.conf && this.conf.config) {
            this.submitCommandChange(this.conf.config.command, true);
        }
    }

    submitCommandChange(commandName: string, fromInit = false) {
        if (!fromInit) {
            this.form.get('ui').get('fields').setValue(null);
        }
        this.actionCommandDef = this.getCommandDefByName(commandName);
    }

    private migrateConfig(obj: any, migrationItems: {property: string; defaultValue: any;}[]) {
        migrationItems.map((x) => {
            if (!obj.hasOwnProperty(x.property)) {
                obj[x.property] = x.defaultValue;
            }
        });
    }

}

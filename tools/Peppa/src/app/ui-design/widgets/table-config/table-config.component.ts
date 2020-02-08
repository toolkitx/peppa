import { Component, Injector, OnInit } from '@angular/core';
import { WidgetConfig } from '../../decorators';
import { WidgetConfigBaseComponent } from '../widget-config-base-component';
import { TablePreviewSlotComponent } from './table-preview-slot/table-preview-slot.component';

@WidgetConfig({
    type: 'Table',
    description: 'A simple way to display data',
    tags: ['Component', 'Data Display'],
    previewComponent: TablePreviewSlotComponent,
    defaultConfig: {
        actions: null,
        fields: null,
        filters: null,
        selectMode: 'None',
        refresh: true,
        idFieldKey: null,
        command: null
    }
})
@Component({
    selector: 'app-table-config',
    templateUrl: './table-config.component.html',
    styleUrls: ['./table-config.component.less']
})
export class TableConfigComponent extends WidgetConfigBaseComponent implements OnInit {
    selectModes = ['None', 'Multiple'];
    commandOutputKeys: string[] = [];

    constructor(protected injector: Injector) {
        super(injector);
    }


    ngOnInit() {
        super.ngOnInit();
        const configGroup = this.formBuilder.group({
            actions: [null],
            command: [null],
            selectMode: [null],
            refresh: true,
            idFieldKey: [null],
            fields: [[]],
            filters: [[]]
        });

        // Migrate
        const migrationItems = [
            {property: 'selectMode', defaultValue: 'None'},
            {property: 'refresh', defaultValue: true},
            {property: 'idFieldKey', defaultValue: null},
            {property: 'filters', defaultValue: []},
        ];
        migrationItems.map((x) => {
            if (!this.conf.config.hasOwnProperty(x.property)) {
                this.conf.config[x.property] = x.defaultValue;
            }
        });
        if (this.conf.config.command) {
            this.commandChange(this.conf.config.command, true);
        }
        this.createForm(configGroup);
    }

    commandChange(command: string, skipReset: boolean) {
        if (!skipReset) {
            this.form.get('fields').setValue([]);
        }
        this.commandOutputKeys = this.getCommandOutputKeys(command);
    }

}

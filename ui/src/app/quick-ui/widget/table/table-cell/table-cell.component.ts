import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableCellConf } from '../table-slot-conf';
import { UiConfigurationService } from '../../../core/render/ui-configuration.service';

@Component({
    selector: 'qui-table-cell',
    templateUrl: './table-cell.component.html',
    styleUrls: ['./table-cell.component.less']
})
export class TableCellComponent implements OnInit {
    @Input() data: any;
    @Input() rowIndex: number;
    @Input() columnIndex: number;
    @Input() conf: TableCellConf;
    @Output() afterAction = new EventEmitter<string>();
    constructor(private uiConfigService: UiConfigurationService) {
    }

    ngOnInit() {
    }

    get content() {
        return this.data && this.conf ? this.data[this.conf.key] : null;
    }

}

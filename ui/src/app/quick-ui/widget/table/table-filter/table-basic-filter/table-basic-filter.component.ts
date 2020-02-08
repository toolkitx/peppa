import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { TableFilterConf } from '../../table-slot-conf';
import { SchemaDef } from '../../../../core/render/modals/ui-configuration';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PQLFilter } from '../../../../core/render/pql';

@Component({
    selector: 'qui-table-basic-filter',
    templateUrl: './table-basic-filter.component.html',
    styleUrls: ['./table-basic-filter.component.less']
})
export class TableBasicFilterComponent implements OnInit, OnDestroy, OnChanges {
    @Input() pqlFilter: PQLFilter;
    @Input() filterConf: TableFilterConf;
    @Input() schema: SchemaDef;
    @Output() valueChange = new EventEmitter<PQLFilter>();
    value: string;
    form: FormGroup;
    subscription = new Subscription();

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.filterConf) {
            this.createForm();
        }
    }


    private createForm() {
        this.form = this.fb.group({
            field: [this.filterConf.key],
            operator: [this.filterConf.operator],
            value: [this.pqlFilter ? this.pqlFilter.value : null]
        });
        this.subscription = this.form.valueChanges.subscribe((data: PQLFilter) => {
            this.valueChange.emit(data);
        });
    }

}

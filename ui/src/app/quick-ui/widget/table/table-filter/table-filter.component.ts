import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableFilterConf } from '../table-slot-conf';
import { ObjectSchemaDef } from '../../../core/render/modals/ui-configuration';
import { PQL, PQLFilter } from '../../../core/render/pql';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'qui-table-filter',
    templateUrl: './table-filter.component.html',
    styleUrls: ['./table-filter.component.less']
})
export class TableFilterComponent implements OnInit {
    @Input() set pql(val: string) {
        this.searchQuery = val;
        this.filterInstances = [];
        if (val) {
            const inst = new PQL(val);
            if (inst.valid) {
                this.filterInstances = inst.toFilterObject();
            }
        }
    }

    @Input() filterConfs: TableFilterConf[];
    @Input() defaultKeywordIn$: BehaviorSubject<string>;
    @Input() schema: ObjectSchemaDef;
    @Input() disabled: boolean;
    @Output() filterChange = new EventEmitter<string>();
    @Output() defaultKeywordOut = new EventEmitter<string>();
    searchQuery: string;
    pqlValid = true;
    searchMode: 'basic' | 'advanced' = 'basic';
    filterInstances: PQLFilter[] = [];
    defaultFilterConf: TableFilterConf;

    constructor() {
    }

    ngOnInit() {
        this.defaultFilterConf = this.filterConfs.find(x => x.isDefault);
        if (this.defaultKeywordIn$) {
            this.defaultKeywordIn$.subscribe((val: string) => {
                if (val !== null) {
                    this.defaultKeywordChangesFromOutside(val);
                }
            });
        }
    }

    defaultKeywordChangesFromOutside(val: string) {
        if (!this.defaultFilterConf) {
            return;
        }
        const obj: PQLFilter = {field: this.defaultFilterConf.key, operator: this.defaultFilterConf.operator, value: val};
        this.fieldFilterValueChange(obj);
        this.triggerBasicSearch();
    }


    triggerSearch() {
        if (this.pqlValid) {
            this.filterChange.emit(this.searchQuery);
        }
    }

    triggerBasicSearch() {
        this.searchQuery = PQL.fromPQLFilters(this.filterInstances);
        this.filterChange.emit(this.searchQuery);
        const defaultKeywordInst = this.filterInstances.find(x => this.defaultFilterConf.key === x.field);
        this.defaultKeywordOut.emit(defaultKeywordInst ? defaultKeywordInst.value : '');
    }

    toggleSearchMode() {
        this.searchMode = this.searchMode === 'basic' ? 'advanced' : 'basic';
    }

    searchPQLChange() {
        this.pqlValid = this.searchQuery ? new PQL(this.searchQuery).valid : true;
    }

    reset() {
        this.searchQuery = null;
        this.filterInstances = [];
        this.triggerSearch();
    }

    fieldFilterValueChange(val: PQLFilter) {
        if (!val.value) {
            this.filterInstances = this.filterInstances.filter(x => x.field !== val.field);
        } else {
            if (this.filterInstances.length && this.filterInstances.some(x => x.field === val.field)) {
                const index = this.filterInstances.findIndex(x => x.field === val.field);
                this.filterInstances.splice(index, 1, val);
            } else {
                this.filterInstances.push(val);
            }
        }
        const newPQL = PQL.fromPQLFilters(this.filterInstances);
        this.searchQuery = newPQL;
    }

    getFilterInstanceByKey(key: string) {
        return this.filterInstances.find(x => x.field === key);
    }
}

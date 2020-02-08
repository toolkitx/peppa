import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { BaseWidget } from '../../core/render';
import { Widget } from '../../core/decorators';
import { TableFilterConf, TableSlotConf } from './table-slot-conf';
import { isPagingResponse, PagingRequest, PagingResponse } from '../shared-modals';
import { ParamMap, Params } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PQL } from '../../core/render/pql';
import { ArraySchemaDef, ObjectSchemaDef } from '../../core/render/modals/ui-configuration';

@Widget({
    type: 'Table',
    version: 'latest',
    slotConfClass: TableSlotConf
})
@Component({
    selector: 'qui-table',
    templateUrl: './table.widget.html',
    styleUrls: ['./table.widget.less']
})
export class TableWidget extends BaseWidget implements OnInit, OnDestroy {
    @Input() conf: TableSlotConf;
    lastQuery: string;
    dataSet = [];
    totalCount = 0;
    pagingEnabled = false;
    queryParams = {
        index: 1,
        size: 10,
        filter: '',
        tag: 0
    };
    routerSubscription = new Subscription();
    urlParams: Params;
    url: string;
    selectedSet = new Set<string>();
    allChecked = false;
    indeterminate = false;
    filterEnabled = false;
    filterShown = false;
    filterObjectStr: string;
    hasUserFilter = false;
    outputSchemaObject: ObjectSchemaDef;
    defaultFieldKeyword: string;
    defaultKeywordChange$ = new BehaviorSubject<string>(null);
    defaultFieldFilterConf: TableFilterConf;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    startInitWidget() {
        super.startInitWidget();
        // check filter status
        this.filterEnabled = this.conf.config.hasOwnProperty('filters') && this.conf.config.filters && this.conf.config.filters.length > 0;
        if (this.filterEnabled) {
            this.defaultFieldFilterConf = this.conf.config.filters.find(x => x.isDefault);
        }
        // Get schema
        const commandDef = this.uiConfigurationService.getCommand(this.conf.config.command);
        if (commandDef) {
            const output = commandDef.outputSchema as ObjectSchemaDef;
            if (output.properties.hasOwnProperty('results')) {
                this.outputSchemaObject = (output.properties.results as ArraySchemaDef).items as ObjectSchemaDef;
            } else {
                this.outputSchemaObject = null;
            }
        }

        this.routerSubscription = this.activatedRouter.queryParamMap.subscribe((map: ParamMap) => {
            this.urlParams = {};
            map.keys.map((k: string) => {
                const value = map.get(k);
                if (value) {
                    this.urlParams[k] = value;
                    if (k === this.conf.id) {
                        this.queryParams = JSON.parse(value);
                    }
                }
            });
            // Skip if router url changes
            const currentUrl = this.getCurrentUrl();
            if ((!this.url || this.url === currentUrl) && this.lastQuery !== map.get(this.conf.id)) {
                this.url = currentUrl;
                // set object
                this.convertPQLtoFilterObject(this.queryParams.filter);
                this.loadData();
            }
        });
    }

    getCurrentUrl() {
        return this.router.url.split('?')[0];
    }

    get $context() {
        return {
            $selectedIds: this.selectedIds,
            $filter: this.filterObjectStr,
            $total: this.totalCount
        };
    }

    ngOnDestroy(): void {
        this.routerSubscription.unsubscribe();
        if (this.defaultKeywordChange$) {
            this.defaultKeywordChange$.complete();
        }
        super.ngOnDestroy();
    }

    loadData() {
        // clear selected items
        this.resetCheckStatus();
        // convert PQL to filter object
        const payload = {
            command: this.conf.config.command,
            payload: <PagingRequest>{
                skip: (this.queryParams.index - 1) * this.queryParams.size,
                take: this.queryParams.size,
                filter: this.filterObjectStr
            }
        };
        this.lastQuery = JSON.stringify(this.getParams());
        this.runCommand(payload).subscribe((x: any) => {
            if (this.isPagingResponse(x)) {
                const tmp = x as PagingResponse<any>;
                // go to previous page if current page empty
                if (tmp.total > 0 && tmp.results.length === 0 && this.queryParams.index > 1) {
                    this.queryParams.index = this.queryParams.index - 1;
                    this.loadData();
                } else {
                    this.totalCount = tmp.total;
                    this.dataSet = tmp.results;
                }
            } else {
                const tmp = x as any[];
                this.totalCount = tmp.length;
                this.dataSet = tmp;
            }
            if (!this.conf.config.fields && this.dataSet.length) {
                const fields = [];
                Object.keys(this.dataSet[0]).map((key: string) => {
                    fields.push({key: key});
                });
                this.conf.config.fields = fields;
            }
        });
    }

    defaultSearchKeywordChange(val: string) {
        this.defaultKeywordChange$.next(val);
    }

    clearDefaultSearchKeyword() {
        this.defaultFieldKeyword = '';
    }

    private isPagingResponse(data: any) {
        this.pagingEnabled = isPagingResponse(data);
        return this.pagingEnabled;
    }

    private convertPQLtoFilterObject(pql: string) {
        const pqls: string[] = this.getInternalFilter();
        this.hasUserFilter = !!pql;
        if (this.hasUserFilter) {
            pqls.push(pql);
        }
        const instance = new PQL(PQL.concat(pqls));
        if (instance.valid) {
            const objs = instance.toFilterObject();
            this.filterObjectStr = instance.toFilterObjectString();
            // revert when reload
            const defaultObj = objs.find(x => x.field === this.defaultFieldFilterConf.key);
            if (defaultObj) {
                this.defaultFieldKeyword = defaultObj.value;
            }
        } else {
            this.queryParams.filter = '';
            this.filterObjectStr = '';
            this.defaultFieldKeyword = '';
        }
    }

    pageIndexChange(i: number) {
        this.queryParams.index = i;
        this.search();
    }

    pageSizeChange(size: number) {
        this.queryParams.index = 1;
        this.queryParams.size = size;
        this.search();
    }

    search(resetIndex?: boolean) {
        if (resetIndex) {
            this.queryParams.index = 1;
            this.queryParams.tag = Date.now();
        }
        const qParams = {...this.urlParams};
        qParams[this.conf.id] = JSON.stringify(this.getParams());
        this.router.navigate([], {queryParams: qParams});
    }

    afterPopupAction(action: string) {
        switch (action.toLowerCase()) {
            case 'reload':
                this.loadData();
                break;
        }
    }

    toggleTableFilter() {
        this.filterShown = !this.filterShown;
    }

    tableFilterChange(pql: string) {
        this.queryParams.filter = pql;
        this.search(true);
    }

    get canCheckAll() {
        return this.conf && this.conf.config && this.conf.config.selectMode === 'Multiple';
    }

    get selectedIds() {
        const rs: string[] = [];
        this.selectedSet.forEach(x => rs.push(x));
        return rs;
    }

    get userFilters(): TableFilterConf[] {
        if (this.conf && this.conf.config &&  this.conf.config.filters &&  this.conf.config.filters.length) {
            return this.conf.config.filters.filter(x => !x.internalValue);
        }
        return null;
    }

    // return checked state for each item
    isItemChecked(item: any) {
        const id = this.getId(item);
        return id && this.selectedSet.has(id);
    }

    dataItemCheckChange(val: boolean, item: any) {
        const id = this.getId(item);
        if (val) {
            this.selectedSet.add(id);
        } else {
            this.selectedSet.delete(id);
        }
        this.refreshStatus();
    }

    checkAllChange(val: boolean) {
        if (val) {
            this.selectedSet = new Set<string>(this.dataSet.map(x => this.getId(x)));
        } else {
            this.selectedSet.clear();
        }
        this.refreshStatus();
    }

    private refreshStatus() {
        const allChecked = this.dataSet.length > 0 && this.selectedSet.size === this.dataSet.length;
        const allUnchecked = this.dataSet.length > 0 && this.selectedSet.size === 0;
        this.allChecked = allChecked;
        this.indeterminate = (this.dataSet.length > 0) && (this.selectedSet.size > 0) && !allChecked && !allUnchecked;
    }

    private resetCheckStatus() {
        this.selectedSet.clear();
        this.refreshStatus();
    }

    private getId(item: any) {
        if (!this.conf.config.idFieldKey) {
            throw new Error('IdFieldKey is not set');
        }
        return item[this.conf.config.idFieldKey];
    }

    private getParams() {
        const params = {};
        Object.keys(this.queryParams).map((k: string) => {
            if (this.queryParams[k]) {
                params[k] = this.queryParams[k];
            }
        });
        return params;
    }

    private getInternalFilter() {
        if (this.conf && this.conf.config &&  this.conf.config.filters &&  this.conf.config.filters.length) {
            const rs = this.conf.config.filters.filter(x => !!x.internalValue).map(x => `${x.key} ${x.operator} ${x.internalValue}`);
            return rs;
        }
        return [];
    }


}

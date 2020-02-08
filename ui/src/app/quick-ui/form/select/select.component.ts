import { ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { CustomFormControlWidget } from '../../core/render/custom-form-control-widget';
import { ObjectSchemaDef, SchemaDef } from '../../core/render/modals/ui-configuration';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { CommandService } from '../../core/service/command.service';
import { UiConfigurationService } from '../../core/render/ui-configuration.service';
import { debounceTime, distinctUntilChanged, finalize, take } from 'rxjs/operators';
import { isPagingRequest, isPagingResponse, PagingRequest } from '../../widget/shared-modals';
import { BehaviorSubject } from 'rxjs';
import { PQL } from '../../core/render/pql';

@Component({
    selector: 'qui-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => SelectComponent),
        multi: true
    }]
})
export class SelectComponent extends CustomFormControlWidget implements OnInit, OnDestroy {
    @Input() schema: SchemaDef;
    _remoteOptions: any[];
    remoteTotalCount = 0;
    remoteSearching = false;
    searchChange$ = new BehaviorSubject<string>('');
    serverQueryParams = {
        size: 10,
        index: 1,
        filter: ''
    };
    remoteSearchKeyword: string;

    get options(): any[] {
        return this._remoteOptions || this.schema!.enum || [];
    }

    constructor(private cdr: ChangeDetectorRef, private commandService: CommandService, private uiConfigService: UiConfigurationService) {
        super();
    }

    valueChange(value: any) {
        this.onChangeCallback(value);
        this.onTouchedCallback();
    }

    writeValue(obj: any): void {
        super.writeValue(obj);
        // this.restoreState();
        // Restore item by setting value as label&value
        if (this.isRemoteDataSource && obj && (!this._remoteOptions || !this._remoteOptions.length)) {
            const labelKey = this.ui.dataSource.label;
            const valueKey = this.ui.dataSource.value;
            const item = {};
            item[labelKey] = obj;
            item[valueKey] = obj;
            this._remoteOptions = [item];
        }
    }


    ngOnInit(): void {
        this.ui = Object.assign({mode: 'default'}, this.ui);
        this.searchChange$.asObservable()
            .pipe(debounceTime(500))
            .subscribe(() => {
                if (this.command) {
                    this.remoteSearching = false;
                    this.pullRemoteData();
                }
            });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    serverSearch(keyword: string) {
        this.remoteSearchKeyword = keyword;
        // reset
        this.serverQueryParams = {
            size: 10,
            index: 1,
            filter: ''
        };
        this._remoteOptions = [];
        this.searchChange$.next(keyword);
    }

    validate(control: AbstractControl): ValidationErrors | null {
        if (this.schema.type === 'array') {
            const val = <string[]>control.value;
            if (val && this.schema.minItems && val.length < this.schema.minItems) {
                return {minItems: true};
            }
            if (val && this.schema.maxItems && val.length > this.schema.maxItems) {
                return {maxItems: true};
            }
        }
        this.cdr.markForCheck();
        return null;
    }

    loadMore() {
        if (this.isRemoteDataSource && this._remoteOptions && this._remoteOptions.length < this.remoteTotalCount && !this.remoteSearching) {
            this.serverQueryParams.index = this.serverQueryParams.index + 1;
            this.pullRemoteData();
        }
    }

    controlInit() {

    }

    protected linkageFieldChanges(key: string, value: string) {
        this.serverSearch('');
    }

    private get command() {
        return this.ui && this.ui.dataSource && this.uiConfigService.getCommand(this.ui.dataSource.command);
    }

    // private restoreState() {
    //     if (!this.ui!.dataSource) {
    //         return;
    //     }
    //     const valueKey = this.ui.dataSource.value;
    //     const def = this.command && this.command.inputSchema ? (<ObjectSchemaDef>this.command.inputSchema).properties[valueKey] : null;
    //     if (!def) {
    //         // skip if can not get input schema doesn't support this value key
    //         return;
    //     }
    //     const payload: PayloadDef = {};
    //     if (def.type === 'array') {
    //         payload[valueKey] = (this.instanceValue instanceof Array) ? this.instanceValue : [this.instanceValue];
    //     } else if (def.type === 'string') {
    //         payload[valueKey] = (this.instanceValue instanceof Array) ? this.instanceValue.join(',') : this.instanceValue;
    //     }
    //     // TODO
    //     // this.pullRemoteData(payload);
    // }

    private pullRemoteData() {
        if (!this.linkageFieldReady || this.remoteSearching) {
            return;
        }
        this.remoteSearching = true;
        const ctx = null;
        const formObj = this.form ? this.form.value : null;
        const payload: PagingRequest = this.uiConfigService
            .getCommandInputPayload(this.remoteSearchKeyword || '', this.command.inputSchema, this.ui.dataSource.payload, ctx, formObj);

        // For paging request, need to convert PQL to Filter Object
        if (this.command.inputSchema && isPagingRequest((this.command.inputSchema as ObjectSchemaDef).properties)) {
            if (payload.hasOwnProperty('filter')) {
                const filterObj = new PQL(payload.filter);
                if (filterObj.valid) {
                    payload.filter = filterObj.toFilterObjectString();
                }
            } else {
                payload.filter = '';
            }
            payload.take = this.serverQueryParams.size;
            payload.skip = (this.serverQueryParams.index - 1) * this.serverQueryParams.size;
        }
        this.commandService.run({command: this.command!.name, payload: payload})
            .pipe(debounceTime(500), distinctUntilChanged(), take(1), finalize(() => {
                this.remoteSearching = false;
            })).subscribe((data: any) => {
            this.handleRemoteData(data);
        });
    }

    private handleRemoteData(data: any) {
        const isPaging = isPagingResponse(data);
        if (!isPaging) {
            this._remoteOptions = data as any[];
            this.remoteTotalCount = this._remoteOptions.length || 0;
        } else {
            const rs = data['results'] as any[];
            this._remoteOptions = this._remoteOptions ? [...this._remoteOptions, ...rs] : [...rs];
            this.remoteTotalCount = data['total'] || 0;
        }

        if (this._remoteOptions.length && this.instanceValue) {
            const optionExists = this._remoteOptions.some((x) => {
                return x[this.ui.dataSource.value] === this.instanceValue;
            });
            if (!optionExists) {
                this.instanceValue = null;
                this.onChangeCallback(this.instanceValue);
            }
        }
    }

}

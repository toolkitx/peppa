import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { TableCellConf, TableFilterConf } from '../../../../modals/widget-slot-conf';
import { FormArray, FormBuilder } from '@angular/forms';
import { CacheService } from '../../../../cache/cache.service';
import { NzModalService } from 'ng-zorro-antd';

@Component({
    selector: 'app-table-filter-def-model',
    templateUrl: './table-filter-def-model.component.html',
    styleUrls: ['./table-filter-def-model.component.less']
})
export class TableFilterDefModelComponent implements OnInit, AfterViewInit {
    @Input() fieldConf: TableCellConf[];
    @Input() data: TableFilterConf[];

    form: FormArray;
    firstVisual = false;

    constructor(private cacheService: CacheService, private fb: FormBuilder, private messageService: NzModalService) {
    }

    get value() {
        return this.data;
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        // const arrForm = this.fb.array([]);
        // if (this.data) {
        //     this.data.map(x => {
        //         arrForm.push(this.getFormGroup(x.key, x.displayName, x.dataType, x.action));
        //     });
        // }
        // this.form = arrForm;
    }

    private getFormGroup(key: string, displayName: string, dataType: string, action: string) {
        const fg = this.fb.group({});
        fg.addControl('key', this.fb.control(key));
        fg.addControl('displayName', this.fb.control(displayName));
        fg.addControl('dataType', this.fb.control(dataType));
        fg.addControl('action', this.fb.control(action));
        return fg;
    }

    ngAfterViewInit(): void {
        this.firstVisual = true;
    }

}

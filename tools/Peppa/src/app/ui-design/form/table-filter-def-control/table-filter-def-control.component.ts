import { ChangeDetectorRef, Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { CustomDefControl } from '../custom-def-control';
import { TableCellConf } from '../../../modals/widget-slot-conf';
import { NzModalService } from 'ng-zorro-antd';
import { FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TableFieldDefModelComponent } from '../table-field-def-control/table-field-def-model/table-field-def-model.component';
import { TableFilterDefModelComponent } from './table-filter-def-model/table-filter-def-model.component';

@Component({
  selector: 'app-table-filter-def-control',
  templateUrl: './table-filter-def-control.component.html',
  styleUrls: ['./table-filter-def-control.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TableFilterDefControlComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => TableFilterDefControlComponent),
        multi: true
    }]
})
export class TableFilterDefControlComponent extends CustomDefControl<TableCellConf[]> implements OnInit {
    @Input() fieldConf: TableCellConf[];
    constructor(protected injector: Injector,
                private nzModalService: NzModalService,
                private cdr: ChangeDetectorRef,
                private fb: FormBuilder) {
        super(injector);
    }

  ngOnInit() {
  }

    toggleVisible() {
      const modal = this.nzModalService.create({
          nzTitle: 'Edit Filters',
          nzContent: TableFilterDefModelComponent,
          nzWidth: '60%',
          nzComponentParams: {
              data: this.instanceValue ? [...this.instanceValue] : this.instanceValue,
              fieldConf: this.fieldConf
          },
          nzFooter: [
              {
                  label: 'Save',
                  type: 'primary',
                  onClick: (comp: TableFilterDefModelComponent) => {
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

}

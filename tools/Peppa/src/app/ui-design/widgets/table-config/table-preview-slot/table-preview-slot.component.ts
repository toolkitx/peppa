import { Component, Injector, OnInit } from '@angular/core';
import { WidgetPreviewSlotBaseComponent } from '../../widget-preview-slot-base-component';

@Component({
    selector: 'app-table-preview-slot',
    templateUrl: './table-preview-slot.component.html',
    styleUrls: ['./table-preview-slot.component.less']
})
export class TablePreviewSlotComponent extends WidgetPreviewSlotBaseComponent implements OnInit {
    listOfData = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park'
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park'
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park'
        }
    ];

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
    }

}

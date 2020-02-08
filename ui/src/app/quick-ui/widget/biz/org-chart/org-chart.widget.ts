import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseWidget } from '../../../core/render';
import { Widget } from '../../../core/decorators';
import { OrgChartSlotConf } from './org-chart-slot-conf';
import { NzDrawerService } from 'ng-zorro-antd';
import { OrgChartDetailComponent } from './org-chart-detail/org-chart-detail.component';

@Widget({
    type: 'OrgChart',
    version: 'latest',
    slotConfClass: OrgChartSlotConf
})
@Component({
    selector: 'qui-sample',
    templateUrl: './org-chart.widget.html',
    styleUrls: ['./org-chart.widget.less']
})
export class OrgChartWidget extends BaseWidget implements OnInit {
    @Input() conf: OrgChartSlotConf;

    constructor(protected injector: Injector, private drawerService: NzDrawerService) {
        super(injector);
    }

    ngOnInit() {
    }

    open() {
        this.drawerService.create({
            nzTitle: 'Sam Huang',
            nzContent: OrgChartDetailComponent,
            nzWidth: 800
        });
    }

}

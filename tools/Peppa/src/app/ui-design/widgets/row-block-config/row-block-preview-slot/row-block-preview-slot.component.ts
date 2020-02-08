import { Component, Injector, OnInit } from '@angular/core';
import { WidgetPreviewSlotBaseComponent } from '../../widget-preview-slot-base-component';
import { SlotConfDef } from '../../../../modals/ui-configuration';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { PromptModalComponent } from '../../../modals/prompt-modal/prompt-modal.component';

@Component({
    selector: 'app-row-block-preview-slot',
    templateUrl: './row-block-preview-slot.component.html',
    styleUrls: ['./row-block-preview-slot.component.less']
})
export class RowBlockPreviewSlotComponent extends WidgetPreviewSlotBaseComponent implements OnInit {
    selectedTab: {width: number; widgets?: SlotConfDef[];};

    constructor(protected injector: Injector, private nzModalService: NzModalService, private nzMessageService: NzMessageService) {
        super(injector);
    }

    ngOnInit() {
    }

    selectTab(item: any) {
        this.selectedTab = item;
    }

    closeTab(index: number): void {
        this.conf.config.columns.splice(index, 1);
    }

    newColumn(): void {
        if (!this.conf.config.columns) {
            this.conf.config.columns = [];
        }

        const modal = this.nzModalService.create({
            nzTitle: 'New column',
            nzContent: PromptModalComponent,
            nzComponentParams: {
                data: '',
                message: 'Column span(1-24)'
            },
            nzFooter: [
                {
                    label: 'Create',
                    type: 'primary',
                    onClick: (comp: PromptModalComponent) => {
                        if (comp.value) {
                            this.conf.config.columns.push({width: Number(comp.value), widgets: []});
                            if (!this.selectedTab) {
                                this.selectTab(this.conf.config.columns[0]);
                            }
                            modal.close();
                        } else {
                            this.nzMessageService.error('Please enter width!');
                        }
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


    rename(i: number): void {
        const modal = this.nzModalService.create({
            nzTitle: 'Edit column span',
            nzContent: PromptModalComponent,
            nzComponentParams: {
                data: `${this.selectedTab.width}`,
                message: 'Column span(1-24)'
            },
            nzFooter: [
                {
                    label: 'Rename',
                    type: 'primary',
                    onClick: (comp: PromptModalComponent) => {
                        if (comp.value) {
                            this.selectedTab.width = Number(comp.value);
                            modal.close();
                        } else {
                            this.nzMessageService.error('Please enter width!');
                        }
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

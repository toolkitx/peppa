import { Component, Injector, OnInit } from '@angular/core';
import { WidgetPreviewSlotBaseComponent } from '../../widget-preview-slot-base-component';
import { SlotConfDef } from '../../../../modals/ui-configuration';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { PromptModalComponent } from '../../../modals/prompt-modal/prompt-modal.component';

@Component({
    selector: 'app-tab-block-preview-slot',
    templateUrl: './tab-block-preview-slot.component.html',
    styleUrls: ['./tab-block-preview-slot.component.less']
})
export class TabBlockPreviewSlotComponent extends WidgetPreviewSlotBaseComponent implements OnInit {
    selectedTab: {name: string; widgets?: SlotConfDef[];};

    constructor(protected injector: Injector, private nzModalService: NzModalService, private nzMessageService: NzMessageService) {
        super(injector);
    }

    ngOnInit() {
    }

    selectTab(item: any) {
        this.selectedTab = item;
    }

    closeTab(index: number): void {
        this.conf.config.tabs.splice(index, 1);
    }

    newTab(): void {
        if (!this.conf.config.tabs) {
            this.conf.config.tabs = [];
        }

        const modal = this.nzModalService.create({
            nzTitle: 'New tab',
            nzContent: PromptModalComponent,
            nzComponentParams: {
                data: '',
                message: 'Tab Name'
            },
            nzFooter: [
                {
                    label: 'Create',
                    type: 'primary',
                    onClick: (comp: PromptModalComponent) => {
                        if (comp.value && this.isNameValid(comp.value)) {
                            this.conf.config.tabs.push({name: comp.value, widgets: []});
                            if (!this.selectedTab) {
                                this.selectTab(this.conf.config.tabs[0]);
                            }
                            modal.close();
                        } else {
                            this.nzMessageService.error('Invalid name!');
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
            nzTitle: 'Rename tab',
            nzContent: PromptModalComponent,
            nzComponentParams: {
                data: this.selectedTab.name,
                message: 'Tab Name'
            },
            nzFooter: [
                {
                    label: 'Rename',
                    type: 'primary',
                    onClick: (comp: PromptModalComponent) => {
                        if (comp.value && this.isNameValid(comp.value)) {
                            this.selectedTab.name = comp.value;
                            modal.close();
                        } else {
                            this.nzMessageService.error('Invalid name!');
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

    private isNameValid(name: string) {
        return !this.conf.config.tabs.some(x => x.name === name);
    }

}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SidebarDef, UIConfiguration, ViewDef } from '../../modals/ui-configuration';
import { CacheService } from '../../cache/cache.service';
import { EditorStateService } from '../../providers/editor-state.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { NewViewComponent } from '../modals/new-view/new-view.component';
import { newViewName, newWidgetId } from '../../util';
import { NativeService } from '../../providers/native.service';
import { PeppaService } from '../../providers/peppa.service';
import _ from 'lodash';
import { AppSettingsModalComponent } from '../modals/app-settings-modal/app-settings-modal.component';

@Component({
    selector: 'app-ui-editor',
    templateUrl: './ui-editor.component.html',
    styleUrls: ['./ui-editor.component.less']
})
export class UiEditorComponent implements OnInit {

    uiConfiguration: UIConfiguration;
    selectedView: ViewDef;
    showRightPanel = true;
    openedFile: string;

    constructor(private cacheService: CacheService,
                private nativeService: NativeService,
                private peppaService: PeppaService,
                private nzModalService: NzModalService,
                private cdr: ChangeDetectorRef,
                private message: NzMessageService,
                private editorService: EditorStateService) {
    }

    ngOnInit() {
        this.uiConfiguration = this.editorService.getData<UIConfiguration>();
        this.openedFile = this.editorService.openedFile;
    }

    get views() {
        return this.uiConfiguration ? this.uiConfiguration.application.views : [];
    }

    addView() {
        const modal = this.nzModalService.create({
            nzTitle: 'New view',
            nzContent: NewViewComponent,
            nzFooter: [
                {
                    label: 'Create',
                    type: 'primary',
                    onClick: (comp: NewViewComponent) => {
                        if (!comp.isValid) {
                            return;
                        }
                        const data = _.cloneDeep(comp.data);
                        if (data.widgets) {
                            data.widgets.map(x => x.id = newWidgetId());
                        }
                        this.uiConfiguration.application.views.push(data);
                        this.uiConfiguration.application.views = [...this.uiConfiguration.application.views];
                        // select recent view
                        this.selectView(data);
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

    showAppSettings() {
        const modal = this.nzModalService.create({
            nzTitle: 'App Settings',
            nzContent: AppSettingsModalComponent,
            nzComponentParams: {
                config: this.uiConfiguration.application
            },
            nzFooter: [
                {
                    label: 'Save',
                    type: 'primary',
                    onClick: (comp: AppSettingsModalComponent) => {
                        const val = comp.value;
                        this.uiConfiguration.application = Object.assign(this.uiConfiguration.application, val);
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

    removeView(name: string) {
        this.nzModalService.confirm({
            nzTitle: 'Removing view',
            nzContent: 'Are you sure to remove this view?',
            nzOnOk: () => {
                this.uiConfiguration.application.views = this.uiConfiguration.application.views.filter(x => x.name !== name);
                this.selectedView = null;
            }
        });
    }

    duplicateView(view: ViewDef) {
        const newView = _.cloneDeep(view);
        newView.name = newViewName(view.name);
        this.uiConfiguration.application.views.push(newView);
    }

    selectView(view: ViewDef) {
        this.selectedView = view;
    }

    toggleRightPanel() {
        this.showRightPanel = !this.showRightPanel;
    }

    sidebarDefChange(val: SidebarDef[]) {
        this.uiConfiguration.application.sidebarDefs = val;
    }

    async saveJSON() {
        const filePath = await this.nativeService.showSaveDialog('Save Peppa UI configuration...', [
            {name: 'All Jsons', extensions: ['json']},
            {name: 'Peppa UI Configuration', extensions: ['ui.json']}
        ]);
        if (filePath) {
            try {
                const id = this.message.loading('Saving...', {nzDuration: 0}).messageId;
                const content = this.uiConfiguration;
                await this.nativeService.saveJson(filePath.toString(), content);
                this.message.remove(id);
                this.message.success('Saved successfully.');
            } catch (e) {
                this.message.error('Fail to save JSON. ' + e.message);
            }
        }
    }

    async saveAsMock() {
        const path = await this.nativeService.showSaveDialog('Save application.json...');
        if (path) {
            try {
                const id = this.message.loading('Saving...', {nzDuration: 0}).messageId;
                const content = this.uiConfiguration;
                await this.nativeService.saveJson(<string> path, {
                    state: 'Completed', output: {
                        moduleInfo: [{moduleName: this.uiConfiguration.module.name, uiDefinition: content}]
                    }
                });
                this.message.remove(id);
                this.message.success('Saved successfully.');
            } catch (e) {
                this.message.error('Fail to save JSON. ' + e.message);
            }
        }
    }
}

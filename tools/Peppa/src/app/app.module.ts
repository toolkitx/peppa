import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import json from 'highlight.js/lib/languages/json';
import { HttpClientModule } from '@angular/common/http';
import { AngularSplitModule } from 'angular-split';

import { AppRoutingModule } from './app-routing.module';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { en_US, NgZorroAntdModule, NZ_I18N } from 'ng-zorro-antd';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorLayoutComponent } from './components/editor-layout/editor-layout.component';
import { CommandEditorComponent } from './command/command-editor/command-editor.component';
import { EditorPrimaryActionsComponent } from './components/editor-layout/editor-primary-actions/editor-primary-actions.component';
import { EditorSecondaryActionsComponent } from './components/editor-layout/editor-secondary-actions/editor-secondary-actions.component';
import { EditorContentComponent } from './components/editor-layout/editor-content/editor-content.component';
import { EditorSiderComponent } from './components/editor-layout/editor-sider/editor-sider.component';
import { UiEditorComponent } from './ui-design/ui-editor/ui-editor.component';
import { EditorStateService } from './providers/editor-state.service';
import { DataGuard } from './guards/data.guard';
import { SchemaEditorComponent } from './components/schema-editor/schema-editor.component';
import { JsonEditorComponent } from './components/json-editor/json-editor.component';
import { CustomFormComponent } from './components/custom-form/custom-form.component';
import { KeysPipe } from './pipes/keys.pipe';
import { NativeService } from './providers/native.service';
import { PeppaService } from './providers/peppa.service';
import { ValInputComponent } from './components/val-input/val-input.component';
import { EditorFooterComponent } from './components/editor-layout/editor-footer/editor-footer.component';
import { StartupService, StartupServiceFactory } from './providers/startup.service';
import { JsonLoaderService } from './providers/json-loader.service';
import { CacheService } from './cache/cache.service';
import { LocalStorageCacheService } from './cache/local-storage-cache.service';
import { WidgetSelectorComponent } from './ui-design/components/widget-selector/widget-selector.component';
import { NewViewComponent } from './ui-design/modals/new-view/new-view.component';
import { ViewPropertyComponent } from './ui-design/components/view-property/view-property.component';
import { ViewBuilderComponent } from './ui-design/components/view-builder/view-builder.component';
import { Oauth2LoginConfigComponent } from './ui-design/widgets/oauth2-login-config/oauth2-login-config.component';
import { TableConfigComponent } from './ui-design/widgets/table-config/table-config.component';
import { ConfigSlotDirective } from './ui-design/config-slot.directive';
import { CommandDefControlComponent } from './ui-design/form/command-def-control/command-def-control.component';
import { CommandPayloadComponent } from './ui-design/modals/command-payload/command-payload.component';
import { ScreenshotPipe } from './pipes/screenshot.pipe';
import { MockServerComponent } from './views/mock-server/mock-server.component';
import { CustomFormConfigComponent } from './ui-design/widgets/custom-form-config/custom-form-config.component';
import { CommandSelectControlComponent } from './ui-design/form/command-select-control/command-select-control.component';
import { SchemaUiDefModalComponent } from './ui-design/widgets/custom-form-config/schema-ui-def-modal/schema-ui-def-modal.component';
import { SchemaUiDefControlComponent } from './ui-design/widgets/custom-form-config/schema-ui-def-modal/schema-ui-def-control/schema-ui-def-control.component';
import { DataSourceDefControlComponent } from './ui-design/form/data-source-def-control/data-source-def-control.component';
import { KeyValueDefControlComponent } from './ui-design/form/key-value-def-control/key-value-def-control.component';
import { KeyValueDefModalComponent } from './ui-design/modals/key-value-def-modal/key-value-def-modal.component';
import { VisibleDefControlComponent } from './ui-design/form/visible-def-control/visible-def-control.component';
import { MenuDefControlComponent } from './ui-design/form/menu-def-control/menu-def-control.component';
import { TableFieldDefControlComponent } from './ui-design/form/table-field-def-control/table-field-def-control.component';
import { TableFieldDefModelComponent } from './ui-design/form/table-field-def-control/table-field-def-model/table-field-def-model.component';
import { MenuDefModalComponent } from './ui-design/modals/menu-def-modal/menu-def-modal.component';
import { ActionDefControlComponent } from './ui-design/form/action-def-control/action-def-control.component';
import { SignUpConfigComponent } from './ui-design/widgets/sign-up-config/sign-up-config.component';
import { SidebarDefsBuilderComponent } from './ui-design/components/sidebar-defs-builder/sidebar-defs-builder.component';
import { ViewHeaderConfigComponent } from './ui-design/widgets/view-header-config/view-header-config.component';
import { BlockConfigComponent } from './ui-design/widgets/block-config/block-config.component';
import { TabBlockConfigComponent } from './ui-design/widgets/tab-block-config/tab-block-config.component';
import { DescriptionBlockConfigComponent } from './ui-design/widgets/description-block-config/description-block-config.component';
import { PreviewSlotDirective } from './ui-design/preview-slot.directive';
import { BlockPreviewSlotComponent } from './ui-design/widgets/block-config/block-preview-slot/block-preview-slot.component';
import { TabBlockPreviewSlotComponent } from './ui-design/widgets/tab-block-config/tab-block-preview-slot/tab-block-preview-slot.component';
import { DescriptionBlockPreviewSlotComponent } from './ui-design/widgets/description-block-config/description-block-preview-slot/description-block-preview-slot.component';
import { ViewHeaderPreviewSlotComponent } from './ui-design/widgets/view-header-config/view-header-preview-slot/view-header-preview-slot.component';
import { WidgetPreviewListComponent } from './ui-design/components/widget-preview-list/widget-preview-list.component';
import { PromptModalComponent } from './ui-design/modals/prompt-modal/prompt-modal.component';
import { CustomFormPreviewSlotComponent } from './ui-design/widgets/custom-form-config/custom-form-preview-slot/custom-form-preview-slot.component';
import { TablePreviewSlotComponent } from './ui-design/widgets/table-config/table-preview-slot/table-preview-slot.component';
import { RowBlockConfigComponent } from './ui-design/widgets/row-block-config/row-block-config.component';
import { RowBlockPreviewSlotComponent } from './ui-design/widgets/row-block-config/row-block-preview-slot/row-block-preview-slot.component';
import { CustomConfigComponent } from './ui-design/widgets/custom-config/custom-config.component';
import { CustomPreviewSlotComponent } from './ui-design/widgets/custom-config/custom-preview-slot/custom-preview-slot.component';
import { TableFilterDefControlComponent } from './ui-design/form/table-filter-def-control/table-filter-def-control.component';
import { TableFilterDefModelComponent } from './ui-design/form/table-filter-def-control/table-filter-def-model/table-filter-def-model.component';
import { ConfirmActionConfigComponent } from './ui-design/widgets/confirm-action-config/confirm-action-config.component';
import { ConfirmActionPreviewSlotComponent } from './ui-design/widgets/confirm-action-config/confirm-action-preview-slot/confirm-action-preview-slot.component';
import { AppSettingsModalComponent } from './ui-design/modals/app-settings-modal/app-settings-modal.component';
import { WidgetListDefControlComponent } from './ui-design/form/widget-list-def-control/widget-list-def-control.component';
import { UiConfigSelectModalComponent } from './views/home/ui-config-select-modal/ui-config-select-modal.component';
import { SingleWidgetDefControlComponent } from './ui-design/form/single-widget-def-control/single-widget-def-control.component';
import { TinyStatusConfigComponent } from './ui-design/widgets/tiny-status-config/tiny-status-config.component';
import { TinyStatusPreviewSlotComponent } from './ui-design/widgets/tiny-status-config/tiny-status-preview-slot/tiny-status-preview-slot.component';
import { TinyStatusStateDefControlComponent } from './ui-design/widgets/tiny-status-config/tiny-status-state-def-control/tiny-status-state-def-control.component';
import { CommandEditor2Component } from './command-design/command-editor2/command-editor2.component';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { TrimPipe } from './pipes/trim.pipe';
import { CommandJsonEditorComponent } from './command-design/components/command-json-editor/command-json-editor.component';
import { SchemaEditor2Component } from './command-design/components/schema-editor2/schema-editor2.component';
import { CreatePropertyModalComponent } from './command-design/components/schema-editor2/create-property-modal/create-property-modal.component';
import { InitSchemaModalComponent } from './command-design/components/schema-editor2/init-schema-modal/init-schema-modal.component';
import { RenamePropertyModalComponent } from './command-design/components/schema-editor2/rename-property-modal/rename-property-modal.component';
import { DuplicatePropertyModalComponent } from './command-design/components/schema-editor2/duplicate-property-modal/duplicate-property-modal.component';
import { CreateCommandModalComponent } from './command-design/command-editor2/create-command-modal/create-command-modal.component';
import { DuplicateCommandModalComponent } from './command-design/command-editor2/duplicate-command-modal/duplicate-command-modal.component';
import { CreateServiceModalComponent } from './command-design/command-editor2/create-service-modal/create-service-modal.component';

export function hljsLanguages() {
    return [
        {name: 'json', func: json},
    ];
}

const WidgetConfigs = [
    Oauth2LoginConfigComponent,
    TableConfigComponent,
    CustomFormConfigComponent,
    SignUpConfigComponent,
    ViewHeaderConfigComponent,
    BlockConfigComponent,
    TabBlockConfigComponent,
    DescriptionBlockConfigComponent,
    RowBlockConfigComponent,
    CustomConfigComponent,
    ConfirmActionConfigComponent,
    TinyStatusConfigComponent
];

const WidgetPreviewSlots = [
    BlockPreviewSlotComponent,
    TabBlockPreviewSlotComponent,
    DescriptionBlockPreviewSlotComponent,
    ViewHeaderPreviewSlotComponent,
    CustomFormPreviewSlotComponent,
    TablePreviewSlotComponent,
    RowBlockPreviewSlotComponent,
    CustomPreviewSlotComponent,
    ConfirmActionPreviewSlotComponent,
    TinyStatusPreviewSlotComponent
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        WebviewDirective,
        EditorLayoutComponent,
        CommandEditorComponent,
        EditorPrimaryActionsComponent,
        EditorSecondaryActionsComponent,
        EditorContentComponent,
        EditorSiderComponent,
        UiEditorComponent,
        SchemaEditorComponent,
        JsonEditorComponent,
        CustomFormComponent,
        KeysPipe,
        ScreenshotPipe,
        ValInputComponent,
        EditorFooterComponent,
        WidgetSelectorComponent,
        NewViewComponent,
        ViewPropertyComponent,
        ViewBuilderComponent,
        ConfigSlotDirective,
        ...WidgetConfigs,
        ...WidgetPreviewSlots,
        CommandDefControlComponent,
        CommandPayloadComponent,
        MockServerComponent,
        CommandSelectControlComponent,
        SchemaUiDefModalComponent,
        SchemaUiDefControlComponent,
        DataSourceDefControlComponent,
        KeyValueDefControlComponent,
        KeyValueDefModalComponent,
        VisibleDefControlComponent,
        MenuDefControlComponent,
        TableFieldDefControlComponent,
        TableFieldDefModelComponent,
        MenuDefModalComponent,
        ActionDefControlComponent,
        SidebarDefsBuilderComponent,
        PreviewSlotDirective,
        WidgetPreviewListComponent,
        PromptModalComponent,
        TableFilterDefControlComponent,
        TableFilterDefModelComponent,
        AppSettingsModalComponent,
        WidgetListDefControlComponent,
        SingleWidgetDefControlComponent,
        UiConfigSelectModalComponent,
        TinyStatusStateDefControlComponent,
        CommandEditor2Component,
        CodeEditorComponent,
        TrimPipe,
        CommandJsonEditorComponent,
        SchemaEditor2Component,
        CreatePropertyModalComponent,
        InitSchemaModalComponent,
        RenamePropertyModalComponent,
        DuplicatePropertyModalComponent,
        CreateCommandModalComponent,
        DuplicateCommandModalComponent,
        CreateServiceModalComponent
    ],
    entryComponents: [
        NewViewComponent,
        CommandPayloadComponent,
        KeyValueDefModalComponent,
        TableFieldDefModelComponent,
        TableFilterDefModelComponent,
        MenuDefModalComponent,
        PromptModalComponent,
        AppSettingsModalComponent,
        ViewBuilderComponent,
        ...WidgetConfigs,
        ...WidgetPreviewSlots,
        UiConfigSelectModalComponent,
        CreatePropertyModalComponent,
        InitSchemaModalComponent,
        RenamePropertyModalComponent,
        DuplicatePropertyModalComponent,
        CreateCommandModalComponent,
        DuplicateCommandModalComponent,
        CreateServiceModalComponent
    ],
    imports: [
        AngularSplitModule.forRoot(),
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        NgZorroAntdModule,
        DragDropModule,
        HighlightModule.forRoot({
            languages: hljsLanguages
        })
    ],
    providers: [
        {provide: NZ_I18N, useValue: en_US},
        {
            provide: APP_INITIALIZER,
            useFactory: StartupServiceFactory,
            deps: [StartupService],
            multi: true
        },
        ElectronService,
        EditorStateService,
        NativeService,
        PeppaService,
        DataGuard,
        JsonLoaderService,
        StartupService,
        CacheService,
        LocalStorageCacheService,
        KeysPipe],
    bootstrap: [AppComponent]
})
export class AppModule {
}

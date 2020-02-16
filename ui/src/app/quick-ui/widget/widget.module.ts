import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { HeaderWidget } from './header/header.widget';
import { TableWidget } from './table/table.widget';
import { CustomFormWidget } from './custom-form/custom-form.widget';
import { Oauth2LoginWidget } from './oauth2-login/oauth2-login.widget';
import { CustomFormErrorComponent } from './custom-form/custom-form-error/custom-form-error.component';
import { CustomFormItemWrapperComponent } from './custom-form/custom-form-item-wrapper/custom-form-item-wrapper.component';
import { TableCellComponent } from './table/table-cell/table-cell.component';
import { CoreModule } from '../core/core.module';
import { FormModule } from '../form/form.module';
import { FormControlTypePipe } from './custom-form/form-control-type.pipe';
import { NzValidateStatusPipe } from './custom-form/nz-validate-status.pipe';
import { SideMenuWidget } from './side-menu/side-menu.widget';
import { SignUpWidget } from './sign-up/sign-up.widget';
import { BlockWidget } from './block/block.widget';
import { SampleWidget } from './sample/sample.widget';
import { TabBlockWidget } from './tab-block/tab-block.widget';
import { ViewHeaderWidget } from './view-header/view-header.widget';
import { DescriptionBlockWidget } from './description-block/description-block.widget';
import { RowBlockWidget } from './row-block/row-block.widget';
import { ConfirmActionWidget } from './confirm-action/confirm-action.widget';
import { TableFilterComponent } from './table/table-filter/table-filter.component';
import { TableBasicFilterComponent } from './table/table-filter/table-basic-filter/table-basic-filter.component';
import { TeamLoginWidget } from './team-login/team-login.widget';
import { StateCheckerWidget } from './state-checker/state-checker.widget';
import { TinyStatusWidget } from './tiny-status/tiny-status.widget';
import { SimpleCardActionWidget } from './simple-card-action/simple-card-action-widget';
import { DirectorySettingsWidget } from './biz/directory-settings/directory-settings.widget';
import { CredentialSettingsWidget } from './biz/credential-settings/credential-settings.widget';
import { OrgChartWidget } from './biz/org-chart/org-chart.widget';
import { OrgChartDetailComponent } from './biz/org-chart/org-chart-detail/org-chart-detail.component';
import { TeamSlientLoginWidget } from './team-slient-login/team-slient-login.widget';
import { TeamGrantAdminConsentWidget } from './team-grant-admin-consent/team-grant-admin-consent.widget';

const WIDGETS = [
    SampleWidget,
    HeaderWidget,
    TableWidget,
    CustomFormWidget,
    Oauth2LoginWidget,
    SideMenuWidget,
    SignUpWidget,
    BlockWidget,
    TabBlockWidget,
    ViewHeaderWidget,
    DescriptionBlockWidget,
    RowBlockWidget,
    ConfirmActionWidget,
    TeamLoginWidget,
    TeamSlientLoginWidget,
    TeamGrantAdminConsentWidget,
    StateCheckerWidget,
    TinyStatusWidget,
    SimpleCardActionWidget,
    DirectorySettingsWidget,
    CredentialSettingsWidget,
    OrgChartWidget
];

const COMPONENTS = [
    CustomFormErrorComponent,
    CustomFormItemWrapperComponent,
    TableCellComponent,
    OrgChartDetailComponent
];

const PIPES = [
    FormControlTypePipe,
    NzValidateStatusPipe
];

@NgModule({
    declarations: [...WIDGETS, ...COMPONENTS, ...PIPES, TableFilterComponent, TableBasicFilterComponent],
    exports: [...WIDGETS, ...COMPONENTS],
    entryComponents: [...WIDGETS, OrgChartDetailComponent],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule,
        FormModule,
        NgZorroAntdModule
    ]
})
export class WidgetModule {
}

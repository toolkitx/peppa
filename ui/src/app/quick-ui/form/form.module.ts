import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectComponent } from './select/select.component';
import { CheckboxGroupComponent } from './checkbox-group/checkbox-group.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CoreModule } from '../core/core.module';
import { PolicyInputComponent } from './biz/policy-input/policy-input.component';
import { PolicyTemplateModalComponent } from './biz/policy-input/policy-template-modal/policy-template-modal.component';
import { NamingRuleDefineInputComponent } from './biz/policy-input/naming-rule-define-input/naming-rule-define-input.component';
import { NamingRulePreviewComponent } from './biz/policy-input/naming-rule-preview/naming-rule-preview.component';
import { ApprovalProcessInputComponent } from './biz/approval-process-input/approval-process-input.component';
import { NamingRuleInputComponent } from './biz/naming-rule-input/naming-rule-input.component';
import { TeamRulesInputComponent } from './biz/team-rules-input/team-rules-input.component';
import { TeamTemplateInputComponent } from './biz/team-template-input/team-template-input.component';
import { GrantAdminConsentInputComponent } from './biz/grant-admin-consent-input/grant-admin-consent-input.component';

const COMPONENTS = [
    SelectComponent,
    CheckboxGroupComponent,
    PolicyInputComponent,
    PolicyTemplateModalComponent,
    NamingRuleInputComponent,
    NamingRuleDefineInputComponent,
    NamingRulePreviewComponent,
    ApprovalProcessInputComponent,
    TeamRulesInputComponent,
    TeamTemplateInputComponent,
    GrantAdminConsentInputComponent
];

@NgModule({
    declarations: [...COMPONENTS],
    entryComponents: [PolicyTemplateModalComponent],
    exports: [...COMPONENTS],
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgZorroAntdModule,
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule,
        DragDropModule
    ]
})
export class FormModule {
}

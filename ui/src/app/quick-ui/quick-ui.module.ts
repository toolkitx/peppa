import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule, NzMessageService } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { QuickUIRoutingModule } from './quick-ui-routing.module';
import { CustomHttpInterceptor } from './core/custom-http-interceptor';
import { CoreModule } from './core/core.module';
import { FormModule } from './form/form.module';
import { WidgetModule } from './widget/widget.module';
import { MessageService } from './core/service/message.service';


@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgZorroAntdModule,
        BrowserModule,
        NoopAnimationsModule,
        CoreModule,
        FormModule,
        WidgetModule,
        QuickUIRoutingModule
    ],
    providers: [
        {provide: MessageService, useClass: NzMessageService},
        {provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true}
    ],
    exports: [
        CoreModule, FormModule, WidgetModule
    ]
})
export class QuickUIModule {
}

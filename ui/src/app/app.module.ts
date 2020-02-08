import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { en_US, NgZorroAntdModule, NZ_I18N } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { QuickUIModule } from './quick-ui/quick-ui.module';
import { AppComponent } from './app.component';
import { StartupService, StartupServiceFactory } from './quick-ui/core/service/startup.service';

registerLocaleData(en);

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgZorroAntdModule,
        FormsModule,
        HttpClientModule,
        NoopAnimationsModule,
        QuickUIModule
    ],
    providers: [
        {provide: NZ_I18N, useValue: en_US},
        {
            provide: APP_INITIALIZER,
            useFactory: StartupServiceFactory,
            deps: [StartupService],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

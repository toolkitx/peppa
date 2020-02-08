import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PermissionGuard } from './guard/permission.guard';

import { PermissionDirective } from './guard/permission.directive';
import { ActionDirective } from './render/action.directive';
import { SlotDirective } from './render';
import { ViewComponent } from './container/view/view.component';
import { ApplicationComponent } from './container/application/application.component';
import { ViewGeneratorComponent } from './render/view-generator/view-generator.component';
import { SpinnerComponent } from './component/spinner/spinner.component';
import { AboutService } from '../abc/about-box/about.service';
import { CommandService } from './service/command.service';
import { CacheService } from './cache/cache.service';
import { LocalStorageCacheService } from './cache/local-storage-cache.service';
import { StartupService } from './service/startup.service';
import { DomService } from './service/dom.service';
import { QUI_PROVIDERS } from './providers';
import { KeysPipe } from './pipe/keys.pipe';
import { LabelValuePipe } from './pipe/label-value.pipe';
import { EmptyComponent } from './component/empty/empty.component';
import { TranslatePipe } from './pipe/translate.pipe';
import { TranslateService } from './service/translate.service';
import { GlobalConfigService } from './service/global-config.service';
import { JsonLoaderService } from './service/json-loader.service';
import { MessageService } from './service/message.service';
import { SentencePipe } from './render/sentence.pipe';
import { PopupViewGeneratorComponent } from './render/popup-view-generator/popup-view-generator.component';
import { ConditionPipe } from './pipe/condition.pipe';
import { LocationRef } from './render/location-ref.service';

const COMPONENTS = [
    ActionDirective,
    SlotDirective,
    ViewComponent,
    ApplicationComponent,
    ViewGeneratorComponent,
    SpinnerComponent,
    EmptyComponent,
    PopupViewGeneratorComponent
];
const DIRECTIVES = [
    PermissionDirective
];
const GUARDS = [
    PermissionGuard
];

const SERVICES = [
    AboutService,
    CommandService,
    DomService,
    GlobalConfigService,
    JsonLoaderService,
    MessageService,
    StartupService,
    TranslateService,
    CacheService,
    LocalStorageCacheService,
    LocationRef,
    ...QUI_PROVIDERS
];

const PIPES = [
    KeysPipe,
    LabelValuePipe,
    TranslatePipe,
    SentencePipe,
    ConditionPipe
];


@NgModule({
    declarations: [...COMPONENTS, ...DIRECTIVES, ...PIPES],
    providers: [...SERVICES, ...DIRECTIVES, ...GUARDS, ...PIPES],
    entryComponents: [PopupViewGeneratorComponent],
    exports: [...COMPONENTS, ...DIRECTIVES, ...PIPES],
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule
    ]
})
export class CoreModule {
}

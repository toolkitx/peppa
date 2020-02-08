import {
    AfterViewInit, ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnDestroy, OnInit, ViewContainerRef
} from '@angular/core';
import { BaseWidget } from './base-widget';
import { getWidgetByType } from '../global';
import { SlotConf, SlotConfDef } from './modals/ui-configuration';
import { QUI } from '../global';
import { WidgetMeta } from './modals/widget-meta';

@Directive({
    selector: '[quiSlot]'
})
export class SlotDirective implements OnChanges, OnInit, OnDestroy, AfterViewInit {
    @Input() data: SlotConfDef;
    @Input() context?: any;
    private widgetDefinition: WidgetMeta;

    get setting() {
        return this.data;
    }

    componentRef: ComponentRef<BaseWidget>;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private vcr: ViewContainerRef) {
    }

    ngOnInit() {

    }

    ngOnDestroy(): void {
        if (this.componentRef) {
            this.componentRef.destroy();
        }
    }

    ngAfterViewInit(): void {
        this.vcr.clear();
        if (!this.setting) {
            this.displayError('parameters cannot be null.');
            return;
        }
        this.widgetDefinition = getWidgetByType(this.setting.type);
        if (!this.widgetDefinition) {
            this.displayError(`widget [${this.setting.type}] not found. <p>${JSON.stringify(this.setting)}</p>`);
            return;
        }
        try {
            const factory = this.componentFactoryResolver.resolveComponentFactory(this.widgetDefinition.component);
            this.componentRef = this.vcr.createComponent(factory);
            this.detect();
        } catch (error) {
            QUI.error(error);
            this.displayError(error.message);
        }
    }

    ngOnChanges(): void {
        if (this.componentRef) {
            this.detect();
        }
    }

    private displayError(msg: string) {
        QUI.error(msg);
        this.vcr.element.nativeElement.innerHTML = `
        <div class="ant-alert ant-alert-error ant-alert-no-icon" style="margin: 3px;">
            <div class="ant-alert-message">Failed to compile widget: ${msg}</div>
        </div>
        `;
    }

    private createSlotConfInstance(ctor: {new(data: any): SlotConf}): SlotConf {
        const conf = new ctor(this.setting.config);
        conf.id = this.setting.id;
        return conf;
    }

    private detect() {
        if (!this.widgetDefinition) {
            return;
        }
        this.componentRef.instance.conf = this.createSlotConfInstance(this.widgetDefinition.slotConfClass);
        this.componentRef.instance.context = this.context;
        this.componentRef.changeDetectorRef.markForCheck();
        this.componentRef.changeDetectorRef.detectChanges();
    }
}

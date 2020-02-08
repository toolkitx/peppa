import {
    AfterViewInit, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
    SimpleChanges, ViewContainerRef
} from '@angular/core';
import { SlotConfDef } from '../modals/ui-configuration';
import { WidgetConfigBaseComponent } from './widgets/widget-config-base-component';
import { WidgetConfigMeta } from './widget-config-meta';
import { getWidgetConfigByType, isDevWidget } from './widget-config-store';

@Directive({
    selector: '[appPreviewSlot]'
})
export class PreviewSlotDirective implements OnChanges, OnInit, OnDestroy, AfterViewInit {
    @Input() data: SlotConfDef;
    @Output() change = new EventEmitter<SlotConfDef>();

    componentRef: ComponentRef<WidgetConfigBaseComponent>;
    widgetConfigMeta: WidgetConfigMeta;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private vcr: ViewContainerRef) {
    }

    ngOnInit() {

    }

    ngOnDestroy(): void {
        if (this.componentRef) {
            this.componentRef.destroy();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.componentRef && this.widgetConfigMeta) {
            // this.detect();
            this.init();
        }
    }


    ngAfterViewInit(): void {
        this.init();
    }


    private detect() {
        if (!this.widgetConfigMeta) {
            return;
        }
        this.componentRef.instance.conf = this.data;
        this.componentRef.changeDetectorRef.markForCheck();
        this.componentRef.changeDetectorRef.detectChanges();
    }

    private displayError(msg: string) {
        this.vcr.element.nativeElement.innerHTML = `
        <div class="ant-alert ant-alert-error ant-alert-no-icon" style="margin: 3px;">
            <div class="ant-alert-message">Failed to compile widget: ${msg}</div>
        </div>
        `;
    }

    private init() {
        this.vcr.clear();
        if (!this.data) {
            this.displayError('parameters cannot be null.');
            return;
        }
        const wcm = getWidgetConfigByType(this.getPreviewType(this.data.type));
        if (!wcm) {
            this.displayError(`Widget config [${this.data.type}] not found.`);
            return;
        }
        try {
            this.widgetConfigMeta = wcm;
            const factory = this.componentFactoryResolver.resolveComponentFactory(this.widgetConfigMeta.previewComponent);
            this.componentRef = this.vcr.createComponent(factory);
            this.componentRef.instance.change.subscribe((value: SlotConfDef) => {
                console.log('slot get changes');
                this.change.emit(value);
            });
            this.detect();
        } catch (error) {
            console.log(error);
            this.displayError(error.message);
        }
    }

    getPreviewType(type: string) {
        return isDevWidget(type) ? 'Custom' : type;
    }

}

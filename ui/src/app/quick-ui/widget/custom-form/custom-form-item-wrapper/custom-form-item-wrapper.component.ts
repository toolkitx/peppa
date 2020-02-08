import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CustomForm } from '../custom-form';
import { AbstractControl } from '@angular/forms';
import { AsyncValidatorDef, VisibleValidatorDef } from '../../../core/render/modals/ui-configuration';
import { Subject } from 'rxjs';
import { UiConfigurationService } from '../../../core/render/ui-configuration.service';
import { CommandService } from '../../../core/service/command.service';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';

@Component({
    selector: 'qui-custom-form-item-wrapper',
    templateUrl: './custom-form-item-wrapper.component.html',
    styleUrls: ['./custom-form-item-wrapper.component.less']
})
export class CustomFormItemWrapperComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() key: string;
    @Input() form: CustomForm;
    @Input() context?: any;
    @Input() ctrl: AbstractControl;
    @Input() def: VisibleValidatorDef | AsyncValidatorDef | boolean;
    visibleState = true;
    subscription: Subject<any>;

    constructor(private uiConfigService: UiConfigurationService,
                private render2: Renderer2,
                private elementRef: ElementRef,
                private cdr: ChangeDetectorRef,
                private commandService: CommandService) {
    }

    ngOnInit(): void {
        this.subscription = new Subject();
        this.check();
    }

    ngAfterViewInit(): void {
        // this.check();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    check() {
        if (this.def === null || this.def === undefined) {
            return;
        }
        this.render2.addClass(this.elementRef.nativeElement, 'qui-hide');
        if (this.isAsyncCommand) {
            this.checkAsync();
        } else if (this.isDefBoolean()) {
            this.updateVisible(<boolean>this.def);
        } else {
            this.setupSubscriber();
        }
    }

    private setupSubscriber() {
        const conf = <VisibleValidatorDef>this.def;
        const keys = Object.keys(conf);
        // only subscribe the defined properties
        keys.map((key: string) => {
            if (this.form.instance.contains(key)) {
                this.form.instance.get(key).valueChanges
                    .pipe(debounceTime(300), distinctUntilChanged())
                    .subscribe(() => {
                        this.checkLocally();
                    });
            }
        });
        // first check
        this.checkLocally();
    }

    private checkLocally() {
        const conf = <VisibleValidatorDef>this.def;
        const keys = Object.keys(conf);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const condition: any[] = conf[key];
            const instanceValue = this.form.value[key];
            if ((condition instanceof Array) && condition.includes(instanceValue)) {
                this.updateVisible(true);
                return;
            }
        }
        this.updateVisible(false);
    }

    private checkAsync() {
        const conf = <AsyncValidatorDef>this.def;
        const command = this.uiConfigService.getCommand(conf.command);
        const formObject = this.form ? this.form.value : null;
        const payload = this.uiConfigService
            .getCommandInputPayload(null, command.inputSchema, conf.payload, this.context, formObject);
        this.commandService.run({command: command.name, payload}).pipe(finalize(() => {
        })).subscribe((data: any) => {
            this.updateVisible(!!data);
        });
    }

    private get isAsyncCommand() {
        return this.def && this.def.hasOwnProperty('command');
    }

    private updateVisible(visible: boolean) {
        this.visibleState = visible;
        if (visible) {
            this.render2.removeClass(this.elementRef.nativeElement, 'qui-hide');
            this.ctrl.setValidators(this.form.getValidators(this.key));
            this.ctrl.setAsyncValidators(this.form.getAsyncValidators(this.key));
        } else {
            this.render2.addClass(this.elementRef.nativeElement, 'qui-hide');
            this.ctrl.clearValidators();
            this.ctrl.clearAsyncValidators();
            if (!this.isDefBoolean()) {
                this.ctrl.setValue(null);
            }
        }
        this.ctrl.updateValueAndValidity();
    }

    private isDefBoolean() {
        return typeof this.def === 'boolean';
    }

}

import { ChangeDetectorRef, Component, ElementRef, forwardRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CustomFormControlWidget } from '../../../core/render/custom-form-control-widget';
import {
    AbstractControl, FormArray, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, ValidatorFn, Validators
} from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { isPagingResponse, PagingResponse } from '../../../widget/shared-modals';
import { CommandService } from '../../../core/service/command.service';
import { UiConfigurationService } from '../../../core/render/ui-configuration.service';
import { debounceTime } from 'rxjs/operators';
import { RuleColumn } from '../policy-input/models';

@Component({
    selector: 'qui-naming-rule-input',
    templateUrl: './naming-rule-input.component.html',
    styleUrls: ['./naming-rule-input.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NamingRuleInputComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => NamingRuleInputComponent),
        multi: true
    }]
})
export class NamingRuleInputComponent extends CustomFormControlWidget implements OnInit, OnDestroy {
    isRunningCommand = false;
    requestSubscription = new Subscription();
    searchChange$ = new BehaviorSubject<string>('');
    namingRule: RuleColumn[];
    formArray: FormArray;
    defaultNamingRule: RuleColumn[] = [{
        description: '',
        dataType: 'FlexibleText',
        value: null
    }];
    columnFormat = /^[a-zA-Z0-9.\-_]+$/;
    prefixFormat = /^(?!\.)[a-zA-Z0-9.\-_]+$/; // not start with dot
    suffixFormat = /^[a-zA-Z0-9.\-_]*[a-zA-Z0-9]$/; // end with a-z A-Z 0-9

    constructor(private cdr: ChangeDetectorRef,
                private commandService: CommandService,
                private uiConfigService: UiConfigurationService,
                private el: ElementRef,
                private renderer2: Renderer2,
                private fb: FormBuilder) {
        super();
    }

    ngOnInit() {
        this.searchChange$.asObservable()
            .pipe(debounceTime(500))
            .subscribe(() => this.command && this.getNamingRule());
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }


    private get command() {
        return this.ui && this.ui.dataSource && this.uiConfigService.getCommand(this.ui.dataSource.command);
    }

    private getNamingRule() {
        if (!this.linkageFieldReady) {
            return;
        }
        this.isRunningCommand = true;
        const ctx = null;
        const formObj = this.form ? this.form.value : null;
        const payload = this.uiConfigService
            .getCommandInputPayload(null, this.command.inputSchema, this.ui.dataSource.payload, ctx, formObj);

        this.requestSubscription = this.commandService.run({command: this.ui.dataSource.command, payload: payload})
            .subscribe((data: PagingResponse<{name: string; value: string}>) => {
                if (isPagingResponse(data)) {
                    this.namingRule = data.results.length ? JSON.parse(data.results[0].value) : this.defaultNamingRule;
                }
                this.isRunningCommand = false;
                this.initFormArray();
            }, ({message}) => {
                this.isRunningCommand = false;
            });
    }

    protected linkageFieldChanges(key: string, value: string) {
        // All monitor fields are ready
        this.instanceValue = null;
        this.onChangeCallback(this.instanceValue);
        this.searchChange$.next(value);
    }


    private initFormArray() {
        this.renderer2.addClass(this.el.nativeElement, 'form-init-before');
        this.instanceValue = null;
        const farr = this.fb.array([]);
        this.namingRule.map((x, index) => {
            farr.push(this.getFormGroup(x, index));
        });
        this.formArray = farr;
        this.formArray.valueChanges.subscribe((x) => {
            this.instanceValue = this.formArray.valid ? this.getName() : null;
            this.onChangeCallback(this.instanceValue);
        });
    }

    private getFormGroup(def: RuleColumn, index: number) {
        let defaultValue: any;
        if (def.dataType === 'Enumeration' && def.value && def.value.length) {
            defaultValue = def.value[0];
        } else if (def.dataType === 'FixedField') {
            defaultValue = {value: def.value, disabled: true};
        } else {
            defaultValue = ['FlexibleText', 'Connector'].includes(def.dataType) ? def.value as string : '';
        }
        const validators: ValidatorFn[] = [Validators.required];
        if (def.dataType !== 'Connector') {
            if (index === 0) {
                validators.push(Validators.pattern(this.prefixFormat));
            }
            if (index === this.namingRule.length - 1) {
                validators.push(Validators.pattern(this.suffixFormat));
            }
            validators.push(Validators.pattern(this.columnFormat));
        }

        const fg = this.fb.group({
            value: this.fb.control(defaultValue, validators)
        });
        Object.defineProperty(fg, 'raw', {value: def, writable: false});
        return fg;
    }

    validate(control: AbstractControl): ValidationErrors | null {
        return this.formArray && this.formArray.valid ? null : {namingRuleInput: true};
    }

    private getName() {
        const items = this.formArray.getRawValue() as {value: string}[];
        const parts: string[] = [];
        items.map(x => parts.push(x.value));
        return parts.join('');
    }

}

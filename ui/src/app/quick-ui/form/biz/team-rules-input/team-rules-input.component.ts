import { ChangeDetectorRef, Component, ElementRef, forwardRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CustomFormControlWidget } from '../../../core/render/custom-form-control-widget';
import { FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommandService } from '../../../core/service/command.service';
import { UiConfigurationService } from '../../../core/render/ui-configuration.service';

@Component({
    selector: 'qui-team-rules-input',
    templateUrl: './team-rules-input.component.html',
    styleUrls: ['./team-rules-input.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TeamRulesInputComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => TeamRulesInputComponent),
        multi: true
    }]
})
export class TeamRulesInputComponent extends CustomFormControlWidget implements OnInit, OnDestroy {
    isRunningCommand = false;

    constructor(private cdr: ChangeDetectorRef,
                private commandService: CommandService,
                private uiConfigService: UiConfigurationService,
                private el: ElementRef,
                private renderer2: Renderer2,
                private fb: FormBuilder) {
        super();
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

}

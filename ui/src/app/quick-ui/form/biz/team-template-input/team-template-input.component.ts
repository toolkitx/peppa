import { ChangeDetectorRef, Component, ElementRef, forwardRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CustomFormControlWidget } from '../../../core/render/custom-form-control-widget';
import { FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommandService } from '../../../core/service/command.service';
import { UiConfigurationService } from '../../../core/render/ui-configuration.service';

@Component({
    selector: 'qui-team-template-input',
    templateUrl: './team-template-input.component.html',
    styleUrls: ['./team-template-input.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TeamTemplateInputComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => TeamTemplateInputComponent),
        multi: true
    }]
})
export class TeamTemplateInputComponent extends CustomFormControlWidget implements OnInit, OnDestroy {
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

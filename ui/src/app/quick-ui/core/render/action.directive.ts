import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UiConfigurationService } from './ui-configuration.service';
import { Sentence } from './sentence';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { PopupViewGeneratorComponent } from './popup-view-generator/popup-view-generator.component';

@Directive({
    selector: '[quiAction]'
})
export class ActionDirective {
    @Input() quiAction: string;
    @Input() params?: {[key: string]: any};
    @Input() context?: any;
    @Input() disabled?: boolean;
    @Input() nzDisabled?: boolean;
    @Output() afterAction = new EventEmitter<string>();

    constructor(private route: Router,
                private uiConfigurationService: UiConfigurationService,
                private nzModalService: NzModalService) {
    }

    @HostListener('click', ['$event'])
    triggerAction() {
        if (this.disabled || this.nzDisabled) {
            return;
        }
        const action = this.uiConfigurationService.translateSentence(this.quiAction, this.params, this.context);
        if (!action.valid) {
            return;
        }
        if (action.type === 'view') {
            const url = ['/display', action.value].join('');
            this.route.navigateByUrl(url);
        } else if (action.type === 'popup') {
            this.popupView(action);
        }
    }

    popupView(action: Sentence) {
        let context = {};
        if (this.params) {
            context = {...this.params};
        }
        if (this.context) {
            // append current context to popup context, I think this way is not so good, but there is not any good ideas for now.
            // also add it as $parent, refer as parent context
            context = {...context, ...this.context, $parent: this.context};
        }
        const modal: NzModalRef = this.nzModalService.create({
            nzTitle: null,
            nzContent: PopupViewGeneratorComponent,
            nzMaskClosable: false,
            nzComponentParams: {
                action: action,
                context: context
            },
            nzFooter: null
        });
        modal.afterClose.subscribe((result: string) => {
            if (result && action.view.params && action.view.params.hasOwnProperty(result)) {
                this.afterAction.emit(action.view.params[result]);
            }
        });
    }

}

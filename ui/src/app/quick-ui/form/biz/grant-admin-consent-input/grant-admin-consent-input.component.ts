import {ChangeDetectorRef, Component, ElementRef, forwardRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';
import {CustomFormControlWidget} from '../../../core/render/custom-form-control-widget';
import {NzMessageService} from 'ng-zorro-antd';
import {AdalService} from '../../../core/service/adal.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'qui-grant-admin-consent-input',
    templateUrl: './grant-admin-consent-input.component.html',
    styleUrls: ['./grant-admin-consent-input.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => GrantAdminConsentInputComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => GrantAdminConsentInputComponent),
        multi: true
    }]
})
export class GrantAdminConsentInputComponent extends CustomFormControlWidget implements OnInit, OnDestroy {
    subscription: Subscription = new Subscription();

    constructor(private adalService: AdalService,
                private msgSvc: NzMessageService) {
        super();
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    grant() {
        this.onTouchedCallback();
        const msg = this.msgSvc.loading('Granting...', {nzDuration: 0});
        this.subscription = this.adalService.grantAdminConsent().subscribe((token: string) => {
            this.instanceValue = token;
            this.onChangeCallback(token);
            this.msgSvc.remove(msg.messageId);
            this.msgSvc.success('Granted.');
        }, (err: string) => {
            this.instanceValue = null;
            this.onChangeCallback(null);
            this.msgSvc.remove(msg.messageId);
            this.msgSvc.error(err);
        });
    }

}

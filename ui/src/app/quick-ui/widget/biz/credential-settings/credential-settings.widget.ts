import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseWidget } from '../../../core/render';
import { CredentialSettingsSlotConf } from './credential-settings-slot-conf';
import { Widget } from '../../../core/decorators';

@Widget({
    type: 'CredentialSettings',
    version: 'latest',
    slotConfClass: CredentialSettingsSlotConf
})
@Component({
    selector: 'qui-credential-settings',
    templateUrl: './credential-settings.widget.html',
    styleUrls: ['./credential-settings.widget.less']
})
export class CredentialSettingsWidget extends BaseWidget implements OnInit {
    @Input() conf: CredentialSettingsSlotConf;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
    }

}

import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseWidget } from '../../../core/render';
import { DirectorySettingsSlotConf } from './directory-settings-slot-conf';
import { Widget } from '../../../core/decorators';

@Widget({
    type: 'DirectorySettings',
    version: 'latest',
    slotConfClass: DirectorySettingsSlotConf
})
@Component({
    selector: 'qui-directory-settings',
    templateUrl: './directory-settings.widget.html',
    styleUrls: ['./directory-settings.widget.less']
})
export class DirectorySettingsWidget extends BaseWidget implements OnInit {
    @Input() conf: DirectorySettingsSlotConf;
    settings = [
        {name: 'Allow user to create team', displayName: 'Allow user to create team', targetAttributeType: 'TargetBoolean', value: 'true'},
        {name: 'Block word list', displayName: 'Block word list', targetAttributeType: 'TargetString', value: 'word1,word2'},
        {
            name: 'Allow guest to access in Team',
            displayName: 'Allow guest to access in Team',
            targetAttributeType: 'TargetBoolean',
            value: 'true'
        },
        {
            name: 'Allow guest to access to be owner',
            displayName: 'Allow guest to access  be owner',
            targetAttributeType: 'TargetBoolean',
            value: 'true'
        },
        {name: 'Guest domain white list', displayName: 'Guest domain white list', targetAttributeType: 'TargetString', value: 'domain1.com, domain2.com'}
    ];

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
    }

}

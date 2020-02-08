import { SlotConf } from '../../../core/render/modals/ui-configuration';

export class CredentialSettingsSlotConf extends SlotConf {
    type = 'CredentialSettings';
    constructor(public config: any) {
        super(config);
    }
}

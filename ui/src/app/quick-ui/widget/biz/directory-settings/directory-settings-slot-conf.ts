import { SlotConf } from '../../../core/render/modals/ui-configuration';

export class DirectorySettingsSlotConf extends SlotConf {
    type = 'DirectorySettings';
    constructor(public config: any) {
        super(config);
    }
}

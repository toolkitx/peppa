import { MenuDef, SlotConf } from '../../core/render/modals/ui-configuration';

export class SampleSlotConf extends SlotConf {
    type = 'Sample';
    constructor(public config: any) {
        super(config);
    }
}

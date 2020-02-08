import { MenuDef, SlotConf, SlotConfDef } from '../../core/render/modals/ui-configuration';

export class BlockSlotConf extends SlotConf {
    type = 'Block';

    constructor(public config: {
        title: string;
        description?: string;
        styles?: {[key: string]: string};
        actions?: MenuDef[];
        widgets?: SlotConfDef[];
    }) {
        super(config);
    }
}

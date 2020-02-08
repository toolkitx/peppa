import { MenuDef, SlotConf, SlotConfDef } from '../../core/render/modals/ui-configuration';

export class TabBlockSlotConf extends SlotConf {
    type = 'TabBlock';

    constructor(public config: {
        title: string;
        description?: string;
        styles?: {[key: string]: string};
        actions?: MenuDef[];
        tabs: {name: string; widgets?: SlotConfDef[]; }[];
    }) {
        super(config);
    }
}

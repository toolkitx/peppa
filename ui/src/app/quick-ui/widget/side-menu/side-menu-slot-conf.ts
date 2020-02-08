import { MenuDef, SlotConf } from '../../core/render/modals/ui-configuration';

export class SideMenuSlotConf extends SlotConf {
    type = 'SideMenu';
    constructor(public config: {menu: string | MenuDef[]} = null) {
        super(config);
    }
}

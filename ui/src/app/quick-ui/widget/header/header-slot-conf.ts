import { MenuDef, SlotConf, SlotConfDef } from '../../core/render/modals/ui-configuration';

export class HeaderSlotConf extends SlotConf {
    type = 'Header';
    constructor(public config: {title: string, primaryMenus: MenuDef[], widgets: SlotConfDef[]}) {
        super(config);
    }
}

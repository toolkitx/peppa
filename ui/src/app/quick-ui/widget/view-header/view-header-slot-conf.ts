import { MenuDef, SlotConf } from '../../core/render/modals/ui-configuration';

export class ViewHeaderSlotConf extends SlotConf {
    type = 'ViewHeader';

    constructor(public config: {
        title: string;
        description?: string;
        styles?: {[key: string]: string};
        actions?: MenuDef[];
        backIcon: boolean;
    }) {
        super(config);
    }
}

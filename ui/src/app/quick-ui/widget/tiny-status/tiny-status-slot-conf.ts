import { MenuDef, SlotConf } from '../../core/render/modals/ui-configuration';

interface TinyStatusDef {
    name: string; // status name, unique, from server or biz logic
    status: 'success' | 'processing' | 'default' | 'error' | 'warning' | string; // status of this widget or color hex
    text: string; // display name
}

export class TinyStatusSlotConf extends SlotConf {
    type = 'TinyStatus';
    constructor(public config: {name: string; defs: TinyStatusDef[]}) {
        super(config);
    }
}

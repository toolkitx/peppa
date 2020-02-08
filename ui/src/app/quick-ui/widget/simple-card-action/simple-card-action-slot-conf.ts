import { SlotConf } from '../../core/render/modals/ui-configuration';

export class SimpleCardActionSlotConf extends SlotConf {
    type = 'SimpleCardAction';
    constructor(public config: {title: string; description: string; avatarIcon: string; action: string; }) {
        super(config);
    }
}

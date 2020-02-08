import { SlotConf } from '../../../core/render/modals/ui-configuration';

export class OrgChartSlotConf extends SlotConf {
    type = 'OrgChart';
    constructor(public config: any) {
        super(config);
    }
}

import { SlotConf, SlotConfDef } from '../../core/render/modals/ui-configuration';

export class RowBlockSlotConf extends SlotConf {
    type = 'RowBlock';

    constructor(public config: {
        gutter: number,
        columns: {
            width: string;
            widgets?: SlotConfDef[];
        }[]
    }) {
        super(config);
    }
}

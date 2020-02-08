import { CommandRequestDef, MenuDef, SlotConf } from '../../core/render/modals/ui-configuration';
import { ItemFieldConf } from '../shared-modals';

export interface DescriptionFieldConf extends ItemFieldConf {
    key: string;
    dataType?: 'Text' | 'Date' | 'Action' | 'Widget';
}

export class DescriptionBlockSlotConf extends SlotConf {
    type = 'DescriptionBlock';

    constructor(public config: {
        title: string;
        description?: string;
        styles?: {[key: string]: string};
        actions?: MenuDef[];
        column: number;
        command: CommandRequestDef;
        fields: DescriptionFieldConf[];
    }) {
        super(config);
    }
}

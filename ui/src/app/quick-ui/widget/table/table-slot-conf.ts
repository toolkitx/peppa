import { AsyncDataSourceDef, MenuDef, SlotConf } from '../../core/render/modals/ui-configuration';
import { ItemFieldConf } from '../shared-modals';

export interface TableCellConf extends ItemFieldConf {
    key: string;
    dataType?: 'Text' | 'Date' | 'Action' | 'Menu' | 'Widget';
    action?: any;
}

export interface TableFilterConf {
    key: string;
    displayName: string;
    operator: string;
    // widget --> widget type
    // Text -> input to enter keyword
    // Date -> Date picker
    // DateRange -> Date range
    widget: string;
    dataSource?: AsyncDataSourceDef | string[] | {label: string; value: string; }[]; // Async static data source, for Remote
    isDefault: boolean;
    internalValue?: string;
}

export class TableSlotConf extends SlotConf {
    type = 'Table';

    constructor(public config: {
        actions: MenuDef[];
        command: string;
        selectMode: 'None' | 'Multiple';
        refresh?: boolean;
        idFieldKey?: string; // need to set this if use selectable
        fields: TableCellConf[];
        filters: TableFilterConf[];
    } = <any>{selectMode: 'None', refresh: true}) {
        super(config);
    }

    get isSelectable() {
        return this.config.selectMode && this.config.selectMode !== 'None';
    }
}


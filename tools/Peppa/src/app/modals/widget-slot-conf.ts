import { AsyncDataSourceDef } from './ui-configuration';

export interface TableCellConf {
    key: string;
    displayName: string;
    dataType?: 'Text' | 'Date' | 'Action';
    action?: string;
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
    internalValue: string;
}

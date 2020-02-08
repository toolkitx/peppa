export interface PeppaProject {
    type: 'Ui' | 'Command';
    module?: {name: string};
    studio?: {version: string; [key: string]: any;};
    version?: string;
}

export interface UIConfiguration extends PeppaProject {
    application: ApplicationDef;
}

export interface ServiceConfiguration extends PeppaProject {
    services: ServiceDef[];
}
export type CommandSecurityRole = 'Anonymous' | 'Admin' | 'GeneralUser' | 'OnDemand' | 'AAD';
export const CommandSecurityRoles: CommandSecurityRole[] = ['Anonymous', 'Admin', 'GeneralUser', 'OnDemand', 'AAD'];
export const ViewSecurityRoles: CommandSecurityRole[] = ['Anonymous', 'Admin', 'GeneralUser'];

export interface ApplicationDef {
    id?: string;
    name: string;
    type?: 'Application' | 'Module';
    nav: MenuDef[];
    headWidgets: SlotConfDef[];
    sidebar: MenuDef[];
    sidebarDefs?: SidebarDef[];
    views: ViewDef[];
    commands: CommandDef[];
}

export interface SidebarDef {
    name: string;
    items: MenuDef[];
}

export interface MenuDef {
    id?: string;
    name: string; // display text
    icon: string;
    type: 'Link' | 'Group' | string;
    action: string;
    styles: {[key: string]: any};
    permissions: string[];
    disabled?: string;
    children: MenuDef[];
}


export interface ServiceDef {
    name: string;
    commands: CommandDef[];
}

export interface CommandDef {
    name: string; // unique name
    type: 'Public' | 'Private';
    securityRole: CommandSecurityRole;
    feature: string;
    inputSchema: SchemaDef;
    outputSchema: SchemaDef;
}

export interface PayloadDef {
    [key: string]: any;
}

export interface CommandRequestDef {
    command: string;
    payload: PayloadDef;
}


export interface AsyncDataSourceDef extends CommandRequestDef {
    // label property key for select form control
    label: string;
    // value property key for select form control
    value: string;
}

export interface AsyncValidatorDef extends CommandRequestDef {
    command: string;
    payload: PayloadDef;
}

export interface VisibleValidatorDef {
    [key: string]: string[] | boolean[] | number[];
}

export interface SchemaUiDef {
    // form control type, text box by default, password, calender picker, etc
    // this is REQUIRED for ARRAY
    widget: string;
    mode: 'multiple' | 'tags' | 'default'; // mode for Select widget
    label: string; // label text for checkbox
    size: 'default' | 'small';
    placeholder: string;
    // error: string | {[key: string]: any};
    // Async static data source
    dataSource: AsyncDataSourceDef;
    // Async validator
    validator: AsyncValidatorDef;
    errors: {[key: string]: string}; // keys are case insensitive
    section: {title: string};
    // visible : { shown: [ true ] }: show current property when shown: true
    // visible : {command: 'COMMAND', payload: {...}}: show current property if command return true
    visible: VisibleValidatorDef | AsyncValidatorDef;
    // value, for which do not need to enter from user
    value: any;
}

export interface FormUiDef {
    title: string;
    description: string;
    messages: {success: string; error: string};
    submitText?: string;
    cancelText?: string;
    fields: {[key: string]: SchemaUiDef};
}

export interface SchemaDef {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object'; // the root type must be object
    //  A “title” will preferably be short, whereas a “description” will provide a more lengthy
    //  explanation about the purpose of the data described by the schema.
    title: string; // label, text to display
    description: string;
    // The default keyword specifies a default value for an item.
    default: any;
    // The const keyword is used to restrict a value to a single value.
    // https://json-schema.org/understanding-json-schema/reference/generic.html#constant-values
    const: any;
    // The enum keyword is used to restrict a value to a fixed set of values. It must be an array with at least one element,
    // where each element is unique.
    // https://json-schema.org/understanding-json-schema/reference/generic.html#enumerated-values
    enum: string[] | {label: string; value: string;}[];

    // items?: SchemaDef; // when type is array

    [key: string]: any;
}

export interface NumberSchemaDef extends SchemaDef {
    // x ≥ minimum
    minimum: number;
    // x > exclusiveMinimum
    // exclusiveMinimum: number;
    // // x ≤ maximum
    maximum: number;
    // // x < exclusiveMaximum
    // exclusiveMaximum: number;
}

export interface StringSchemaDef extends SchemaDef {
    minLength: number;
    maxLength: number;
    // format: string;
    pattern: string;
}

export interface ArraySchemaDef extends SchemaDef {
    minItems: number;
    maxItems: number;
    uniqueItems: boolean;
    items: SchemaDef | SchemaDef[];
}

export interface ObjectSchemaDef extends SchemaDef {
    properties: {[key: string]: SchemaDef};
    required: string[];
    minProperties: number;
    maxProperties: number;
}

export interface ViewDef {
    name: string; // unique name
    title: string; // page title
    default: boolean;
    sidebar: MenuDef[] | string;
    widgets?: SlotConfDef[];
    permissions?: CommandSecurityRole[];
    parent?: string;
}

export type SlotConfWrapperType = 'None' | 'Card';

// SlotConf Definition
export interface SlotConfDef {
    id?: string;
    type: string;
    wrapper: SlotConfWrapperType | {type: SlotConfWrapperType, styles?: {[key: string]: any}};
    config: any;
}

// SlotConf instance
export class SlotConf implements SlotConfDef {
    _stamp = Date.now();
    id: string;
    type: string;
    wrapper: SlotConfWrapperType;
    config: any;

    constructor(conf: any) {
        this.wrapper = 'Card';
    }

    get instanceId(): string {
        return this.id || `qui-widget-${this.type!.toLowerCase()}-${this._stamp}`;
    }
}

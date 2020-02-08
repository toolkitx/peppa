export interface PolicyDefinition {
    type: 'Object' | 'Member';
    code: string;
    codeName: string;
    id: string;
    name: string;
    description: string;
    targetAttributeType: string;
    targetAttributeDefaultValue: string | any;
    targetAttributeOption: string[];
    value: string | any;
}

export interface PolicyFormItemDefinition extends PolicyDefinition {
    sectionTitle?: string;
    sectionDescription?: string;
    enable?: boolean;
}

export interface RuleColumn {
    description: string;
    dataType: string;
    value: string | string[];
}

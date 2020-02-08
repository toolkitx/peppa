import { CommandDef, ObjectSchemaDef, SchemaDef } from '../modals/ui-configuration';
import { NzTreeNode } from 'ng-zorro-antd';

export function newSchemaDef(type: any, itemType: any = 'string') {
    const def: SchemaDef = {type} as any;
    if (type === 'array') {
        def.items = {
            type: itemType
        };
        if (itemType === 'object') {
            def.items.properties = {
                // p1: {type: 'string', title: 'p1'}
            };
        }
    } else if (type === 'object') {
        def.properties = {
            // p1: {type: 'string', title: 'p1'}
        };
    }
    return def;
}

export function isNewPropertyValid(name: string, contextTargetNode: NzTreeNode) {

    const isPropertyExists = (key: string, properties: any) => {
        const keys = Object.keys(properties);
        return !keys.includes(key);
    };

    const reg = /^[a-z][A-Za-z0-9]+$/g;
    if (name && reg.test(name)) {
        const def = contextTargetNode.origin.raw as SchemaDef;
        if (def.type === 'object' && def.properties) {
            return isPropertyExists(name, (def as ObjectSchemaDef).properties);
        } else {
            const raw = contextTargetNode.parentNode.origin.raw;
            return isPropertyExists(name, (raw as ObjectSchemaDef).properties);
        }
    }
    return false;
}

export function createDefaultCommandObject(def?: CommandDef, defaultFeature?: string): CommandDef {
    return def ? {...def} : {
        name: null,
        type: 'Private',
        securityRole: 'GeneralUser',
        feature: defaultFeature,
        inputSchema: null,
        outputSchema: null
    };
}

export function checkFirstChar(name: string) {
    let val = name;
    if (!val) {
        return '';
    }
    const reg = new RegExp(/^[A-Z].*$/, 'g');
    if (reg.test(val)) {
        return name;
    }
    val = val.charAt(0).toUpperCase() + val.slice(1);
    return val;
}


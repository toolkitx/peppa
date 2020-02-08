import { ViewDef } from './ui-configuration';

export interface ApplicationViewTemplate {
    name: string;
    displayName: string;
    description: string;
    data: ViewDef;
}

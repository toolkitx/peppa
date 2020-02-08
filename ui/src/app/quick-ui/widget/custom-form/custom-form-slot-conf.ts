import { CommandRequestDef, FormUiDef, SlotConf } from '../../core/render/modals/ui-configuration';

export interface CustomFormConf {
    command: string;
    data?: CommandRequestDef;
    ui: FormUiDef;
    popup: boolean;
    postAction: string;
}

export class CustomFormSlotConf extends SlotConf {
    type = 'CustomForm';
    constructor(public config: CustomFormConf = <any>{popup: false}) {
        super(config);
    }
}

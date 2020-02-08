import { CommandRequestDef, SlotConf } from '../../core/render/modals/ui-configuration';

export class ConfirmActionSlotConf extends SlotConf {
    type = 'ConfirmAction';

    constructor(public config: {
        title: string;
        description?: string;
        okText?: string;
        cancelText?: string;
        action: CommandRequestDef;
        postAction: string;
        successMessage: string;
    }) {
        super(config);
    }
}

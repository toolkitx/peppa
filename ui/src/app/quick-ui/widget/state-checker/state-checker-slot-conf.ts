import { CommandRequestDef, SlotConf } from '../../core/render/modals/ui-configuration';

export class StateCheckerSlotConf extends SlotConf {
    type = 'StateChecker';

    constructor(public config: {
        icon: string;
        dataSource: CommandRequestDef;
        interval: number;
        pendingMessage: string;
        doneMessage: string;
        statePropName: string;
        doneState: string;
    }) {
        super(config);
    }
}

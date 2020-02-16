import { CommandRequestDef, SlotConf } from '../../core/render/modals/ui-configuration';

interface TeamLoginConf  {
    redirectUrl: string;
}

export class TeamLoginSlotConf extends SlotConf {
    type = 'TeamLogin';
    constructor(public config: TeamLoginConf) {
        super(config);
    }
}

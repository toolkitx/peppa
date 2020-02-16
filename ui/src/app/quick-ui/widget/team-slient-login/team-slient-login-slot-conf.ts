import { CommandRequestDef, SlotConf } from '../../core/render/modals/ui-configuration';

interface TeamSlientLoginConf  {
    doLoginUrl: string;
    token: CommandRequestDef;
    tokenPropName: string;
}

export class TeamSlientLoginSlotConf extends SlotConf {
    type = 'TeamSlientLogin';
    constructor(public config: TeamSlientLoginConf) {
        super(config);
    }
}

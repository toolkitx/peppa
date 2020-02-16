import { CommandRequestDef, SlotConf } from '../../core/render/modals/ui-configuration';

interface TeamGrantAdminConsentConf  {
    authorize: CommandRequestDef;
    redirectUrlPropName: string;
}

export class TeamGrantAdminConsentSlotConf extends SlotConf {
    type = 'TeamGrantAdminConsent';
    constructor(public config: TeamGrantAdminConsentConf) {
        super(config);
    }
}

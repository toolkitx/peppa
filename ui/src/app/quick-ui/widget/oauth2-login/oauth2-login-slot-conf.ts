import { CommandRequestDef, SlotConf } from '../../core/render/modals/ui-configuration';

export class Oauth2LoginSlotConf extends SlotConf {
    constructor(public config: {
        authorize: CommandRequestDef;
        region: CommandRequestDef;
        token: CommandRequestDef;
        redirectUrlPropName: string;
        tokenPropName: string;
    }) {
        super(config);
    }
}

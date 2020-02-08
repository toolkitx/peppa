import { CommandRequestDef, SlotConf } from '../../core/render/modals/ui-configuration';

export class SignUpSlotConf extends SlotConf {
    constructor(public config: {authorize: CommandRequestDef; register: CommandRequestDef; redirectUrlPropName: string; }) {
        super(config);
    }
}

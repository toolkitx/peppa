import { Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { WidgetConfig } from '../../decorators';
import { WidgetConfigBaseComponent } from '../widget-config-base-component';
import { KeysPipe } from '../../../pipes/keys.pipe';
import { Validators } from '@angular/forms';
import { CommandRequestDef, ObjectSchemaDef } from '../../../modals/ui-configuration';

@WidgetConfig({
    type: 'SignUp',
    description: 'A simple way to sign up',
    tags: ['Auth'],
    defaultConfig: {
        authorize: {command: null, payload: null},
        register: {command: null, payload: null},
        redirectUrlPropName: null
    }
})
@Component({
    selector: 'app-sign-up-config',
    templateUrl: './sign-up-config.component.html',
    styleUrls: ['./sign-up-config.component.less']
})
export class SignUpConfigComponent extends WidgetConfigBaseComponent implements OnInit, OnChanges {
    authProperties: string[] = [];

    constructor(protected injector: Injector, private keysPipe: KeysPipe) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        const configGroup = this.formBuilder.group({
            authorize: [null, [Validators.required]],
            register: [null, [Validators.required]],
            redirectUrlPropName: [null, [Validators.required]]
        });
        this.createForm(configGroup);
        if (this.conf) {
            const authCommandDef = this.getCommandDefByName(this.conf.config.authorize.command);
            if (authCommandDef) {
                this.tokenCommandChange(<CommandRequestDef> {command: authCommandDef.name}, false, 'redirectUrlPropName');
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
    }

    tokenCommandChange(commandDef: CommandRequestDef, reset = true, property: string) {
        const cmd = this.getCommandDefByName(commandDef.command);
        let rs = [];
        if (cmd && cmd.outputSchema) {
            const output = cmd.outputSchema as ObjectSchemaDef;
            if (output.type === 'object') {
                const items = this.keysPipe.transform(output.properties);
                rs = items.map(x => x.key);
            }
        }
        if (property === 'redirectUrlPropName') {
            this.authProperties = rs;
        }
        if (!reset) {
            return;
        }

        if (property === 'redirectUrlPropName') {
            this.form.get(property).setValue(this.authProperties[0]);
        }
    }
}

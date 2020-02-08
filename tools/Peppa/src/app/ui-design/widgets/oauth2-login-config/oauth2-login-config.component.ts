import { Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { WidgetConfig } from '../../decorators';
import { Validators } from '@angular/forms';
import { WidgetConfigBaseComponent } from '../widget-config-base-component';
import { CommandRequestDef, ObjectSchemaDef } from '../../../modals/ui-configuration';
import { KeysPipe } from '../../../pipes/keys.pipe';

@WidgetConfig({
    type: 'Oauth2Login',
    description: 'A simple way to authorize users',
    tags: ['Auth'],
    defaultConfig: {
        authorize: {command: null, payload: null},
        region: {command: null, payload: null},
        token: {command: null, payload: null},
        redirectUrlPropName: null,
        tokenPropName: null
    }
})
@Component({
    selector: 'app-oauth2-login-config',
    templateUrl: './oauth2-login-config.component.html',
    styleUrls: ['./oauth2-login-config.component.less']
})
export class Oauth2LoginConfigComponent extends WidgetConfigBaseComponent implements OnInit, OnChanges {
    tokenProperties: string[] = [];
    authProperties: string[] = [];

    constructor(protected injector: Injector, private keysPipe: KeysPipe) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        const configGroup = this.formBuilder.group({
            authorize: [null, [Validators.required]],
            region: [null, [Validators.required]],
            token: [null, [Validators.required]],
            redirectUrlPropName: [null, [Validators.required]],
            tokenPropName: [null, [Validators.required]]
        });
        this.createForm(configGroup);
        if (this.conf) {
            const tokenCommandDef = this.getCommandDefByName(this.conf.config.token.command);
            if (tokenCommandDef) {
                this.tokenCommandChange(<CommandRequestDef> {command: tokenCommandDef.name}, false, 'tokenPropName');
            }
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
        if (property === 'tokenPropName') {
            this.tokenProperties = rs;
        } else {
            this.authProperties = rs;
        }
        if (!reset) {
            return;
        }

        if (property === 'tokenPropName') {
            this.form.get(property).setValue(this.tokenProperties[0]);
        } else {
            this.form.get(property).setValue(this.authProperties[0]);
        }
    }
}

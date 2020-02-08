import { HttpParams } from '@angular/common/http';

export class OauthResponse {
    idToken: string;
    code: string;
    state: string;
    sessionState: string;
    error: string;
    errorDescription: string;
    static get oauth2IdTokenRegex() {
        return /(id_token=.*)$/;
    }

    static get oauth2IdTokenCallbackRegex() {
        return /#(id_token=.*)$/;
    }

    static get oauth2CodeRegex() {
        return /(code=.*)$/;
    }

    static get oauth2ErrorRegex() {
        return /#(error=.*)$/;
    }

    get isSucceed() {
        return this.idToken || this.code;
    }

    constructor(url: string) {
        if (OauthResponse.oauth2IdTokenRegex.test(url)) {
            const matches = OauthResponse.oauth2IdTokenRegex.exec(url);
            this.extractParams(matches[1]);
        }
        if (OauthResponse.oauth2CodeRegex.test(url)) {
            const matches = OauthResponse.oauth2CodeRegex.exec(url);
            this.extractParams(matches[1]);
        }
        if (OauthResponse.oauth2ErrorRegex.test(url)) {
            const matches = OauthResponse.oauth2ErrorRegex.exec(url);
            this.extractParams(matches[1]);
        }
    }

    private extractParams(urlParams: string): void {
        const obj = new HttpParams({fromString: urlParams});
        this.idToken = obj.get('id_token');
        this.code = obj.get('code');
        this.state = obj.get('state');
        this.sessionState = obj.get('session_state');
        this.error = obj.get('error');
        const errorDescription = obj.get('error_description');
        this.errorDescription = errorDescription ? decodeURIComponent(errorDescription) : null;
    }
}

export interface CommandRequest {
    command: string;
    payload?: any;
}

export interface CommandResponse<T> {
    sessionId: string;
    output: T;
    state: 'Completed' | 'Fail';
}

export class CommandErrorMessage {
    constructor(private errorResponse: CommandErrorResponse) {
    }

    get message() {
        return this.errorResponse && this.errorResponse.output && this.errorResponse.output.errorMessageId || 'UnknownError';
    }

    get error(): CommandErrorResponse {
        return this.errorResponse;
    }
}

export interface CommandErrorResponse extends CommandResponse<{errorMessageId: string; commandName: string;}> {
}

export interface RegionConfig {
    name: string;
    displayName: string;
    apiBaseUrl: string;
}

export interface GlobalConfig {
    aadClientId: string;
    regions: RegionConfig[];
}

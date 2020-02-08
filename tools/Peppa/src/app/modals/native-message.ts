export interface NativeMessage {
    channel: string;
    payload: ActionMessage;
}

export interface ActionMessage {
    action: string;
    data?: any;
}

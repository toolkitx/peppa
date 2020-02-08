
export interface ItemFieldConf {
    key: string;
    displayName: string;
    dataType?: 'Text' | 'Date' | 'Action' | 'Menu' | 'Widget';
    action?: string;
}


export interface PagingRequest {
    skip?: number;
    take?: number;
    filter?: string;
}

export interface PagingResponse<T> {
    total: number;
    results: T[];
}

export function isPagingResponse(data: any) {
    return typeof data === 'object' && data.hasOwnProperty('total') && data.hasOwnProperty('results');
}

export function isPagingRequest(data: any) {
    return typeof data === 'object' && data.hasOwnProperty('skip') && data.hasOwnProperty('take') && data.hasOwnProperty('filter');
}

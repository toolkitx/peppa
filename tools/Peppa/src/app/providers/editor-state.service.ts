import { Injectable } from '@angular/core';
import { ServiceConfiguration, UIConfiguration } from '../modals/ui-configuration';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EditorStateService {
    private data: ServiceConfiguration | UIConfiguration;
    private clipboard: any;
    clipboard$ = new BehaviorSubject<any>(null);
    currentDirectory: string;
    openedFile: string;
    constructor() {
    }

    get moduleInfo() {
        return this.data && this.data.module;
    }

    setClipboard(val: any) {
        this.clipboard = val;
        this.clipboard$.next(this.clipboard);
    }

    getClipboard() {
        return this.clipboard;
    }

    clearClipboard() {
        this.setClipboard(null);
    }

    setData(conf: any) {
        this.data = conf;
    }

    getData<T>(): T {
        const temp = <any> this.data;
        return <T> temp;
    }
}

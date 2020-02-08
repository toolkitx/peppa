import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocationRef {
    get protocol() {
        return location.protocol;
    }

    get host() {
        return location.host;
    }

    get port() {
        return location.port;
    }
}

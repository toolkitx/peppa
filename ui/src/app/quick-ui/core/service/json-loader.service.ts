import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonLoaderService {

    constructor(protected http: HttpClient) {
    }

    get(url: string): Observable<any> {
        return this.http.get(url, {headers: {'Content-Type': 'application/json'}});
    }
}

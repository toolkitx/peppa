import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Inject, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { DEFAULT_HEADER_KEYS, DEFAULT_LOGIN_VIEW_NAME } from './providers';
import { UiConfigurationService } from './render/ui-configuration.service';
import { CacheService } from './cache/cache.service';
import { CACHE_KEY_AUTH_TOKEN } from './global/cache-keys';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
    constructor(private router: Router,
                @Inject(DEFAULT_HEADER_KEYS) private headerKeys: any[],
                @Inject(DEFAULT_LOGIN_VIEW_NAME) private loginViewName: string,
                private uiConfigurationService: UiConfigurationService,
                private cacheService: CacheService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = req.headers.set('Content-Type', 'application/json');
        if (this.headerKeys) {
            this.headerKeys.map((item: {key: string; value: string; }) => {
                const val = this.uiConfigurationService.translateSentence(item.value);
                if (val.valid) {
                    headers = headers.set(item.key, val.value);
                }
            });
        }
        const newReq = req.clone({headers: headers});
        return next.handle(newReq).pipe(tap(() => {
        }, (res: any) => {
            this.checkError(res);
        }));
    }

    private checkError(res: any) {
        if (res instanceof HttpErrorResponse) {
            if (res.status === 401) {
                this.cacheService.remove(CACHE_KEY_AUTH_TOKEN);
                this.router.navigate([this.loginViewName]);
            }
        }
    }
}

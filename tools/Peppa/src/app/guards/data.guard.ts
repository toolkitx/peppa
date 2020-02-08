import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { EditorStateService } from '../providers/editor-state.service';

@Injectable({
    providedIn: 'root'
})
export class DataGuard implements CanActivate {
    constructor(private router: Router, private editorService: EditorStateService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.editorService.getData()) {
            return true;
        } else {
            this.router.navigate(['/']);
        }
    }
}

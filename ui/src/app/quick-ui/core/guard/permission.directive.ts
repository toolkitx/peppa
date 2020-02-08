import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UiConfigurationService } from '../render/ui-configuration.service';
import { CacheService } from '../cache/cache.service';
import { hasPermission } from '../global/utils';
import { CACHE_KEY_AUTH_TOKEN } from '../global/cache-keys';

@Directive({
    selector: '[quiPermission]'
})
export class PermissionDirective implements OnInit {
    private permissions: string[] = [];
    private hasCreatedView = false;

    constructor(private uiConfigService: UiConfigurationService,
                private cacheService: CacheService,
                private templateRef: TemplateRef<any>,
                private viewContainer: ViewContainerRef) {
    }

    @Input()
    set quiPermission(val: string[]) {
        this.permissions = val;
        this.checkPermission();
    }

    ngOnInit(): void {
        this.cacheService.notify(CACHE_KEY_AUTH_TOKEN).subscribe(() => {
            this.checkPermission();
        });
    }

    private checkPermission() {
        if (hasPermission(this.permissions, this.uiConfigService, this.cacheService)) {
            if (!this.hasCreatedView) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
            this.hasCreatedView = true;
        } else {
            this.viewContainer.clear();
        }
    }
}

import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';

@Component({
    selector: 'qui-empty',
    templateUrl: './empty.component.html',
    styleUrls: ['./empty.component.less']
})
export class EmptyComponent implements OnChanges, OnInit, OnDestroy {
    @Input() notFoundImage: string | TemplateRef<void>;
    @Input() notFoundContent: string | TemplateRef<void>;
    @Input() notFoundFooter: string | TemplateRef<void>;
    isContentString = false;
    private destroy$ = new Subject<void>();

    constructor(private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        const { nzNotFoundContent } = changes;
        if (nzNotFoundContent) {
            this.isContentString = typeof nzNotFoundContent.currentValue === 'string';
        }
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

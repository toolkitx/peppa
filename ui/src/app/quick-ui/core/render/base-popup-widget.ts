import { Injector, OnDestroy, OnInit } from '@angular/core';
import { BaseWidget } from './base-widget';

/**
 *  Popup based widget can trigger closeModel after some actions, should pass a result in string when closing a model.
 * */
export class BasePopupWidget extends BaseWidget implements OnInit, OnDestroy {
    constructor(injector: Injector) {
        super(injector);
    }

    protected closeModal(result?: string) {
        const openModals = this.modelService.openModals;
        if (openModals && openModals.length) {
            openModals[0].close(result);
        }
    }
}

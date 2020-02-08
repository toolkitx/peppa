import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DomService {
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector
    ) {
    }

    createComponentRef(component: any): ComponentRef<any> {
        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(component)
            .create(this.injector);
        this.appRef.attachView(componentRef.hostView);
        return componentRef;
    }

    getDomElementFromComponentRef(componentRef: ComponentRef<any>): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;
    }

    addChild(child: HTMLElement, parent: HTMLElement = document.body) {
        parent.appendChild(child);
    }

    removeChild(child: HTMLElement, parent: HTMLElement = document.body) {
        parent.removeChild(child);
    }

    destroyRef(componentRef: ComponentRef<any>, delay: number = 0) {
        setTimeout(() => {
            this.appRef.detachView(componentRef.hostView);
            componentRef.destroy();
        }, delay);
    }
}

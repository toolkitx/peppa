import { ElementRef, Injector, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { PayloadDef, SlotConf } from './modals/ui-configuration';
import { CONSTANT_ELEMENT_ID_ATTR_NAME } from '../global';
import { CommandErrorMessage, CommandRequest } from '../service/interface';
import { Observable, Subject } from 'rxjs';
import { CommandService } from '../service/command.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { UiConfigurationService } from './ui-configuration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CacheService } from '../cache/cache.service';
import { CacheOption } from '../cache/interface';
import { MessageService } from '../service/message.service';
import { TranslateService } from '../service/translate.service';
import { NzModalService } from 'ng-zorro-antd';

export class BaseWidget implements OnInit, OnDestroy {
    @Input() conf: SlotConf;
    @Input() context?: any;
    renderer2: Renderer2;
    el: ElementRef;
    messageService: MessageService;
    modelService: NzModalService;
    commandService: CommandService;
    cacheService: CacheService;
    uiConfigurationService: UiConfigurationService;
    translate: TranslateService;
    subscription: Subject<any>;
    router: Router;
    activatedRouter: ActivatedRoute;
    location: Location;
    runningCommand = false;

    constructor(injector: Injector) {
        this.subscription = new Subject();
        this.renderer2 = injector.get(Renderer2);
        this.el = injector.get(ElementRef);
        this.cacheService = injector.get(CacheService);
        this.commandService = injector.get(CommandService);
        this.uiConfigurationService = injector.get(UiConfigurationService);
        this.messageService = injector.get(MessageService);
        this.modelService = injector.get(NzModalService);
        this.translate = injector.get(TranslateService);
        this.location = injector.get(Location);
        this.router = injector.get(Router);
        this.activatedRouter = injector.get(ActivatedRoute);
    }

    ngOnInit(): void {
        if (this.conf) {
            this.renderer2.setAttribute(this.el.nativeElement, CONSTANT_ELEMENT_ID_ATTR_NAME, this.conf.instanceId);
            this.startInitWidget();
        }
    }

    ngOnDestroy(): void {
        this.subscription.next();
        this.subscription.unsubscribe();
    }

    startInitWidget() {
        // Implement this method
    }

    addClassToHost(clsName: string) {
        this.renderer2.addClass(this.el.nativeElement, clsName);
    }

    removeClassFromHost(clsName: string) {
        this.renderer2.removeClass(this.el.nativeElement, clsName);
    }

    protected handleCommandRequestError(err: CommandErrorMessage) {
        this.showError(err.message);
    }

    protected runCommand(req: CommandRequest) {
        this.runningCommand = true;
        return new Observable((obs) => {
            this.commandService.run(req).pipe(
                takeUntil(this.subscription),
                finalize(() => {
                    this.runningCommand = false;
                })).subscribe((data: any) => {
                obs.next(data);
                this.runningCommand = false;
            }, (err) => {
                this.runningCommand = false;
                obs.error(err);
                this.handleCommandRequestError(err);
            });
        });
    }

    protected navigateTo(viewName: string) {
        this.router.navigate(['display', viewName]);
    }

    protected getCommandRequest(commandName: string, payloadDef: PayloadDef, currentValue?: any, context?: any): CommandRequest {
        const command = this.uiConfigurationService.getCommand(commandName);
        if (!command) {
            throw new Error('Command not found.');
        }
        const payload = this.uiConfigurationService.getCommandInputPayload(currentValue, command.inputSchema, payloadDef, context);
        return {command: commandName, payload};
    }

    protected getCache(key: string) {
        return this.cacheService.get(key);
    }

    protected removeCache(key: string) {
        return this.cacheService.remove(key);
    }

    protected setCache(key: string, value: any, opt: CacheOption = {type: 'storage'}) {
        return this.cacheService.set(key, value, {type: 'storage'});
    }

    protected showError(msg: string) {
        this.messageService.error(this.translate.translate(msg), {nzDuration: 5000});
    }

    protected showSuccess(msg: string) {
        this.messageService.success(this.translate.translate(msg));
    }
}

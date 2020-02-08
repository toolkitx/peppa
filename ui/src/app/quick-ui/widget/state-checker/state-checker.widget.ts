import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { BaseWidget } from '../../core/render';
import { Widget } from '../../core/decorators';
import { StateCheckerSlotConf } from './state-checker-slot-conf';
import { CommandErrorMessage } from '../../core/service/interface';

@Widget({
    type: 'StateChecker',
    version: 'latest',
    slotConfClass: StateCheckerSlotConf
})
@Component({
    selector: 'qui-state-checker',
    templateUrl: './state-checker.widget.html',
    styleUrls: ['./state-checker.widget.less']
})
export class StateCheckerWidget extends BaseWidget implements OnInit, OnDestroy {
    @Input() conf: StateCheckerSlotConf;
    done = false;
    timer: any;
    state: {status: string; totalNumberOfReads: number; validNumberOfReads: number;} = <any>{};

    constructor(protected injector: Injector) {
        super(injector);
    }

    startInitWidget() {
        this.getState();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    private getState() {
        const cmdRequest = this.getCommandRequest(this.conf.config.dataSource.command, this.conf.config.dataSource.payload, null);
        this.runCommand(cmdRequest).subscribe((rs: any) => {
            this.state = rs;
            this.done = this.state[this.conf.config.statePropName] === this.conf.config.doneState;
            if (!this.done) {
                this.timer = setTimeout(() => this.getState(), this.conf.config.interval * 1000);
            } else {
                this.addClassToHost('qui-hide');
                if (this.conf.config.doneMessage) {
                    this.showSuccess(this.conf.config.doneMessage);
                }
            }
        });
    }

    handleCommandRequestError(err: CommandErrorMessage) {
        super.handleCommandRequestError(err);
        this.addClassToHost('qui-hide');
    }

}

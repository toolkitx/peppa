import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { PeppaService } from './providers/peppa.service';
import { ActionMessage, NativeMessage } from './modals/native-message';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
    messageId: any;
    updateMessageSubscriber = new Subscription();
    @ViewChild('template', {static: true}) public template: TemplateRef<any>;
    private notificationKey = 'autoUpdate';

    constructor(
        private notification: NzNotificationService,
        public electronService: ElectronService,
        public router: Router,
        public peppaService: PeppaService) {
    }

    ngOnInit() {
        this.subscribeMainMessage();
        this.subscribeAutoUpdateMessage();
        this.subscribeMockServerMessage();
    }

    ngOnDestroy(): void {
        this.updateMessageSubscriber.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.peppaService.sendNativeMessage({channel: 'auto-update', payload: {action: 'auto-check-update'}});
    }

    subscribeMainMessage() {
        if (this.electronService.ipcRenderer) {
            this.electronService.ipcRenderer.on('message-from-main', (event: any, data: NativeMessage) => {
                this.peppaService.dispatchMessage(data);
            });
        }
    }

    subscribeAutoUpdateMessage() {
        this.updateMessageSubscriber = this.peppaService.subscribeMessageByType('auto-update')
            .subscribe((data: ActionMessage) => {
                this.handleAutoUpdateMessage(data);
            });
    }

    subscribeMockServerMessage() {
        this.peppaService.subscribeMessageByType('mock-server')
            .subscribe((data: ActionMessage) => {
                if (data && data.action === 'open') {
                    this.router.navigate(['mock-server']);
                }
            });
    }

    private handleAutoUpdateMessage(msg: ActionMessage) {
        if (msg.action === 'checking-for-update') {
            this.notification.info(
                'Checking for updates',
                'We are checking for latest updates.', {
                    nzKey: this.notificationKey
                }
            );
        } else if (msg.action === 'update-available') {
            this.notification.info(
                'Update available',
                'Update available, downloading in background.', {
                    nzKey: this.notificationKey
                }
            );
        } else if (msg.action === 'update-downloaded') {
            this.messageId = this.notification.template(this.template, {
                nzKey: this.notificationKey,
                nzDuration: 0
            }).messageId;
        } else if (msg.action === 'update-not-available' && this.messageId) {
            this.notification.info(
                'You\'re all good',
                'You\'ve got the latest version.', {
                    nzKey: this.notificationKey
                }
            );
        } else if (msg.action === 'error') {
            this.notification.info(
                'Error',
                'Failed to update.', {
                    nzKey: this.notificationKey,
                    nzDuration: 0
                }
            );
        }
    }

    installUpdate() {
        this.notification.remove(this.messageId);
        this.peppaService.sendNativeMessage({channel: 'auto-update', payload: {action: 'quit-and-install-update'}});
    }

    skipUpdate() {
        this.notification.remove(this.messageId);
    }
}

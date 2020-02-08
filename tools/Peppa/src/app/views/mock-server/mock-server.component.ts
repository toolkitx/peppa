import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PeppaService } from '../../providers/peppa.service';
import { ActionMessage } from '../../modals/native-message';
import { CacheService } from '../../cache/cache.service';
import { NativeService } from '../../providers/native.service';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';

const mockServerChannel = 'mock-server';

@Component({
    selector: 'app-mock-server',
    templateUrl: './mock-server.component.html',
    styleUrls: ['./mock-server.component.less']
})
export class MockServerComponent implements OnInit {
    mockConfig: {directory: string, port: number} = <any> {port: 8000};
    requests: any[] = [];
    activedRequest: any;
    status: {directory: string, port: number} = null;
    cacheKey = 'mock-requests';
    tplModal: NzModalRef;

    constructor(private router: Router,
                private location: Location,
                private cdr: ChangeDetectorRef,
                private cacheService: CacheService,
                private modalService: NzModalService,
                private messageService: NzMessageService,
                private nativeService: NativeService,
                private peppaService: PeppaService) {
    }

    ngOnInit() {
        this.subscribeMockServerMessage();
        this.reportMockServerStatus();
        this.requests = this.cacheService.get<any[]>(this.cacheKey) || [];
    }

    subscribeMockServerMessage() {
        this.peppaService.subscribeMessageByType('mock-server')
            .subscribe((data: ActionMessage) => {
                if (data.action === 'request') {
                    this.requests.push(data.data);
                    this.cacheService.set(this.cacheKey, this.requests);
                } else if (data.action === 'status') {
                    this.status = data.data;
                }
            });
    }

    onBack() {
        this.router.navigate(['home']);
    }

    startMockServer() {
        this.peppaService.sendNativeMessage({
            channel: mockServerChannel,
            payload: {
                action: 'start',
                data: {...this.mockConfig}
            }
        });
        this.destroyTplDialog();
    }

    selectRequest(req: any) {
        this.activedRequest = req;
    }

    reportMockServerStatus() {
        this.peppaService.sendNativeMessage({
            channel: mockServerChannel,
            payload: {
                action: 'report-status'
            }
        });
    }

    stopMockServer() {
        this.clearLogs();
        this.peppaService.sendNativeMessage({
            channel: mockServerChannel,
            payload: {
                action: 'stop'
            }
        });
    }

    clearLogs() {
        this.requests = [];
        this.activedRequest = null;
        this.cacheService.set(this.cacheKey, this.requests);
    }

    async openMockDataSelectDialog() {
        const path = await this.nativeService.openFileDialog('Open Command Project', [], 'openDirectory');
        if (path) {
            try {
                this.mockConfig.directory = <string> path;
            } catch ({message}) {
                this.messageService.error(message);
            }
        }
    }

    showDialog(title: string, tpl: TemplateRef<{}>, footTpl: TemplateRef<{}>) {
        this.tplModal = this.modalService.create({
            nzTitle: title,
            nzContent: tpl,
            nzFooter: footTpl,
            nzMaskClosable: false,
            nzClosable: true,
        });
    }

    destroyTplDialog() {
        if (this.tplModal) {
            setTimeout(() => {
                this.tplModal.destroy();
            }, 100);
        }
    }

}

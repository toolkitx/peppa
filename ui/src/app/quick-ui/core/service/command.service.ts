import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { CommandErrorMessage, CommandErrorResponse, CommandRequest, CommandResponse } from './interface';
import { GlobalConfigService } from './global-config.service';

@Injectable({
    providedIn: 'root'
})
export class CommandService {

    constructor(private http: HttpClient, private config: GlobalConfigService) {
    }

    run<T>(req: CommandRequest): Observable<T> {
        const baseEndpoint = this.config.getEndpoint(`/${req.command}`);
        return new Observable((observe) => {
            this.http.post(baseEndpoint, req.payload)
                .subscribe((res: CommandResponse<any>) => {
                    if (res.state === 'Completed') {
                        observe.next(<T>res.output);
                        observe.complete();
                    } else {
                        observe.error(new CommandErrorMessage(<CommandErrorResponse>res));
                    }
                }, (err: HttpErrorResponse) => this.handleError(err, observe, req.command));
        });
    }

    batchRun(reqs: CommandRequest[]) {
        const reqInstances = reqs.map(x => this.run(x));
        return forkJoin(reqInstances);
    }

    private handleError(error: HttpErrorResponse, observe: any, command: string) {
        const errorResponse = <CommandErrorResponse>{
            output: error.error && error.error.output ? error.error.output : {
                errorMessageId: error.statusText,
                commandName: command
            },
            state: 'Fail'
        };
        observe.error(new CommandErrorMessage(errorResponse));
    }
}

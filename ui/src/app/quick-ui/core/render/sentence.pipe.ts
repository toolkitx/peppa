import { Pipe, PipeTransform } from '@angular/core';
import { UiConfigurationService } from './ui-configuration.service';

@Pipe({
    name: 'sentence'
})
export class SentencePipe implements PipeTransform {
    constructor(private uiConfigService: UiConfigurationService) {
    }

    transform(value: string, args?: any, context?: any): any {
        const action = this.uiConfigService.translateSentence(value, args, context);
        if (!action.valid) {
            return value;
        }
        return action.value;
    }

}

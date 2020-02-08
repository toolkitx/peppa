import { Pipe, PipeTransform } from '@angular/core';
import { UiConfigurationService } from '../render/ui-configuration.service';
import { PCL } from '../render/pcl';

@Pipe({
    name: 'condition'
})
export class ConditionPipe implements PipeTransform {
    constructor(private uiConfigService: UiConfigurationService) {

    }

    transform(pcl: string, params?: any, context?: any): boolean {
        if (!pcl) {
            return false;
        }
        const instance = new PCL(pcl, (field: string) => {
            const sentence = this.uiConfigService.translateSentence(field, params, context);
            return sentence;
        });

        return instance.result;
    }

}

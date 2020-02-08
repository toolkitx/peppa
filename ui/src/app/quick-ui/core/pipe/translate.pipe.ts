import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../service/translate.service';

@Pipe({
    name: 'translate'
})
export class TranslatePipe implements PipeTransform {
    constructor(private _translate: TranslateService) {
    }

    transform(value: string, args?: {[key: string]: any}): string {
        if (!value) {
            return;
        }
        return this._translate.translate(value, args);
    }
}

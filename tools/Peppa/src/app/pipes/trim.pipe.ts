import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'trim'
})
export class TrimPipe implements PipeTransform {

    transform(value: string, regExpress: string, replacement: string): any {
        if (!value) {
            return value;
        }
        return value.toString().replace(new RegExp(regExpress), '');
    }

}

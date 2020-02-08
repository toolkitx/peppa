import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'keys'
})
export class KeysPipe implements PipeTransform {

    transform(obj: object): {key: string; value: any}[] {
        if (!obj) {
            return [];
        }
        const keys = Object.keys(obj);
        const rs = [];
        keys.map((key: string) => {
            const value = obj[key];
           rs.push({key, value});
        });
        return rs;
    }

}
